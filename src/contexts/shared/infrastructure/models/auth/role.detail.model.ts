import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class RoleDetailModel extends Model {}

RoleDetailModel.init(
  {
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    resourceId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'resource',
        key: 'id'
      }
    },
    canAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'role_detail',
    tableName: 'role_detail',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
