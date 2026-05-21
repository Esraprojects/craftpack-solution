import { Router } from 'express';
import * as ctrl from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/',                    ctrl.getProducts);
router.get('/featured',            ctrl.getFeaturedProducts);
router.get('/search',              ctrl.searchProducts);
router.get('/category/:category',  ctrl.getProductsByCategory);
router.get('/slug/:slug',          ctrl.getProductBySlug);
router.get('/:id',                 ctrl.getProductById);
router.get('/:id/reviews',         ctrl.getProductReviews);

// Authenticated routes
router.post('/:id/reviews', authenticate, ctrl.createReview);

// Admin routes
router.post('/',       authenticate, requireRole('admin', 'super_admin'), ctrl.createProduct);
router.put('/:id',     authenticate, requireRole('admin', 'super_admin'), ctrl.updateProduct);
router.delete('/:id',  authenticate, requireRole('admin', 'super_admin'), ctrl.deleteProduct);

export default router;
