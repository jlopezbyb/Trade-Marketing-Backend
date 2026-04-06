import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class EmployeeModel extends Model {}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true
    },

    employeeNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'employee_number'
    },

    dpi: {
      type: DataTypes.STRING(20)
    },

    nit: {
      type: DataTypes.STRING(20)
    },

    name: {
      type: DataTypes.STRING(100)
    },

    company: {
      type: DataTypes.STRING(100)
    },

    departmentCode: {
      type: DataTypes.STRING(20),
      field: 'department_code'
    },

    department: {
      type: DataTypes.STRING(100)
    },

    areaCode: {
      type: DataTypes.STRING(20),
      field: 'area_code'
    },

    area: {
      type: DataTypes.STRING(100)
    },

    positionCode: {
      type: DataTypes.STRING(20),
      field: 'position_code'
    },

    position: {
      type: DataTypes.STRING(100)
    },

    employeeType: {
      type: DataTypes.STRING(50),
      field: 'employee_type'
    },

    companyEmail: {
      type: DataTypes.STRING(100),
      field: 'company_email'
    },

    managerEmployeeNumber: {
      type: DataTypes.STRING(20),
      field: 'manager_employee_number'
    },

    costCenter: {
      type: DataTypes.STRING(50),
      field: 'cost_center'
    },

    globalDimensionCode: {
      type: DataTypes.STRING(50),
      field: 'global_dimension_code'
    },

    supplierNumber: {
      type: DataTypes.STRING(20),
      field: 'supplier_number'
    },

    preferredBankAccountCode: {
      type: DataTypes.STRING(50),
      field: 'preferred_bank_account_code'
    },

    statisticsGroupCode: {
      type: DataTypes.STRING(50),
      field: 'statistics_group_code'
    }
  },
  {
    sequelize,
    tableName: 'employee',
    modelName: 'employee',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
