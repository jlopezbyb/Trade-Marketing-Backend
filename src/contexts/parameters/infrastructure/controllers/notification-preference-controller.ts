import { Request, Response, NextFunction } from 'express';
import { GetPreferenceNotificationByUserUseCase } from '@src/contexts/parameters/application/setting/get-preference-by-user';
import { SaveNotificationPreferenceUseCase } from '@src/contexts/parameters/application/setting/save-notification-preference';

export class NotificationPreferenceController {
  constructor(
    private readonly getPreferenceNotificationByUserUseCase: GetPreferenceNotificationByUserUseCase,
    private readonly saveNotificationPreferenceUseCase: SaveNotificationPreferenceUseCase
  ) {}

  async getNotificationPreferencesByUser(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;
    try {
      const data = await this.getPreferenceNotificationByUserUseCase.run(user_id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async saveNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;
    const { preferences } = req.body;
    try {
      await this.saveNotificationPreferenceUseCase.run({ userId: user_id, preferences });
      res.status(200).json({ message: 'Notification preferences saved successfully' });
    } catch (error) {
      next(error);
    }
  }
}
