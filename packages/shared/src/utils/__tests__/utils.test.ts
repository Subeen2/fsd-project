import { describe, expect, it, vi } from "vitest";
import {
  assertDefined,
  entries,
  formatDate,
  keys,
  sleep,
  slugify,
} from "../index";

describe("entries", () => {
  it("returns key-value pairs", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(entries(obj)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("returns empty array for empty object", () => {
    expect(entries({})).toEqual([]);
  });

  it("preserves value types", () => {
    const obj = { name: "Alice", age: 30 };
    const result = entries(obj);
    expect(result).toContainEqual(["name", "Alice"]);
    expect(result).toContainEqual(["age", 30]);
  });
});

describe("keys", () => {
  it("returns all keys of an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(keys(obj)).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for empty object", () => {
    expect(keys({})).toEqual([]);
  });
});

describe("assertDefined", () => {
  it("does not throw for a defined value", () => {
    expect(() => assertDefined("hello")).not.toThrow();
    expect(() => assertDefined(0)).not.toThrow();
    expect(() => assertDefined(false)).not.toThrow();
  });

  it("throws for null", () => {
    expect(() => assertDefined(null)).toThrow("Value is not defined");
  });

  it("throws for undefined", () => {
    expect(() => assertDefined(undefined)).toThrow("Value is not defined");
  });

  it("throws with custom message", () => {
    expect(() => assertDefined(null, "User not found")).toThrow(
      "User not found",
    );
  });
});

describe("sleep", () => {
  it("resolves after given milliseconds", async () => {
    vi.useFakeTimers();
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("does not resolve before time elapses", async () => {
    vi.useFakeTimers();
    let resolved = false;
    sleep(500).then(() => {
      resolved = true;
    });
    vi.advanceTimersByTime(499);
    await Promise.resolve();
    expect(resolved).toBe(false);
    vi.useRealTimers();
  });
});

describe("formatDate", () => {
  it("formats ISO string to en-US locale by default", () => {
    expect(formatDate("2024-01-15T00:00:00.000Z")).toMatch(/1\/1[45]\/2024/);
  });

  it("formats with ko-KR locale", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z", "ko-KR");
    expect(result).toMatch(/2024/);
  });

  it("returns a non-empty string", () => {
    expect(formatDate("2023-06-01T12:00:00.000Z")).toBeTruthy();
  });
});

describe("slugify", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("lowercases the text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("foo  --  bar")).toBe("foo-bar");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("handles Korean text by removing non-word characters", () => {
    expect(slugify("안녕 world")).toBe("world");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});
