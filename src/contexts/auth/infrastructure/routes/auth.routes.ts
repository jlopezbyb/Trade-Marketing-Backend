import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@src/server/middleware/auth-middleware';
import { loginSchema } from '../utils/auth-zod-schemas';
import { validateRequest } from '@src/server/utils/zod-validator';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

const routes = Router();

const samlRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

routes.post('/login', validateRequest(loginSchema, 'body'), authController.login.bind(authController));
routes.post('/refresh-token', validateAuth('refresh_token'), authController.refreshToken.bind(authController));
routes.post('/logout', authController.logout.bind(authController));
routes.get('/entra/login', passport.authenticate('entra-admin', { failureRedirect: '/login' }));
routes.post(
  '/entra/callback',
  samlRateLimiter,
  passport.authenticate('entra-admin', { session: false }),
  authController.entraLogin.bind(authController)
);

export default routes;
