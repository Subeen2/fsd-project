import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  displayName: string;
}

export function makeToken(user: AuthUser): string {
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

export function verifyToken(token: string): AuthUser {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET not configured");
  const payload = jwt.verify(token, secret) as JwtPayload;
  return {
    id: payload.userId,
    email: payload.email,
    username: payload.username,
    displayName: payload.displayName,
  };
}
