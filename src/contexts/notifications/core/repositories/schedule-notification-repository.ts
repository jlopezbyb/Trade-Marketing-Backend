import { ScheduleNotificationEntity } from '../entities/schedule-notifications-entity';
import { NotificationDetailEntity } from '../entities/notifications-detail-entity';

export interface ScheduleNotificationRepository {
  create(notification: ScheduleNotificationEntity): Promise<ScheduleNotificationEntity>;
  bulkCreateDetails(details: NotificationDetailEntity[]): Promise<void>;
}
