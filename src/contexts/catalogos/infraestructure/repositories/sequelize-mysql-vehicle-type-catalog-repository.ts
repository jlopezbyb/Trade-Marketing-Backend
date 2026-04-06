import { VehicleTypeEntity } from '../../core/entities/vehicle-type-catalog-entity';
import { VehicleTypeCatalogRepository } from '../../core/repositories/vehicle-type-catalog-repository';
import { VehicleTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/vehicle-type-model';
import { VehicleModel } from '@src/contexts/shared/infrastructure/models/assignment/vehicle.model';
import { SlotModel } from '@src/contexts/shared/infrastructure/models/parking/slot.model';

export class SequelizeMysqlVehicleTypeCatalogRepository implements VehicleTypeCatalogRepository {
  async create(vehicleTypeCatalogEntity: VehicleTypeEntity): Promise<void> {
    await VehicleTypeModel.create(vehicleTypeCatalogEntity.toPrimitives());
  }

  async getAll(): Promise<Array<VehicleTypeEntity>> {
    const data = await VehicleTypeModel.findAll();
    return data.map(item => VehicleTypeEntity.fromPrimitives(item.get({ plain: true })));
  }

  async getById(id: string): Promise<VehicleTypeEntity | null> {
    const data = await VehicleTypeModel.findByPk(id);
    if (!data) return null;
    return VehicleTypeEntity.fromPrimitives(data.get({ plain: true }));
  }

  async update(vehicleTypeCatalogEntity: VehicleTypeEntity): Promise<void> {
    // 1. Obtener el registro actual
    const existing = await VehicleTypeModel.findByPk(vehicleTypeCatalogEntity.id);
    if (!existing) return;

    const previousName = existing.getDataValue('name');
    const newName = vehicleTypeCatalogEntity.name;

    // 2. Actualizar la tabla principal
    await VehicleTypeModel.update(vehicleTypeCatalogEntity.toPrimitives(), {
      where: { id: vehicleTypeCatalogEntity.id },
      fields: ['name', 'description', 'isActive']
    });

    // 3. Si el nombre cambió, propagar a vehicle y slot
    if (previousName !== newName) {
      await Promise.all([
        VehicleModel.update({ type: newName }, { where: { type: previousName } }),
        SlotModel.update(
          { vehicleType: newName },
          { where: { vehicleType: previousName }, validate: false } // 👈 evitar validaciones innecesarias
        )
      ]);
    }
  }

  async delete(id: string): Promise<void> {
    await VehicleTypeModel.destroy({ where: { id } });
  }

  async isUsedInVehicles(vehicleTypeName: string): Promise<boolean> {
    const count = await VehicleModel.count({ where: { type: vehicleTypeName } });
    return count > 0;
  }

  async isUsedInSlots(vehicleTypeName: string): Promise<boolean> {
    const count = await SlotModel.count({ where: { vehicle_type: vehicleTypeName } });
    return count > 0;
  }
}
