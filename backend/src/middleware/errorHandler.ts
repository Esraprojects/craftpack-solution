import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err.message, { stack: err.stack });

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach(e => {
      const field = e.path.join('.');
      errors[field] = errors[field] ?? [];
      errors[field].push(e.message);
    });
    res.status(400).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  // App errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success:    false,
      message:    err.message,
      errors:     err.errors,
      statusCode: err.statusCode,
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') ?? 'field';
      res.status(409).json({ success: false, message: `A record with this ${field} already exists.` });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found.' });
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token.' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired.' });
    return;
  }

  // Fallback
  const statusCode = (err as AppError).statusCode ?? 500;
  res.status(statusCode).json({
    success:    false,
    message:    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode,
  });
}
