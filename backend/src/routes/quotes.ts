import { Router } from 'express';
import * as ctrl from '../controllers/quoteController';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/',    optionalAuth,   ctrl.submitQuote);
router.get('/my',   authenticate,   ctrl.getMyQuotes);
router.get('/:id',  authenticate,   ctrl.getQuoteById);
router.get('/',     authenticate, requireRole('admin','super_admin','manager'), ctrl.getAllQuotes);
router.patch('/:id/respond', authenticate, requireRole('admin','super_admin','manager'), ctrl.respondToQuote);

export default router;
