/**
 * Edge Runtime-compatible JWT utilities
 * Uses `jose` instead of `jsonwebtoken` (which requires Node.js crypto)
 * Used by middleware.ts — which runs in the Edge Runtime
 */
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Verify and decode access token (Edge-compatible)
 */
export async function verifyAccessTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Extract JWT from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}
