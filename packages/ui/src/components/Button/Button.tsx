import React from "react";
import { sva } from "../../../styled-system/css";

const buttonSlots = sva({
  slots: ["root", "leftIcon", "rightIcon", "spinner", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontWeight: "semibold",
      letterSpacing: "wide",
      transition: "all 0.2s ease-out",
      userSelect: "none",
      outline: "none",
      _focusVisible: { outline: "2px solid", outlineOffset: "2px" },
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.6",
        pointerEvents: "none",
      },
    },
    leftIcon: { display: "inline-flex", alignItems: "center", flexShrink: "0" },
    rightIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: "0",
    },
    spinner: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: "0",
      animation: "spin",
    },
    label: { lineHeight: "tight" },
  },
  variants: {
    variant: {
      primary: {
        root: {
          borderRadius: "full",
          bgGradient: "to-r",
          // violet/purple are intentional gradient accent steps, not in brand palette
          gradientFrom: "indigo.500",
          gradientVia: "violet.500",
          gradientTo: "purple.600",
          color: "brand.fg",
          shadow: "md",
          _hover: { shadow: "xl", filter: "brightness(1.1)", translateY: "-1" },
          _active: { translateY: "0", shadow: "md" },
          _focusVisible: { outlineColor: "brand.default" },
          _disabled: {
            bgGradient: "to-r",
            gradientFrom: "text.disabled",
            gradientVia: "text.disabled",
            gradientTo: "text.disabled",
            shadow: "none",
          },
        },
        spinner: { color: "brand.fg" },
        leftIcon: { color: "brand.fg", opacity: "0.85" },
        rightIcon: { color: "brand.fg", opacity: "0.85" },
      },
      secondary: {
        root: {
          borderRadius: "xl",
          bg: "bg.default",
          borderWidth: "2px",
          borderColor: "border.default",
          color: "text.default",
          shadow: "sm",
          _hover: {
            borderColor: "brand.border",
            bg: "brand.subtle",
            color: "brand.text",
            shadow: "md",
            translateY: "-1",
          },
          _active: { translateY: "0", shadow: "sm" },
          _focusVisible: { outlineColor: "brand.border" },
          _disabled: {
            bg: "bg.subtle",
            color: "text.disabled",
            borderColor: "border.subtle",
            shadow: "none",
          },
        },
        spinner: { color: "brand.default" },
        leftIcon: { color: "text.subtle" },
        rightIcon: { color: "text.subtle" },
      },
      ghost: {
        root: {
          borderRadius: "lg",
          bg: "transparent",
          color: "text.subtle",
          _hover: { bg: "bg.muted", color: "text.default" },
          // slate.200 is intentional: slightly darker than bg.muted for pressed feel
          _active: { bg: "slate.200" },
          _focusVisible: { outlineColor: "border.strong" },
          _disabled: { color: "text.disabled" },
        },
        spinner: { color: "text.muted" },
        leftIcon: { color: "text.muted" },
        rightIcon: { color: "text.muted" },
      },
      danger: {
        root: {
          borderRadius: "xl",
          bg: "danger.default",
          color: "danger.fg",
          shadow: "md",
          // rose.600/700 are intentional darkened hover/active steps
          _hover: { bg: "rose.600", shadow: "xl", translateY: "-1" },
          _active: { translateY: "0", bg: "rose.700", shadow: "md" },
          _focusVisible: { outlineColor: "danger.default" },
          // rose.300: intentional disabled wash, lighter than danger.default
          _disabled: { bg: "rose.300", shadow: "none" },
        },
        spinner: { color: "danger.fg" },
        leftIcon: { color: "danger.fg", opacity: "0.85" },
        rightIcon: { color: "danger.fg", opacity: "0.85" },
      },
    },
    size: {
      sm: {
        root: { px: "4", py: "1.5", fontSize: "xs", gap: "1.5" },
        leftIcon: { w: "3", h: "3" },
        rightIcon: { w: "3", h: "3" },
        spinner: { w: "3", h: "3" },
      },
      md: {
        root: { px: "5", py: "2.5", fontSize: "sm", gap: "2" },
        leftIcon: { w: "4", h: "4" },
        rightIcon: { w: "4", h: "4" },
        spinner: { w: "4", h: "4" },
      },
      lg: {
        root: {
          px: "8",
          py: "3.5",
          fontSize: "md",
          gap: "2.5",
          fontWeight: "bold",
        },
        leftIcon: { w: "5", h: "5" },
        rightIcon: { w: "5", h: "5" },
        spinner: { w: "5", h: "5" },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? loading;
  const slots = buttonSlots({ variant, size });

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={slots.root + (className ? ` ${className}` : "")}
    >
      {loading ? (
        <span className={slots.spinner} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      ) : leftIcon ? (
        <span className={slots.leftIcon}>{leftIcon}</span>
      ) : null}

      <span className={slots.label}>{children}</span>

      {!loading && rightIcon ? (
        <span className={slots.rightIcon}>{rightIcon}</span>
      ) : null}
    </button>
  );
}

export default Button;
