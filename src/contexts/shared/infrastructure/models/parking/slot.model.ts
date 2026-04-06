import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../../../server/config/database/sequelize';

enum SlotStatusEnum {
  ACTIVE = 'DISPONIBLE',
  INACTIVE = 'NO DISPONIBLE',
  OCCUPIED = 'OCUPADO'
}

enum SlotTypeEnum {
  SIMPLE = 'SIMPLE',
  MULTIPLE = 'MULTIPLE'
}

enum BenefitTypeEnum {
  NO_COST = 'SIN_COSTO',
  DISCOUNT = 'DESCUENTO',
  COMPLEMENT = 'COMPLEMENTO'
}

export class SlotModel extends Model {}

const slotTypeValues: string[] = Object.values(SlotTypeEnum);
const benefitTypeValues: string[] = Object.values(BenefitTypeEnum);
const statusSlotValues: string[] = Object.values(SlotStatusEnum);

SlotModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'location',
        key: 'id'
      }
    },
    slotNumber: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    slotType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isValidSlotType(value: unknown) {
          if (typeof value !== 'string' || (!slotTypeValues.includes(value) && value.trim() === '')) {
            throw new Error(`Invalid slot type: ${String(value)}`);
          }
        }
      }
    },
    limitOfAssignments: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'The limit of assignments must be at least 1.'
        },
        max: {
          args: [1000],
          msg: 'The limit of assignments must not exceed 1000.'
        }
      }
    },
    vehicleType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    benefitType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isValidBenefitType(value: unknown) {
          if (typeof value !== 'string' || (!benefitTypeValues.includes(value) && value.trim() === '')) {
            throw new Error(`Invalid benefit type: ${String(value)}`);
          }
        }
      }
    },
    amount: {
      type: DataTypes.FLOAT(5, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Amount cannot be negative.'
        }
      }
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isValidStatus(value: unknown) {
          if (typeof value !== 'string' || (!statusSlotValues.includes(value) && value.trim() === '')) {
            throw new Error(`Invalid status: ${String(value)}`);
          }
        }
      }
    }
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'slot',
    tableName: 'slot',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    underscored: true
  }
);
