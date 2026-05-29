import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sua sessao expirou. Entre novamente para salvar a midia." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    const avatarUrl =
      typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : undefined;
    const bannerUrl =
      typeof body.bannerUrl === "string" ? body.bannerUrl.trim() : undefined;

    if (avatarUrl === undefined && bannerUrl === undefined) {
      return NextResponse.json(
        { error: "Nenhuma alteracao de media foi enviada." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(avatarUrl !== undefined ? { avatarUrl: avatarUrl || null } : {}),
        ...(bannerUrl !== undefined ? { bannerUrl: bannerUrl || null } : {}),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath(`/${user.username}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("profile.media-route", error);
    return NextResponse.json(
      { error: "Unable to save profile media right now." },
      { status: 500 }
    );
  }
}
