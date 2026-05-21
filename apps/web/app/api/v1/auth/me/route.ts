import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json<ApiResponse<AuthResponse["user"]>>({
      success: true,
      data: {
        id: authUser.id,
        email: authUser.email,
        username: authUser.username,
        displayName: authUser.displayName,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
