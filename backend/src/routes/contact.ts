import { Router } from 'express';
import * as ctrl from '../controllers/contactController';
import { authenticate, requireRole } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
const contactLimiter = rateLimit({ windowMs: 15*60*1000, max: 5, message: { success: false, message: 'Too many submissions' } });

router.post('/',   contactLimiter, ctrl.submitInquiry);
router.get('/',    authenticate, requireRole('admin','super_admin'), ctrl.getInquiries);
router.patch('/:id/read', authenticate, requireRole('admin','super_admin'), ctrl.markRead);

export default router;
