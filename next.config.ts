import type { NextConfig } from "next";
import { securityHeadersConfig } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  /* Environment-aware configuration */

  // Allow Next.js <Image> to serve photos from S3
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  // Load environment-specific configuration
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },

  // Disable SWR for static exports if needed
  experimental: {
    optimizePackageImports: ["@tailwindcss/postcss"],
  },

  // Security headers configuration
  async headers() {
    return securityHeadersConfig;
  },

  /* config options here */
};

export default nextConfig;
