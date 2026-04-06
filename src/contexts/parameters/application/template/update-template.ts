import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { TemplateRepository } from '../../core/repositories/template-repository';
import { EmailTemplateEntity } from '../../core/entities/email-template';

export class UpdateTemplateUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async run(id: string, data: { content: string; subject: string }) {
    const template = await this.templateRepository.getTemplateById(id);
    if (!template) {
      throw new AppError('Template not found', 404, 'No se encontro una template con el id proporcionado', true);
    }
    const updatedTemplate = EmailTemplateEntity.fromPrimitive({
      ...template.toPrimitive(),
      content: data.content,
      subject: data.subject
    });
    await this.templateRepository.updateTemplate(updatedTemplate);
  }
}
