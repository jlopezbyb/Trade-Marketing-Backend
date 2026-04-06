import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@src/server/middleware/auth-middleware';
import passport from 'passport';

import rateLimit from 'express-rate-limit';

const routes = Router();

const samlCallbackRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

routes.get('/employee/entra/login', passport.authenticate('entra-employee', { failureRedirect: '/login' }));
routes.post(
  '/employee/entra/callback',
  samlCallbackRateLimiter,
  passport.authenticate('entra-employee', { session: false }),
  authController.entraEmployeeLogin.bind(authController)
);

routes.post('/refresh-token', validateAuth('refresh_token'), authController.refreshEmployeeToken.bind(authController));

routes.post('/logout', authController.logout.bind(authController));

export default routes;
