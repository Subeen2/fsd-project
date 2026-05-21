import { create } from "zustand";
import type { User } from "@fsd/api";

type StoredUser = Pick<User, "id" | "username" | "displayName" | "avatarUrl">;

type AuthState = {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState["user"], token?: string) => void;
  logout: () => void;
};

const TOKEN_KEY = "fsd_token";
const USER_KEY = "fsd_user";

function readStorage(): { user: StoredUser | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user: StoredUser | null = raw
      ? (JSON.parse(raw) as StoredUser)
      : null;
    return token && user ? { user, token } : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

const saved = readStorage();

export { TOKEN_KEY, USER_KEY };

export const useAuthStore = create<AuthState>((set) => ({
  user: saved.user,
  token: saved.token,
  isAuthenticated: saved.user !== null,

  setUser: (user, token) => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, token: token ?? null, isAuthenticated: user !== null });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
