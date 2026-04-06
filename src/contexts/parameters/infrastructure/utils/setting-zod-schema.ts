import { z } from 'zod';

export const idSettingSchema = z.object({
  setting_id: z.string().uuid()
});

export const settingUpdateSchema = z.object({
  settingValue: z.string().max(500).min(1),
  description: z.string().max(255).min(1)
});
