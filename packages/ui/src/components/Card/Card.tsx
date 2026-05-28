import React from "react";
import { cva, css } from "../../../styled-system/css";

const cardVariants = cva({
  base: {
    borderRadius: "lg",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.default",
    bg: "bg.default",
  },
  variants: {
    padding: {
      none: {},
      sm: { p: "3" },
      md: { p: "5" },
      lg: { p: "7" },
    },
    shadow: {
      none: {},
      sm: { shadow: "sm" },
      md: { shadow: "md" },
    },
    interactive: {
      true: {
        cursor: "pointer",
        transition: "box-shadow 0.15s ease-out",
        _hover: { shadow: "md" },
      },
      false: {},
    },
  },
  defaultVariants: { padding: "md", shadow: "sm", interactive: false },
});

const headerCss = css({
  mb: "4",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderColor: "border.subtle",
  pb: "3",
});

const footerCss = css({
  mt: "4",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderColor: "border.subtle",
  pt: "3",
});

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({
  children,
  className,
  padding = "md",
  shadow = "sm",
  onClick,
}: CardProps) {
  const interactive = !!onClick;
  return (
    <div
      className={
        cardVariants({ padding, shadow, interactive }) +
        (className ? ` ${className}` : "")
      }
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={headerCss + (className ? ` ${className}` : "")}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={footerCss + (className ? ` ${className}` : "")}>
      {children}
    </div>
  );
}

export default Card;
