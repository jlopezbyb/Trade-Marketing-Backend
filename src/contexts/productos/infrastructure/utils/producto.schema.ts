import { z } from 'zod';

export const createProductoSchema = z.object({
  nombre: z.string().min(1).max(150),
  sku: z.string().min(1).max(30),
  unidad: z.string().min(1).max(20),
  categoria_id: z.number().int().positive(),
  imagen_url: z.string().min(1).optional()
});

export const updateProductoSchema = z.object({
  nombre: z.string().min(1).max(150).optional(),
  sku: z.string().min(1).max(30).optional(),
  unidad: z.string().min(1).max(20).optional(),
  categoria_id: z.number().int().positive().optional(),
  imagen_url: z.string().url().nullable().optional(),
  activo: z.boolean().optional()
});
