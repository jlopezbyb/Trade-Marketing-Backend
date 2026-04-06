import { NotificationController } from '../controllers/notification.controller';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification';
import { SequelizeNotificationRepository } from '../repositories/sequelize-notification.repository';
import { ScheduledSequelizeNotificationRepository } from '../repositories/sequelize-schedule-notification-repository'; // Corrige la ruta si es diferente

// Instancia de los repositorios
const notificationRepository = new SequelizeNotificationRepository();
const scheduledNotificationRepository = new ScheduledSequelizeNotificationRepository(); // Nombres consistentes

// Instancia del caso de uso
const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository, scheduledNotificationRepository);

// Controladores
export const notificationController = new NotificationController(createNotificationUseCase, notificationRepository);
