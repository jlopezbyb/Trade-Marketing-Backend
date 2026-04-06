import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { BenefitTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/benefit-type-catalog-repository';
export class GetByIdBenefitTypeUseCase {
  constructor(private readonly benefitTypeRepository: BenefitTypeCatalogRepository) {}

  async run(id: string) {
    const data = await this.benefitTypeRepository.getById(id);
    if (!data) throw new AppError('BENEFIT_TYPE_NOT_FOUND', 404, 'Benefit type not found', true);
    return data;
  }
}
