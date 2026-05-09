export { cn } from "./cn";

/**
 * Type-safe object entries iterator
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Type-safe object keys
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Asserts a value is defined (not null or undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = "Value is not defined"
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Useful for testing and development delays.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formats an ISO timestamp string to a locale date string
 */
export function formatDate(iso: string, locale = "en-US"): string {
  return new Date(iso).toLocaleDateString(locale);
}

/**
 * Creates a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
