import { z } from 'zod';

const loteSchema = z.object({
  lote: z.string().min(1).max(80),
  cantidad: z.number().int().positive(),
  fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
});

const inventarioItemSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().nonnegative(),
  lotes: z.array(loteSchema).optional()
});

export const createInventarioSchema = z.object({
  cliente_id: z.number().int().positive(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  items: z.array(inventarioItemSchema).min(1)
});
