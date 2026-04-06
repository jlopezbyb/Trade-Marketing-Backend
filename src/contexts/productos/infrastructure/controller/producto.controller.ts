import { Request, Response, NextFunction } from 'express';
import { ProductoSequelizeRepository } from '../repositories/producto.sequelize';

export class ProductoController {
  constructor(private readonly repo: ProductoSequelizeRepository) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.repo.getAll(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const producto = await this.repo.create(req.body);
      res.status(201).json(producto.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const producto = await this.repo.update(Number(req.params.id), req.body);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
      res.status(200).json(producto.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
      res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
      next(error);
    }
  }
}
