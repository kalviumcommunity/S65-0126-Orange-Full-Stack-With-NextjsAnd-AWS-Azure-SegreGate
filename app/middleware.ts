import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, extractTokenFromHeader } from "@/lib/auth";
import {
  PROTECTED_ROUTES,
  ADMIN_ONLY_ROUTES,
  isAdmin,
} from "@/config/roles";
import { logger } from "@/lib/errorHandler";
import { ALLOWED_ORIGINS, corsHeaders, getCorsOriginHeader } from "@/lib/security-headers";

/**
 * Global middleware for authentication, authorization, and security
 * Protects specified routes, enforces role-based access control, and applies CORS
 *
 * Flow:
 * 1. Handle CORS pre-flight requests
 * 2. Check if route requires authentication
 * 3. Validate JWT token from Authorization header
 * 4. For admin routes, verify user has admin role
 * 5. Attach user info to request headers for use in route handlers
 */
export function middleware(req: NextRequest) {
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
    // For non-protected routes, still add CORS headers
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
