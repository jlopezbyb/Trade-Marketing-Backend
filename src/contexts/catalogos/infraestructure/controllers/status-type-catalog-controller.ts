import { Request, Response, NextFunction } from 'express';
import { GetAllStatusTypeUseCase } from '../../application/use-cases/status-type/get-all-status-type';
import { GetByIdStatusTypeUseCase } from '../../application/use-cases/status-type/get-by-id-status-type';
import { UpdateStatusTypeUseCase } from '../../application/use-cases/status-type/update-status-type';
import { DeleteStatusTypeUseCase } from '../../application/use-cases/status-type/delete-status-type';
import { CreateStatusTypeUseCase } from '../../application/use-cases/status-type/create-status-type';

export class StatusTypeCatalogController {
  constructor(
    private readonly createStatusTypeUseCase: CreateStatusTypeUseCase,
    private readonly getByIdStatusTypeUseCase: GetByIdStatusTypeUseCase,
    private readonly getAllStatusTypeUseCase: GetAllStatusTypeUseCase,
    private readonly updateStatusTypeUseCase: UpdateStatusTypeUseCase,
    private readonly deleteStatusTypeUseCase: DeleteStatusTypeUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, isActive } = req.body;
    try {
      await this.createStatusTypeUseCase.run({ name, description, isActive });
      res.status(201).json({ message: 'Status type created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const statusTypes = await this.getAllStatusTypeUseCase.run();
      res.status(200).json({ data: statusTypes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const statusType = await this.getByIdStatusTypeUseCase.run(id);
      res.status(200).json(statusType);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    try {
      await this.updateStatusTypeUseCase.run(id, { name, description, isActive });
      res.status(200).json({ message: 'Status type updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deleteStatusTypeUseCase.run(id);
      res.status(200).json({ message: 'Status type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
