import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env["ANALYZE"] === "true",
});

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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

export default withBundleAnalyzer(withNextIntl(nextConfig));
