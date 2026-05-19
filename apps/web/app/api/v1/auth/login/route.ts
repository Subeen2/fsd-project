import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { makeToken } from "@/lib/auth";
import type { ApiResponse, AuthResponse } from "@fsd/api";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string; password?: string };
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
      },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !valid) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
        },
        { status: 401 },
      );
    }

    const token = makeToken(user);
    return NextResponse.json<ApiResponse<AuthResponse>>({
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
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: "INTERNAL_SERVER_ERROR", message: "Login failed" },
      },
      { status: 500 },
    );
  }
}
