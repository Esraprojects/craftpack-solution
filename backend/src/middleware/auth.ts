import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id:    string;
    email: string;
    role:  string;
  };
}

interface JwtPayload {
  id:    string;
  email: string;
  role:  string;
  iat:   number;
  exp:   number;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where:  { id: payload.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user)          throw new AppError('User not found', 401);
    if (!user.isActive) throw new AppError('Account deactivated', 401);

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }
    next();
  };

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token   = authHeader.slice(7);
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user    = await prisma.user.findUnique({
        where:  { id: payload.id },
        select: { id: true, email: true, role: true },
      });
      if (user) req.user = user;
    }
  } catch {
    // Token invalid — proceed unauthenticated
  }
  next();
};
