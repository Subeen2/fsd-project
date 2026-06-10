import { defineConfig } from "@pandacss/dev";
import { designTokens } from "../../packages/ui/src/design-tokens";

export default defineConfig({
  preflight: false,
  include: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  exclude: [],
  theme: {
    extend: {
      tokens: designTokens.tokens,
      semanticTokens: designTokens.semanticTokens,
    },
  },
  outdir: "styled-system",
  jsxFramework: "react",
});
