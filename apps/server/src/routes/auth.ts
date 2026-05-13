import {
  Router,
  type Request,
  type Response,
  type Router as RouterType,
} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";
import type { ApiResponse, AuthResponse } from "@fsd/api";
import { AUTH_ROUTES } from "@fsd/api";

const router: RouterType = Router();

function makeToken(user: {
  id: string;
  email: string;
  username: string;
  displayName: string;
}): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    },
    secret,
    { expiresIn: "7d" },
  );
}

// POST /api/v1/auth/register
router.post(AUTH_ROUTES.register.path, async (req: Request, res: Response) => {
  const { email, username, displayName, password } = req.body as {
    email?: string;
    username?: string;
    displayName?: string;
    password?: string;
  };

  if (!email || !username || !displayName || !password) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "All fields are required" },
    });
    return;
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message:
            existing.email === email
              ? "Email already in use"
              : "Username already taken",
        },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, displayName, passwordHash },
    });

    const token = makeToken(user);
    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        token,
      },
      message: "Account created successfully",
    };
    res.status(201).json(response);
  } catch (err) {
    console.error("[Auth] Register error:", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "Registration failed" },
    });
  }
});

// POST /api/v1/auth/login
router.post(AUTH_ROUTES.login.path, async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Email and password are required",
      },
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !valid) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
      });
      return;
    }

    const token = makeToken(user);
    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        token,
      },
    };
    res.json(response);
  } catch (err) {
    console.error("[Auth] Login error:", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "Login failed" },
    });
  }
});

// GET /api/v1/auth/me
router.get(
  AUTH_ROUTES.me.path,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });
      if (!user) {
        res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "User not found" },
        });
        return;
      }

      const response: ApiResponse<AuthResponse["user"]> = {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
      res.json(response);
    } catch (err) {
      console.error("[Auth] Me error:", err);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        },
      });
    }
  },
);

export default router;
