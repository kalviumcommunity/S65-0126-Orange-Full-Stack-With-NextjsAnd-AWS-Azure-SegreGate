import { z } from 'zod';

/**
 * Schema for submitting a new waste segregation report
 * Frontend validation before sending to API
 */
export const reportSubmitSchema = z.object({
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(255, 'Location must not exceed 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  photoUrl: z
    .string()
    .url('Invalid photo URL')
    .optional()
    .or(z.literal('')),
  segregationQuality: z
    .enum(['excellent', 'good', 'fair', 'poor'], {
      errorMap: () => ({
        message: 'Please select a segregation quality level',
      }),
    }),
});

export type ReportSubmitInput = z.infer<typeof reportSubmitSchema>;

/**
 * Schema for contact form (general feedback)
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

export type ContactFormInput = z.infer<typeof contactSchema>;
