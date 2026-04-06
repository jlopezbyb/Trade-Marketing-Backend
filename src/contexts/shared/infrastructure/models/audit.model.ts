import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class AuditModel extends Model {}

AuditModel.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
      allowNull: false
    },
    use_case: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    target_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    target_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Sequelize fallback
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Audit',
    tableName: 'audit',
    timestamps: false
  }
);
