import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@shiftslabs/ui",
    "@shiftslabs/config",
    "@shiftslabs/database",
    "@shiftslabs/auth",
    "@shiftslabs/permissions",
    "@shiftslabs/validation",
    "@shiftslabs/business-core",
    "@shiftslabs/profession-registry",
    "@shiftslabs/customers",
    "@shiftslabs/scheduling",
    "@shiftslabs/catalogue",
    "@shiftslabs/inventory",
    "@shiftslabs/work-orders",
    "@shiftslabs/commerce",
    "@shiftslabs/finance",
    "@shiftslabs/observability",
  ],
};

export default nextConfig;
