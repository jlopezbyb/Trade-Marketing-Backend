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
}
