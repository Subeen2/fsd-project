/**
 * REST API route contracts.
 * Defines path patterns and HTTP methods as const objects for type-safe usage
 * across both client and server.
 */

export const API_BASE = "/api/v1" as const;

// ─── User routes ──────────────────────────────────────────────────────────────

export const USER_ROUTES = {
  list: { method: "GET", path: `${API_BASE}/users` },
  getById: { method: "GET", path: `${API_BASE}/users/:id` },
  create: { method: "POST", path: `${API_BASE}/users` },
  update: { method: "PATCH", path: `${API_BASE}/users/:id` },
  delete: { method: "DELETE", path: `${API_BASE}/users/:id` },
} as const;

// ─── Post routes ──────────────────────────────────────────────────────────────

export const POST_ROUTES = {
  list: { method: "GET", path: `${API_BASE}/posts` },
  getById: { method: "GET", path: `${API_BASE}/posts/:id` },
  create: { method: "POST", path: `${API_BASE}/posts` },
  update: { method: "PATCH", path: `${API_BASE}/posts/:id` },
  delete: { method: "DELETE", path: `${API_BASE}/posts/:id` },
} as const;

// ─── Auth routes ──────────────────────────────────────────────────────────────

export const AUTH_ROUTES = {
  register: { method: "POST", path: `${API_BASE}/auth/register` },
  login: { method: "POST", path: `${API_BASE}/auth/login` },
  logout: { method: "POST", path: `${API_BASE}/auth/logout` },
  refresh: { method: "POST", path: `${API_BASE}/auth/refresh` },
  me: { method: "GET", path: `${API_BASE}/auth/me` },
} as const;
