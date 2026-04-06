import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type ValidateOption = 'body' | 'params' | 'query';

export const validateRequest = (schema: z.ZodTypeAny, validateOf: ValidateOption) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[validateOf]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.issues });
      }
      next(error);
    }
  };
};
