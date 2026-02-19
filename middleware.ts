import { NextRequest, NextResponse } from "next/server";
import { verifyAccessTokenEdge, extractTokenFromHeader } from "@/src/lib/auth-edge";
import {
  PROTECTED_ROUTES,
  ADMIN_ONLY_ROUTES,
  isAdmin,
} from "@/src/config/roles";
import { ALLOWED_ORIGINS, corsHeaders, getCorsOriginHeader } from "@/src/lib/security-headers";

/**
 * Global middleware for authentication, authorization, and security
 * Protects specified routes, enforces role-based access control, and applies CORS
 *
 * Uses `jose` (Edge-compatible) for JWT verification instead of `jsonwebtoken`.
 *
 * Flow:
 * 1. Handle CORS pre-flight requests
 * 2. Check if route requires authentication
 * 3. Validate JWT token from Authorization header
 * 4. For admin routes, verify user has admin role
 * 5. Attach user info to request headers for use in route handlers
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") || "";

  // Handle CORS pre-flight requests
  if (req.method === "OPTIONS") {
    const allowedOrigin = getCorsOriginHeader(origin, ALLOWED_ORIGINS);

    if (allowedOrigin) {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          ...corsHeaders,
        },
      });
    }

    return new NextResponse(null, { status: 204 });
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    const response = NextResponse.next();
    const allowedOrigin = getCorsOriginHeader(origin, ALLOWED_ORIGINS);

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  }

  // Extract token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Missing authentication token",
        error: { code: "MISSING_TOKEN" },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  // Verify JWT token (async — jose uses Web Crypto)
  const user = await verifyAccessTokenEdge(token);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Invalid or expired token",
        error: { code: "INVALID_TOKEN" },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  // Check if route is admin-only
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute && !isAdmin(user.role)) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden: Admin access required",
        error: { code: "ADMIN_ACCESS_REQUIRED" },
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  }

  // Attach user info to request headers for use in route handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", String(user.userId));
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);

  // Continue to next handler with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add CORS headers to response
  const allowedOrigin = getCorsOriginHeader(origin, ALLOWED_ORIGINS);
  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
