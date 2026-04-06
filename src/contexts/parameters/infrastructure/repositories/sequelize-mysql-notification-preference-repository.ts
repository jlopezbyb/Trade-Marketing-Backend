import { NotificationPreferenceRepository } from '@src/contexts/parameters/core/repositories/notification-preference-repository';
import {
  NotificationPreferencesEntity,
  NotificationTypePreference
} from '@src/contexts/parameters/core/entities/notification-preference-entity';
import { NotificationPreferenceModel } from '@src/contexts/shared/infrastructure/models/parameter/notification-preference';
import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { sequelize } from '@src/server/config/database/sequelize';
import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';
import { EventType } from '@src/contexts/shared/core/notification_queue';

export class NotificationPreferenceMySQLRepository implements NotificationPreferenceRepository {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  async getNotificationPreferencesByUser(userId: string): Promise<NotificationPreferencesEntity> {
    const data = await UserModel.findAll({
      where: {
        id: userId
      },
      include: [
        {
          model: NotificationPreferenceModel,
          attributes: ['notification_type', 'enable']
        }
      ],
      attributes: ['id', 'username', 'email', 'name']
    });

    return data.map((item: UserModel) => {
      const plainData = item.get({ plain: true });
      return NotificationPreferencesEntity.fromPrimitives({
        ...plainData,
        notificationPreferences: plainData.notification_preferences.map(
          (item: { notification_type: string; enable: boolean }) => {
            return {
              notificationType: item.notification_type,
              enable: item.enable
            };
          }
        )
      });
    })[0];
  }

  async saveNotificationPreferences(notificationPreferences: {
    userId: string;
    preferences: Array<NotificationTypePreference>;
  }): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const updateListPromises = notificationPreferences.preferences.map(preference => {
        return NotificationPreferenceModel.update(
          { enable: preference.enable },
          {
            where: {
              userId: notificationPreferences.userId,
              notificationType: preference.notificationType
            },
            transaction
          }
        );
      });

      await Promise.all(updateListPromises);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUsersByNotificationType(notificationType: EventType): Promise<Array<UserEntity>> {
    const data = await NotificationPreferenceModel.findAll({
      where: {
        notificationType: notificationType,
        enable: true
      },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'username', 'email', 'name'],
          where: { status: 'ACTIVO' }
        }
      ]
    });

    return data.map(item => {
      const plainData = item.get({ plain: true });
      return UserEntity.fromPrimitives({
        ...plainData.user
      });
    });
  }
}
