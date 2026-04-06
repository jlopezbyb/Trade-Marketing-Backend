import { z } from 'zod';
import { EventType } from '@src/contexts/shared/core/notification_queue';

export const userSchema = z.object({
  user_id: z.string().uuid()
});

export const notificationPreferenceSchema = z.object({
  preferences: z.array(
    z.object({
      notificationType: z.enum([
        EventType.ACCEPTANCE_ASSIGNMENT,
        EventType.ACCEPTANCE_FORM,
        EventType.DISCOUNT_NOTE,
        EventType.MANUAL_DE_ASSIGNMENT,
        EventType.AUTO_DE_ASSIGNMENT,
        EventType.ASSIGNMENT_LOAN,
        EventType.DE_ASSIGNMENT_LOAN,
        EventType.REMINDER_DISCOUNT_NOTE,
        EventType.DISCOUNT_NOTE_ESCALATION,
        EventType.ONDEMAND_NOTIFICATION
      ]),
      enable: z.boolean()
    })
  )
});
