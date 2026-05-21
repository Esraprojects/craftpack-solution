import { Router } from 'express';
import * as ctrl from '../controllers/blogController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/',          ctrl.getPosts);
router.get('/:slug',     ctrl.getPostBySlug);
router.post('/',         authenticate, requireRole('admin','super_admin'), ctrl.createPost);
router.put('/:id',       authenticate, requireRole('admin','super_admin'), ctrl.updatePost);
router.delete('/:id',    authenticate, requireRole('admin','super_admin'), ctrl.deletePost);

export default router;
