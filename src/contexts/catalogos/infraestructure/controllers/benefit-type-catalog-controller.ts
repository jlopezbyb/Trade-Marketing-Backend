import { Request, Response, NextFunction } from 'express';
import { CreateBenefitTypeUseCase } from '../../application/use-cases/benefit-type/create-benefit-type';
import { GetByIdBenefitTypeUseCase } from '../../application/use-cases/benefit-type/get-by-id-benefit-type';
import { DeleteBenefitTypeUseCase } from '../../application/use-cases/benefit-type/delete-benefit-type';
import { GetAllBenefitTypeUseCase } from '../../application/use-cases/benefit-type/get-all-benefit-type';
import { UpdateBenefitTypeUseCase } from '../../application/use-cases/benefit-type/update-benefit-type';

export class BenefitTypeCatalogController {
  constructor(
    private readonly createBenefitTypeUseCase: CreateBenefitTypeUseCase,
    private readonly getByIdBenefitTypeUseCase: GetByIdBenefitTypeUseCase,
    private readonly getAllBenefitTypeUseCase: GetAllBenefitTypeUseCase,
    private readonly updateBenefitTypeUseCase: UpdateBenefitTypeUseCase,
    private readonly deleteBenefitTypeUseCase: DeleteBenefitTypeUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, sendDocument, allowAmount, isActive } = req.body;
    try {
      await this.createBenefitTypeUseCase.run({ name, description, sendDocument, allowAmount, isActive });
      res.status(201).json({ message: 'Benefit type created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const data = await this.getByIdBenefitTypeUseCase.run(id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAllBenefitTypeUseCase.run();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, description, sendDocument, allowAmount, isActive } = req.body;

    try {
      await this.updateBenefitTypeUseCase.run(id, { name, description, sendDocument, allowAmount, isActive });
      res.status(200).json({ message: 'Benefit type updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deleteBenefitTypeUseCase.run(id);
      res.status(200).json({ message: 'Benefit type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
