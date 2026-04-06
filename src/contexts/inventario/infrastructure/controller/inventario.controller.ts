import { Request, Response, NextFunction } from 'express';
import { GetAllInventarioUseCase } from '../../application/use-cases/get-all-inventario';
import { CreateInventarioUseCase } from '../../application/use-cases/create-inventario';

export class InventarioController {
  constructor(
    private readonly getAllUseCase: GetAllInventarioUseCase,
    private readonly createUseCase: CreateInventarioUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.getAllUseCase.run(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { cliente_id, fecha, items } = req.body;
      const created = await this.createUseCase.run(cliente_id, fecha, items);
      res.status(201).json({ data: created.map(e => e.toPrimitives()) });
    } catch (error) {
      next(error);
    }
  }
}
