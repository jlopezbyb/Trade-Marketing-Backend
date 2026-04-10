import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    employee_code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    imagen_url: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'usuario',
    tableName: 'usuarios',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
