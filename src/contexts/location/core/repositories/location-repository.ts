import { LocationEntity } from '../entities/location-entity';
import { BenefitType, SlotEntity, SlotType, VehicleType } from '../entities/slot-entity';

export interface LocationFinderResultWithStatusCounterSlots {
  id: string;
  name: string;
  address: string;
  contactReference: string;
  phone: string;
  email: string;
  comments: string;
  numberOfIdentifier: string;
  status: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  unavailableSlots: number;
}

export type LocationFinderResult = Promise<{
  pageCounter: number;
  data: LocationFinderResultWithStatusCounterSlots[];
}>;

export type FunctionNames = 'location_has_active_assignment';

export type ProcedureNames = 'get_active_assignments_by_location';

export interface OverviewDataResult {
  totalSlots: number;
  availableSlots: number;
  unavailableSlots: number;
  occupiedSlots: number;
}

export interface TrendDataResult extends OverviewDataResult {
  periodTrend: string;
  startDate: string;
}

export interface ResponseAvailableSlots {
  id: string;
  slotNumber: string;
  slotType: SlotType;
  benefitType: BenefitType;
}

export type TrendDataType = 'daily' | 'weekly' | 'monthly';

export interface LocationRepository {
  createLocation(location: LocationEntity): Promise<void>;
  updateLocation(location: LocationEntity, slotsToDelete: Set<string>): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<LocationEntity | null>;
  getLocations(limit: number, page: number): Promise<LocationFinderResult | null>;
  getSlotById(id: string): Promise<SlotEntity | null>;
  getLocationBySlotId(slotId: string): Promise<LocationEntity | null>;
  executeFunction<TypeFunctionResult = boolean | number>(
    functionName: FunctionNames,
    params: string[]
  ): Promise<TypeFunctionResult>;
  callProcedure<TypeProcedureResult>(procedureName: ProcedureNames, params: string[]): Promise<TypeProcedureResult>;
  overviewData(): Promise<OverviewDataResult>;
  trendData(type: TrendDataType): Promise<TrendDataResult[] | []>;

  getAvailableSlotsByTypeVehicleAndLocationId(locationId: string, vehicleType: VehicleType): Promise<ResponseAvailableSlots[]>;
  getParkingAvailabilityData(): Promise<{ months: string[]; occupied: number[]; available: number[] }>;
  getEmployeesParkingData(): Promise<{ months: string[]; employees: number[]; slots: number[] }>;
}
