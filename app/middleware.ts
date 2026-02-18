import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, extractTokenFromHeader } from "@/lib/auth";
import {
  PROTECTED_ROUTES,
  ADMIN_ONLY_ROUTES,
  isAdmin,
} from "@/config/roles";
import { logger } from "@/lib/errorHandler";

/**
 * Global middleware for authentication and authorization
 * Protects specified routes and enforces role-based access control
 *
 * Flow:
 * 1. Check if route requires authentication
 * 2. Validate JWT token from Authorization header
 * 3. For admin routes, verify user has admin role
 * 4. Attach user info to request headers for use in route handlers
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Extract token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    logger.error("Unauthorized: Missing token", { pathname });
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

  // Verify JWT token
  const user = verifyAccessToken(token);

  if (!user) {
    logger.error("Unauthorized: Invalid or expired token", { pathname });
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
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !isAdmin(user.role)) {
    logger.error("Forbidden: Admin access required", {
      pathname,
      userId: user.userId,
      role: user.role,
    });
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

  logger.info("Authenticated request", {
    pathname,
    userId: user.userId,
    role: user.role,
  });

  // Continue to next handler with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes this middleware should run on
 * Prevents running middleware on static assets, public files, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
