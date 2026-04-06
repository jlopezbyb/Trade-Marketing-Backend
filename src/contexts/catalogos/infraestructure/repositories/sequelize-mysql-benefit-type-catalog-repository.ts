import { BenefitTypeEntity } from '../../core/entities/benefit-type-catalog-entity';
import { BenefitTypeCatalogRepository } from '../../core/repositories/benefit-type-catalog-repository';
import { BenefitTypeModel } from '@src/contexts/shared/infrastructure/models/catalogos/benefit-type-model';

export class SequelizeMysqlBenefitTypeCatalogRepository implements BenefitTypeCatalogRepository {
  async create(benefitType: BenefitTypeEntity): Promise<void> {
    await BenefitTypeModel.create(benefitType.toPrimitive());
  }

  async getAll(): Promise<Array<BenefitTypeEntity>> {
    const data = await BenefitTypeModel.findAll();
    return data.map((benefitType: { get: (arg0: { plain: boolean }) => any }) =>
      BenefitTypeEntity.fromPrimitive(benefitType.get({ plain: true }))
    );
  }

  async getById(id: string): Promise<BenefitTypeEntity | null> {
    const data = await BenefitTypeModel.findByPk(id);
    if (!data) return null;
    return BenefitTypeEntity.fromPrimitive(data.get({ plain: true }));
  }

  async update(benefitType: BenefitTypeEntity): Promise<void> {
    await BenefitTypeModel.update(benefitType.toPrimitive(), {
      where: { id: benefitType.id },
      fields: ['name', 'description', 'sendDocument', 'allowAmount', 'isActive']
    });
  }

  async delete(id: string): Promise<void> {
    await BenefitTypeModel.destroy({ where: { id } });
  }
}
