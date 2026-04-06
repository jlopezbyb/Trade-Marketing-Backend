import { TemplateRepository } from '../../core/repositories/template-repository';

export class GetVariablesUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async run() {
    return this.templateRepository.getTemplateVariables();
  }
}
