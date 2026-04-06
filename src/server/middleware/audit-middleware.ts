import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const extractUserFromToken = (req: Request, res: Response, next: NextFunction) => {
  // ✅ 1. Buscar en cookies primero
  const token =
    req.cookies?.token ||
    // ✅ 2. Fallback al header Authorization si no está en cookies
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;

    (req as any).user = { username: decoded.user };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
