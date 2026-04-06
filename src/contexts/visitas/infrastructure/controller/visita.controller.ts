import { Request, Response, NextFunction } from 'express';
import { VisitaSequelizeRepository } from '../repositories/visita.sequelize';

export class VisitaController {
  constructor(private readonly repo: VisitaSequelizeRepository) {}

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
      const visita = await this.repo.create(req.body);
      res.status(201).json(visita.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const visita = await this.repo.update(Number(req.params.id), req.body);
      if (!visita) return res.status(404).json({ message: 'Visita no encontrada' });
      res.status(200).json(visita.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Visita no encontrada' });
      res.status(200).json({ message: 'Visita eliminada' });
    } catch (error) {
      next(error);
    }
  }
}
