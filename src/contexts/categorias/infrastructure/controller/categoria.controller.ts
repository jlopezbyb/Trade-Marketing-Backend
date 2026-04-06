import { Request, Response, NextFunction } from 'express';
import { CategoriaSequelizeRepository } from '../repositories/categoria.sequelize';

export class CategoriaController {
  constructor(private readonly repo: CategoriaSequelizeRepository) {}

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await this.repo.create(req.body);
      res.status(201).json(cat.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await this.repo.update(Number(req.params.id), req.body);
      if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json(cat.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
      next(error);
    }
  }
}
