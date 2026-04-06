import { Request, Response, NextFunction } from 'express';
import { GetAllVisitasUseCase } from '../../application/use-cases/get-all-visitas';
import { CreateVisitaUseCase } from '../../application/use-cases/create-visita';

export class VisitaController {
  constructor(
    private readonly getAllUseCase: GetAllVisitasUseCase,
    private readonly createUseCase: CreateVisitaUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const result = await this.getAllUseCase.run(limit, page);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const visita = await this.createUseCase.run(req.body);
      res.status(201).json(visita.toPrimitives());
    } catch (error) {
      next(error);
    }
  }
}
