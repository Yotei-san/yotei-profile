import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

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
    console.error("profile media update error", error);
    return NextResponse.json({ error: "Falha ao salvar mídia." }, { status: 500 });
  }
}