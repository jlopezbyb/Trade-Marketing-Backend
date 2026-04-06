import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '@src/contexts/auth/application/use-cases/auth/login';
import { addTokenToBlacklist } from '@src/server/security/token-blacklist';

import { createToken } from '../utils/jwt-utils';
import { getPayload } from '../utils/jwt-utils';

import { getActiveToken, invalidateToken, setActiveToken } from '@src/server/security/session-manager';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  private setAuthCookies(response: Response, token: string, refresh: string) {
    response
      .cookie('token', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.localhost.com'
      })
      .cookie('refresh_token', refresh, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.localhost.com'
      });
  }

  async refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
      const raw = String(request.cookies?.['refresh_token'] ?? '');
      const refresh = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      if (!refresh) return response.status(401).json({ message: 'Refresh token requerido' });

      const userData = getPayload(refresh);
      if (!userData?.user) return response.status(401).json({ message: 'Refresh token inválido' });

      const { user } = await this.loginUseCase.entraLogin({ email: userData.user });

      const payload = {
        user: user.email,
        role: user.rol,
        type: user.rol,
        employeeCode: user.employee_code,
        nombre: user.nombre
      };

      const { token, refreshToken } = createToken(payload);

      setActiveToken(user.email, user.rol, token);

      this.setAuthCookies(response, token, refreshToken);
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

      res.status(200).clearCookie('token').clearCookie('refresh_token').json({ message: 'Sesión finalizada correctamente' });
    } catch (error) {
      next(error);
    }
  }

  me(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      res.status(200).json({
        user: payload.user,
        role: payload.role,
        employeeCode: payload.employeeCode,
        nombre: payload.nombre
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

      const payload = {
        user: user.email,
        role: user.rol,
        type: user.rol,
        employeeCode: user.employee_code,
        nombre: user.nombre
      };

      const { token, refreshToken } = createToken(payload);

      const oldToken = getActiveToken(user.email, user.rol);
      if (oldToken && oldToken !== token) {
        addTokenToBlacklist(oldToken);
      }
      setActiveToken(user.email, user.rol, token);

      this.setAuthCookies(response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!', token, refreshToken, role: user.rol });
    } catch (error) {
      next(error);
    }
  }
}
