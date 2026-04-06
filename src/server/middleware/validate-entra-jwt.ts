import { Request, Response, NextFunction } from 'express';
import { validateEntraIdToken } from '../../contexts/auth/infrastructure/utils/jwt-utils';
import { config } from '@src/server/config/env/envs';

export const validateEntraIdJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const validatedToken = await validateEntraIdToken(token, config.ENTRA_ID.TENANT_ID!, config.ENTRA_ID.CLIENT_ID!);

    if (!validatedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach the validated token payload to the request
    (req as any).entraIdPayload = validatedToken;
    next();
  } catch (error) {
    console.error('Error validating Entra ID token:', error);
    return res.status(401).json({ error: 'Token validation failed' });
  }
};
