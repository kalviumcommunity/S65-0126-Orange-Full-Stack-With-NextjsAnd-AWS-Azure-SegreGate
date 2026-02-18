import { z } from "zod";

/**
 * Signup schema validation
 * Validates user registration input
 */
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
  role: z.enum(["user", "volunteer", "admin"]).default("user").optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Login schema validation
 * Validates user authentication input
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Refresh token schema validation
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
