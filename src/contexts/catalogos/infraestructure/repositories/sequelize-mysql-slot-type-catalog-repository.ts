import { SlotTypeEntity } from '../../core/entities/slot-type-catalog-entity';
import { SlotTypeCatalogRepository } from '../../core/repositories/slot-type-catalog-repository';
import { SlotTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/slot-type-model';

export class SequelizeMysqlSlotTypeCatalogRepository implements SlotTypeCatalogRepository {
  async create(SlotTypeEntity: SlotTypeEntity): Promise<void> {
    await SlotTypeModel.create(SlotTypeEntity.toPrimitives());
  }

  async getAll(): Promise<SlotTypeEntity[]> {
    const data = await SlotTypeModel.findAll();
    return data.map(type => SlotTypeEntity.fromPrimitives(type.get({ plain: true })));
  }

  async getById(id: string): Promise<SlotTypeEntity | null> {
    const data = await SlotTypeModel.findByPk(id);

    if (!data) return null;

    return SlotTypeEntity.fromPrimitives(data.get({ plain: true }));
  }

  async update(SlotTypeEntity: SlotTypeEntity): Promise<void> {
    await SlotTypeModel.update(SlotTypeEntity.toPrimitives(), {
      where: { id: SlotTypeEntity.id },
      fields: ['name', 'description', 'isActive', 'allowParallelAssignments']
    });
  }

  async delete(id: string): Promise<void> {
    await SlotTypeModel.destroy({ where: { id } });
  }
}
