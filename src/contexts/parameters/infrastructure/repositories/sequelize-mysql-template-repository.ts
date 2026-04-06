import { TemplateEmailModel } from '@src/contexts/shared/infrastructure/models/parameter/template-email.model';
import { EmailTemplateEntity } from '../../core/entities/email-template';
import { TemplateParameterEntity } from '../../core/entities/template-parameter';
import { TemplateRepository } from '../../core/repositories/template-repository';
import { TemplateParameterModel } from '@src/contexts/shared/infrastructure/models/parameter/template-parameter.model';

export class SequelizeMySqlTemplateRepository implements TemplateRepository {
  async updateTemplate(template: EmailTemplateEntity): Promise<void> {
    await TemplateEmailModel.update(
      { ...template.toPrimitive() },
      { where: { id: template.id }, fields: ['subject', 'content'] }
    );
  }
  async getTemplateById(id: string): Promise<EmailTemplateEntity | null> {
    const templates = await TemplateEmailModel.findByPk(id);
    if (!templates) {
      return null;
    }
    const plainTemplate = templates.get({ plain: true });
    return EmailTemplateEntity.fromPrimitive({
      ...plainTemplate,
      updatedAt: plainTemplate.updatedAt
    });
  }
  async getTemplates(): Promise<Array<EmailTemplateEntity>> {
    const templates = await TemplateEmailModel.findAll();
    return templates.map(template => EmailTemplateEntity.fromPrimitive({ ...template.get({ plain: true }) }));
  }
  async getTemplateVariables(): Promise<Array<TemplateParameterEntity>> {
    const variables = await TemplateParameterModel.findAll();
    return variables.map(variable => TemplateParameterEntity.fromPrimitive({ ...variable.get({ plain: true }) }));
  }
}
