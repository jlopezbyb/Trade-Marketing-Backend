import { Router } from 'express';
import { notificationSchema } from '../utils/notifications-schema';
import { validateRequest } from '@src/server/utils/zod-validator';
import { notificationController } from '../repositories/dependencies';
import { getAllNotificationsSchemaForQuery } from '../repositories/notification-zod-schema';

const routes = Router();

routes.post(
  '/send',
  validateRequest(notificationSchema, 'body'),
  notificationController.createNotification.bind(notificationController)
);

routes.get(
  '/',
  validateRequest(getAllNotificationsSchemaForQuery, 'query'),
  notificationController.getAllNotifications.bind(notificationController)
);

export default routes;
