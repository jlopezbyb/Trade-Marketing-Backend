// src/server/middleware/csrf-protection.ts
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '@contexts/shared/infrastructure/exception/AppError';

// Generar un token seguro
export const generateCSRFToken = () => crypto.randomBytes(24).toString('hex');

// Middleware para enviar el token CSRF como cookie en respuestas GET (opcional)
export const attachCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' && !req.cookies['csrfToken']) {
    const token = generateCSRFToken();
    res.cookie('csrfToken', token, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      domain: '.claro.com.gt'
    });
  }
  next();
};

// Middleware de validación CSRF
export const validateCSRF = (req: Request, res: Response, next: NextFunction) => {
  // Expresiones regulares para rutas exentas de validación CSRF
  const csrfExemptPaths: RegExp[] = [
    /^\/api\/v1\/auth\/login$/,
    /^\/api\/v1\/auth\/refresh-token$/,
    /^\/api\/v1\/auth\/logout$/,
    /^\/api\/v1\/auth\/entra\/login$/,
    /^\/api\/v1\/auth\/employee\/entra\/login$/,
    /^\/api\/v1\/auth\/employee\/refresh-token$/,
    /^\/api\/v1\/auth\/employee\/logout$/,
    /^\/api\/v1\/csrf\/health$/,
    /^\/api\/v1\/health$/,
    /^\/api\/v1\/assignment\/de-assignment\/[^/]+$/
  ];

  const isExempt = csrfExemptPaths.some(pattern => pattern.test(req.path));
  if (isExempt) {
    return next();
  }

  // Solo validar en métodos mutantes
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfCookie = req.cookies['csrfToken'];
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      console.info('Invalid CSRF token');
      throw new AppError('INVALID_CSRF_TOKEN', 403, 'Invalid CSRF token', true);
    }
  }

  next();
};
