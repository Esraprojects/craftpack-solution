import { Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

async function uploadToCloudinary(buffer: Buffer, folder: string, options: Record<string, unknown> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', ...options },
      (error, result) => {
        if (error) reject(new AppError('Upload failed', 500));
        else resolve(result!.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw new AppError('No file provided', 400);

    const url = await uploadToCloudinary(
      req.file.buffer,
      'craftpack/products',
      { transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:best', format: 'webp' }] }
    );

    res.json({ success: true, data: { url } });
  } catch (err) {
    next(err);
  }
}

export async function uploadLogo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw new AppError('No file provided', 400);

    const url = await uploadToCloudinary(
      req.file.buffer,
      'craftpack/logos',
      { transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'png', background: 'transparent' }] }
    );

    res.json({ success: true, data: { url } });
  } catch (err) {
    next(err);
  }
}

export async function deleteUpload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, message: 'File deleted' });
  } catch (err) {
    next(err);
  }
}
