import { LocationModel } from "../../../src/contexts/shared/infrastructure/models/parking/location.model";
import { SlotModel } from "../../../src/contexts/shared/infrastructure/models/parking/slot.model";

export interface LocationTableResult {
  id: number;
  name: string;
  address: string;
  contactReference: string;
  phone: string;
  email: string;
  comments: string;
  numberOfIdentifier: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface SlotTableResult {
  id: number;
  locationId: number;
  slotNumber: string;
  slotType: string;
  limitOfAssignments: number;
  benefitType: string;
  amount: number;
  vehicleType: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class LocationHelper{

  static async getAllLocations(): Promise<LocationTableResult[]>{
    const locationsDatabase = await LocationModel.findAll();
    return locationsDatabase.map(location => ({...location.get({ plain: true })}));
  }

  static async getAllSlots(): Promise<SlotTableResult[]>{
    const slotsDatabase = await SlotModel.findAll();
    return slotsDatabase.map(slot => ({...slot.get({ plain: true })}));
  }
}

