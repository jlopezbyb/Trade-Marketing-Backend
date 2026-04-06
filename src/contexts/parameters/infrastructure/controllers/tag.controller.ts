import { Request, Response } from 'express';
import { NextFunction } from 'express';
import { CreateTag } from '@src/contexts/parameters/application/use-cases/create-tag';
import { UpdateTag } from '@src/contexts/parameters/application/use-cases/update-tag';
import { DeleteTag } from '@src/contexts/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '@src/contexts/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '@src/contexts/parameters/application/use-cases/tag-finder';

export class TagController {
  constructor(
    private readonly createTagUseCase: CreateTag,
    private readonly updateTagUseCase: UpdateTag,
    private readonly deleteTagUseCase: DeleteTag,
    private readonly tagFinderByIdUseCase: TagFinderById,
    private readonly tagFinderUseCase: TagFinder
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, status } = req.body;

    try {
      await this.createTagUseCase.run({ name, description, status });
      res.status(201).json({ message: 'Tag created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { name, description, status } = req.body;
    const { tag_id } = req.params;
    try {
      await this.updateTagUseCase.run({
        id: tag_id,
        name,
        description,
        status
      });
      res.status(200).json({ message: 'Tag updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.tag_id;
    try {
      await this.deleteTagUseCase.run(id);
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { tag_id } = req.params;
    try {
      const tag = await this.tagFinderByIdUseCase.run(tag_id);
      res.status(200).json({ data: tag });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const { limit, page } = req.query;

    try {
      const data = await this.tagFinderUseCase.run(Number(limit), Number(page));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
