import { defineConfig } from "@pandacss/dev";
import { designTokens } from "../../packages/ui/src/design-tokens";

export default defineConfig({
  preflight: false,
  include: ["../../packages/ui/src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  exclude: [],
  theme: {
    extend: {
      tokens: designTokens.tokens,
      semanticTokens: designTokens.semanticTokens,
    },
  },
  outdir: "styled-system",
});
