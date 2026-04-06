import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';
import { NotificationTypeModel } from './notification-type';

export class NotificationQueueModel extends Model {}

const eventStatus = ['PENDING', 'IN_PROGRESS', 'DISPATCHED', 'FAILED', 'RETRYING'];

NotificationQueueModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: NotificationTypeModel,
        key: 'notification_type'
      }
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: eventStatus,
      allowNull: false
    },
    attempts: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    maxRetries: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 3
    },
    dispatchedAt: {
      type: DataTypes.DATE
    },
    errorMessage: {
      type: DataTypes.TEXT
    },
    nextAttempt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    underscored: true,
    version: true,
    modelName: 'notification_queue',
    tableName: 'notification_queue',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
