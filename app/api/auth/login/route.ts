import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { loginSchema } from "@/src/lib/schemas/authSchema";
import { sendSuccess, sendError } from "@/src/lib/responseHandler";
import { handleError, logger } from "@/src/lib/errorHandler";
import { generateAccessToken, generateRefreshToken } from "@/src/lib/auth";
import { ZodError } from "zod";

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT tokens
 * Returns: Access token (in body), Refresh token (in HTTP-only cookie)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return sendError("Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return sendError("Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Create response with access token in body
    // sendSuccess() already returns a NextResponse — use it directly
    const response = sendSuccess(
      {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
      200
    );

    // Set refresh token as HTTP-only cookie (secure, sameSite)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return response;
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

    logger.error("Login failed", { error: String(error) });
    return handleError(error, "POST /api/auth/login");
  }
}
