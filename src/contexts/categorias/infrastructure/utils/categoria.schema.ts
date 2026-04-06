import { z } from 'zod';

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(300).optional(),
  color: z.string().max(7).optional()
});

export const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(300).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
  activo: z.boolean().optional()
});
