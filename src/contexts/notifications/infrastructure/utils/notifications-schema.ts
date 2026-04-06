import { z } from 'zod';

export const notificationSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1).max(512),
  isScheduled: z.boolean(),
  notificationDate: z.string().optional(),
  recipientType: z.enum(['individual', 'tag', 'all']),
  recipientId: z.string().optional()
});
