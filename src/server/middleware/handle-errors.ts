/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from 'express';
import { Response } from 'express';
import { ErrorRequestHandler } from 'express';
import { NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../../contexts/shared/infrastructure/exception/AppError';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';
import { MAX_IMAGE_FILE_SIZE_MB } from './upload.middleware';

const logger = new WinstonLogger();

export const handleErrors = (err: ErrorRequestHandler | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.info(err.message);
      return res.status(err.httpCode).json({ code: err.name, message: err.message });
    }
    logger.warn(err.message);
    return res.status(500).json({ code: err.name, message: err.message });
  }

  if (err instanceof multer.MulterError) {
    logger.info(err.message);

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ code: 'INVALID_FILE_SIZE', message: `La imagen no puede superar ${MAX_IMAGE_FILE_SIZE_MB} MB` });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res
        .status(400)
        .json({ code: 'INVALID_FILE_FIELD', message: 'El campo del archivo no es valido para este endpoint' });
    }

    return res.status(400).json({ code: err.code, message: 'No se pudo procesar el archivo adjunto' });
  }

  logger.error(err.toString());
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
};
