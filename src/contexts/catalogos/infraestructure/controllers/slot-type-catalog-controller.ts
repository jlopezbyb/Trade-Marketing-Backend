import { Request, Response, NextFunction } from 'express';
import { CreateSlotTypeUseCase } from '../../application/use-cases/slot-types/create-slot-type';
import { GetByIdSlotTypeUseCase } from '../../application/use-cases/slot-types/get-by-id-slot-type';
import { GetAllSlotTypeUseCase } from '../../application/use-cases/slot-types/get-all-slot-type';
import { UpdateSlotTypeUseCase } from '../../application/use-cases/slot-types/update-slot-type';
import { DeleteSlotTypeUseCase } from '../../application/use-cases/slot-types/delete-slot-type';

export class SlotTypeCatalogController {
  constructor(
    private readonly createSlotTypeUseCase: CreateSlotTypeUseCase,
    private readonly getByIdSlotTypeUseCase: GetByIdSlotTypeUseCase,
    private readonly getAllSlotTypeUseCase: GetAllSlotTypeUseCase,
    private readonly updateSlotTypeUseCase: UpdateSlotTypeUseCase,
    private readonly deleteSlotTypeUseCase: DeleteSlotTypeUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, allowParallelAssignments, isActive } = req.body;
    try {
      await this.createSlotTypeUseCase.run({ name, description, allowParallelAssignments, isActive });
      res.status(201).json({ message: 'Slot type created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const data = await this.getByIdSlotTypeUseCase.run(id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAllSlotTypeUseCase.run();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, description, allowParallelAssignments, isActive } = req.body;
    try {
      await this.updateSlotTypeUseCase.run(id, { name, description, allowParallelAssignments, isActive });
      res.status(200).json({ message: 'Slot type updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deleteSlotTypeUseCase.run(id);
      res.status(200).json({ message: 'Slot type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
