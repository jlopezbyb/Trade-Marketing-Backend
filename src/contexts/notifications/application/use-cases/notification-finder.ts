import { NotificationRepository } from '../../core/repositories/notification-repository';

export class getAllNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async run() {
    try {
      const notifications = await this.notificationRepository.findAllNotifications();
      if (!notifications || notifications.length === 0) {
        return { message: 'No notifications found' };
      }

      return notifications;
    } catch (error) {
      console.error('Error in run method:', error);
      return null;
    }
  }
}
