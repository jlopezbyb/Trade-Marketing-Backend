import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(35),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50)
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: 'role',
        key: 'id'
      }
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
    modelName: 'user',
    tableName: 'user',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
