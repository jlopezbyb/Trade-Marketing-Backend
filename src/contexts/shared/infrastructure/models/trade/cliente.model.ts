import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class ClienteModel extends Model {}

ClienteModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(180), allowNull: false },
    cliente_code: { type: DataTypes.STRING(80), unique: true, allowNull: false },
    direccion: { type: DataTypes.STRING(255), allowNull: false },
    telefono: { type: DataTypes.STRING(30), allowNull: false },
    contacto: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255) },
    imagen_url: { type: DataTypes.TEXT },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'cliente',
    tableName: 'clientes',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
