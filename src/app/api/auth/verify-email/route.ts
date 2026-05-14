import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/app/lib/email-verification";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = String(searchParams.get("token") ?? "").trim();

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        status: "invalid",
        message: "Missing verification token.",
      },
      { status: 400 }
    );
  }

  const result = await verifyEmailToken(token);

  return NextResponse.json({
    success: result.status === "verified" || result.status === "already-verified",
    status: result.status,
  });
}
