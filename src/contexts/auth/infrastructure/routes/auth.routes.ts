import { Router } from 'express';
import { authController } from '../dependencies';

import { validateEntraIdJwt } from '@src/server/middleware/validate-entra-jwt';
//import { validateAuth } from '@src/server/middleware/auth-middleware';
import rateLimit from 'express-rate-limit';

const routes = Router();

const entraRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

routes.post('/login', entraRateLimiter, validateEntraIdJwt, authController.entraLogin.bind(authController));
routes.get('/me', /*validateAuth(),*/ authController.me.bind(authController));
routes.post('/refresh-token', authController.refreshToken.bind(authController));
routes.post('/logout', authController.logout.bind(authController));

export default routes;
