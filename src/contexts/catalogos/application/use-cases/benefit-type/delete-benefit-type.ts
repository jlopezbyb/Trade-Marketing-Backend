import { BenefitTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/benefit-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteBenefitTypeUseCase {
  constructor(private readonly benefitTypeCatalogRepository: BenefitTypeCatalogRepository) {}

  async run(id: string) {
    const benefitType = await this.benefitTypeCatalogRepository.getById(id);
    if (!benefitType) throw new AppError('BENEFIT_TYPE_NOT_FOUND', 404, 'Benefit type not found', true);
    await this.benefitTypeCatalogRepository.delete(id);
  }
}
