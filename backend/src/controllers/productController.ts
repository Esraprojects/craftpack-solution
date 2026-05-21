import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { slugify } from '../utils/helpers';

// ── Helpers ───────────────────────────────────────────────────
function buildWhere(params: Record<string, string | undefined>) {
  const where: Record<string, unknown> = { isActive: true };
  if (params.category) where.category = params.category;
  if (params.search)   where.name     = { contains: params.search, mode: 'insensitive' };
  if (params.tag)      where.tags     = { has: params.tag };
  if (params.featured  === 'true') where.isFeatured = true;
  if (params.minPrice || params.maxPrice) {
    where.basePrice = {};
    if (params.minPrice) (where.basePrice as Record<string, number>).gte = Number(params.minPrice);
    if (params.maxPrice) (where.basePrice as Record<string, number>).lte = Number(params.maxPrice);
  }
  return where;
}

const productSelect = {
  id: true, name: true, slug: true, description: true, shortDescription: true,
  category: true, images: true, thumbnail: true, model3dUrl: true, basePrice: true,
  isActive: true, isFeatured: true, tags: true, features: true, applications: true,
  specifications: true, seoTitle: true, seoDescription: true, createdAt: true,
  variants:      { where: { isActive: true } },
  bulkPricing:   true,
  customization: true,
  reviews: {
    where:  { isApproved: true },
    select: { id: true, rating: true, title: true, content: true, createdAt: true,
              user: { select: { name: true, company: true, avatar: true } } },
    take:   5,
    orderBy: { createdAt: 'desc' as const },
  },
  _count: { select: { reviews: { where: { isApproved: true } } } },
};

// ── Controllers ───────────────────────────────────────────────
export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '12', sortBy = 'createdAt', order = 'desc', ...filters } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where = buildWhere(filters);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productSelect,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order as 'asc' | 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: productSelect,
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q } = req.query as { q?: string };
    if (!q) { res.json({ success: true, data: [] }); return; }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name:  { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
          { tags:  { has: q.toLowerCase() } },
        ],
      },
      select: { id: true, name: true, slug: true, thumbnail: true, basePrice: true, category: true },
      take: 10,
    });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category }         = req.params;
    const { page = '1', limit = '12' } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { category: category as never, isActive: true },
        select: productSelect,
        skip,
        take: Number(limit),
        orderBy: { isFeatured: 'desc' },
      }),
      prisma.product.count({ where: { category: category as never, isActive: true } }),
    ]);

    res.json({
      success: true,
      data:    products,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)), hasNext: skip + Number(limit) < total, hasPrev: Number(page) > 1 },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where:  { slug: req.params.slug },
      select: productSelect,
    });
    if (!product) throw new AppError('Product not found', 404);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where:  { id: req.params.id },
      select: productSelect,
    });
    if (!product) throw new AppError('Product not found', 404);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
        where:   { productId: req.params.id, isApproved: true },
        include: { user: { select: { name: true, company: true, avatar: true } } },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.productReview.count({ where: { productId: req.params.id, isApproved: true } }),
    ]);

    res.json({ success: true, data: reviews, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const schema = z.object({
      rating:  z.number().int().min(1).max(5),
      title:   z.string().optional(),
      content: z.string().min(10).max(1000),
    });
    const data = schema.parse(req.body);

    const review = await prisma.productReview.create({
      data: {
        productId: req.params.id,
        userId:    req.user!.id,
        ...data,
      },
    });

    res.status(201).json({ success: true, message: 'Review submitted for approval.', data: review });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { variants, bulkPricing, customization, ...rest } = req.body;

    const product = await prisma.product.create({
      data: {
        ...rest,
        slug: slugify(rest.name),
        variants:      variants      ? { create: variants }      : undefined,
        bulkPricing:   bulkPricing   ? { create: bulkPricing }   : undefined,
        customization: customization ? { create: customization } : undefined,
      },
      select: productSelect,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { variants: _v, bulkPricing: _b, customization: _c, ...rest } = req.body;

    const product = await prisma.product.update({
      where:  { id: req.params.id },
      data:   rest,
      select: productSelect,
    });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data:  { isActive: false },
    });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
}
