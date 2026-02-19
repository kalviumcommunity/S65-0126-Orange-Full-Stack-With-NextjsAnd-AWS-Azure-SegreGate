import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'volunteer', 'admin']).default('user'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  role: z.enum(['user', 'volunteer', 'admin']).optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
