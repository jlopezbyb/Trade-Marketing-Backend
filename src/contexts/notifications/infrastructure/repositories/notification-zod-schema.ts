import { z } from 'zod';

export const getAllNotificationsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});
