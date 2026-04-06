import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class CategoriaModel extends Model {}

CategoriaModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(120), unique: true, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    color: { type: DataTypes.STRING(20), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'categoria',
    tableName: 'categorias',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
