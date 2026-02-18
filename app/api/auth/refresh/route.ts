import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { handleError, logger } from "@/lib/errorHandler";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

/**
 * POST /api/auth/refresh
 * Issue a new access token using a valid refresh token
 * Refresh token is read from HTTP-only cookie (refreshToken)
 * Returns: New access token
 */
export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return sendError(
        "Refresh token not found. Please log in again.",
        "REFRESH_TOKEN_MISSING",
        401
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return sendError(
        "Refresh token is invalid or expired",
        "REFRESH_TOKEN_INVALID",
        401
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return sendError("User not found", "USER_NOT_FOUND", 404);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);

    logger.info("Access token refreshed", {
      userId: user.id,
      email: user.email,
    });

    return sendSuccess(
      {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Access token refreshed successfully",
      200
    );
  } catch (error) {
    logger.error("Token refresh failed", { error: String(error) });
    return handleError(error, "POST /api/auth/refresh");
  }
}
