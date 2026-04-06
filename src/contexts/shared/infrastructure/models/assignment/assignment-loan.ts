import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class AssignmentLoanModel extends Model {}

AssignmentLoanModel.init(
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
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    startDateAssignment: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDateAssignment: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    assignmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    tableName: 'assignment_loan',
    modelName: 'assignment_loan',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  }
);
