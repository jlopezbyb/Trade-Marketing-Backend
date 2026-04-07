import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../contexts/shared/infrastructure/exception/AppError';
import { getPayload, validateToken } from '@src/contexts/auth/infrastructure/utils/jwt-utils';
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

      // 🔒 Verificar si el token fue revocado (logout)
      if (isTokenBlacklisted(token)) {
        throw new AppError('TOKEN_REVOKED', 401, 'Token revocado. Inicia sesión nuevamente.', true);
      }

      // 🔒 Verifica que el token sea válido (firma + expiración)
      if (!validateToken(token)) {
        throw new AppError('INVALID_TOKEN', 403, 'Invalid token', true);
      }

      // ✅ Extraer el payload para uso posterior
      const payload = getPayload(token);
      if (!payload) {
        throw new AppError('INVALID_TOKEN_PAYLOAD', 403, 'Invalid token payload', true);
      }
      request.user = payload;

      if (!registerOrValidateActiveToken(payload.user, String(payload.type), token)) {
        throw new AppError('SESSION_INVALIDATED', 401, 'Esta sesión ha sido reemplazada por otro inicio de sesión.', true);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
