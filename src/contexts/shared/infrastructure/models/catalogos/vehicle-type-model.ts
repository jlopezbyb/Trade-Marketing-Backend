import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class VehicleTypeModel extends Model {}

VehicleTypeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'catalog_vehicle_type',
    modelName: 'catalog_vehicle_type',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  }
);
