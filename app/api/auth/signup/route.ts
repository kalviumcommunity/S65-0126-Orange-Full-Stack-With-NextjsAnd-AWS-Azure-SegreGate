import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { signupSchema } from "@/src/lib/schemas/authSchema";
import { sendSuccess, sendError } from "@/src/lib/responseHandler";
import { handleError, logger } from "@/src/lib/errorHandler";
import { ZodError } from "zod";

/**
 * POST /api/auth/signup
 * Register a new user with email and password
 * Returns: User object (without password) and tokens if successful
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return sendError(
        "User with this email already exists",
        "EMAIL_ALREADY_EXISTS",
        409
      );
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // SECURITY: Users cannot self-assign privileged roles
    // Only 'user' role is allowed during self-registration
    // Admin can assign other roles through the admin user management API
    const allowedRole = 'user';

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: allowedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    logger.info("User registered successfully", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(
      user,
      "User registered successfully. Please log in.",
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendError(
        "Validation failed",
        "VALIDATION_ERROR",
        400,
        fieldErrors
      );
    }

    logger.error("Signup failed", { error: String(error) });
    return handleError(error, "POST /api/auth/signup");
  }
}
