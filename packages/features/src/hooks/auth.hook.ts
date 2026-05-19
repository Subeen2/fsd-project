"use client";

import { useEffect } from "react";
import type { ApiResponse, AuthResponse, RegisterPayload } from "@fsd/api";
import { AUTH_ROUTES } from "@fsd/api";
import { useAuthStore } from "../stores/auth.store";

const TOKEN_KEY = "fsd_token";
const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (store.isAuthenticated) return;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;

    void fetch(`${API_URL}${AUTH_ROUTES.me.path}`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((r) => r.json())
      .then((data: ApiResponse<AuthResponse["user"]>) => {
        if (data.success) {
          store.setUser(data.data, stored);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY));
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> => {
    const res = await fetch(`${API_URL}${AUTH_ROUTES.login.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as ApiResponse<AuthResponse>;
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      store.setUser(data.data.user, data.data.token);
    }
    return data;
  };

  const register = async (
    payload: RegisterPayload,
  ): Promise<ApiResponse<AuthResponse>> => {
    const res = await fetch(`${API_URL}${AUTH_ROUTES.register.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as ApiResponse<AuthResponse>;
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      store.setUser(data.data.user, data.data.token);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    store.logout();
  };

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    login,
    register,
    logout,
  };
}
