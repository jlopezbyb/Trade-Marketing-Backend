import { z } from 'zod';

export const createVisitaSchema = z.object({
  cliente_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  observaciones: z.string().max(500).optional()
});

export const updateVisitaSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  usuario_id: z.string().uuid().optional(),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .optional(),
  observaciones: z.string().max(500).nullable().optional()
});
