import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "**/node_modules/**"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}", "lib/**/*.ts", "hooks/**/*.ts"],
      exclude: [
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/global-error.tsx",
        "app/api/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
