/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from 'express';
import { Response } from 'express';
import { ErrorRequestHandler } from 'express';
import { NextFunction } from 'express';
import { AppError } from '../../contexts/shared/infrastructure/exception/AppError';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';

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
  logger.error(err.toString());
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
};
