import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { slugify } from '../utils/helpers';

export async function getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '9', category, tag } = req.query as Record<string, string>;
    const skip  = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({ where, skip, take: Number(limit), orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, tags: true, readTime: true, publishedAt: true, authorName: true, authorAvatar: true, views: true } }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({ success: true, data: posts, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || !post.isPublished) throw new AppError('Post not found', 404);

    await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug:       data.slug ?? slugify(data.title),
        authorId:   req.user!.id,
        publishedAt: data.isPublished ? new Date() : undefined,
      },
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}
