import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '@src/contexts/auth/application/use-cases/auth/login';
import { RefreshTokenUseCase } from '@src/contexts/auth/application/use-cases/auth/refresh-token';
import { addTokenToBlacklist } from '@src/server/security/token-blacklist';

import { createToken } from '../utils/jwt-utils';
import { getPayload } from '../utils/jwt-utils';

import { getActiveToken, invalidateToken, setActiveToken } from '@src/server/security/session-manager';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  private setAuthCookies(response: Response, token: string, refresh: string) {
    response
      .cookie('token', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.claro.com.gt'
      })
      .cookie('refresh_token', refresh, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.claro.com.gt'
      });
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;

    try {
      const { user, role } = await this.loginUseCase.run({
        username,
        password
      });

      const payload = {
        user: user.username,
        role: role.name,
        type: 'admin',
        resources: role.resources.filter(r => r.canAccess).map(r => r.slug)
      };

      const { token, refreshToken } = createToken(payload);

      const oldToken = getActiveToken(user.username, 'admin');
      if (oldToken && oldToken !== token) {
        addTokenToBlacklist(oldToken); // Invalida sesión previa
      }
      setActiveToken(user.username, 'admin', token);

      this.setAuthCookies(response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!' });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
      const raw = String(request.cookies?.['refresh_token'] ?? '');
      const refresh = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      if (!refresh) return response.status(401).json({ message: 'Refresh token requerido' });

      const userData = getPayload(refresh);
      if (!userData?.user) return response.status(401).json({ message: 'Refresh token inválido' });

      const { role, user } = await this.refreshTokenUseCase.run(userData.user);

      // Si tu payload original traía type, úsalo; si no, infiérelo (admin/employee)
      const inferredType = request.cookies?.['token_employee'] ? 'employee' : userData.type ?? 'admin';

      const payload = {
        user: user.username,
        role: role.name,
        type: inferredType, // 👈 OBLIGATORIO
        resources: role.resources.filter(r => r.canAccess).map(r => r.slug)
      };

      const { token, refreshToken } = createToken(payload);

      // Actualiza sesión activa (opcional pero recomendado)
      setActiveToken(user.username, inferredType, token);

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

  async entraLogin(request: Request, response: Response, next: NextFunction) {
    try {
      const entraPayload = (request as any).entraIdPayload;
      const email = entraPayload?.preferred_username || entraPayload?.email;

      if (!email) throw new Error('No se pudo obtener el email del token Entra ID');

      const { user, role } = await this.loginUseCase.entraLogin({ email });

      const payload = {
        user: user.username,
        role: role.name,
        type: 'admin' as const,
        resources: role.resources.filter(r => r.canAccess).map(r => r.slug)
      };

      const { token, refreshToken } = createToken(payload);

      // 🔐 Política de single-session
      const oldToken = getActiveToken(user.username, 'admin');
      if (oldToken && oldToken !== token) {
        addTokenToBlacklist(oldToken);
      }
      setActiveToken(user.username, 'admin', token);

      this.setAuthCookies(response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!', token, refreshToken });
    } catch (error) {
      next(error);
    }
  }
}
