import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';
import { NotificationModel } from '@src/contexts/shared/infrastructure/models/notification/notification-model';
import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';

export class NotificationDetailModel extends Model {}

NotificationDetailModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    notificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: NotificationModel,
        key: 'id'
      }
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: EmployeeModel,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'notification_detail',
    tableName: 'notification_detail',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
