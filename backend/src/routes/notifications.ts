import { Router } from 'express';
import * as ctrl from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/',              ctrl.getNotifications);
router.patch('/:id/read',    ctrl.markRead);
router.patch('/read-all',    ctrl.markAllRead);
router.delete('/:id',        ctrl.deleteNotification);

export default router;
