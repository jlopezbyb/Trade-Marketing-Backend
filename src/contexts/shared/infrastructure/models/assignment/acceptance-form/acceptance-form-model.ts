import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AcceptanceFormModel extends Model {}

AcceptanceFormModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    formDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDIENTE', 'CANCELADO', 'RECHAZADO', 'ACEPTADO'),
      allowNull: false
    },
    decisionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isDiscountWaiver: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'assignment_acceptance_form',
    tableName: 'assignment_acceptance_form',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
