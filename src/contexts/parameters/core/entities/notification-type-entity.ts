export class NotificationTypeEntity {
  constructor(
    public readonly notificationType: string,
    public readonly description: string
  ) {}

  public static fromPrimitives(plaintData: { notificationType: string; description: string }) {
    return new NotificationTypeEntity(plaintData.notificationType, plaintData.description);
  }

  public toPrimitives() {
    return {
      notificationType: this.notificationType,
      description: this.description
    };
  }
}
