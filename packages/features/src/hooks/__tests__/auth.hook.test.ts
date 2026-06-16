import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../../stores/auth.store";
import { useAuth } from "../auth.hook";

const mockUser = {
  id: "user-1",
  username: "testuser",
  displayName: "Test User",
  avatarUrl: null,
};

const mockToken = "mock-jwt-token";

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  vi.restoreAllMocks();
});

describe("useAuth — 초기 상태", () => {
  it("토큰 없으면 isLoading false로 시작", async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("스토어에 이미 인증 상태면 isLoading false", async () => {
    useAuthStore.setState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
    localStorage.setItem("fsd_token", mockToken);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: mockUser })),
    );

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });
});

describe("useAuth — login", () => {
  it("성공 시 스토어에 유저/토큰 저장", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { user: mockUser, token: mockToken },
        }),
      ),
    );

    const { result } = renderHook(() => useAuth());
    let response: Awaited<ReturnType<typeof result.current.login>>;

    await act(async () => {
      response = await result.current.login("test@example.com", "password");
    });

    expect(response!.success).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("fsd_token")).toBe(mockToken);
  });

  it("실패 시 스토어 변경 없음", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
      ),
    );

    const { result } = renderHook(() => useAuth());
    let response: Awaited<ReturnType<typeof result.current.login>>;

    await act(async () => {
      response = await result.current.login("bad@example.com", "wrong");
    });

    expect(response!.success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("올바른 엔드포인트로 POST 요청", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ success: false, error: "err" })),
      );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("useAuth — register", () => {
  it("성공 시 스토어에 유저/토큰 저장", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { user: mockUser, token: mockToken },
        }),
      ),
    );

    const { result } = renderHook(() => useAuth());
    let response: Awaited<ReturnType<typeof result.current.register>>;

    await act(async () => {
      response = await result.current.register({
        email: "test@example.com",
        password: "password",
        username: "testuser",
        displayName: "Test User",
      });
    });

    expect(response!.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("fsd_token")).toBe(mockToken);
  });
});

describe("useAuth — logout", () => {
  it("localStorage와 스토어 모두 초기화", async () => {
    useAuthStore.setState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
    localStorage.setItem("fsd_token", mockToken);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: mockUser })),
    );

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem("fsd_token")).toBeNull();
  });
});
