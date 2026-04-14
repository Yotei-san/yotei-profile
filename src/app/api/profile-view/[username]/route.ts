import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function POST(_req: Request, { params }: RouteProps) {
  try {
    const { username } = await params;

    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername) {
      return NextResponse.json(
        { error: "Username inválido." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: {
        id: true,
        status: true,
        _count: {
          select: {
            profileViews: true,
          },
        },
      },
    });

    if (!user || user.status === "banned") {
      return NextResponse.json(
        { error: "Perfil não encontrado." },
        { status: 404 }
      );
    }

    await prisma.profileView.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      views: user._count.profileViews + 1,
    });
  } catch (error) {
    console.error("profile view route error", error);

    return NextResponse.json(
      { error: "Falha ao registrar view." },
      { status: 500 }
    );
  }
}