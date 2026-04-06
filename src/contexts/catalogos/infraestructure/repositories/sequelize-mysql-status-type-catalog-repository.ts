import { StatusEntity } from '../../core/entities/status-catalog-entity';
import { StatusTypeCatalogRepository } from '../../core/repositories/status-type-catalog-repository';
import { StatusTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/status-type-model';

export class SequelizeMysqlStatusTypeCatalogRepository implements StatusTypeCatalogRepository {
  async create(statusTypeCatalogEntity: StatusEntity): Promise<void> {
    await StatusTypeModel.create(statusTypeCatalogEntity.toPrimitives());
  }

  async getAll(): Promise<Array<StatusEntity>> {
    const data = await StatusTypeModel.findAll();
    return data.map(item => StatusEntity.fromPrimitives(item.get({ plain: true })));
  }

  async getById(id: string): Promise<StatusEntity | null> {
    const data = await StatusTypeModel.findByPk(id);
    if (!data) return null;
    return StatusEntity.fromPrimitives(data.get({ plain: true }));
  }

  async update(statusTypeCatalogEntity: StatusEntity): Promise<void> {
    await StatusTypeModel.update(statusTypeCatalogEntity.toPrimitives(), {
      where: { id: statusTypeCatalogEntity.id },
      fields: ['name', 'description', 'isActive']
    });
  }

  async delete(id: string): Promise<void> {
    await StatusTypeModel.destroy({ where: { id } });
  }
}
