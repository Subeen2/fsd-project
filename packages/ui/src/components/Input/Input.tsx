import React from "react";
import { sva, css } from "../../../styled-system/css";

const inputSlots = sva({
  slots: [
    "root",
    "label",
    "inputWrapper",
    "input",
    "leftIcon",
    "rightIcon",
    "hint",
    "error",
  ],
  base: {
    root: { display: "flex", flexDir: "column", gap: "1" },
    label: { fontSize: "sm", fontWeight: "medium", color: "gray.700" },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: {
      w: "full",
      borderRadius: "md",
      borderWidth: "1px",
      borderStyle: "solid",
      bg: "white",
      px: "3",
      py: "2",
      fontSize: "sm",
      color: "gray.900",
      _placeholder: { color: "gray.400" },
      _focusVisible: { outline: "2px solid", outlineOffset: "1px" },
      _disabled: { cursor: "not-allowed", bg: "gray.50", color: "gray.400" },
    },
    leftIcon: { position: "absolute", left: "3", color: "gray.400" },
    rightIcon: { position: "absolute", right: "3", color: "gray.400" },
    hint: { fontSize: "xs", color: "gray.400" },
    error: { fontSize: "xs", color: "red.500" },
  },
  variants: {
    hasError: {
      true: {
        input: {
          borderColor: "red.400",
          _focusVisible: { outlineColor: "red.400" },
        },
      },
      false: {
        input: {
          borderColor: "gray.300",
          _focusVisible: { outlineColor: "blue.500" },
        },
      },
    },
  },
  defaultVariants: { hasError: false },
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const slots = inputSlots({ hasError: !!error });

  return (
    <div className={slots.root}>
      {label && (
        <label htmlFor={inputId} className={slots.label}>
          {label}
        </label>
      )}
      <div className={slots.inputWrapper}>
        {leftIcon && <span className={slots.leftIcon}>{leftIcon}</span>}
        <input
          id={inputId}
          className={[
            slots.input,
            leftIcon && css({ pl: "9" }),
            rightIcon && css({ pr: "9" }),
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {rightIcon && <span className={slots.rightIcon}>{rightIcon}</span>}
      </div>
      {error && (
        <p id={`${inputId}-error`} className={slots.error}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className={slots.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default Input;
