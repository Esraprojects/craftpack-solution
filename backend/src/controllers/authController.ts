import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken, rotateRefreshToken, revokeRefreshToken, revokeAllUserTokens } from '../utils/jwt';
import { sendEmail } from '../services/emailService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logActivity } from '../utils/activityLogger';

const registerSchema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(8).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  phone:    z.string().optional(),
  company:  z.string().optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ── Register ──────────────────────────────────────────────────
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verifyToken    = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email:    data.email,
        name:     data.name,
        password: hashedPassword,
        phone:    data.phone,
        company:  data.company,
      },
      select: { id: true, email: true, name: true, role: true, isVerified: true },
    });

    // Store verification token in system settings temporarily
    await prisma.systemSetting.upsert({
      where:  { key: `verify:${user.id}` },
      update: { value: verifyToken },
      create: { key: `verify:${user.id}`, value: verifyToken, category: 'verification' },
    });

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verifyToken}&id=${user.id}`;
    await sendEmail({
      to:      data.email,
      subject: 'Verify your Craftpack Solution account',
      template: 'welcome',
      vars:    { name: data.name, verifyUrl },
    }).catch(() => {}); // Non-blocking

    const accessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = await generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email.',
      data: { user, accessToken, refreshToken, expiresIn: 900 },
    });
  } catch (err) {
    next(err);
  }
}

// ── Login ─────────────────────────────────────────────────────
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where:  { email },
      select: { id: true, email: true, name: true, role: true, password: true, isActive: true, isVerified: true, company: true, phone: true, avatar: true },
    });

    if (!user) throw new AppError('Invalid email or password', 401);
    if (!user.isActive) throw new AppError('Account has been deactivated. Contact support.', 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError('Invalid email or password', 401);

    const { password: _pw, ...safeUser } = user;
    const accessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = await generateRefreshToken(user.id);

    await logActivity({
      userId:    user.id,
      action:    'LOGIN',
      resource:  'auth',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, accessToken, refreshToken, expiresIn: 900 },
    });
  } catch (err) {
    next(err);
  }
}

// ── Logout ────────────────────────────────────────────────────
export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await revokeRefreshToken(refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

// ── Refresh Token ─────────────────────────────────────────────
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const tokens = await rotateRefreshToken(refreshToken);
    if (!tokens) throw new AppError('Invalid or expired refresh token', 401);

    res.json({ success: true, data: { ...tokens, expiresIn: 900 } });
  } catch (err) {
    next(err);
  }
}

// ── Forgot Password ────────────────────────────────────────────
export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 to prevent email enumeration
    if (user) {
      const resetToken   = crypto.randomBytes(32).toString('hex');
      const hashedToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt    = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.systemSetting.upsert({
        where:  { key: `reset:${user.id}` },
        update: { value: JSON.stringify({ token: hashedToken, expiresAt }) },
        create: { key: `reset:${user.id}`, value: JSON.stringify({ token: hashedToken, expiresAt }), category: 'reset' },
      });

      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&id=${user.id}`;
      await sendEmail({
        to:      email,
        subject: 'Reset your Craftpack Solution password',
        template: 'reset-password',
        vars:    { name: user.name, resetUrl },
      }).catch(() => {});
    }

    res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

// ── Reset Password ─────────────────────────────────────────────
export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, id, password } = z.object({
      token:    z.string(),
      id:       z.string(),
      password: z.string().min(8),
    }).parse(req.body);

    const setting = await prisma.systemSetting.findUnique({ where: { key: `reset:${id}` } });
    if (!setting) throw new AppError('Invalid or expired reset token', 400);

    const { token: storedHash, expiresAt } = JSON.parse(setting.value);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (hashedToken !== storedHash || new Date(expiresAt) < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
    await prisma.systemSetting.delete({ where: { key: `reset:${id}` } });
    await revokeAllUserTokens(id);

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    next(err);
  }
}

// ── Verify Email ───────────────────────────────────────────────
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, id } = z.object({ token: z.string(), id: z.string() }).parse(req.body);

    const setting = await prisma.systemSetting.findUnique({ where: { key: `verify:${id}` } });
    if (!setting || setting.value !== token) throw new AppError('Invalid verification token', 400);

    await prisma.user.update({ where: { id }, data: { isVerified: true } });
    await prisma.systemSetting.delete({ where: { key: `verify:${id}` } });

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
}

// ── Get Me ─────────────────────────────────────────────────────
export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: {
        id: true, email: true, name: true, phone: true, company: true,
        role: true, avatar: true, isVerified: true, createdAt: true,
        address: true, preferences: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// ── Update Me ──────────────────────────────────────────────────
export async function updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const schema = z.object({
      name:    z.string().min(2).max(100).optional(),
      phone:   z.string().optional(),
      company: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where:  { id: req.user!.id },
      data,
      select: { id: true, email: true, name: true, phone: true, company: true, role: true, avatar: true, isVerified: true },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// ── Change Password ────────────────────────────────────────────
export async function changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string(),
      newPassword:     z.string().min(8),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError('User not found', 404);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new AppError('Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await revokeAllUserTokens(user.id);

    res.json({ success: true, message: 'Password changed successfully. Please log in again.' });
  } catch (err) {
    next(err);
  }
}
