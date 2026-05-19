import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import type { ApiResponse, AuthResponse } from "@fsd/api";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Missing or invalid token" },
      },
      { status: 401 },
    );
  }

  try {
    const authUser = verifyToken(authHeader.slice(7));
    const user = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "User not found" },
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<AuthResponse["user"]>>({
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
    });
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
      },
      { status: 401 },
    );
  }
}
