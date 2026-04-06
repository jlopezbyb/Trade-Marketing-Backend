import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class NotificationTypeModel extends Model {}

NotificationTypeModel.init(
  {
    notificationType: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'notification_type',
    tableName: 'notification_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
