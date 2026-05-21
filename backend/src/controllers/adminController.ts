import { Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export async function getActivityLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '50', userId, action } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: { user: { select: { name: true, email: true, role: true } } },
        skip,
        take: Number(limit),
        orderBy: { timestamp: 'desc' },
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({ success: true, data: logs, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: { category: { in: ['general', 'email', 'payment', 'shipping'] } },
    });
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json({ success: true, data: settingsMap });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = req.body as Record<string, string>;
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.systemSetting.upsert({
          where:  { key },
          update: { value },
          create: { key, value, category: 'general' },
        })
      )
    );
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
}

export async function getAdminUsers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where:  { role: { in: ['admin', 'super_admin', 'manager'] } },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function createAdminUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role } = z.object({
      name:     z.string().min(2),
      email:    z.string().email(),
      password: z.string().min(8),
      role:     z.enum(['admin', 'manager']),
    }).parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new AppError('Email already registered', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({
      data: { name, email, password: hashed, role, isVerified: true },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role } = z.object({ role: z.enum(['customer', 'manager', 'admin', 'super_admin']) }).parse(req.body);

    if (req.params.id === req.user!.id) throw new AppError('Cannot change your own role', 400);

    const user = await prisma.user.update({
      where:  { id: req.params.id },
      data:   { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
