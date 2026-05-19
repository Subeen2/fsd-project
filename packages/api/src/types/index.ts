import type {
  ID,
  Timestamp,
  PaginationParams,
  PaginatedResult,
} from "@fsd/shared";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: ID;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface UpdateUserPayload {
  displayName?: string;
  avatarUrl?: string | null;
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: ID;
  title: string;
  content: string;
  authorId: ID;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  published?: boolean;
}

// ─── Pagination re-export ─────────────────────────────────────────────────────

export type { PaginationParams, PaginatedResult };

// ─── API Response envelope ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatUser {
  id: ID;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ChatMessage {
  id: ID;
  content: string;
  author: ChatUser;
  createdAt: Timestamp;
}

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export type WsEventType =
  | "connection:established"
  | "connection:closed"
  | "post:created"
  | "post:updated"
  | "post:deleted"
  | "user:joined"
  | "user:left"
  | "ping"
  | "pong"
  | "chat:join"
  | "chat:send"
  | "chat:history"
  | "chat:message"
  | "chat:user_list"
  | "chat:user_joined"
  | "chat:user_left";

export interface WsBaseEvent<T extends WsEventType, P = undefined> {
  type: T;
  timestamp: Timestamp;
  payload: P;
}

export type WsConnectionEstablishedEvent = WsBaseEvent<
  "connection:established",
  { sessionId: string }
>;

export type WsPostCreatedEvent = WsBaseEvent<"post:created", { post: Post }>;
export type WsPostUpdatedEvent = WsBaseEvent<"post:updated", { post: Post }>;
export type WsPostDeletedEvent = WsBaseEvent<"post:deleted", { postId: ID }>;
export type WsUserJoinedEvent = WsBaseEvent<
  "user:joined",
  { user: Pick<User, "id" | "username"> }
>;
export type WsUserLeftEvent = WsBaseEvent<"user:left", { userId: ID }>;
export type WsPingEvent = WsBaseEvent<"ping", undefined>;
export type WsPongEvent = WsBaseEvent<"pong", undefined>;

// Client → Server
export type WsChatJoinEvent = WsBaseEvent<"chat:join", { token: string }>;
export type WsChatSendEvent = WsBaseEvent<"chat:send", { content: string }>;

// Server → Client
export type WsChatHistoryEvent = WsBaseEvent<
  "chat:history",
  { messages: ChatMessage[] }
>;
export type WsChatMessageEvent = WsBaseEvent<
  "chat:message",
  { message: ChatMessage }
>;
export type WsChatUserListEvent = WsBaseEvent<
  "chat:user_list",
  { users: ChatUser[] }
>;
export type WsChatUserJoinedEvent = WsBaseEvent<
  "chat:user_joined",
  { user: ChatUser }
>;
export type WsChatUserLeftEvent = WsBaseEvent<"chat:user_left", { userId: ID }>;

export type WsEvent =
  | WsConnectionEstablishedEvent
  | WsPostCreatedEvent
  | WsPostUpdatedEvent
  | WsPostDeletedEvent
  | WsUserJoinedEvent
  | WsUserLeftEvent
  | WsPingEvent
  | WsPongEvent
  | WsChatJoinEvent
  | WsChatSendEvent
  | WsChatHistoryEvent
  | WsChatMessageEvent
  | WsChatUserListEvent
  | WsChatUserJoinedEvent
  | WsChatUserLeftEvent;
