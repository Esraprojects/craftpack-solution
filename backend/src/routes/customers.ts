import { Router } from 'express';
import * as ctrl from '../controllers/customerController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const adminOnly = [authenticate, requireRole('admin', 'super_admin', 'manager')];

router.get('/',        ...adminOnly, ctrl.getCustomers);
router.get('/:id',     ...adminOnly, ctrl.getCustomerById);
router.put('/:id',     ...adminOnly, ctrl.updateCustomer);
router.delete('/:id',  authenticate, requireRole('super_admin'), ctrl.deleteCustomer);
router.get('/:id/orders', ...adminOnly, ctrl.getCustomerOrders);

export default router;
