import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class VisitaModel extends Model {}

VisitaModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cliente_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'clientes', key: 'id' } },
    usuario_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'usuarios', key: 'id' } },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    observaciones: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'visita',
    tableName: 'visitas',
    updatedAt: false,
    createdAt: 'created_at'
  }
);
