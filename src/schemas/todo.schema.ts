import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'title required').max(200),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    done: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, 'nothing to update');

export const listQuerySchema = z.object({
  done: z.enum(['true', 'false']).optional(),
  search: z.string().trim().max(200).optional(),
});