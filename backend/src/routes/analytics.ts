import { Router } from 'express';
import * as ctrl from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const adminOnly = [authenticate, requireRole('admin', 'super_admin', 'manager')];

router.get('/dashboard',           ...adminOnly, ctrl.getDashboardStats);
router.get('/revenue',             ...adminOnly, ctrl.getRevenueData);
router.get('/orders',              ...adminOnly, ctrl.getOrderTrends);
router.get('/top-products',        ...adminOnly, ctrl.getTopProducts);
router.get('/customers/segments',  ...adminOnly, ctrl.getCustomerSegments);
router.get('/customers/growth',    ...adminOnly, ctrl.getCustomerGrowth);
router.get('/geography',           ...adminOnly, ctrl.getGeographicData);
router.get('/export',              ...adminOnly, ctrl.exportReport);

export default router;
