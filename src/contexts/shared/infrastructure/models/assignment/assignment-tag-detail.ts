import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class AssignmentTagDetailModel extends Model {}

AssignmentTagDetailModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    underscored: true,
    tableName: 'assignment_tag_detail',
    modelName: 'assignment_tag_detail',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
