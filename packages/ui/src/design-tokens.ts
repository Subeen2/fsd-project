/**
 * FSD Design System — Canonical Token Definitions
 *
 * This file is the single source of truth for all design tokens.
 * It is imported by packages/ui, apps/storybook, and apps/web panda configs.
 *
 * Primitive colors come from Panda CSS's default preset (Tailwind scale).
 * This file adds semantic tokens + extended primitive tokens on top.
 */

export const designTokens = {
  tokens: {
    fonts: {
      sans: {
        value: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      },
      serif: { value: "ui-serif, Georgia, Cambria, serif" },
      mono: { value: "ui-monospace, SFMono-Regular, 'Fira Code', monospace" },
    },
    fontSizes: {
      "2xs": { value: "0.625rem" }, // 10px
      xs: { value: "0.75rem" }, // 12px
      sm: { value: "0.875rem" }, // 14px
      md: { value: "1rem" }, // 16px
      lg: { value: "1.125rem" }, // 18px
      xl: { value: "1.25rem" }, // 20px
      "2xl": { value: "1.5rem" }, // 24px
      "3xl": { value: "1.875rem" }, // 30px
      "4xl": { value: "2.25rem" }, // 36px
      "5xl": { value: "3rem" }, // 48px
      "6xl": { value: "3.75rem" }, // 60px
    },
    fontWeights: {
      normal: { value: "400" },
      medium: { value: "500" },
      semibold: { value: "600" },
      bold: { value: "700" },
      extrabold: { value: "800" },
    },
    lineHeights: {
      none: { value: "1" },
      tight: { value: "1.25" },
      snug: { value: "1.375" },
      normal: { value: "1.5" },
      relaxed: { value: "1.625" },
      loose: { value: "2" },
    },
    letterSpacings: {
      tighter: { value: "-0.05em" },
      tight: { value: "-0.025em" },
      normal: { value: "0em" },
      wide: { value: "0.025em" },
      wider: { value: "0.05em" },
      widest: { value: "0.1em" },
    },
    radii: {
      none: { value: "0" },
      xs: { value: "0.125rem" }, // 2px
      sm: { value: "0.25rem" }, // 4px
      md: { value: "0.375rem" }, // 6px
      lg: { value: "0.5rem" }, // 8px
      xl: { value: "0.75rem" }, // 12px
      "2xl": { value: "1rem" }, // 16px
      "3xl": { value: "1.5rem" }, // 24px
      full: { value: "9999px" },
    },
    shadows: {
      xs: { value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
      sm: {
        value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
      md: {
        value:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      lg: {
        value:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      xl: {
        value:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      "2xl": { value: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
      inner: { value: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" },
      none: { value: "none" },
    },
    zIndex: {
      hide: { value: "-1" },
      base: { value: "0" },
      raised: { value: "1" },
      dropdown: { value: "1000" },
      sticky: { value: "1100" },
      overlay: { value: "1200" },
      modal: { value: "1300" },
      popover: { value: "1400" },
      toast: { value: "1500" },
      tooltip: { value: "1600" },
    },
  },

  semanticTokens: {
    colors: {
      // ── Background ────────────────────────────────────────────────────
      "bg.default": {
        value: { base: "{colors.white}", _dark: "{colors.slate.950}" },
      },
      "bg.subtle": {
        value: { base: "{colors.slate.50}", _dark: "{colors.slate.900}" },
      },
      "bg.muted": {
        value: { base: "{colors.slate.100}", _dark: "{colors.slate.800}" },
      },
      "bg.inverted": {
        value: { base: "{colors.slate.900}", _dark: "{colors.white}" },
      },

      // ── Text ──────────────────────────────────────────────────────────
      "text.default": {
        value: { base: "{colors.slate.900}", _dark: "{colors.slate.50}" },
      },
      "text.subtle": {
        value: { base: "{colors.slate.600}", _dark: "{colors.slate.400}" },
      },
      "text.muted": {
        value: { base: "{colors.slate.400}", _dark: "{colors.slate.600}" },
      },
      "text.inverted": {
        value: { base: "{colors.white}", _dark: "{colors.slate.900}" },
      },
      "text.disabled": {
        value: { base: "{colors.slate.300}", _dark: "{colors.slate.700}" },
      },

      // ── Border ────────────────────────────────────────────────────────
      "border.default": {
        value: { base: "{colors.slate.200}", _dark: "{colors.slate.700}" },
      },
      "border.subtle": {
        value: { base: "{colors.slate.100}", _dark: "{colors.slate.800}" },
      },
      "border.strong": {
        value: { base: "{colors.slate.400}", _dark: "{colors.slate.500}" },
      },

      // ── Brand (indigo) ────────────────────────────────────────────────
      "brand.default": {
        value: { base: "{colors.indigo.600}", _dark: "{colors.indigo.400}" },
      },
      "brand.subtle": {
        value: { base: "{colors.indigo.50}", _dark: "{colors.indigo.950}" },
      },
      "brand.muted": {
        value: { base: "{colors.indigo.100}", _dark: "{colors.indigo.900}" },
      },
      "brand.fg": {
        value: { base: "{colors.white}", _dark: "{colors.white}" },
      },
      "brand.text": {
        value: { base: "{colors.indigo.700}", _dark: "{colors.indigo.300}" },
      },
      "brand.border": {
        value: { base: "{colors.indigo.200}", _dark: "{colors.indigo.800}" },
      },

      // ── Danger (rose) ─────────────────────────────────────────────────
      "danger.default": {
        value: { base: "{colors.rose.500}", _dark: "{colors.rose.400}" },
      },
      "danger.subtle": {
        value: { base: "{colors.rose.50}", _dark: "{colors.rose.950}" },
      },
      "danger.muted": {
        value: { base: "{colors.rose.100}", _dark: "{colors.rose.900}" },
      },
      "danger.fg": {
        value: { base: "{colors.white}", _dark: "{colors.white}" },
      },
      "danger.text": {
        value: { base: "{colors.rose.700}", _dark: "{colors.rose.300}" },
      },
      "danger.border": {
        value: { base: "{colors.rose.200}", _dark: "{colors.rose.800}" },
      },

      // ── Success (emerald) ─────────────────────────────────────────────
      "success.default": {
        value: { base: "{colors.emerald.500}", _dark: "{colors.emerald.400}" },
      },
      "success.subtle": {
        value: { base: "{colors.emerald.50}", _dark: "{colors.emerald.950}" },
      },
      "success.muted": {
        value: { base: "{colors.emerald.100}", _dark: "{colors.emerald.900}" },
      },
      "success.fg": {
        value: { base: "{colors.white}", _dark: "{colors.white}" },
      },
      "success.text": {
        value: { base: "{colors.emerald.700}", _dark: "{colors.emerald.300}" },
      },
      "success.border": {
        value: { base: "{colors.emerald.200}", _dark: "{colors.emerald.800}" },
      },

      // ── Warning (amber) ───────────────────────────────────────────────
      "warning.default": {
        value: { base: "{colors.amber.500}", _dark: "{colors.amber.400}" },
      },
      "warning.subtle": {
        value: { base: "{colors.amber.50}", _dark: "{colors.amber.950}" },
      },
      "warning.muted": {
        value: { base: "{colors.amber.100}", _dark: "{colors.amber.900}" },
      },
      "warning.fg": {
        value: { base: "{colors.white}", _dark: "{colors.white}" },
      },
      "warning.text": {
        value: { base: "{colors.amber.700}", _dark: "{colors.amber.300}" },
      },
      "warning.border": {
        value: { base: "{colors.amber.200}", _dark: "{colors.amber.800}" },
      },

      // ── Info (sky) ────────────────────────────────────────────────────
      "info.default": {
        value: { base: "{colors.sky.500}", _dark: "{colors.sky.400}" },
      },
      "info.subtle": {
        value: { base: "{colors.sky.50}", _dark: "{colors.sky.950}" },
      },
      "info.muted": {
        value: { base: "{colors.sky.100}", _dark: "{colors.sky.900}" },
      },
      "info.fg": { value: { base: "{colors.white}", _dark: "{colors.white}" } },
      "info.text": {
        value: { base: "{colors.sky.700}", _dark: "{colors.sky.300}" },
      },
      "info.border": {
        value: { base: "{colors.sky.200}", _dark: "{colors.sky.800}" },
      },
    },
  },
} as const;
