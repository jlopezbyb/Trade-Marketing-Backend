import { NotificationQueue } from '../notification_queue';

export interface NotificationQueueRepository {
  create(data: NotificationQueue): Promise<void>;
}
