import { NextFunction, Request, Response } from 'express';
import { GetTemplatesUseCase } from '../../application/template/get-templates';
import { GetVariablesUseCase } from '../../application/template/get-variables';
import { UpdateTemplateUseCase } from '../../application/template/update-template';
import { GetTemplateByIdUseCase } from '../../application/template/get-by-id-template';

export class TemplateController {
  constructor(
    private readonly getTemplatesUseCase: GetTemplatesUseCase,
    private readonly getTemplateVariablesUseCase: GetVariablesUseCase,
    private readonly getByIdTemplateUseCase: GetTemplateByIdUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase
  ) {}

  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getTemplatesUseCase.run();
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTemplateVariables(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getTemplateVariablesUseCase.run();
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTemplateById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const template = await this.getByIdTemplateUseCase.run(id);
      res.status(200).json({ data: template });
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { subject, content } = req.body;
    try {
      await this.updateTemplateUseCase.run(id, { subject, content });
      res.status(200).json({ messaje: 'Template update Succesffuly!' });
    } catch (error) {
      next(error);
    }
  }
}
