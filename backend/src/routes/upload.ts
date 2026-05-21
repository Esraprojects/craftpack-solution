import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import * as ctrl from '../controllers/uploadController';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/image',    authenticate, upload.single('file'), ctrl.uploadImage);
router.post('/logo',     authenticate, upload.single('file'), ctrl.uploadLogo);
router.delete('/:publicId', authenticate, ctrl.deleteUpload);

export default router;
