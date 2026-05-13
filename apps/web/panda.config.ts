import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: false,
  include: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  exclude: [],
  theme: { extend: {} },
  outdir: "styled-system",
  jsxFramework: "react",
});
