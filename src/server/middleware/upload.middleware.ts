import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export const MAX_IMAGE_FILE_SIZE_MB = 5;
const MAX_IMAGE_FILE_SIZE_BYTES = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function createDiskStorage(relativeUploadPath: string) {
  const uploadPath = path.join(process.cwd(), relativeUploadPath);

  return multer.diskStorage({
    destination: function (_req, _file, cb) {
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
}

function imageFileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new AppError('INVALID_FILE_TYPE', 400, 'Solo se permiten imagenes JPG, PNG o WEBP', true));
}

function createUploadMiddleware(relativeUploadPath: string) {
  return multer({
    storage: createDiskStorage(relativeUploadPath),
    limits: { fileSize: MAX_IMAGE_FILE_SIZE_BYTES },
    fileFilter: imageFileFilter
  });
}

export const uploadProductoImage = createUploadMiddleware('public/uploads/productos');
export const uploadClienteImage = createUploadMiddleware('public/uploads/clientes');
