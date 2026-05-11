import { create } from "zustand";
import type { User } from "@fsd/api";

type AuthState = {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl"> | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null }),

  logout: () =>
    set({ user: null, isAuthenticated: false }),
}));
