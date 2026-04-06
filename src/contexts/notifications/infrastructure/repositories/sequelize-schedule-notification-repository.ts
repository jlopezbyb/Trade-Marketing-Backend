import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { sequelize } from '@src/server/config/database/sequelize';
import { v4 as uuid } from 'uuid';
import { NotificationDetailModel } from '@src/contexts/shared/infrastructure/models/notification/notification-detail-model';
import { NotificationDetailEntity } from '../../core/entities/notifications-detail-entity';
import { ScheduleNotificationEntity } from '../../core/entities/schedule-notifications-entity';
import { ScheduleNotificationModel } from '@src/contexts/shared/infrastructure/models/notification/schedule-notification-model';

export class ScheduledSequelizeNotificationRepository implements ScheduledSequelizeNotificationRepository {
  async create(notification: ScheduleNotificationEntity): Promise<ScheduleNotificationEntity> {
    const transaction = await sequelize.transaction();
    try {
      // Transformar la entidad a un formato compatible con la base de datos
      const notificationData = notification.toPrimitives();

      // Crear la notificación en la base de datos
      const createdNotification = await ScheduleNotificationModel.create(notificationData, { transaction });

      // Confirmar la transacción
      await transaction.commit();

      // Retornar una nueva instancia de NotificationEntity
      return ScheduleNotificationEntity.fromPrimitives(createdNotification.toJSON());
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      console.error('Transaction rolled back due to error:', error);

      if ((error as any).name === 'SequelizeValidationError') {
        const sequelizeError = error as { errors: Array<{ message: string }> };
        throw new AppError('VALIDATION_ERROR', 400, sequelizeError.errors.map(e => e.message).join(', '), true);
      }

      throw new AppError('DATABASE_ERROR', 500, 'Failed to create notification', true);
    }
  }

  async bulkCreateDetails(details: NotificationDetailEntity[]): Promise<void> {
    try {
      await NotificationDetailModel.bulkCreate(
        details.map(detail => ({
          ...detail,
          id: uuid()
        }))
      );
    } catch (error) {
      console.error('Error during bulkCreate:', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to bulk create notification details', true);
    }
  }
}
