import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '@src/contexts/auth/application/use-cases/auth/login';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { addTokenToBlacklist } from '@src/server/security/token-blacklist';
import { createAuthCookieOptions } from '../utils/auth-cookie-options';

import { createToken } from '../utils/jwt-utils';
import { getPayload } from '../utils/jwt-utils';

import { getActiveToken, invalidateToken, setActiveToken } from '@src/server/security/session-manager';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  private buildSessionPayload(user: { id: string; email: string; rol: string; employee_code: string; nombre: string }) {
    return {
      id: user.id,
      user: user.email,
      role: user.rol,
      type: user.rol,
      employeeCode: user.employee_code,
      nombre: user.nombre
    };
  }

  private setAuthCookies(request: Request, response: Response, token: string, refresh: string) {
    const cookieOptions = createAuthCookieOptions(request);

    response.cookie('token', token, cookieOptions).cookie('refresh_token', refresh, cookieOptions);
  }

  private clearAuthCookies(request: Request, response: Response) {
    const cookieOptions = createAuthCookieOptions(request);

    return response.clearCookie('token', cookieOptions).clearCookie('refresh_token', cookieOptions);
  }

  async refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
      const raw = String(request.cookies?.['refresh_token'] ?? '');
      const refresh = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      if (!refresh) return response.status(401).json({ message: 'Refresh token requerido' });

      const userData = getPayload(refresh);
      if (!userData?.user) return response.status(401).json({ message: 'Refresh token inválido' });

      const { user } = await this.loginUseCase.entraLogin({ email: userData.user });

      const payload = this.buildSessionPayload(user);

      const { token, refreshToken } = createToken(payload);

      setActiveToken(user.email, user.rol, token);

      this.setAuthCookies(request, response, token, refreshToken);
      response.status(200).json({ message: 'Success!' });
    } catch (error) {
      next(error);
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['token'];
      const refreshToken = req.cookies['refresh_token'];

      if (token) addTokenToBlacklist(token);
      if (refreshToken) addTokenToBlacklist(refreshToken);
      const userData = getPayload(token);
      if (userData?.user) invalidateToken(userData.user);

      this.clearAuthCookies(req, res).status(200).json({ message: 'Sesión finalizada correctamente' });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      if (!payload) {
        throw new AppError('AUTHORIZATION_NOT_PROVIDED', 401, 'Token not provided', true);
      }

      if (!payload.user) {
        throw new AppError('INVALID_TOKEN_PAYLOAD', 403, 'Invalid token payload', true);
      }

      const { user } = await this.loginUseCase.entraLogin({ email: payload.user });

      res.status(200).json({
        id: user.id,
        user: user.email,
        role: user.rol,
        employeeCode: user.employee_code,
        nombre: user.nombre
      });
    } catch (error) {
      next(error);
    }
  }

  async entraLogin(request: Request, response: Response, next: NextFunction) {
    try {
      const entraPayload = (request as any).entraIdPayload;
      const email = entraPayload?.preferred_username || entraPayload?.email;

      if (!email) throw new Error('No se pudo obtener el email del token Entra ID');

      const { user } = await this.loginUseCase.entraLogin({ email });

      const payload = this.buildSessionPayload(user);

      const { token, refreshToken } = createToken(payload);

      const oldToken = getActiveToken(user.email, user.rol);
      if (oldToken && oldToken !== token) {
        addTokenToBlacklist(oldToken);
      }
      setActiveToken(user.email, user.rol, token);

      this.setAuthCookies(request, response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!', role: user.rol });
    } catch (error) {
      next(error);
    }
  }
}
