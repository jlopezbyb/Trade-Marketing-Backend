import { Request, Response, NextFunction } from 'express';
import { LoginEmployeeUseCase } from '@src/contexts/auth copy/application/use-cases/auth/login';
import { RefreshTokenUseCase } from '@src/contexts/auth copy/application/use-cases/auth/refresh-token';
import { createToken, getPayload } from '../utils/jwt-utils';
import * as crypto from 'crypto';
import { addTokenToBlacklist } from '@src/server/security/token-blacklist';
import { getActiveToken, invalidateToken, setActiveToken } from '@src/server/security/session-manager';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_chars'; // Must be 32 chars
const ENCRYPTION_ALGORITHM = 'aes-256-ctr';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

export class AuthEmployeeController {
  constructor(
    private readonly loginUseCase: LoginEmployeeUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  private setAuthCookies(response: Response, token: string, refresh: string) {
    response
      .cookie('token', encrypt(token), {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.claro.com.gt',
        maxAge: 60 * 60 * 1000 // 1 hora
      })
      .cookie('refresh_token', encrypt(refresh), {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.claro.com.gt',
        maxAge: 60 * 60 * 1000 // 1 hora
      });
  }

  async entraEmployeeLogin(request: Request, response: Response, next: NextFunction) {
    try {
      const entraPayload = (request as any).entraIdPayload;
      const email = entraPayload?.preferred_username || entraPayload?.email;

      if (!email) {
        throw new Error('No se pudo obtener el email del token Entra ID');
      }

      console.log('📥 Email extraído del token Entra ID:', email);

      const { user, employeeCode, assignmentId } = await this.loginUseCase.entraLogin({ email });

      const { token, refreshToken } = createToken(user.email, employeeCode, assignmentId ?? '', 'employee');

      const oldToken = getActiveToken(user.email, 'employee');
      if (oldToken && oldToken !== token) {
        addTokenToBlacklist(oldToken);
      }
      setActiveToken(user.email, 'employee', token);

      this.setAuthCookies(response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!', token, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  async refreshEmployeeToken(request: Request, response: Response, next: NextFunction) {
    try {
      const encryptedToken = (request.cookies['refresh_token'] ?? '') as string;
      const token = decrypt(encryptedToken);
      const userData = getPayload(token.split(' ')[1]);

      if (!userData?.user) {
        throw new Error('Token inválido');
      }

      const { user, employeeCode, assignmentId } = await this.refreshTokenUseCase.run(userData.user);
      const { token: newToken, refreshToken: newRefresh } = createToken(user.email, employeeCode, assignmentId ?? '', 'employee');

      this.setAuthCookies(response, newToken, newRefresh);
      response.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
      next(error);
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      const encryptedToken = req.cookies['token'];
      const token = encryptedToken ? decrypt(encryptedToken) : undefined;
      const encryptedRefreshToken = req.cookies['refresh_token'];
      const refreshToken = encryptedRefreshToken ? decrypt(encryptedRefreshToken) : undefined;

      if (token) addTokenToBlacklist(token);
      if (refreshToken) addTokenToBlacklist(refreshToken);
      const userData = token ? getPayload(token) : undefined;
      if (userData?.user) invalidateToken(userData.user);

      res.status(200).clearCookie('token').clearCookie('refresh_token').json({ message: 'Sesión finalizada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
