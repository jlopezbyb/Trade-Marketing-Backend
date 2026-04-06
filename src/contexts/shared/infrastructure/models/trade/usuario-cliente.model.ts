import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class UsuarioClienteModel extends Model {}

UsuarioClienteModel.init(
  {
    usuario_id: { type: DataTypes.BIGINT, primaryKey: true, references: { model: 'usuarios', key: 'id' } },
    cliente_id: { type: DataTypes.BIGINT, primaryKey: true, references: { model: 'clientes', key: 'id' } }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'usuario_cliente_asignado',
    tableName: 'usuario_cliente_asignado',
    updatedAt: false,
    createdAt: 'created_at'
  }
);
