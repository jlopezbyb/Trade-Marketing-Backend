import { Request, Response, NextFunction } from 'express';
import { ClienteSequelizeRepository } from '../repositories/cliente.sequelize';

export class ClienteController {
  constructor(private readonly repo: ClienteSequelizeRepository) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);

      // Si viene usuario_id, retorna solo clientes asignados a ese usuario
      const usuarioId = req.query.usuario_id ? Number(req.query.usuario_id) : null;
      if (usuarioId) {
        const result = await this.repo.getByUsuarioId(usuarioId, limit, page);
        return res.status(200).json(result);
      }

      const result = await this.repo.getAll(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await this.repo.getById(Number(req.params.id));
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      res.status(200).json(cliente.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await this.repo.create(req.body);
      res.status(201).json(cliente.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await this.repo.update(Number(req.params.id), req.body);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      res.status(200).json(cliente.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Cliente no encontrado' });
      res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
      next(error);
    }
  }
}
