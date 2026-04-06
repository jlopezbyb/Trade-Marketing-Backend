import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class NotificationPreferenceModel extends Model {}

NotificationPreferenceModel.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'notification_type',
        key: 'notification_type'
      }
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'notification_preference',
    tableName: 'notification_preference'
  }
);
