import { Router } from 'express';
import * as ctrl from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const adminOnly = [authenticate, requireRole('admin', 'super_admin')];

router.get('/activity-logs',  ...adminOnly, ctrl.getActivityLogs);
router.get('/settings',       ...adminOnly, ctrl.getSettings);
router.put('/settings',       authenticate, requireRole('super_admin'), ctrl.updateSettings);
router.get('/users',          ...adminOnly, ctrl.getAdminUsers);
router.post('/users',         authenticate, requireRole('super_admin'), ctrl.createAdminUser);
router.put('/users/:id/role', authenticate, requireRole('super_admin'), ctrl.updateUserRole);

export default router;
