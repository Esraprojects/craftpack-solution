import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { success: false, message: 'Too many registration attempts. Please try again later.' },
});

router.post('/register',        registerLimiter, authController.register);
router.post('/login',           authLimiter,     authController.login);
router.post('/logout',          authenticate,    authController.logout);
router.post('/refresh',                          authController.refresh);
router.post('/forgot-password',                  authController.forgotPassword);
router.post('/reset-password',                   authController.resetPassword);
router.post('/verify-email',                     authController.verifyEmail);
router.get( '/me',              authenticate,    authController.getMe);
router.put( '/me',              authenticate,    authController.updateMe);
router.put( '/me/password',     authenticate,    authController.changePassword);

export default router;
