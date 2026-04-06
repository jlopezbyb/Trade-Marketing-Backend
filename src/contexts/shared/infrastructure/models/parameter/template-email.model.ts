import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@server/config/database/sequelize';

export class TemplateEmailModel extends Model {}

const templateType = [
  'ACCEPTANCE_FORM',
  'ACCEPTANCE_ASSIGNMENT',
  'MANUAL_DE_ASSIGNMENT',
  'AUTO_DE_ASSIGNMENT',
  'DISCOUNT_NOTE',
  'ASSIGNMENT_LOAN',
  'DE_ASSIGNMENT_LOAN'
];

TemplateEmailModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: templateType,
      allowNull: false
    },
    templateName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'template_email',
    tableName: 'template_email',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
