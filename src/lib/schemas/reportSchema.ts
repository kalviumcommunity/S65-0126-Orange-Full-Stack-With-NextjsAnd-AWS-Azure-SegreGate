import { z } from 'zod';

export const reportCreateSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(255, 'Location must not exceed 255 characters'),
  description: z.string().max(1000).optional(),
  segregationQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  photoUrl: z.string().url('Invalid photo URL').optional().or(z.literal('')),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

export const reportUpdateSchema = z.object({
  location: z.string().min(3).max(255).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  photoUrl: z.string().url().optional(),
});

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;
