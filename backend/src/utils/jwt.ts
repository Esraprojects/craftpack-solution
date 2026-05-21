import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';

interface TokenPayload {
  id:    string;
  email: string;
  role:  string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    issuer:    'craftpack-api',
  } as jwt.SignOptions);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token     = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

export async function rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const existing = await prisma.refreshToken.findUnique({
    where:  { token: oldToken },
    include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
  });

  if (!existing || existing.isRevoked || existing.expiresAt < new Date() || !existing.user.isActive) {
    return null;
  }

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data:  { isRevoked: true },
  });

  const accessToken  = generateAccessToken({ id: existing.user.id, email: existing.user.email, role: existing.user.role });
  const refreshToken = await generateRefreshToken(existing.user.id);

  return { accessToken, refreshToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token },
    data:  { isRevoked: true },
  });
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data:  { isRevoked: true },
  });
}
