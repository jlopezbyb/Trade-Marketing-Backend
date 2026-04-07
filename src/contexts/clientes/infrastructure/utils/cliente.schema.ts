import { z } from 'zod';

export const createClienteSchema = z.object({
  nombre: z.string().min(1).max(150),
  cliente_code: z.string().min(1).max(20),
  direccion: z.string().min(1).max(300),
  telefono: z.string().min(1).max(20),
  contacto: z.string().min(1).max(120),
  email: z.string().email().optional(),
  imagen_url: z.string().optional()
});

export const updateClienteSchema = z.object({
  nombre: z.string().min(1).max(150).optional(),
  cliente_code: z.string().min(1).max(20).optional(),
  direccion: z.string().min(1).max(300).optional(),
  telefono: z.string().min(1).max(20).optional(),
  contacto: z.string().min(1).max(120).optional(),
  email: z.string().email().nullable().optional(),
  imagen_url: z.string().nullable().optional(),
  activo: z.boolean().optional()
});
