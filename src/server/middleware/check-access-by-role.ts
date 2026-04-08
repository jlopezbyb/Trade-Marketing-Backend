import { Request, Response, NextFunction } from 'express';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { getPayload } from '@src/contexts/auth/infrastructure/utils/jwt-utils';
import { resolveAuthToken } from './utils/resolve-auth-token';

export const checkAccessByRole = (allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Primero intentamos usar el payload ya inyectado por validateAuth / validateAuthFlexible
    let payload: any = (req as any).user;

    // Si no existe en la request (casos antiguos), resolvemos el token desde cookie o header
    if (!payload) {
      const token = resolveAuthToken(req, 'token_employee') ?? resolveAuthToken(req, 'token');

      if (!token) {
        return next(new AppError('NO_TOKEN', 401, 'Token no proporcionado', true));
      }

      payload = getPayload(token);

      if (!payload) {
        return next(new AppError('INVALID_TOKEN', 403, 'Token inválido', true));
      }
    }

    const userType = payload.type;
    const userResources: string[] = payload.resources || [];

    // 👤 Si permitimos el tipo de usuario directamente
    if (allowed.includes(userType)) {
      return next();
    }

    // 🔐 Si permitimos recursos específicos
    const hasAccess = allowed.some(resource => userResources.includes(resource));
    if (hasAccess) {
      return next();
    }

    return next(new AppError('FORBIDDEN', 403, 'No tiene acceso a este recurso', true));
  };
};
