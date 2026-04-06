import { StatusSlotEntity } from '../../core/entities/status-slot-type-entity';
import { StatusTypeCatalogRepository } from '../../core/repositories/status-type-catalog-repository';
import { StatusSlotTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/status-slot-type-model';

export class SequelizeMysqlStatusSlotTypeCatalogRepository implements StatusTypeCatalogRepository {
  async create(statusTypeCatalogEntity: StatusSlotEntity): Promise<void> {
    await StatusSlotTypeModel.create(statusTypeCatalogEntity.toPrimitives());
  }

  async getAll(): Promise<Array<StatusSlotEntity>> {
    const data = await StatusSlotTypeModel.findAll();
    return data.map(item => StatusSlotEntity.fromPrimitives(item.get({ plain: true })));
  }

  async getById(id: string): Promise<StatusSlotEntity | null> {
    const data = await StatusSlotTypeModel.findByPk(id);
    if (!data) return null;
    return StatusSlotEntity.fromPrimitives(data.get({ plain: true }));
  }

  async update(statusTypeCatalogEntity: StatusSlotEntity): Promise<void> {
    await StatusSlotTypeModel.update(statusTypeCatalogEntity.toPrimitives(), {
      where: { id: statusTypeCatalogEntity.id },
      fields: ['name', 'description', 'isActive']
    });
  }

  async delete(id: string): Promise<void> {
    await StatusSlotTypeModel.destroy({ where: { id } });
  }
}
