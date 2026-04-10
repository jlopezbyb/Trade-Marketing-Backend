import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class ProductoModel extends Model {}

ProductoModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    nombre: { type: DataTypes.STRING(180), allowNull: false },
    sku: { type: DataTypes.STRING(80), unique: true, allowNull: false },
    unidad: { type: DataTypes.STRING(40), allowNull: false },
    categoria_id: { type: DataTypes.UUID, references: { model: 'categorias', key: 'id' } },
    imagen_url: { type: DataTypes.TEXT },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'producto',
    tableName: 'productos',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
