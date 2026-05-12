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
          gradientFrom: "indigo.500",
          gradientVia: "violet.500",
          gradientTo: "purple.600",
          color: "white",
          shadow: "md",
          _hover: { shadow: "xl", filter: "brightness(1.1)", translateY: "-1" },
          _active: { translateY: "0", shadow: "md" },
          _focusVisible: { outlineColor: "indigo.500" },
          _disabled: {
            bgGradient: "to-r",
            gradientFrom: "slate.300",
            gradientVia: "slate.300",
            gradientTo: "slate.300",
            shadow: "none",
          },
        },
        spinner: { color: "white" },
        leftIcon: { color: "white", opacity: "0.85" },
        rightIcon: { color: "white", opacity: "0.85" },
      },
      secondary: {
        root: {
          borderRadius: "xl",
          bg: "white",
          borderWidth: "2px",
          borderColor: "slate.200",
          color: "slate.700",
          shadow: "sm",
          _hover: {
            borderColor: "indigo.200",
            bg: "indigo.50",
            color: "indigo.700",
            shadow: "md",
            translateY: "-1",
          },
          _active: { translateY: "0", shadow: "sm" },
          _focusVisible: { outlineColor: "indigo.300" },
          _disabled: {
            bg: "slate.50",
            color: "slate.300",
            borderColor: "slate.100",
            shadow: "none",
          },
        },
        spinner: { color: "indigo.400" },
        leftIcon: { color: "slate.500" },
        rightIcon: { color: "slate.500" },
      },
      ghost: {
        root: {
          borderRadius: "lg",
          bg: "transparent",
          color: "slate.600",
          _hover: { bg: "slate.100", color: "slate.900" },
          _active: { bg: "slate.200" },
          _focusVisible: { outlineColor: "slate.400" },
          _disabled: { color: "slate.300" },
        },
        spinner: { color: "slate.400" },
        leftIcon: { color: "slate.400" },
        rightIcon: { color: "slate.400" },
      },
      danger: {
        root: {
          borderRadius: "xl",
          bg: "rose.500",
          color: "white",
          shadow: "md",
          _hover: { bg: "rose.600", shadow: "xl", translateY: "-1" },
          _active: { translateY: "0", bg: "rose.700", shadow: "md" },
          _focusVisible: { outlineColor: "rose.500" },
          _disabled: { bg: "rose.300", shadow: "none" },
        },
        spinner: { color: "white" },
        leftIcon: { color: "white", opacity: "0.85" },
        rightIcon: { color: "white", opacity: "0.85" },
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

export type ButtonSvaVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSvaSize = "sm" | "md" | "lg";

export interface ButtonSvaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonSvaVariant;
  size?: ButtonSvaSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ButtonSva({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonSvaProps) {
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
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
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
