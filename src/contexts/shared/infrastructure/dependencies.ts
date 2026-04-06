import { EventNotificationService } from '../application/event-notification-service';
import { SequelizeMysqlNotificationRepository } from './repositories/sequelize-mysql-notification-repository';
import { NotificationPreferenceMySQLRepository } from '../../parameters/infrastructure/repositories/sequelize-mysql-notification-preference-repository';

const notificationRepository = new SequelizeMysqlNotificationRepository();

const notificationPreferenceRepository = new NotificationPreferenceMySQLRepository();

const eventNotificationService = new EventNotificationService(notificationRepository, notificationPreferenceRepository);

export { eventNotificationService };
