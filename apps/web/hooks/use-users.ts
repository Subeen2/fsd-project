"use client";

import { useQuery } from "@tanstack/react-query";
import type { User, ApiResponse } from "@fsd/api";
import { USER_ROUTES } from "@fsd/api";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}${USER_ROUTES.list.path}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  const json = (await res.json()) as ApiResponse<User[]>;
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${API_URL}${USER_ROUTES.getById.path.replace(":id", id)}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  const json = (await res.json()) as ApiResponse<User>;
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
  });
}
