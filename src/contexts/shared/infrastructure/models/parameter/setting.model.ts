import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class SettingModel extends Model {}

SettingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    settingKey: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    settingValue: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'setting',
    tableName: 'setting',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
