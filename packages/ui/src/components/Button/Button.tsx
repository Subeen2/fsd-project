import React from "react";
import { cn } from "@fsd/shared";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "rounded-full",
    "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white",
    "shadow-md shadow-indigo-500/30",
    "hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:brightness-110",
    "active:translate-y-0 active:shadow-md active:brightness-100",
    "focus:ring-indigo-500",
    "disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:shadow-none",
  ].join(" "),
  secondary: [
    "rounded-xl",
    "bg-white border-2 border-slate-200 text-slate-700",
    "shadow-sm",
    "hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 hover:shadow-md hover:-translate-y-0.5",
    "active:translate-y-0 active:bg-indigo-50 active:shadow-sm",
    "focus:ring-indigo-300",
    "disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 disabled:shadow-none",
  ].join(" "),
  ghost: [
    "rounded-lg",
    "bg-transparent text-slate-600",
    "hover:bg-slate-100 hover:text-slate-900",
    "active:bg-slate-200",
    "focus:ring-slate-400",
    "disabled:text-slate-300",
  ].join(" "),
  danger: [
    "rounded-xl",
    "bg-rose-500 text-white",
    "shadow-md shadow-rose-500/25",
    "hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/40 hover:-translate-y-0.5",
    "active:translate-y-0 active:bg-rose-700 active:shadow-md",
    "focus:ring-rose-500",
    "disabled:bg-rose-300 disabled:shadow-none",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs font-semibold tracking-wide gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold tracking-wide gap-2",
  lg: "px-8 py-3.5 text-base font-bold tracking-wide gap-2.5",
};

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

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center select-none",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
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

export default Button;
