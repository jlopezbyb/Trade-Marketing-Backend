import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

const TagStatus = ['ACTIVO', 'INACTIVO'];

export class TagModel extends Model {}

TagModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM,
      values: TagStatus,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    paranoid: true,
    tableName: 'tag',
    modelName: 'tag',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at'
  }
);
