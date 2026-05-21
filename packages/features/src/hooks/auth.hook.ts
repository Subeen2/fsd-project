"use client";

import { useEffect, useState } from "react";
import type { ApiResponse, AuthResponse, RegisterPayload } from "@fsd/api";
import { AUTH_ROUTES } from "@fsd/api";
import { TOKEN_KEY, useAuthStore } from "../stores/auth.store";

const API_URL = "";

export function useAuth() {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(!store.isAuthenticated);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);

    if (!stored) {
      setIsLoading(false);
      return;
    }

    if (store.isAuthenticated) {
      // 캐시된 인증 상태로 즉시 렌더 — 백그라운드에서 토큰 유효성 검증
      void fetch(`${API_URL}${AUTH_ROUTES.me.path}`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => r.json())
        .then((data: ApiResponse<AuthResponse["user"]>) => {
          if (!data.success) {
            localStorage.removeItem(TOKEN_KEY);
            store.logout();
          }
        })
        .catch(() => {
          /* 네트워크 오류는 무시 — 오프라인 상황 허용 */
        });
      return;
    }

    // 스토어에 캐시가 없는 경우 (첫 방문 등) — 서버에서 복원
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
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
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
    isLoading,
    login,
    register,
    logout,
  };
}
