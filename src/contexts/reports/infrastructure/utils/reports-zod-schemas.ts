import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

const dateFilterSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid startDate format, should be yyyy-mm-dd'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid endDate format, should be yyyy-mm-dd')
});

export const getAssignedParkingByPeriodQuerySchema = PaginationQuerySchema.merge(dateFilterSchema);
