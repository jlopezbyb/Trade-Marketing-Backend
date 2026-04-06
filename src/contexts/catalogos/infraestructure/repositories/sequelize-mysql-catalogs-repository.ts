import { BenefitTypeEntity } from '../../core/entities/benefit-type-catalog-entity';
import { BenefitTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/benefit-type-model';
import { BenefitTypeCatalogRepository } from '../../core/repositories/benefit-type-catalog-repository';

export class SequelizeBenefitTypeRepository implements BenefitTypeCatalogRepository {
  async create(benefitType: BenefitTypeEntity): Promise<void> {
    await BenefitTypeModel.create({
      id: benefitType.id,
      name: benefitType.name
    });
  }

  async getAll(): Promise<Array<BenefitTypeEntity>> {
    const benefitTypes = await BenefitTypeModel.findAll();
    return benefitTypes.map(bt => BenefitTypeEntity.fromPrimitive(bt.toJSON()));
  }

  async getById(id: string): Promise<BenefitTypeEntity | null> {
    const benefitType = await BenefitTypeModel.findByPk(id);
    return benefitType ? BenefitTypeEntity.fromPrimitive(benefitType.toJSON()) : null;
  }

  async update(benefitType: BenefitTypeEntity): Promise<void> {
    await BenefitTypeModel.update({ name: benefitType.name }, { where: { id: benefitType.id } });
  }

  async delete(id: string): Promise<void> {
    await BenefitTypeModel.destroy({ where: { id } });
  }
}
