import { Request, Response, NextFunction } from 'express';
import { GetAllProductosUseCase } from '../../application/use-cases/get-all-productos';

export class ProductoController {
  constructor(private readonly getAllUseCase: GetAllProductosUseCase) {}

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
}
