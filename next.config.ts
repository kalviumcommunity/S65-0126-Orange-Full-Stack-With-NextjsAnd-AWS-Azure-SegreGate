import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Environment-aware configuration */
  
  // Load environment-specific configuration
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },

  // Disable SWR for static exports if needed
  experimental: {
    optimizePackageImports: ["@tailwindcss/postcss"],
  },

  /* config options here */
};

export default nextConfig;
