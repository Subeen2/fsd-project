"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          gap: "16px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}>
          문제가 발생했습니다
        </h2>
        <button
          onClick={reset}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
