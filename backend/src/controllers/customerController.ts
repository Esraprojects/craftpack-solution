import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', search } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = { role: 'customer' };
    if (search) {
      where.OR = [
        { name:    { contains: search, mode: 'insensitive' } },
        { email:   { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, company: true,
          isVerified: true, isActive: true, createdAt: true,
          _count: { select: { orders: true } },
          orders: { select: { total: true }, where: { paymentStatus: 'paid' } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const enriched = customers.map(c => ({
      ...c,
      orderCount:    c._count.orders,
      totalSpent:    c.orders.reduce((sum, o) => sum + o.total, 0),
    }));

    res.json({ success: true, data: enriched, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customer = await prisma.user.findUnique({
      where:  { id: req.params.id },
      select: { id: true, name: true, email: true, phone: true, company: true, isVerified: true, isActive: true, createdAt: true, address: true, preferences: true, _count: { select: { orders: true } } },
    });
    if (!customer) throw new AppError('Customer not found', 404);
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { isActive } = z.object({ isActive: z.boolean().optional() }).parse(req.body);
    const customer = await prisma.user.update({
      where: { id: req.params.id },
      data:  { isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function deleteCustomer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Customer deactivated' });
  } catch (err) {
    next(err);
  }
}

export async function getCustomerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      where:   { userId: req.params.id },
      include: { items: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}
