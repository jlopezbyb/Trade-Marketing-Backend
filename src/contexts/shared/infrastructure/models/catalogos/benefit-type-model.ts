import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class BenefitTypeModel extends Model {}

BenefitTypeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sendDocument: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    allowAmount: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize: sequelize,
    tableName: 'catalog_benefit_type',
    modelName: 'catalog_benefit_type',
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
