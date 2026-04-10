import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class InventarioLoteModel extends Model {}

InventarioLoteModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    inventario_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'inventario', key: 'id' } },
    lote: { type: DataTypes.STRING(80), allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'inventario_lote',
    tableName: 'inventario_lotes',
    updatedAt: false,
    createdAt: 'created_at'
  }
);
