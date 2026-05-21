import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const inventorySchema = z.object({
  name:         z.string().min(2),
  sku:          z.string().min(2),
  category:     z.string(),
  currentStock: z.number().min(0),
  minStock:     z.number().min(0),
  maxStock:     z.number().positive(),
  unit:         z.string().default('kg'),
  costPerUnit:  z.number().positive(),
  supplier:     z.string(),
  notes:        z.string().optional(),
});

export async function getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', status, search } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.name   = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({ where, skip, take: Number(limit), orderBy: { status: 'asc' } }),
      prisma.inventoryItem.count({ where }),
    ]);

    res.json({ success: true, data: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function getAlerts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const alerts = await prisma.inventoryItem.findMany({
      where: { status: { in: ['low_stock', 'out_of_stock'] } },
      orderBy: { currentStock: 'asc' },
    });
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
}

export async function getInventoryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
    if (!item) throw new AppError('Item not found', 404);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createInventoryItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data   = inventorySchema.parse(req.body);
    const status = computeStatus(data.currentStock, data.minStock);
    const item   = await prisma.inventoryItem.create({ data: { ...data, status } });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateInventoryItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = inventorySchema.partial().parse(req.body);
    const existing = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Item not found', 404);

    const currentStock = data.currentStock ?? existing.currentStock;
    const minStock     = data.minStock ?? existing.minStock;
    const status       = computeStatus(currentStock, minStock);
    const lastRestocked = data.currentStock && data.currentStock > existing.currentStock ? new Date() : existing.lastRestocked;

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data:  { ...data, status, lastRestocked },
    });

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteInventoryItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Inventory item deleted' });
  } catch (err) {
    next(err);
  }
}

function computeStatus(current: number, min: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (current === 0)   return 'out_of_stock';
  if (current <= min)  return 'low_stock';
  return 'in_stock';
}
