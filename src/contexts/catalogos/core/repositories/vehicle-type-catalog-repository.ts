import { VehicleTypeEntity } from '../entities/vehicle-type-catalog-entity';

export interface VehicleTypeCatalogRepository {
  create(vehicleTypeCatalogEntity: VehicleTypeEntity): Promise<void>;
  getAll(): Promise<Array<VehicleTypeEntity>>;
  getById(id: string): Promise<VehicleTypeEntity | null>;
  update(vehicleTypeCatalogEntity: VehicleTypeEntity): Promise<void>;
  delete(id: string): Promise<void>;
  isUsedInSlots(vehicleTypeName: string): Promise<boolean>;
  isUsedInVehicles(vehicleTypeName: string): Promise<boolean>;
}
