import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../Avatar";

describe("Avatar", () => {
  it("renders image when src is provided", () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="Alice" />);
    expect(screen.getByRole("img", { name: "Alice" })).toBeInTheDocument();
  });

  it("shows initials when no src is provided", () => {
    render(<Avatar fallback="Alice Kim" />);
    expect(screen.getByText("AK")).toBeInTheDocument();
  });

  it("shows only first two initials for long names", () => {
    render(<Avatar fallback="Alice Bob Charlie" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("shows fallback initials when image fails to load", () => {
    render(<Avatar src="bad-url.jpg" alt="Alice" fallback="Alice Kim" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("AK")).toBeInTheDocument();
  });

  it("renders default icon when no src and no fallback", () => {
    render(<Avatar />);
    // SVG icon is aria-hidden
    expect(
      document.querySelector("svg[aria-hidden='true']"),
    ).toBeInTheDocument();
  });

  it("renders all sizes without error", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    sizes.forEach((size) => {
      // "Alice Baker" → initials "AB" (split by space, take first char of each word)
      const { unmount } = render(<Avatar fallback="Alice Baker" size={size} />);
      expect(screen.getByText("AB")).toBeInTheDocument();
      unmount();
    });
  });
});
