import { Router } from 'express';
import * as ctrl from '../controllers/orderController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Customer routes
router.get('/my',          ctrl.getMyOrders);
router.post('/',           ctrl.createOrder);
router.get('/:id',         ctrl.getOrderById);
router.patch('/:id/cancel',ctrl.cancelOrder);
router.get('/:id/invoice', ctrl.generateInvoice);

// Admin routes
router.get('/', requireRole('admin', 'super_admin', 'manager'), ctrl.getAllOrders);
router.patch('/:id/status', requireRole('admin', 'super_admin', 'manager'), ctrl.updateOrderStatus);

export default router;
