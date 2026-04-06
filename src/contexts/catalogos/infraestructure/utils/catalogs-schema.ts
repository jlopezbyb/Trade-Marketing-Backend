import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().uuid()
});

export const vehicleTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  isActive: z.boolean()
});

export const StatusTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  isActive: z.boolean()
});

export const StatusSlotTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  isActive: z.boolean()
});

export const slotTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  allowParallelAssignments: z.boolean(),
  isActive: z.boolean()
});

export const benefitTypeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  sendDocument: z.boolean(),
  allowAmount: z.boolean(),
  isActive: z.boolean()
});
