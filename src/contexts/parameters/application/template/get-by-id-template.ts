import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { TemplateRepository } from '../../core/repositories/template-repository';

export class GetTemplateByIdUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async run(id: string) {
    const template = await this.templateRepository.getTemplateById(id);

    if (!template) {
      throw new AppError('TEMPLATE NOT FOUND', 404, 'Template Not Found', true);
    }
    return template.toPrimitive();
  }
}
