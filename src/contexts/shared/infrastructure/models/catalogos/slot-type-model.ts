import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class SlotTypeModel extends Model {}

SlotTypeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allowParallelAssignments: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'catalog_slot_type',
    tableName: 'catalog_slot_type',
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
