/**
 * Merges class names conditionally.
 * Lightweight alternative to clsx/classnames for simple cases.
 */
export function cn(
  ...inputs: Array<string | undefined | null | false | 0>
): string {
  return inputs
    .filter((input): input is string => typeof input === "string" && input.length > 0)
    .join(" ")
    .trim();
}
