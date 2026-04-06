import { Request, Response, NextFunction } from 'express';
import { CreateStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/create-status-slot-type';
import { GetByIdStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/get-by-id-status-slot-type';
import { GetAllStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/get-all-status-slot-type';
import { UpdateStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/update-status-slot-type';
import { DeleteStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/delete-status-slot-type';

export class StatusSlotTypeCatalogController {
  constructor(
    private readonly createStatusSlotTypeUseCase: CreateStatusSlotTypeUseCase,
    private readonly getByIdStatusSlotTypeUseCase: GetByIdStatusSlotTypeUseCase,
    private readonly getAllStatusSlotTypeUseCase: GetAllStatusSlotTypeUseCase,
    private readonly updateStatusSlotTypeUseCase: UpdateStatusSlotTypeUseCase,
    private readonly deleteStatusSlotTypeUseCase: DeleteStatusSlotTypeUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, isActive } = req.body;
    try {
      await this.createStatusSlotTypeUseCase.run({ name, description, isActive });
      res.status(201).json({ message: 'Status type created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const statusTypes = await this.getAllStatusSlotTypeUseCase.run();
      res.status(200).json({ data: statusTypes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const statusType = await this.getByIdStatusSlotTypeUseCase.run(id);
      res.status(200).json(statusType);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    try {
      await this.updateStatusSlotTypeUseCase.run(id, { name, description, isActive });
      res.status(200).json({ message: 'Status type updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deleteStatusSlotTypeUseCase.run(id);
      res.status(200).json({ message: 'Status type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
