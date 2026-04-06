import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
// eslint-disable-next-line node/no-extraneous-import
import moment from 'moment-timezone';

export class NotificationEntity {
  readonly id: string;
  readonly subject: string;
  readonly message: string;
  readonly notificationDate: Date | null;
  readonly isScheduled: boolean;
  readonly emailStatus: 'PENDING' | 'SENT' | 'FAILED';
  readonly tagName: string | null;
  readonly recipients: string | null;

  constructor(
    id: string,
    subject: string,
    message: string,
    notificationDate: Date | null,
    isScheduled: boolean,
    emailStatus: 'PENDING' | 'SENT' | 'FAILED',
    recipients: string | null,
    tagName: string | null
  ) {
    if (!id || !subject || !message) {
      throw new AppError(
        'INVALID_NOTIFICATION_ENTITY',
        400,
        'Notification entity must have valid id, subject, and message',
        true
      );
    }

    this.id = id;
    this.subject = subject;
    this.message = message;
    this.notificationDate = notificationDate;
    this.isScheduled = isScheduled;
    this.emailStatus = emailStatus;
    this.recipients = recipients;
    this.tagName = tagName;
  }

  static fromPrimitives(primitiveData: {
    id: string;
    subject: string;
    message: string;
    notificationDate: string | null;
    isScheduled: boolean;
    emailStatus: 'PENDING' | 'SENT' | 'FAILED';
    recipients: string | null;
    tagName: string | null;
  }) {
    if (!primitiveData.id || !primitiveData.subject || !primitiveData.message) {
      throw new AppError('INVALID_PRIMITIVE_DATA', 400, 'Primitive data must include valid id, subject, and message', true);
    }

    return new NotificationEntity(
      primitiveData.id,
      primitiveData.subject,
      primitiveData.message,
      primitiveData.notificationDate ? new Date(primitiveData.notificationDate) : moment().tz('America/Guatemala').toDate(),
      primitiveData.isScheduled,
      primitiveData.emailStatus,
      primitiveData.recipients,
      primitiveData.tagName
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      subject: this.subject,
      message: this.message,
      notificationDate: this.notificationDate ? this.notificationDate.toISOString() : null,
      isScheduled: this.isScheduled,
      emailStatus: this.emailStatus,
      recipients: this.recipients,
      tagName: this.tagName
    };
  }
}
