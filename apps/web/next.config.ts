import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  experimental: {
    reactCompiler: false,
  },
  // Transpile internal workspace packages
  transpilePackages: ["@fsd/ui", "@fsd/shared", "@fsd/api", "@fsd/features"],
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_WS_URL:
      process.env["NEXT_PUBLIC_WS_URL"] ?? "ws://localhost:3002/ws",
  },
};

export default nextConfig;
