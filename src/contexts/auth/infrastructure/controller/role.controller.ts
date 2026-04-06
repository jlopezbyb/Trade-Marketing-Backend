import { Request, Response } from 'express';
import { NextFunction } from 'express';

import { CreateRole } from '@src/contexts/auth/application/use-cases/role/create-role';
import { UpdateRole } from '@src/contexts/auth/application/use-cases/role/update-role';
import { DeleteRole } from '@src/contexts/auth/application/use-cases/role/delete-role';
import { FinderById } from '@src/contexts/auth/application/use-cases/role/finder-by-id-role';
import { FinderRole } from '@src/contexts/auth/application/use-cases/role/finder-role';
import { FinderResource } from '@src/contexts/auth/application/use-cases/role/finder-resource';

export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRole,
    private readonly updateRoleUseCase: UpdateRole,
    private readonly deleteRoleUseCase: DeleteRole,
    private readonly finderByIdRoleCase: FinderById,
    private readonly finderRoleCase: FinderRole,
    private readonly finderResources: FinderResource
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const listOfAccess = data.listOfAccess;
    try {
      await this.createRoleUseCase.run({
        ...data,
        listOfAccess
      });
      res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.role_id;
    const data = req.body;
    const listOfAccess = data.listOfAccess;
    try {
      await this.updateRoleUseCase.run({ ...data, id, listOfAccess });
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.role_id;
    try {
      await this.deleteRoleUseCase.run(id);
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.role_id;
    try {
      const role = await this.finderByIdRoleCase.run(id);
      res.status(200).json({ data: role });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    const { limit, page } = req.query;

    try {
      const data = await this.finderRoleCase.run(Number(limit), Number(page));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAllResources(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.finderResources.run();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
