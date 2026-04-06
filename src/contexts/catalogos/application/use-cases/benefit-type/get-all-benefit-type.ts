import { BenefitTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/benefit-type-catalog-repository';
export class GetAllBenefitTypeUseCase {
  constructor(private readonly benefitTypeRepository: BenefitTypeCatalogRepository) {}

  async run() {
    return await this.benefitTypeRepository.getAll();
  }
}
