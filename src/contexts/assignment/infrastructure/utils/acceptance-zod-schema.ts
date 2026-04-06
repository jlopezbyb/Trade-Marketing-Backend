import { z } from 'zod';

export const dataForAcceptanceFormSchema = z.object({
  assignmentDate: z.string().date('YYYY-MM-DD'),
  isDiscountWaiver: z.boolean()
});

export const statusAcceptanceFormSchema = z.object({
  status: z.enum(['ACEPTADO', 'RECHAZADO', 'CANCELADO'])
});
