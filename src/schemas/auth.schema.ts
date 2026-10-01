import { z } from 'zod';

const email = z.string().trim().toLowerCase().email();

export const registerSchema = z.object({
  email,
  password: z.string().min(8, 'password must be at least 8 chars').max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'password required'),
});