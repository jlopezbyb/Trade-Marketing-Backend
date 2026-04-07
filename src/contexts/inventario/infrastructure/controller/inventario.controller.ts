import { Request, Response, NextFunction } from 'express';
import { InventarioSequelizeRepository } from '../repositories/inventario.sequelize';

export class InventarioController {
  constructor(private readonly repo: InventarioSequelizeRepository) {}

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
          producto_id: item.producto_id,
          producto_nombre: item.producto?.nombre ?? null,
          cantidad: item.cantidad,
          fecha_actualizacion: item.fecha_actualizacion
        })),
        total: result.total
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { cliente_id, fecha, items } = req.body;
      const created = await this.repo.createBulk(cliente_id, fecha, items);
      res.status(201).json({ data: created.map(e => e.toPrimitives()) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const inv = await this.repo.update(Number(req.params.id), req.body);
      if (!inv) return res.status(404).json({ message: 'Inventario no encontrado' });
      res.status(200).json(inv.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Inventario no encontrado' });
      res.status(200).json({ message: 'Inventario eliminado' });
    } catch (error) {
      next(error);
    }
  }
}
