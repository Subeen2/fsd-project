import { defineConfig } from "@pandacss/dev";
import { designTokens } from "./src/design-tokens";

export default defineConfig({
  preflight: false,
  include: ["./src/**/*.{ts,tsx}"],
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
