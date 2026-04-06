import { EventType } from '@src/contexts/shared/core/notification_queue';
import { NotificationPreferencesEntity, NotificationTypePreference } from '../entities/notification-preference-entity';
import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';

export interface NotificationPreferenceRepository {
  getNotificationPreferencesByUser(userId: string): Promise<NotificationPreferencesEntity>;
  saveNotificationPreferences(notificationPreferences: {
    userId: string;
    preferences: Array<NotificationTypePreference>;
  }): Promise<void>;
  getUsersByNotificationType(notificationType: EventType): Promise<Array<UserEntity>>;
}
