export enum TemplateNotificationType {
  ACCEPTANCE_FORM = 'ACCEPTANCE_FORM',
  ACCEPTANCE_ASSIGNMENT = 'ACCEPTANCE_ASSIGNMENT',
  MANUAL_DE_ASSIGNMENT = 'MANUAL_DE_ASSIGNMENT',
  AUTO_DE_ASSIGNMENT = 'AUTO_DE_ASSIGNMENT',
  DISCOUNT_NOTE = 'DISCOUNT_NOTE',
  ASSIGNMENT_LOAN = 'ASSIGNMENT_LOAN',
  DE_ASSIGNMENT_LOAN = 'DE_ASSIGNMENT_LOAN'
}

export class EmailTemplateEntity {
  constructor(
    readonly id: string,
    readonly type: TemplateNotificationType,
    readonly templateName: string,
    readonly subject: string,
    readonly content: string
  ) {}

  static fromPrimitive(data: {
    id: string;
    type: TemplateNotificationType;
    templateName: string;
    subject: string;
    content: string;
  }): EmailTemplateEntity {
    return new EmailTemplateEntity(data.id, data.type, data.templateName, data.subject, data.content);
  }

  toPrimitive() {
    return {
      id: this.id,
      type: this.type,
      templateName: this.templateName,
      subject: this.subject,
      content: this.content
    };
  }
}
