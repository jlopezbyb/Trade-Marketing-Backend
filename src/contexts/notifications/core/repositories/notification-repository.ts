import { NotificationDetailEntity } from '../entities/notifications-detail-entity';
import { NotificationEntity } from '../entities/notifications-entity';

export interface NotificationRepository {
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  findById(id: string): Promise<NotificationEntity | null>;
  findByTag(tag: string): Promise<
    Array<{
      tagName: any;
      id: string;
      email: string;
    }>
  >;
  findAll(): Promise<Array<{ id: string; email: string }>>;
  getEmployeeByIdFromDatabase(employeeId: string): Promise<{ id: string; email: string } | null>;
  bulkCreateDetails(details: NotificationDetailEntity[]): Promise<void>;
  markForEmailSending(notificationId: string, recipientEmails: string[]): Promise<void>;
  findAllNotifications(): Promise<
    Array<{
      id: string;
      subject: string;
      message: string;
      notificationDate: Date | null;
      isScheduled: boolean;
      emailStatus: 'PENDING' | 'SENT' | 'FAILED';
      recipients: string | null;
      tagName: string | null;
      source: 'Notification' | 'ScheduleNotification';
    }>
  >;
}
