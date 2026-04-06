import { SequelizeMysqlNotificationRepository } from './repositories/sequelize-mysql-notification-repository';

const notificationRepository = new SequelizeMysqlNotificationRepository();

export { notificationRepository };
