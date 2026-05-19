import {
  Router,
  type Request,
  type Response,
  type Router as RouterType,
} from "express";
import type { ApiResponse, User, Post } from "@fsd/api";
import { API_BASE } from "@fsd/api";
import authRouter from "./auth";

const router: RouterType = Router();

router.use(authRouter);

// ─── Health check ─────────────────────────────────────────────────────────────

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Users ────────────────────────────────────────────────────────────────────

// GET /api/v1/users
router.get(`${API_BASE}/users`, (_req: Request, res: Response) => {
  const users: User[] = [
    {
      id: "user_01",
      email: "jane@example.com",
      username: "janedoe",
      displayName: "Jane Doe",
      avatarUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  const response: ApiResponse<User[]> = { success: true, data: users };
  res.json(response);
});

// GET /api/v1/users/:id
router.get(`${API_BASE}/users/:id`, (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user: User = {
    id,
    email: "jane@example.com",
    username: "janedoe",
    displayName: "Jane Doe",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const response: ApiResponse<User> = { success: true, data: user };
  res.json(response);
});

// ─── Posts ────────────────────────────────────────────────────────────────────

// GET /api/v1/posts
router.get(`${API_BASE}/posts`, (_req: Request, res: Response) => {
  const posts: Post[] = [
    {
      id: "post_01",
      title: "Hello World",
      content: "This is a sample post from the Express server.",
      authorId: "user_01",
      author: {
        id: "user_01",
        username: "janedoe",
        displayName: "Jane Doe",
        avatarUrl: null,
      },
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  const response: ApiResponse<Post[]> = { success: true, data: posts };
  res.json(response);
});

// GET /api/v1/posts/:id
router.get(`${API_BASE}/posts/:id`, (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const post: Post = {
    id,
    title: "Hello World",
    content: "This is a sample post from the Express server.",
    authorId: "user_01",
    author: {
      id: "user_01",
      username: "janedoe",
      displayName: "Jane Doe",
      avatarUrl: null,
    },
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const response: ApiResponse<Post> = { success: true, data: post };
  res.json(response);
});

// POST /api/v1/posts
router.post(`${API_BASE}/posts`, (req: Request, res: Response) => {
  const body = req.body as { title?: string; content?: string };
  if (!body.title || !body.content) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "title and content are required",
      },
    };
    res.status(400).json(response);
    return;
  }
  const post: Post = {
    id: `post_${Date.now()}`,
    title: body.title,
    content: body.content,
    authorId: "user_01",
    author: {
      id: "user_01",
      username: "janedoe",
      displayName: "Jane Doe",
      avatarUrl: null,
    },
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const response: ApiResponse<Post> = {
    success: true,
    data: post,
    message: "Post created successfully",
  };
  res.status(201).json(response);
});

export default router;
