import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { makeToken } from "@/lib/auth";
import type { ApiResponse, AuthResponse } from "@fsd/api";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    email?: string;
    username?: string;
    displayName?: string;
    password?: string;
  };
  const { email, username, displayName, password } = body;

  if (!email || !username || !displayName || !password) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "All fields are required" },
      },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "CONFLICT",
            message:
              existing.email === email
                ? "Email already in use"
                : "Username already taken",
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, displayName, passwordHash },
    });

    const token = makeToken(user);
    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
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
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Registration failed",
        },
      },
      { status: 500 },
    );
  }
}
