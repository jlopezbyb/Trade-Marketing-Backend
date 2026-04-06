import { z } from 'zod';

export const userSchema = z.object({
  name: z.string(),
  status: z.string().min(1).max(50),
  username: z.string().min(1).max(35),
  email: z.string().email().min(1).max(50),
  password: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+\(50[2-6]\) \d{8}$/, {
      message: 'Format phone number is +(50X) XXXXXXXX, example: +(502) 45454545'
    })
    .optional(),
  role: z.string().uuid()
});

export const idUserSchema = z.object({ user_id: z.string().uuid() });

export const finderSchema = z.object({
  limit: z.coerce
    .number({
      message: 'Limit must be number and should be greater than 0'
    })
    .min(1),
  page: z.coerce
    .number({
      message: 'Page must be number and should be greater than 0'
    })
    .min(1)
});
