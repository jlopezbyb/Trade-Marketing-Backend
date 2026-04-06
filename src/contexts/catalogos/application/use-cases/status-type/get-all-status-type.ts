import { StatusTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/status-type-catalog-repository';

export class GetAllStatusTypeUseCase {
  constructor(private readonly statusTypeCatalogRepository: StatusTypeCatalogRepository) {}

  async run() {
    return await this.statusTypeCatalogRepository.getAll();
  }
}
