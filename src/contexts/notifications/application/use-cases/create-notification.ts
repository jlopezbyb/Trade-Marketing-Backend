import { v4 as uuid } from 'uuid';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { NotificationRepository } from '@src/contexts/notifications/core/repositories/notification-repository';
import { NotificationEntity } from '../../core/entities/notifications-entity';
import { NotificationDetailEntity } from '../../core/entities/notifications-detail-entity';
import { ScheduleNotificationEntity } from '../../core/entities/schedule-notifications-entity';
import { ScheduleNotificationRepository } from '@src/contexts/notifications/core/repositories/schedule-notification-repository';
// eslint-disable-next-line node/no-extraneous-import
import moment from 'moment-timezone';

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly scheduleNotificationsRepository: ScheduleNotificationRepository
  ) {}

  private guatemalaDate: Date = moment().tz('America/Guatemala').toDate();

  async run(data: {
    id: string;
    subject: string;
    message: string;
    isScheduled: boolean;
    notificationDate?: Date | null;
    recipientType: 'individual' | 'tag' | 'all';
    recipientId?: string;
    tagName?: string; // Este es el tagName que se puede pasar directamente
  }): Promise<{ message: string }> {
    try {
      if (!data.subject || !data.message) {
        throw new AppError('INVALID_NOTIFICATION_DATA', 400, 'Subject and message are required', true);
      }

      let employeeEmails: string[] = [];
      let employeeId: string[] = [];
      let tagName: string[] = [];

      // Manejar el tipo de destinatario
      switch (data.recipientType) {
        case 'individual': {
          if (!data.recipientId) {
            throw new AppError('INVALID_RECIPIENT', 400, 'Recipient ID is required for individual notifications', true);
          }

          const recipientIds = data.recipientId.split(',').map(id => id.trim());
          const employees = await Promise.all(
            recipientIds.map(async id => {
              const employee = await this.notificationRepository.getEmployeeByIdFromDatabase(id);
              if (!employee) {
                throw new AppError('EMPLOYEE_NOT_FOUND', 404, `Recipient with ID ${id} not found`, true);
              }
              return employee;
            })
          );
          employeeEmails = employees.map(employee => employee.email);
          employeeId = employees.map(employee => employee.id);
          break;
        }
        case 'tag': {
          if (!data.recipientId) {
            throw new AppError('INVALID_TAG', 400, 'Tag is required for tag-based notifications', true);
          }

          // No dividir aquí, solo pasar la cadena con comas
          const taggedEmployees = await this.notificationRepository.findByTag(data.recipientId);

          // El resto queda igual...
          const uniqueEmployees = Array.from(new Set(taggedEmployees.map(emp => emp.id))).map(id =>
            taggedEmployees.find(emp => emp.id === id)
          );

          const employeeDetails = uniqueEmployees.map(employee => {
            if (!employee) {
              throw new AppError('EMPLOYEE_NOT_FOUND', 404, 'Employee not found', true);
            }

            return {
              id: employee.id,
              email: employee.email,
              tagName: employee.tagName
            };
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          tagName = [...new Set(employeeDetails.map(emp => emp.tagName))];
          employeeEmails = employeeDetails.map(emp => emp.email);
          employeeId = employeeDetails.map(emp => emp.id);

          break;
        }

        case 'all': {
          const allEmployees = await this.notificationRepository.findAll();
          employeeEmails = allEmployees.map(employee => employee.email);
          employeeId = allEmployees.map(employee => employee.id);
          break;
        }

        default:
          throw new AppError('INVALID_RECIPIENT_TYPE', 400, 'Invalid recipient type', true);
      }

      if (!employeeEmails.length) {
        throw new AppError('NO_RECIPIENTS_FOUND', 404, 'No recipients found for the notification', true);
      }

      // Manejo de notificaciones programadas
      if (data.isScheduled) {
        const scheduledNotification = new ScheduleNotificationEntity(
          data.id,
          data.subject,
          data.message,
          data.notificationDate || null,
          data.isScheduled,
          'PENDING',
          employeeEmails.join(','),
          tagName.length > 0 ? tagName.join(',') : data.tagName || null // Usar tagName correcto
        );

        console.log('Scheduled Notification:', scheduledNotification);
        await this.scheduleNotificationsRepository.create(scheduledNotification);

        return { message: 'Notificación programada correctamente' };
      }

      // Manejo de notificaciones instantáneas

      const guatemalaDateNow = moment().tz('America/Guatemala').format('YYYY-MM-DD HH:mm:ss');

      const notification = new NotificationEntity(
        data.id,
        data.subject,
        data.message,
        moment(guatemalaDateNow, 'YYYY-MM-DD HH:mm:ss').toDate(), // Usar la fecha actual de Guatemala
        data.isScheduled,
        'PENDING',
        employeeEmails.join(','),
        tagName.length > 0 ? tagName.join(',') : data.tagName || null // Usar tagName correcto
      );

      await this.notificationRepository.create(notification);

      // Crear detalles de notificación
      const notificationDetails = employeeId.map(employeeId => new NotificationDetailEntity(uuid(), notification.id, employeeId));
      await this.notificationRepository.bulkCreateDetails(notificationDetails);

      return { message: 'Notificación enviada correctamente' };
    } catch (error: any) {
      console.error('Error al crear notificación', error);
      throw new AppError('NOTIFICATION_CREATION_FAILED', 500, 'Failed to create notification', true);
    }
  }
}
