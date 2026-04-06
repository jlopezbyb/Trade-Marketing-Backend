import { Request, Response } from 'express';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification';
import { NotificationRepository } from '../../core/repositories/notification-repository';
import { AppError } from '../../../shared/infrastructure/exception/AppError';
import { v4 as uuid } from 'uuid';

export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async createNotification(req: Request, res: Response): Promise<Response> {
    try {
      const { subject, message, isScheduled, notificationDate, recipientType, recipientId } = req.body;

      if (!subject || !message || !recipientType) {
        throw new AppError('INVALID_REQUEST', 400, 'Subject, message, and recipientType are required', true);
      }

      const result = await this.createNotificationUseCase.run({
        id: uuid(),
        subject,
        message,
        isScheduled: isScheduled,
        notificationDate: notificationDate ? new Date(notificationDate) : null,
        recipientType,
        recipientId
      });

      return res.status(201).json({
        message: result.message
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        error: error.name || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      });
    }
  }

  async getNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const notifications = await this.notificationRepository.findAll();
      return res.status(200).json({
        notifications
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        error: error.name || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
  async getAllNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const notifications = await this.notificationRepository.findAllNotifications();

      // Verificar si no hay notificaciones
      if (!notifications || notifications.length === 0) {
        return res.status(200).json({
          message: 'No notifications found'
        });
      }

      return res.status(200).json({
        data: notifications
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        error: error.name || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
}
