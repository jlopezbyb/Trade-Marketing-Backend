import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@src/server/middleware/auth-middleware';
import { loginSchema } from '../utils/auth-zod-schemas';
import { validateRequest } from '@src/server/utils/zod-validator';
import { validateEntraIdJwt } from '@src/server/middleware/validate-entra-jwt';
import rateLimit from 'express-rate-limit';

const routes = Router();

const entraRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

routes.post('/login', validateRequest(loginSchema, 'body'), authController.login.bind(authController));
routes.post('/refresh-token', validateAuth('refresh_token'), authController.refreshToken.bind(authController));
routes.post('/logout', authController.logout.bind(authController));
routes.post('/entra/login', entraRateLimiter, validateEntraIdJwt, authController.entraLogin.bind(authController));

export default routes;
