import { TemplateRepository } from '../../core/repositories/template-repository';

export class GetTemplatesUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async run() {
    return this.templateRepository.getTemplates();
  }
}
