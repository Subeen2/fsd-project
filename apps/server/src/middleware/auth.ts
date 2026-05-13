import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  displayName: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing or invalid token" },
    });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "JWT secret not configured",
      },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
      displayName: payload.displayName,
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}
