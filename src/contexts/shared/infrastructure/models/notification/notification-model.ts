import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class NotificationModel extends Model {}

NotificationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notificationDate: {
      type: DataTypes.DATE
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailStatus: {
      type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
      defaultValue: 'PENDING'
    },
    recipients: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tagName: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'notification',
    tableName: 'notification',
    timestamps: true, // Esto asegura que Sequelize maneje createdAt y updatedAt automáticamente
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
