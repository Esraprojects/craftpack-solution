import { Router } from 'express';
import * as ctrl from '../controllers/inventoryController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const adminOnly = [authenticate, requireRole('admin', 'super_admin', 'manager')];

router.get('/',           ...adminOnly, ctrl.getInventory);
router.get('/alerts',     ...adminOnly, ctrl.getAlerts);
router.get('/:id',        ...adminOnly, ctrl.getInventoryItem);
router.post('/',          ...adminOnly, ctrl.createInventoryItem);
router.put('/:id',        ...adminOnly, ctrl.updateInventoryItem);
router.delete('/:id',     authenticate, requireRole('super_admin'), ctrl.deleteInventoryItem);

export default router;
