import { Request, Response, NextFunction } from 'express';
import { ReportesSequelizeRepository, REPORTES_DASHBOARD_DEFAULTS } from '../repositories/reportes.sequelize';

const DASHBOARD_MAX_LIMIT = 100;

const parsePositiveInteger = (value: unknown, fallback: number) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return Math.floor(parsedValue);
};

export class ReportesController {
  constructor(private readonly repo: ReportesSequelizeRepository) {}

  async inventarioEstancado(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parsePositiveInteger(req.query.limit, 20), DASHBOARD_MAX_LIMIT);
      const page = Math.max(parsePositiveInteger(req.query.page, 1), 1);
      const dias = parsePositiveInteger(req.query.dias, REPORTES_DASHBOARD_DEFAULTS.inventarioEstancadoDias);
      const result = await this.repo.getInventarioEstancado(limit, page, dias);

      res.status(200).json({
        data: result.data.map((item: any) => ({
          id: item.id,
          cliente_id: item.cliente_id,
          cliente_nombre: item.cliente_nombre,
          producto_id: item.producto_id,
          producto_nombre: item.producto_nombre,
          cantidad: item.cantidad,
          fecha_actualizacion: item.fecha_actualizacion,
          dias_sin_movimiento: Number(item.dias_sin_movimiento ?? item.dias_sin_cambio ?? 0)
        })),
        total: result.total
      });
    } catch (error) {
      next(error);
    }
  }

  async productosPorVencer(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parsePositiveInteger(req.query.limit, 20), DASHBOARD_MAX_LIMIT);
      const page = Math.max(parsePositiveInteger(req.query.page, 1), 1);
      const dias = parsePositiveInteger(req.query.dias, REPORTES_DASHBOARD_DEFAULTS.productosPorVencerDias);
      const result = await this.repo.getProductosPorVencer(limit, page, dias);

      res.status(200).json({
        data: result.data.map((item: any) => ({
          id: item.id,
          cliente_id: item.cliente_id,
          cliente_nombre: item.cliente_nombre,
          producto_id: item.producto_id,
          producto_nombre: item.producto_nombre,
          lote: item.lote,
          cantidad: item.cantidad,
          fecha_vencimiento: item.fecha_vencimiento,
          dias_para_vencer: Number(item.dias_para_vencer ?? 0),
          estado: item.estado
        })),
        total: result.total
      });
    } catch (error) {
      next(error);
    }
  }

  async summary(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getSummary();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
