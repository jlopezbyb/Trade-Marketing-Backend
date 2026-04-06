import { z } from 'zod';

export const tagSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.string()
});

export const idTagSchema = z.object({ tag_id: z.string().uuid() });

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
