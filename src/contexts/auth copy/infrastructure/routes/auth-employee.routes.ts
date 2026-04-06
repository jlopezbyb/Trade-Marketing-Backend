import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@src/server/middleware/auth-middleware';
import { validateEntraIdJwt } from '@src/server/middleware/validate-entra-jwt';

import rateLimit from 'express-rate-limit';

const routes = Router();

const entraRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

routes.post(
  '/employee/entra/login',
  entraRateLimiter,
  validateEntraIdJwt,
  authController.entraEmployeeLogin.bind(authController)
);

routes.post('/refresh-token', validateAuth('refresh_token'), authController.refreshEmployeeToken.bind(authController));

routes.post('/logout', authController.logout.bind(authController));

export default routes;
