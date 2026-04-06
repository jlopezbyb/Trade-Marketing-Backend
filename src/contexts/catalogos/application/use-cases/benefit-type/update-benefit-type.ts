import { BenefitTypeEntity } from '@src/contexts/catalogos/core/entities/benefit-type-catalog-entity';
import { BenefitTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/benefit-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateBenefitTypeUseCase {
  constructor(private readonly benefitTypeCatalogRepository: BenefitTypeCatalogRepository) {}

  async run(
    id: string,
    data: { name: string; description: string; sendDocument: boolean; allowAmount: boolean; isActive: boolean }
  ) {
    const benefitType = await this.benefitTypeCatalogRepository.getById(id);
    if (!benefitType) throw new AppError('BENEFIT_TYPE_NOT_FOUND', 404, 'Benefit type not found', true);
    const updatedBenefitType = BenefitTypeEntity.fromPrimitive({ ...benefitType.toPrimitive(), ...data });
    await this.benefitTypeCatalogRepository.update(updatedBenefitType);
  }
}
