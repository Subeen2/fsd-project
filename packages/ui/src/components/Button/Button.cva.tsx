import React from "react";
import { cva, type RecipeVariantProps } from "../../../styled-system/css";

const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "semibold",
    letterSpacing: "wide",
    transition: "all 0.2s ease-out",
    userSelect: "none",
    outline: "none",
    _focusVisible: {
      outline: "2px solid",
      outlineOffset: "2px",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: "0.6",
      pointerEvents: "none",
    },
  },
  variants: {
    variant: {
      primary: {
        borderRadius: "full",
        bgGradient: "to-r",
        gradientFrom: "indigo.500",
        gradientVia: "violet.500",
        gradientTo: "purple.600",
        color: "white",
        shadow: "md",
        _hover: {
          shadow: "xl",
          filter: "brightness(1.1)",
          translateY: "-1",
        },
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
      secondary: {
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
      ghost: {
        borderRadius: "lg",
        bg: "transparent",
        color: "slate.600",
        _hover: { bg: "slate.100", color: "slate.900" },
        _active: { bg: "slate.200" },
        _focusVisible: { outlineColor: "slate.400" },
        _disabled: { color: "slate.300" },
      },
      danger: {
        borderRadius: "xl",
        bg: "rose.500",
        color: "white",
        shadow: "md",
        _hover: { bg: "rose.600", shadow: "xl", translateY: "-1" },
        _active: { translateY: "0", bg: "rose.700", shadow: "md" },
        _focusVisible: { outlineColor: "rose.500" },
        _disabled: { bg: "rose.300", shadow: "none" },
      },
    },
    size: {
      sm: { px: "4", py: "1.5", fontSize: "xs", gap: "1.5" },
      md: { px: "5", py: "2.5", fontSize: "sm", gap: "2" },
      lg: {
        px: "8",
        py: "3.5",
        fontSize: "md",
        gap: "2.5",
        fontWeight: "bold",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonCvaVariants = RecipeVariantProps<typeof buttonRecipe>;

export type ButtonCvaProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonCvaVariants & {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export function ButtonCva({
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonCvaProps) {
  const isDisabled = disabled ?? loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={
        buttonRecipe({ variant, size }) + (className ? ` ${className}` : "")
      }
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
