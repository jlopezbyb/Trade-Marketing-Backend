import { BenefitTypeEntity } from '../entities/benefit-type-catalog-entity';

export interface BenefitTypeCatalogRepository {
  create(benefitType: BenefitTypeEntity): Promise<void>;
  getAll(): Promise<Array<BenefitTypeEntity>>;
  getById(id: string): Promise<BenefitTypeEntity | null>;
  update(benefitType: BenefitTypeEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
