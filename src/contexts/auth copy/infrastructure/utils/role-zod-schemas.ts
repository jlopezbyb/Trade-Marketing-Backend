import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1).max(35),
  description: z.string().max(255).optional(),
  status: z.string().min(1).max(50),
  listOfAccess: z
    .array(
      z.object({
        resource: z.string().uuid(),
        canAccess: z.boolean()
      })
    )
    .nonempty()
});

export const idRoleSchema = z.object({ role_id: z.string().uuid() });

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
