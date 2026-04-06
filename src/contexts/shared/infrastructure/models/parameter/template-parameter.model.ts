import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@server/config/database/sequelize';

export class TemplateParameterModel extends Model {}

TemplateParameterModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    parameterName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parameterDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    exampleValue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'template_parameter',
    tableName: 'template_parameter',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
