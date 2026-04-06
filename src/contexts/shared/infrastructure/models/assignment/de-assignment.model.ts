import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class DeAssignmentModel extends Model {}

DeAssignmentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deAssignmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    isRpaAction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'de_assignment',
    tableName: 'de_assignment',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
