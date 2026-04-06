export enum EventType {
  ACCEPTANCE_FORM = 'ACCEPTANCE_FORM',
  ACCEPTANCE_ASSIGNMENT = 'ACCEPTANCE_ASSIGNMENT',
  MANUAL_DE_ASSIGNMENT = 'MANUAL_DE_ASSIGNMENT',
  AUTO_DE_ASSIGNMENT = 'AUTO_DE_ASSIGNMENT',
  DISCOUNT_NOTE = 'DISCOUNT_NOTE',
  ASSIGNMENT_LOAN = 'ASSIGNMENT_LOAN',
  DE_ASSIGNMENT_LOAN = 'DE_ASSIGNMENT_LOAN',
  REMINDER_DISCOUNT_NOTE = 'REMINDER_DISCOUNT_NOTE',
  ONDEMAND_NOTIFICATION = 'ONDEMAND_NOTIFICATION',
  DISCOUNT_NOTE_ESCALATION = 'DISCOUNT_NOTE_ESCALATION'
}

export enum EventStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DISPATCHED = 'DISPATCHED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING'
}

export enum TargetType {
  'TO' = 'TO',
  'CC' = 'CC'
}
export enum SenderType {
  'EMAIL' = 'EMAIL'
}

export type Payload = {
  transactionId: string;
  destinations: Array<{ sender: SenderType; address: string; target: TargetType }>;
};

export class NotificationQueue {
  constructor(
    readonly id: string,
    readonly notificationType: EventType,
    readonly payload: Payload,
    public status: EventStatus,
    public attempts?: number,
    public maxRetries?: number,
    public dispatchedAt?: Date,
    public errorMessage?: string,
    public nextAttempt?: Date
  ) {
    this.attempts = this.attempts ?? 0;
    this.maxRetries = this.maxRetries ?? 3;
  }

  static fromPrimitives(plainData: {
    id: string;
    notificationType: EventType;
    payload: Payload;
    status: EventStatus;
    attempts?: number;
    maxRetries?: number;
    dispatchedAt?: Date;
    errorMessage?: string;
    nextAttempt?: Date;
  }) {
    return new NotificationQueue(
      plainData.id,
      plainData.notificationType,
      plainData.payload,
      plainData.status,
      plainData.attempts,
      plainData.maxRetries,
      plainData.dispatchedAt,
      plainData.errorMessage,
      plainData.nextAttempt
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      notificationType: this.notificationType,
      status: this.status,
      payload: this.payload,
      attempts: this.attempts,
      maxRetries: this.maxRetries,
      dispatchedAt: this.dispatchedAt,
      errorMessage: this.errorMessage,
      nextAttempt: this.nextAttempt
    };
  }
}
