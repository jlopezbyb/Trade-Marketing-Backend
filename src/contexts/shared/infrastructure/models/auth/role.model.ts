import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class RoleModel extends Model {}

RoleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255)
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'role',
    tableName: 'role',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
