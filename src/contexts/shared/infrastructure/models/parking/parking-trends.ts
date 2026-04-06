import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class ParkingTrendsModel extends Model {}

ParkingTrendsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'location',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalSlots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    availableSlots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unavailableSlots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    occupiedSlots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    occupancyRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    tableName: 'parking_occupancy_trends',
    modelName: 'parking_occupancy_trends',
    timestamps: false
  }
);
