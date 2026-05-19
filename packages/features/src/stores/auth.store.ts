import { create } from "zustand";
import type { User } from "@fsd/api";

type AuthState = {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl"> | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState["user"], token?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) =>
    set({ user, token: token ?? null, isAuthenticated: user !== null }),

  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
