"use client";

import React from "react";
import { sva } from "../../../styled-system/css";

const avatarSlots = sva({
  slots: ["root", "image", "icon"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "full",
      overflow: "hidden",
      bg: "bg.muted",
      color: "text.subtle",
      fontWeight: "medium",
      userSelect: "none",
    },
    image: {
      h: "full",
      w: "full",
      objectFit: "cover",
    },
    icon: {
      h: "[60%]",
      w: "[60%]",
      color: "text.muted",
    },
  },
  variants: {
    size: {
      xs: { root: { h: "6", w: "6", fontSize: "xs" } },
      sm: { root: { h: "8", w: "8", fontSize: "sm" } },
      md: { root: { h: "10", w: "10", fontSize: "md" } },
      lg: { root: { h: "12", w: "12", fontSize: "lg" } },
      xl: { root: { h: "16", w: "16", fontSize: "xl" } },
    },
  },
  defaultVariants: { size: "md" },
});

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(fallback: string): string {
  return fallback
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;
  const slots = avatarSlots({ size });

  return (
    <span className={slots.root + (className ? ` ${className}` : "")}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={slots.image}
          onError={() => setImgError(true)}
        />
      ) : fallback ? (
        <span aria-label={alt}>{getInitials(fallback)}</span>
      ) : (
        <svg
          className={slots.icon}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8c0 2.208-1.79 4-3.998 4-2.21 0-4-1.792-4-4s1.79-4 4-4c2.208 0 3.998 1.792 3.998 4z" />
        </svg>
      )}
    </span>
  );
}

export default Avatar;
