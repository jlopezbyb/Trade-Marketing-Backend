import { diffDays } from '@formkit/tempo';
import { LocationRepository } from '@src/contexts/location/core/repositories/location-repository';
import { EmployeeRepository } from '@src/contexts/assignment/core/repositories/employee-repository';
import { SlotEntity, SlotStatusEnum, SlotTypeEnum } from '@src/contexts/location/core/entities/slot-entity';
import { TagEntity } from '@src/contexts/parameters/core/entities/tag-entity';
import { SettingRepository, SettingKeys } from '@src/contexts/parameters/core/repositories/setting-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { LocationStatus } from '@src/contexts/location/core/entities/location-entity';

/**
 * Funciones para convertir valores a enums de forma segura.
 */
function toSlotStatusEnum(value: string): SlotStatusEnum | null {
  return Object.values(SlotStatusEnum).includes(value as SlotStatusEnum) ? (value as SlotStatusEnum) : null;
}

function toSlotTypeEnum(value: string): SlotTypeEnum | null {
  return Object.values(SlotTypeEnum).includes(value as SlotTypeEnum) ? (value as SlotTypeEnum) : null;
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
function toLocationStatusEnum(value: string): LocationStatus | null {
  return Object.values(LocationStatus).includes(value as LocationStatus) ? (value as LocationStatus) : null;
}

export class Validations {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly settingRepository: SettingRepository,
    private readonly locationRepository: LocationRepository
  ) {}

  public async validateIfCanCreate(data: {
    slot: SlotEntity | null;
    employee: {
      id: string;
      employeeCode: string;
      vehicles: Array<string>;
      vehiclesForDelete: Array<string>;
    };
    tags: {
      request: string[];
      database: TagEntity[] | [];
    };
  }): Promise<void> {
    await this.validateIfSlotIsValid(data.slot);
    this.validateIfTagsAreValid(data.tags);
    // await this.validateIfCanCreateAssignmentInSlot(data.slot!);
    //await this.validateIfVehiclesBelongToEmployee(data.employee.id, data.employee.vehicles);
    //await this.validateIfVehiclesBelongToEmployee(data.employee.id, data.employee.vehiclesForDelete);
    //await this.validateIfEmployeeHasAnActiveAssignment(data.employee.id);
    //await this.validateIfEmployeeCodeAlreadyExists(data.employee.employeeCode, data.employee.id);
  }

  // public async validateIfEmployeeCodeAlreadyExists(employeeCode: string, id: string) {
  //   const employee = await this.employeeRepository.getEmployeeFromDatabase(employeeCode);

  //   if (employee && employee.id !== id) {
  //     throw new AppError(
  //       'EMPLOYEE_CODE_ALREADY_EXISTS',
  //       400,
  //       'Employee code already exists, you cannot create an assignment with this employee',
  //       true
  //     );
  //   }
  // }

  public async validateIfCanCreateAssignmentLoan() {
    //await this.validateIfEmployeeHasAnActiveAssignment(employee.id);
    //await this.validateIfVehiclesBelongToEmployee(employee.id, employee.vehicles);
  }

  private async validateIfSlotIsValid(slot: SlotEntity | null) {
    if (!slot) {
      throw new AppError('SLOT_NOT_FOUND', 404, 'Slot not found', true);
    }

    const slotStatus = toSlotStatusEnum(slot.status);
    const slotType = toSlotTypeEnum(slot.slotType);

    if (slotStatus === SlotStatusEnum.INACTIVE) {
      throw new AppError('SLOT_NOT_AVAILABLE', 400, 'Slot is not available', true);
    }

    if (slotType === SlotTypeEnum.SIMPLE && slotStatus === SlotStatusEnum.OCCUPIED) {
      throw new AppError('SLOT_OCCUPIED', 400, 'Slot is occupied, you cannot create an assignment in this slot', true);
    }

    const location = await this.locationRepository.getLocationBySlotId(slot.id);

    if (!location) {
      throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
    }

    const locationStatus = toLocationStatusEnum(location.status);

    if (locationStatus === LocationStatus.INACTIVE) {
      throw new AppError('LOCATION_NOT_AVAILABLE', 400, 'You cannot create an assignment if the location is inactive', true);
    }
  }

  // private async validateIfCanCreateAssignmentInSlot(slot: SlotEntity) {
  //   const slotType = toSlotTypeEnum(slot.slotType);
  //   const slotStatus = toSlotStatusEnum(slot.status);

  //   if (slotType === SlotTypeEnum.MULTIPLE && slotStatus !== SlotStatusEnum.INACTIVE) {
  //     const canCreateMoreAssignments = await this.assignmentRepository.executeFunction(
  //       ListOfFunctions.FN_VERIFY_IF_CAN_CREATE_MORE_ASSIGNMENTS,
  //       [slot.id]
  //     );
  //     if (!canCreateMoreAssignments) {
  //       throw new AppError('CAN_NOT_CREATE_MORE_ASSIGNMENTS', 400, 'You cannot create more assignments in this slot', true);
  //     }
  //   }
  // }

  // private async validateIfEmployeeHasAnActiveAssignment(employeeId: string) {
  //   if (employeeId) {
  //     const employeeHasActiveAssignment = await this.assignmentRepository.executeFunction(
  //       ListOfFunctions.FN_EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT,
  //       [employeeId]
  //     );

  //     if (employeeHasActiveAssignment) {
  //       throw new AppError('EMPLOYEE_HAS_AN_ACTIVE_ASSIGNMENT', 400, 'Employee has an active assignment', true);
  //     }
  //   }
  // }

  // public async validateIfVehiclesBelongToEmployee(employeeId: string, vehiclesRequest: Array<string>) {
  //   if (!employeeId && vehiclesRequest.some(id => id && /\w+/.test(id))) {
  //     throw new AppError('VEHICLE_NOT_VALID', 400, 'You cannot add or delete vehicles for a new employee.', true);
  //   }

  //   if (employeeId) {
  //     const employeeDatabase = await this.employeeRepository.GetEmployeeByNumberUseCase(employeeId);

  //     if (!employeeDatabase) {
  //       throw new AppError('EMPLOYEE_NOT_FOUND', 400, 'Employee not found', true);
  //     }

  //     const vehicles = new Set(employeeDatabase.vehicles.map(vehicle => vehicle.id));

  //     vehiclesRequest.forEach(id => {
  //       if (id && !vehicles.has(id)) {
  //         throw new AppError('VEHICLE_NOT_FOUND', 400, `The vehicle with id ${id} does not belong to the employee`, true);
  //       }
  //     });
  //   }
  // }

  public validateIfTagsAreValid(tags: { request: string[]; database: TagEntity[] | [] }) {
    if (tags.request.length !== tags.database.length) {
      throw new AppError('TAGS_NOT_VALID', 400, 'Tags are not valid or do not exist', true);
    }
  }

  public async validateIfRangeOfDaysToAssignmentLoanIsValid(start: string, end: string) {
    const diffDaysToAssignmentLoan = diffDays(end, start);

    const setting = await this.settingRepository.getParameterByKey(SettingKeys.MAX_DAYS_TO_ASSIGNMENT_LOAN);

    if (!setting) {
      throw new AppError('SETTING_NOT_FOUND', 404, 'Max days for assignment loan not found', true);
    }

    if (diffDaysToAssignmentLoan > Number(setting.settingValue)) {
      throw new AppError(
        'INVALID_DATE_RANGE',
        400,
        `Date range is invalid; you can only create an assignment loan for a maximum of ${setting.settingValue} days`,
        true
      );
    }
  }
}
