import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = [
      "default",
      "success",
      "warning",
      "danger",
      "info",
    ] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders dot when dot prop is true", () => {
    render(<Badge dot>Active</Badge>);
    // dot is aria-hidden so use querySelector
    const dot = document.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("does not render dot by default", () => {
    render(<Badge>Active</Badge>);
    expect(document.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Label</Badge>);
    expect(screen.getByText("Label").className).toContain("custom-class");
  });
});
