import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

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

const config = withBundleAnalyzer(withNextIntl(nextConfig));

export default withSentryConfig(config, {
  // 소스맵을 Sentry에 업로드 (SENTRY_AUTH_TOKEN 필요)
  silent: !process.env.CI,
  // 빌드 시 소스맵 업로드 비활성화 (토큰 없을 때)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // 번들 크기 최적화 — 사용하는 integration만 포함
  disableLogger: true,
});
