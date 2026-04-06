import { Request, Response, NextFunction } from 'express';
import { ReportesSequelizeRepository } from '../repositories/reportes.sequelize';

export class ReportesController {
  constructor(private readonly repo: ReportesSequelizeRepository) {}

  async inventarioEstancado(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.repo.getInventarioEstancado(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async productosPorVencer(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.repo.getProductosPorVencer(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async summary(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getSummary();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
