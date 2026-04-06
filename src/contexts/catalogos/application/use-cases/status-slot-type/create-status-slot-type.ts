import { v4 as uuid } from 'uuid';
import { StatusSlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/statys-slot-type-catalog-repository';
import { StatusSlotEntity } from '@src/contexts/catalogos/core/entities/status-slot-type-entity';
export class CreateStatusSlotTypeUseCase {
  constructor(private readonly statusSlotTypeCatalogRepository: StatusSlotTypeCatalogRepository) {}

  async run(data: { name: string; description: string; isActive: boolean }) {
    const statusTypeEntity = StatusSlotEntity.fromPrimitives({
      ...data,
      id: uuid()
    });
    await this.statusSlotTypeCatalogRepository.create(statusTypeEntity);
  }
}
