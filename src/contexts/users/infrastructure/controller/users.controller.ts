import { Request, Response, NextFunction } from 'express';
import { UsersSequelizeRepository } from '../repositories/users.sequelize';

export class UsersController {
  constructor(private readonly repo: UsersSequelizeRepository) {}

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

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(String(req.params.id));
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.update(String(req.params.id), req.body);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repo.delete(String(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      next(error);
    }
  }

  async getClientesAsignados(req: Request, res: Response, next: NextFunction) {
    try {
      // Para supervisores se respeta el :id de la ruta.
      // Para usuarios de campo (field), se fuerza a usar el id del token
      // para que solo puedan ver sus propios clientes asignados.
      const authUser: any = (req as any).user;
      let targetUserId = String(req.params.id);

      if (authUser && (authUser.type === 'field' || authUser.role === 'field')) {
        if (authUser.id) {
          targetUserId = String(authUser.id);
        }
      }

      const data = await this.repo.getClientesAsignados(targetUserId);

      // Debug: mostrar qué respuesta se está devolviendo desde el endpoint
      // y contra qué usuario se está consultando.
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async asignarClientes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.asignarClientes(String(req.params.id), req.body.cliente_ids);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
