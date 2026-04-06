import { v4 as uuid } from 'uuid';
import { StatusTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/status-type-catalog-repository';
import { StatusEntity } from '@src/contexts/catalogos/core/entities/status-catalog-entity';
export class CreateStatusTypeUseCase {
  constructor(private readonly statusTypeCatalogRepository: StatusTypeCatalogRepository) {}

  async run(data: { name: string; description: string; isActive: boolean }) {
    const statusTypeEntity = StatusEntity.fromPrimitives({
      ...data,
      id: uuid()
    });
    await this.statusTypeCatalogRepository.create(statusTypeEntity);
  }
}
