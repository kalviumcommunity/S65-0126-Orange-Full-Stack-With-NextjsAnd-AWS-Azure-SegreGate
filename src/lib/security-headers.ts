/**
 * Security Headers Configuration
 * Implements HSTS, CSP, CORS, and other protective headers
 */

export interface SecurityHeadersConfig {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
}

/**
 * HSTS (HTTP Strict Transport Security)
 * Forces browsers to always use HTTPS connections
 */
export const hstsHeader = {
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload',
};

/**
 * CSP (Content Security Policy)
 * Restricts sources for scripts, styles, images, and other content
 * Prevents XSS and data exfiltration attacks
 */
export const cspHeader = {
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://vercel.live", // Note: unsafe-inline for Next.js dev, remove in production if possible
    "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "media-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

/**
 * X-Content-Type-Options
 * Prevents MIME type sniffing attacks
 */
export const contentTypeHeader = {
  key: 'X-Content-Type-Options',
  value: 'nosniff',
};

/**
 * X-Frame-Options
 * Prevents clickjacking attacks by controlling frame embedding
 */
export const frameOptionsHeader = {
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN',
};

/**
 * X-XSS-Protection
 * Legacy header for older browsers (modern CSP is preferred)
 */
export const xssProtectionHeader = {
  key: 'X-XSS-Protection',
  value: '1; mode=block',
};

/**
 * Referrer-Policy
 * Controls how much referrer information is shared
 */
export const referrerPolicyHeader = {
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
};

/**
 * Permissions-Policy (formerly Feature-Policy)
 * Controls access to sensitive browser APIs
 */
export const permissionsPolicyHeader = {
  key: 'Permissions-Policy',
  value: 'geolocation=(), microphone=(), camera=()',
};

/**
 * CORS Headers for API endpoints
 * Should be used in individual API routes, not global headers
 */
export const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Get CORS header value for specific origin
 * In production, only allow your frontend domain
 */
export function getCorsOriginHeader(
  requestOrigin: string | undefined,
  allowedOrigins: string[]
): string {
  // Allow specified origins in production
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  // Fallback to first allowed origin or empty
  return allowedOrigins[0] || '';
}

/**
 * Allowed origins for CORS
 * Configure based on your deployment
 */
export const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production' ? [
  process.env.FRONTEND_URL || 'https://segregate.example.com',
  process.env.ADMIN_URL || 'https://admin.segregate.example.com',
] : [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

/**
 * Security headers configuration for Next.js
 * Applied to all routes by default
 */
export const securityHeadersConfig: SecurityHeadersConfig[] = [
  {
    source: '/(.*)',
    headers: [
      hstsHeader,
      contentTypeHeader,
      frameOptionsHeader,
      xssProtectionHeader,
      referrerPolicyHeader,
      permissionsPolicyHeader,
      cspHeader,
    ],
  },
];
