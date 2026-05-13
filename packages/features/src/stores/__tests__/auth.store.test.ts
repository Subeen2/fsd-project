import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../auth.store";

const mockUser = {
  id: "user-1",
  username: "testuser",
  displayName: "Test User",
  avatarUrl: null,
} as const;

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("initializes with no user", () => {
    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it("sets user and marks as authenticated", () => {
    useAuthStore.getState().setUser(mockUser);

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toBe(true);
  });

  it("sets user with token", () => {
    useAuthStore.getState().setUser(mockUser, "test-token");

    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe("test-token");
    expect(isAuthenticated).toBe(true);
  });

  it("clears user and token on logout", () => {
    useAuthStore.getState().setUser(mockUser, "test-token");
    useAuthStore.getState().logout();

    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it("sets isAuthenticated to false when user is null", () => {
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
