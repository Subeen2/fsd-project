import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: false,
  include: ["../../packages/ui/src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  exclude: [],
  theme: { extend: {} },
  outdir: "styled-system",
});
