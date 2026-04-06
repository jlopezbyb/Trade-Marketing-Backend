import { v4 as uuid } from 'uuid';
import { BenefitTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/benefit-type-catalog-repository';
import { BenefitTypeEntity } from '../../../core/entities/benefit-type-catalog-entity';
export class CreateBenefitTypeUseCase {
  constructor(private readonly benefitTypeCatalogRepository: BenefitTypeCatalogRepository) {}

  async run(data: { name: string; description: string; sendDocument: boolean; allowAmount: boolean; isActive: boolean }) {
    const benefitType = BenefitTypeEntity.fromPrimitive({
      id: uuid(),
      ...data
    });

    await this.benefitTypeCatalogRepository.create(benefitType);
  }
}
