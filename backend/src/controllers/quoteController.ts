import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../services/emailService';

const quoteSchema = z.object({
  companyName:         z.string().min(2),
  contactName:         z.string().min(2),
  email:               z.string().email(),
  phone:               z.string().min(8),
  deliveryDate:        z.string().optional(),
  budget:              z.string().optional(),
  specialRequirements: z.string().optional(),
  products: z.array(z.object({
    productName:   z.string(),
    category:      z.string(),
    quantity:      z.number().int().positive(),
    size:          z.string().optional(),
    material:      z.string().optional(),
    customization: z.string().optional(),
  })).min(1),
});

export async function submitQuote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = quoteSchema.parse(req.body);

    const quote = await prisma.quoteRequest.create({
      data: {
        userId:             req.user?.id,
        companyName:        data.companyName,
        contactName:        data.contactName,
        email:              data.email,
        phone:              data.phone,
        deliveryDate:       data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        budget:             data.budget,
        specialRequirements: data.specialRequirements,
        products:           { create: data.products },
        expiresAt:          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: { products: true },
    });

    await sendEmail({
      to:       data.email,
      subject:  'Quote Request Received — Craftpack Solution',
      template: 'quote-received',
      vars:     { name: data.contactName, quoteId: quote.id },
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Quote request submitted. We\'ll respond within 24 hours.', data: { id: quote.id } });
  } catch (err) {
    next(err);
  }
}

export async function getMyQuotes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      where:   { userId: req.user!.id },
      include: { products: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: quotes });
  } catch (err) {
    next(err);
  }
}

export async function getQuoteById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const quote = await prisma.quoteRequest.findUnique({
      where:   { id: req.params.id },
      include: { products: true, user: { select: { name: true, email: true } } },
    });
    if (!quote) throw new AppError('Quote not found', 404);
    const isOwner = quote.userId === req.user!.id;
    const isAdmin = ['admin', 'super_admin', 'manager'].includes(req.user!.role);
    if (!isOwner && !isAdmin) throw new AppError('Unauthorized', 403);
    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
}

export async function getAllQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', status } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where = status ? { status: status as never } : {};

    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: { products: true, user: { select: { name: true, email: true } } },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    res.json({ success: true, data: quotes, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function respondToQuote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, quotedAmount, adminNotes } = z.object({
      status:       z.enum(['reviewing', 'quoted', 'rejected']),
      quotedAmount: z.number().optional(),
      adminNotes:   z.string().optional(),
    }).parse(req.body);

    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data:  { status, quotedAmount, adminNotes },
      include: { products: true },
    });

    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
}
