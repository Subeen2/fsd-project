import { describe, expect, it } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("filters out null, undefined, false, and 0", () => {
    expect(cn("foo", null, undefined, false, 0, "bar")).toBe("foo bar");
  });

  it("returns empty string when all inputs are falsy", () => {
    expect(cn(null, undefined, false, 0)).toBe("");
  });

  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles single class name", () => {
    expect(cn("foo")).toBe("foo");
  });
});
