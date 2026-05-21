import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateOrderNumber } from '../utils/helpers';
import { sendEmail } from '../services/emailService';
import { logActivity } from '../utils/activityLogger';
import { formatCurrency } from '../utils/formatters';

const orderItemSchema = z.object({
  productId:    z.string(),
  variantId:    z.string(),
  quantity:     z.number().int().positive(),
  customization: z.object({
    logoUrl:      z.string().optional(),
    logoPosition: z.string().optional(),
    printColors:  z.array(z.string()).optional(),
    customText:   z.string().optional(),
    instructions: z.string().optional(),
    finishType:   z.string().optional(),
  }).optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  type:  z.enum(['standard', 'bulk', 'custom', 'wholesale']).default('standard'),
  shippingStreet:  z.string(),
  shippingCity:    z.string(),
  shippingCountry: z.string().default('Ethiopia'),
  billingStreet:   z.string(),
  billingCity:     z.string(),
  billingCountry:  z.string().default('Ethiopia'),
  notes:           z.string().optional(),
});

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createOrderSchema.parse(req.body);

    // Fetch all variants with pricing
    const variantIds = data.items.map(i => i.variantId);
    const variants   = await prisma.productVariant.findMany({
      where:  { id: { in: variantIds }, isActive: true },
      include: { product: { include: { bulkPricing: true } } },
    });

    // Build order items with pricing
    const orderItems = data.items.map(item => {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) throw new AppError(`Variant ${item.variantId} not found`, 404);
      if (item.quantity < variant.minOrder) {
        throw new AppError(`Minimum order for ${variant.product.name} is ${variant.minOrder} units`, 400);
      }

      // Apply bulk pricing if available
      const bulkTier = variant.product.bulkPricing
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(tier => item.quantity >= tier.minQuantity);
      const unitPrice  = bulkTier?.pricePerUnit ?? variant.price;
      const totalPrice = unitPrice * item.quantity;

      return {
        productId:    item.productId,
        variantId:    item.variantId,
        quantity:     item.quantity,
        unitPrice,
        totalPrice,
        logoUrl:      item.customization?.logoUrl,
        logoPosition: item.customization?.logoPosition,
        printColors:  item.customization?.printColors ?? [],
        customText:   item.customization?.customText,
        instructions: item.customization?.instructions,
        finishType:   item.customization?.finishType,
      };
    });

    const subtotal      = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxAmount     = subtotal * 0.15;
    const total         = subtotal + taxAmount;
    const orderNumber   = generateOrderNumber();
    const estimatedDays = data.type === 'custom' ? 21 : data.type === 'bulk' ? 14 : 7;
    const estimatedDelivery = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId:  req.user!.id,
        type:    data.type,
        status:  'pending',
        paymentStatus: 'pending',
        subtotal,
        taxAmount,
        shippingAmount: 0,
        discountAmount: 0,
        total,
        shippingStreet:  data.shippingStreet,
        shippingCity:    data.shippingCity,
        shippingCountry: data.shippingCountry,
        billingStreet:   data.billingStreet,
        billingCity:     data.billingCity,
        billingCountry:  data.billingCountry,
        notes:           data.notes,
        estimatedDelivery,
        items: { create: orderItems },
        timeline: {
          create: {
            status:  'pending',
            message: 'Order placed successfully. Awaiting confirmation.',
          },
        },
      },
      include: {
        items:    { include: { product: true, variant: true } },
        timeline: true,
        user:     { select: { name: true, email: true } },
      },
    });

    // Send confirmation email
    sendEmail({
      to:       order.user.email,
      subject:  `Order Confirmed — ${orderNumber}`,
      template: 'order-confirmed',
      vars: {
        name:              order.user.name,
        orderNumber,
        estimatedDelivery: estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        total:             formatCurrency(total),
        orderUrl:          `${process.env.FRONTEND_URL}/dashboard/orders/${order.id}`,
      },
    }).catch(() => {});

    await logActivity({
      userId:    req.user!.id,
      action:    'CREATE_ORDER',
      resource:  'order',
      resourceId: order.id,
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '10', status } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = { userId: req.user!.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { select: { name: true, thumbnail: true } }, variant: { select: { name: true } } } }, timeline: { orderBy: { timestamp: 'desc' }, take: 1 } },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items:    { include: { product: true, variant: true } },
        timeline: { orderBy: { timestamp: 'desc' } },
        user:     { select: { id: true, name: true, email: true, company: true, phone: true } },
      },
    });

    if (!order) throw new AppError('Order not found', 404);

    const isOwner = order.userId === req.user!.id;
    const isAdmin = ['admin', 'super_admin', 'manager'].includes(req.user!.role);
    if (!isOwner && !isAdmin) throw new AppError('Unauthorized', 403);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', status, type, search } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (type)   where.type   = type;
    if (search) where.orderNumber = { contains: search, mode: 'insensitive' };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true, thumbnail: true } } }, take: 3 },
          user:  { select: { name: true, email: true, company: true } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, message, trackingNumber } = z.object({
      status:         z.enum(['pending','confirmed','in_production','quality_check','ready_to_ship','shipped','delivered','cancelled']),
      message:        z.string().optional(),
      trackingNumber: z.string().optional(),
    }).parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        trackingNumber: trackingNumber ?? undefined,
        actualDelivery: status === 'delivered' ? new Date() : undefined,
        timeline: {
          create: {
            status,
            message: message ?? `Order status updated to ${status.replace(/_/g, ' ')}`,
            updatedBy: req.user!.id,
          },
        },
      },
      include: { user: { select: { email: true, name: true } }, items: { include: { product: { select: { name: true } } } } },
    });

    await logActivity({ userId: req.user!.id, action: 'UPDATE_ORDER_STATUS', resource: 'order', resourceId: order.id, details: { status } });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body);

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId !== req.user!.id) throw new AppError('Unauthorized', 403);

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: 'cancelled',
        timeline: { create: { status: 'cancelled', message: `Cancelled by customer: ${reason}` } },
      },
    });

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    next(err);
  }
}

export async function generateInvoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where:   { id: req.params.id },
      include: { items: { include: { product: true, variant: true } }, user: true },
    });

    if (!order) throw new AppError('Order not found', 404);

    const isOwner = order.userId === req.user!.id;
    const isAdmin = ['admin', 'super_admin', 'manager'].includes(req.user!.role);
    if (!isOwner && !isAdmin) throw new AppError('Unauthorized', 403);

    // In production: generate PDF with pdfkit and upload to Cloudinary
    const invoiceData = {
      orderNumber:  order.orderNumber,
      date:         order.createdAt,
      customer:     { name: order.user.name, email: order.user.email, company: order.user.company },
      items:        order.items.map(item => ({
        name:       item.product.name,
        variant:    item.variant.name,
        qty:        item.quantity,
        unitPrice:  item.unitPrice,
        total:      item.totalPrice,
      })),
      subtotal:     order.subtotal,
      tax:          order.taxAmount,
      shipping:     order.shippingAmount,
      discount:     order.discountAmount,
      total:        order.total,
    };

    res.json({ success: true, data: invoiceData });
  } catch (err) {
    next(err);
  }
}
