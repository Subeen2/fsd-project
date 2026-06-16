// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { makeToken, verifyToken } from "../auth";

const TEST_SECRET = "test-jwt-secret-for-vitest";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  username: "testuser",
  displayName: "Test User",
};

beforeAll(() => {
  process.env["JWT_SECRET"] = TEST_SECRET;
});

describe("makeToken", () => {
  it("JWT 문자열을 반환한다", () => {
    const token = makeToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("JWT_SECRET 없으면 에러를 던진다", () => {
    const original = process.env["JWT_SECRET"];
    delete process.env["JWT_SECRET"];
    expect(() => makeToken(mockUser)).toThrow("JWT_SECRET not configured");
    process.env["JWT_SECRET"] = original;
  });
});

describe("verifyToken", () => {
  it("유효한 토큰에서 유저 정보를 반환한다", () => {
    const token = makeToken(mockUser);
    const result = verifyToken(token);
    expect(result.id).toBe(mockUser.id);
    expect(result.email).toBe(mockUser.email);
    expect(result.username).toBe(mockUser.username);
    expect(result.displayName).toBe(mockUser.displayName);
  });

  it("변조된 토큰은 에러를 던진다", () => {
    const token = makeToken(mockUser);
    const tampered = token.slice(0, -5) + "XXXXX";
    expect(() => verifyToken(tampered)).toThrow();
  });

  it("잘못된 형식의 토큰은 에러를 던진다", () => {
    expect(() => verifyToken("not.a.jwt")).toThrow();
  });

  it("JWT_SECRET 없으면 에러를 던진다", () => {
    const token = makeToken(mockUser);
    const original = process.env["JWT_SECRET"];
    delete process.env["JWT_SECRET"];
    expect(() => verifyToken(token)).toThrow("JWT_SECRET not configured");
    process.env["JWT_SECRET"] = original;
  });

  it("makeToken → verifyToken 라운드트립", () => {
    const token = makeToken(mockUser);
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(mockUser);
  });
});
