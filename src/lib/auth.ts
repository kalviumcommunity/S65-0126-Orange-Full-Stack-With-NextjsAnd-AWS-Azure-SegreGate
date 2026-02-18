import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-change-in-production";

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Generate a short-lived access token (15 minutes)
 */
export function generateAccessToken(
  userId: number,
  email: string,
  role: string
): string {
  const payload: TokenPayload = { userId, email, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

/**
 * Generate a long-lived refresh token (7 days)
 */
export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract JWT from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

/**
 * Extract user from request (used in routes)
 */
export function extractUserFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);
  if (!token) return null;
  return verifyAccessToken(token);
}
