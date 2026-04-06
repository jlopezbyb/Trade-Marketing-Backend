import { Request, Response } from 'express';
import { NextFunction } from 'express';
import { CreateUser } from '@src/contexts/auth/application/use-cases/user/create-user';
import { UpdateUser } from '@src/contexts/auth/application/use-cases/user/update-user';
import { DeleteUser } from '@src/contexts/auth/application/use-cases/user/delete-user';
import { FinderById } from '@src/contexts/auth/application/use-cases/user/finder-by-id-user';
import { FinderUser } from '@src/contexts/auth/application/use-cases/user/finder-user';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUser,
    private readonly updateUserUseCase: UpdateUser,
    private readonly deleteUserUseCase: DeleteUser,
    private readonly finderByIdUseCase: FinderById,
    private readonly finderUseCase: FinderUser
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    try {
      await this.createUserUseCase.run(data);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.user_id;
    const data = req.body;
    try {
      await this.updateUserUseCase.run({ ...data, id });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.user_id;
    try {
      await this.deleteUserUseCase.run(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.user_id;
    try {
      const user = await this.finderByIdUseCase.run(id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    const { limit, page } = req.query;

    try {
      const data = await this.finderUseCase.run(Number(limit), Number(page));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
