export type NotificationTypePreference = {
  notificationType: string;
  enable: boolean;
};

export class NotificationPreferencesEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly name: string,
    public notificationPreferences: Array<NotificationTypePreference>
  ) {}

  public static fromPrimitives(plainData: {
    id: string;
    username: string;
    email: string;
    name: string;
    notificationPreferences: {
      notificationType: string;
      description: string;
      enable: boolean;
    }[];
  }) {
    return new NotificationPreferencesEntity(
      plainData.id,
      plainData.username,
      plainData.email,
      plainData.name,
      plainData.notificationPreferences
    );
  }

  public toPrimitives() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      notificationPreferences: this.notificationPreferences
    };
  }
}
