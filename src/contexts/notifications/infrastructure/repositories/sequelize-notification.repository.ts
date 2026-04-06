import { NotificationRepository } from '../../core/repositories/notification-repository';
import { NotificationModel } from '@src/contexts/shared/infrastructure/models/notification/notification-model';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { NotificationEntity } from '../../core/entities/notifications-entity';
import { sequelize } from '@src/server/config/database/sequelize';
import { v4 as uuid } from 'uuid';
import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';
import { NotificationDetailModel } from '@src/contexts/shared/infrastructure/models/notification/notification-detail-model';
import { NotificationDetailEntity } from '../../core/entities/notifications-detail-entity';
//import { AssignmentModel } from '@src/contexts/shared/infrastructure/models/assignment/assignment.model';
import { TagModel } from '@src/contexts/shared/infrastructure/models/parameter/tag.model';
import { ScheduleNotificationModel } from '@src/contexts/shared/infrastructure/models/notification/schedule-notification-model';
import { Op } from 'sequelize';

export class SequelizeNotificationRepository implements NotificationRepository {
  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    const transaction = await sequelize.transaction();
    try {
      // Transformar la entidad a un formato compatible con la base de datos
      const notificationData = notification.toPrimitives();

      // Crear la notificación en la base de datos
      const createdNotification = await NotificationModel.create(notificationData, { transaction });

      // Confirmar la transacción
      await transaction.commit();

      // Retornar una nueva instancia de NotificationEntity
      return NotificationEntity.fromPrimitives(createdNotification.toJSON());
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      console.error('Transaction rolled back due to error:', error);

      if ((error as any).name === 'SequelizeValidationError') {
        const sequelizeError = error as { errors: Array<{ message: string }> };
        throw new AppError('VALIDATION_ERROR', 400, sequelizeError.errors.map(e => e.message).join(', '), true);
      }

      throw new AppError('DATABASE_ERROR', 500, 'Failed to create notification', true);
    }
  }
  async findById(id: string): Promise<NotificationEntity | null> {
    try {
      const notification = await NotificationModel.findByPk(id);
      return notification ? notification.toJSON() : null;
    } catch (error) {
      throw new AppError('DATABASE_ERROR', 500, 'Failed to find notification by id', true);
    }
  }

  async getEmployeeByIdFromDatabase(employeeId: string): Promise<{ id: string; email: string } | null> {
    const employeeDatabase = await EmployeeModel.findByPk(employeeId, {
      attributes: ['id', 'email'] // Solo seleccionamos las columnas necesarias
    });

    if (!employeeDatabase) return null;

    // Devuelve un objeto literal con los datos necesarios
    return {
      id: employeeDatabase.get('id') as string,
      email: employeeDatabase.get('email') as string
    };
  }

  async findByTag(tagId: string): Promise<Array<{ id: string; email: string; tagName: string }>> {
    try {
      const employees = await EmployeeModel.findAll({
        include: [
          {
            //model: AssignmentModel,
            required: true,
            where: { status: 'ACEPTADO' },
            include: [
              {
                model: TagModel,
                attributes: ['name'], // Asegúrate de que este campo esté bien
                through: { attributes: [] }, // Excluye la tabla intermedia
                where: { id: { [Op.in]: tagId.split(',').map(id => id.trim()) } }
              }
            ]
          }
        ],
        attributes: ['id', 'email'] // Trae el id y email del empleado
      });

      // Imprimir toda la estructura de los empleados para depuración

      return employees.map(employee => {
        // Accede al primer 'assignment' en el array de asignaciones
        const assignment = employee.dataValues.assignment; // Nota que es 'assignment' en singular
        if (!assignment) {
          return {
            id: employee.dataValues.id,
            email: employee.dataValues.email,
            tagName: 'No Tag' // Valor por defecto si no hay asignación
          };
        }

        // Accede al primer 'tag' dentro de la asignación
        const tag = assignment.tags?.[0]; // Asegúrate de que 'tags' es un array
        if (!tag) {
          return {
            id: employee.dataValues.id,
            email: employee.dataValues.email,
            tagName: 'No Tag' // Valor por defecto si no hay tag
          };
        }

        // Devuelve los datos correctamente
        return {
          id: employee.dataValues.id,
          email: employee.dataValues.email,
          tagName: tag.name || 'No Tag' // Asegúrate de acceder a 'name' si existe
        };
      });
    } catch (error) {
      throw new AppError('DATABASE_ERROR', 500, 'Failed to find employees by tag', true);
    }
  }

  async bulkCreateDetails(details: NotificationDetailEntity[]): Promise<void> {
    try {
      await NotificationDetailModel.bulkCreate(
        details.map(detail => ({
          ...detail,
          id: uuid()
        }))
      );
    } catch (error) {
      console.error('Error during bulkCreate:', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to bulk create notification details', true);
    }
  }

  async findAll(): Promise<Array<{ id: string; email: string }>> {
    try {
      const employees = await EmployeeModel.findAll({
        attributes: ['id', 'email'], // Solo seleccionamos los campos necesarios
        include: [
          {
            //model: AssignmentModel,
            attributes: [], // No necesitamos recuperar datos adicionales de la asignación
            where: { status: 'ACEPTADO' }, // Filtrar solo los registros con estado ACEPTADO
            required: true // INNER JOIN: Solo traer empleados con asignaciones aceptadas
          }
        ]
      });

      return employees.map(employee => ({
        id: employee.get('id') as string,
        email: employee.get('email') as string
      }));
    } catch (error) {
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch employees', true);
    }
  }

  async save(notificationData: {
    subject: string;
    message: string;
    isScheduled: boolean;
    notificationDate: Date | null;
    recipientType: string;
    recipientId: string | null;
  }): Promise<NotificationModel> {
    try {
      const notification = await NotificationModel.create(notificationData);
      return notification;
    } catch (error) {
      throw new AppError('DATABASE_ERROR', 500, 'Failed to save notification', true);
    }
  }
  async markForEmailSending(notificationId: string, recipientEmails: string[]): Promise<void> {
    try {
      await NotificationModel.update(
        {
          email_status: 'PENDING',
          recipients: recipientEmails.join(',')
        },
        { where: { id: notificationId } }
      );
    } catch (error) {
      console.error('Error marking notification for email sending:', error);
      throw new Error('Failed to mark notification for email sending');
    }
  }

  async findAllNotifications(): Promise<
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
  > {
    try {
      const notifications = await NotificationModel.findAll({ raw: true });
      const scheduleNotifications = await ScheduleNotificationModel.findAll({ raw: true });

      // Mapear para garantizar que los datos tengan el formato esperado
      const formattedNotifications = notifications.map((notification: any) => ({
        id: notification.id as string,
        subject: notification.subject as string,
        message: notification.message as string,
        notificationDate: notification.notificationDate || null,
        isScheduled: notification.isScheduled || false,
        emailStatus: notification.emailStatus || 'PENDING',
        recipients: notification.recipients || null,
        tagName: notification.tagName,
        source: 'Notification' as const
      }));

      const formattedScheduleNotifications = scheduleNotifications.map((schedule: any) => ({
        id: schedule.id as string,
        subject: schedule.subject as string,
        message: schedule.message as string,
        notificationDate: schedule.notificationDate || null,
        isScheduled: schedule.isScheduled || false,
        emailStatus: schedule.emailStatus || 'PENDING',
        recipients: schedule.recipients || null,
        tagName: schedule.tagName || null,
        source: 'ScheduleNotification' as const
      }));

      return [...formattedNotifications, ...formattedScheduleNotifications];
    } catch (error) {
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch all notifications', true);
    }
  }
}
