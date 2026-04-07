import { NextFunction, Request, Response } from 'express';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { getPayload, validateToken } from '@src/contexts/auth/infrastructure/utils/jwt-utils';
import { isTokenBlacklisted } from '../security/token-blacklist';
import { registerOrValidateActiveToken } from '../security/session-manager';
import { resolveAuthToken } from './utils/resolve-auth-token';

export const validateAuthFlexible = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = resolveAuthToken(req, 'token_employee') ?? resolveAuthToken(req, 'token');

    if (!token) {
      return next(new AppError('AUTHORIZATION_NOT_PROVIDED', 401, 'Token no proporcionado', true));
    }

    if (isTokenBlacklisted(token)) {
      return next(new AppError('TOKEN_REVOKED', 401, 'Token revocado', true));
    }

    if (!validateToken(token)) {
      return next(new AppError('INVALID_TOKEN', 403, 'Token inválido', true));
    }

    const payload = getPayload(token);
    if (!payload) {
      return next(new AppError('INVALID_TOKEN_PAYLOAD', 403, 'Payload inválido', true));
    }

    if (!registerOrValidateActiveToken(payload.user, payload.type, token)) {
      return next(new AppError('SESSION_INVALIDATED', 401, 'Esta sesión ha sido reemplazada.', true));
    }

    req.user = payload;
    next();
  };
};
