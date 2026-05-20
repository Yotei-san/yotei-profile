import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const avatarUrl =
      typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : undefined;
    const bannerUrl =
      typeof body.bannerUrl === "string" ? body.bannerUrl.trim() : undefined;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(avatarUrl !== undefined ? { avatarUrl: avatarUrl || null } : {}),
        ...(bannerUrl !== undefined ? { bannerUrl: bannerUrl || null } : {}),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("profile.media-route", error);
    return NextResponse.json(
      { error: "Unable to save profile media right now." },
      { status: 500 }
    );
  }
}
