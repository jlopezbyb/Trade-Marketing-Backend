import { NotificationQueue } from '../../core/notification_queue';
import { NotificationQueueRepository } from '../../core/repositories.ts/notification-queue-repository';
import { NotificationQueueModel } from '../models/notification/notification-queue-model';

export class SequelizeMysqlNotificationRepository implements NotificationQueueRepository {
  async create(data: NotificationQueue): Promise<void> {
    await NotificationQueueModel.create(data.toPrimitives());
  }
}
