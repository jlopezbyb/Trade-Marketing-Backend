import { NextFunction, Request, Response } from 'express';
import { GetAllSettingsUseCase } from '../../application/setting/get-all-settings';
import { UpdateSettingUseCase } from '../../application/setting/update-setting';
import { GetByIdSettingUseCase } from '../../application/setting/get-by-id-setting';

export class SettingController {
  constructor(
    private readonly getAllSettings: GetAllSettingsUseCase,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
    private readonly getByIdSettingUseCase: GetByIdSettingUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAllSettings.run();
      res.status(200).json({ data: data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { setting_id } = req.params;
    const { settingValue, description } = req.body;
    try {
      await this.updateSettingUseCase.run({ settingId: setting_id, settingValue, description });
      res.status(200).json({ message: 'Setting updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { setting_id } = req.params;
    try {
      const data = await this.getByIdSettingUseCase.run(setting_id);
      res.status(200).json({ data: data });
    } catch (error) {
      next(error);
    }
  }
}
