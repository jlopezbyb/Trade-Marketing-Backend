import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import { VisitaSequelizeRepository } from '../repositories/visita.sequelize';

const GUATEMALA_TIMEZONE = 'America/Guatemala';

const formatDashboardHour = (value: Date | string | undefined) => {
  if (!value) {
    return '00:00';
  }

  return moment(value).tz(GUATEMALA_TIMEZONE).format('HH:mm');
};

export class VisitaController {
  constructor(private readonly repo: VisitaSequelizeRepository) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.repo.getAll(limit, page);
      res.status(200).json({
        data: result.data.map(item => ({
          id: item.id,
          cliente_id: item.cliente_id,
          cliente_nombre: item.cliente?.nombre ?? null,
          usuario_id: item.usuario_id,
          usuario_nombre: item.usuario?.nombre ?? null,
          fecha: item.fecha,
          hora: formatDashboardHour(item.created_at)
        })),
        total: result.total
      });
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
      const visita = await this.repo.update(String(req.params.id), req.body);
      if (!visita) return res.status(404).json({ message: 'Visita no encontrada' });
      res.status(200).json(visita.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(String(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Visita no encontrada' });
      res.status(200).json({ message: 'Visita eliminada' });
    } catch (error) {
      next(error);
    }
  }
}
