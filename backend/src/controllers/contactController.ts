import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { sendEmail } from '../services/emailService';

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
  type:    z.enum(['general', 'quote', 'support', 'partnership']).default('general'),
});

export async function submitInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data    = contactSchema.parse(req.body);
    const inquiry = await prisma.contactInquiry.create({ data });

    // Notify admin
    sendEmail({
      to:       process.env.ADMIN_EMAIL ?? 'admin@craftpacksolution.com',
      subject:  `New Contact: ${data.subject}`,
      template: 'quote-received',
      vars:     { name: 'Admin', quoteId: inquiry.id },
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Message received. We\'ll respond within 24 hours.' });
  } catch (err) {
    next(err);
  }
}

export async function getInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', unread } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where = unread === 'true' ? { isRead: false } : {};

    const [items, total] = await Promise.all([
      prisma.contactInquiry.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.contactInquiry.count({ where }),
    ]);

    res.json({ success: true, data: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.contactInquiry.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
