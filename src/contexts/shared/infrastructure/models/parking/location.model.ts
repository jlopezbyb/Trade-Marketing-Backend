import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../../../../../server/config/database/sequelize';
import { LocationStatus } from '@src/contexts/location/core/entities/location-entity';

export class LocationModel extends Model {}

const locationStatus = [LocationStatus.ACTIVE, LocationStatus.INACTIVE];

LocationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    contactReference: {
      type: DataTypes.STRING(60)
    },
    phone: {
      type: DataTypes.STRING(50)
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING(255)
    },
    numberOfIdentifier: {
      type: DataTypes.STRING(25)
    },
    status: {
      type: DataTypes.ENUM,
      values: locationStatus,
      allowNull: false
    }
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'location',
    tableName: 'location',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    underscored: true
  }
);
