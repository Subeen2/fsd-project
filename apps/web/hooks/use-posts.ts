"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, CreatePostPayload, ApiResponse } from "@fsd/api";
import { POST_ROUTES } from "@fsd/api";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}${POST_ROUTES.list.path}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const json = (await res.json()) as ApiResponse<Post[]>;
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

async function createPost(payload: CreatePostPayload): Promise<Post> {
  const res = await fetch(`${API_URL}${POST_ROUTES.create.path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create post");
  const json = (await res.json()) as ApiResponse<Post>;
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => ["posts", id] as const,
};

export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: fetchPosts,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
