import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  employee_code: z.string().min(1).max(20),
  nombre: z.string().min(1).max(120),
  rol: z.enum(['field', 'supervisor']),
  imagen_url: z.string().url().optional()
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  employee_code: z.string().min(1).max(20).optional(),
  nombre: z.string().min(1).max(120).optional(),
  rol: z.enum(['field', 'supervisor']).optional(),
  activo: z.boolean().optional(),
  imagen_url: z.string().url().nullable().optional()
});

export const asignarClientesSchema = z.object({
  cliente_ids: z.array(z.number().int().positive()).min(0)
});
