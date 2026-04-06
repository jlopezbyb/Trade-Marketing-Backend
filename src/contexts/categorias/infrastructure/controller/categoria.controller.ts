import { Request, Response, NextFunction } from 'express';
import { GetAllCategoriasUseCase } from '../../application/use-cases/get-all-categorias';

export class CategoriaController {
  constructor(private readonly getAllUseCase: GetAllCategoriasUseCase) {}

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAllUseCase.run();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
