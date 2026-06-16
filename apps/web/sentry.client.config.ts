import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 트래킹 — 프로덕션에서 10% 샘플링
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // 세션 리플레이 — 에러 발생 시 100%, 일반 세션 10%
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [Sentry.replayIntegration()],

  // DSN 없으면 초기화 스킵 (로컬 개발)
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
