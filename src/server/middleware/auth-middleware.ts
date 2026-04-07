import { NextFunction, Request, Response } from 'express';
import { getPayload, validateToken } from '@src/contexts/auth/infrastructure/utils/jwt-utils';
import { AppError } from '../../contexts/shared/infrastructure/exception/AppError';
import { isTokenBlacklisted } from '../security/token-blacklist';
import { registerOrValidateActiveToken } from '../security/session-manager';
import { resolveAuthToken } from './utils/resolve-auth-token';

export const validateAuth =
  (cookie: string = 'token') =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const token = resolveAuthToken(request, cookie);

      if (!token) {
        throw new AppError('AUTHORIZATION_NOT_PROVIDED', 401, 'Token not provided', true);
      }

      // ✅ Nuevo paso: revisar si el token está revocado
      if (isTokenBlacklisted(token)) {
        throw new AppError('TOKEN_REVOKED', 401, 'Token revocado. Por favor inicia sesión nuevamente.', true);
      }

      // Validar estructura y firma del token
      if (!validateToken(token)) {
        throw new AppError('INVALID_TOKEN', 403, 'Invalid token', true);
      }

      // ✅ Opcional: inyectar el payload para usarlo en controladores
      const payload = getPayload(token);
      if (!payload) {
        throw new AppError('INVALID_TOKEN_PAYLOAD', 403, 'Invalid token payload', true);
      }
      request.user = payload;

      if (!registerOrValidateActiveToken(payload.user, payload.type, token)) {
        throw new AppError('SESSION_INVALIDATED', 401, 'Esta sesión ha sido reemplazada por otro inicio de sesión.', true);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
