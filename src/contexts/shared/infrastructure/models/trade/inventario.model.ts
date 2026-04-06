import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class InventarioModel extends Model {}

InventarioModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cliente_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'clientes', key: 'id' } },
    producto_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'productos', key: 'id' } },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    fecha_actualizacion: { type: DataTypes.DATEONLY, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'inventario',
    tableName: 'inventario',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
