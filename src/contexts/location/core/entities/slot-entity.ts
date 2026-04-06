import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export enum SlotStatusEnum {
  ACTIVE = 'DISPONIBLE',
  INACTIVE = 'NO DISPONIBLE',
  OCCUPIED = 'OCUPADO'
}

export enum SlotTypeEnum {
  SIMPLE = 'SIMPLE',
  MULTIPLE = 'MULTIPLE'
}

export enum BenefitTypeEnum {
  NO_COST = 'SIN_COSTO',
  DISCOUNT = 'DESCUENTO',
  COMPLEMENT = 'COMPLEMENTO'
}

export enum VehicleTypeEnum {
  CAR = 'CARRO',
  CYCLE = 'MOTO',
  TRUCK = 'CAMION'
}

// Permite valores del enum o cualquier string adicional
export type SlotStatus = SlotStatusEnum | string;
export type SlotType = SlotTypeEnum | string;
export type BenefitType = BenefitTypeEnum | string;
export type VehicleType = VehicleTypeEnum | string;

export class SlotEntity {
  readonly id: string;
  readonly slotNumber: string;
  readonly slotType: SlotType;
  readonly limitOfAssignments: number;
  readonly benefitType: BenefitType;
  readonly amount: number;
  readonly vehicleType: VehicleType;
  readonly status: SlotStatus;

  constructor(
    id: string,
    slotNumber: string,
    slotType: SlotType,
    limitOfAssignments: number,
    benefitType: BenefitType,
    amount: number,
    vehicleType: VehicleType,
    status: SlotStatus
  ) {
    this.validateData({ slotType, limitOfAssignments, benefitType, amount });
    this.id = id;
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.limitOfAssignments = limitOfAssignments;
    this.benefitType = benefitType;
    this.amount = amount;
    this.vehicleType = vehicleType;
    this.status = status;
  }

  static fromPrimitives(plainData: {
    id: string;
    slotNumber: string;
    slotType: SlotType;
    limitOfAssignments: number;
    benefitType: BenefitType;
    amount: number;
    vehicleType: VehicleType;
    status: SlotStatus;
  }) {
    return new SlotEntity(
      plainData.id,
      plainData.slotNumber,
      plainData.slotType,
      plainData.limitOfAssignments,
      plainData.benefitType,
      plainData.amount,
      plainData.vehicleType,
      plainData.status
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      slotNumber: this.slotNumber,
      slotType: this.slotType,
      limitOfAssignments: this.limitOfAssignments,
      benefitType: this.benefitType,
      amount: this.amount,
      vehicleType: this.vehicleType,
      status: this.status
    };
  }

  private validateData(data: { slotType: SlotType; limitOfAssignments: number; benefitType: BenefitType; amount: number }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isSlotTypeSimple = data.slotType === SlotTypeEnum.SIMPLE;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isSlotTypeMultiple = data.slotType === SlotTypeEnum.MULTIPLE;
    const isBenefitTypeDiscountOrComplement =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      data.benefitType === BenefitTypeEnum.DISCOUNT || data.benefitType === BenefitTypeEnum.COMPLEMENT;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const isBenefitTypeNoCost = data.benefitType === BenefitTypeEnum.NO_COST;

    // Valida limitOfAssignments para SIMPLE
    if (isSlotTypeSimple && data.limitOfAssignments !== 1) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `The number of schedules must be exactly 1 for ${SlotTypeEnum.SIMPLE} type spaces.`,
        true
      );
    }

    // Valida limitOfAssignments para MULTIPLE
    if (isSlotTypeMultiple && data.limitOfAssignments <= 1) {
      throw new AppError('ENTITY_VALIDATIONS', 400, 'The number of schedules for a MULTIPLE space must be greater than 1.', true);
    }

    // Valida amount para tipos de beneficio con costo
    if (isBenefitTypeDiscountOrComplement && data.amount <= 0) {
      throw new AppError(
        'ENTITY_VALIDATIONS',
        400,
        `Amount must be greater than 0 when benefit type is ${BenefitTypeEnum.DISCOUNT} or ${BenefitTypeEnum.COMPLEMENT}.`,
        true
      );
    }

    // Valida amount para SIN_COSTO
    if (isBenefitTypeNoCost && data.amount !== 0) {
      throw new AppError('ENTITY_VALIDATIONS', 400, `Amount must be 0 when benefit type is ${BenefitTypeEnum.NO_COST}.`, true);
    }
  }
}
