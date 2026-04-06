import { sequelize } from '@src/server/config/database/sequelize';
import { DataTypes, Model } from 'sequelize';

export class VehicleModel extends Model {}

VehicleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    vehicleBadge: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20)
    },
    brand: {
      type: DataTypes.STRING(20)
    },
    model: {
      type: DataTypes.STRING(50)
    },
    type: {
      type: DataTypes.ENUM,
      values: ['CARRO', 'MOTO', 'CAMION'],
      defaultValue: 'CARRO'
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'vehicle',
    tableName: 'vehicle',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
