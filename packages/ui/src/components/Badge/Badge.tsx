import React from "react";
import { sva } from "../../../styled-system/css";

const badgeSlots = sva({
  slots: ["root", "dot"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1.5",
      borderRadius: "full",
      fontWeight: "medium",
    },
    dot: { borderRadius: "full" },
  },
  variants: {
    variant: {
      default: {
        root: { bg: "bg.muted", color: "text.subtle" },
        dot: { bg: "text.muted" },
      },
      success: {
        root: { bg: "success.subtle", color: "success.text" },
        dot: { bg: "success.default" },
      },
      warning: {
        root: { bg: "warning.subtle", color: "warning.text" },
        dot: { bg: "warning.default" },
      },
      danger: {
        root: { bg: "danger.subtle", color: "danger.text" },
        dot: { bg: "danger.default" },
      },
      info: {
        root: { bg: "info.subtle", color: "info.text" },
        dot: { bg: "info.default" },
      },
    },
    size: {
      sm: {
        root: { px: "2", py: "0.5", fontSize: "xs" },
        dot: { h: "1.5", w: "1.5" },
      },
      md: {
        root: { px: "2.5", py: "1", fontSize: "sm" },
        dot: { h: "2", w: "2" },
      },
    },
  },
  defaultVariants: { variant: "default", size: "sm" },
});

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  size = "sm",
  children,
  className,
  dot = false,
}: BadgeProps) {
  const slots = badgeSlots({ variant, size });

  return (
    <span className={slots.root + (className ? ` ${className}` : "")}>
      {dot && <span className={slots.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;
