import { Router } from 'express';
import { notificationPreferenceController } from '../repositories/dependencies';
import { validateRequest } from '@server/utils/zod-validator';
import { notificationPreferenceSchema, userSchema } from '../utils/notification-preference-zod-schema';

const routes = Router();

routes
  .get(
    '/:user_id',
    validateRequest(userSchema, 'params'),
    notificationPreferenceController.getNotificationPreferencesByUser.bind(notificationPreferenceController)
  )
  .put(
    '/:user_id',
    validateRequest(userSchema, 'params'),
    validateRequest(notificationPreferenceSchema, 'body'),
    notificationPreferenceController.saveNotificationPreferences.bind(notificationPreferenceController)
  );

export default routes;
