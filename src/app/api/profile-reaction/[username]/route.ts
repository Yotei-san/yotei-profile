import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const ALLOWED_TYPES = new Set(["like", "dislike"]);

export async function GET(_: Request, { params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      reactions: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  const likes = user.reactions.find((item) => item.type === "like")?.count ?? 0;
  const dislikes = user.reactions.find((item) => item.type === "dislike")?.count ?? 0;

  return NextResponse.json({
    likes,
    dislikes,
    score: likes - dislikes,
  });
}

export async function POST(request: Request, { params }: Props) {
  const { username } = await params;
  const body = await request.json();
  const type = String(body?.type ?? "");

  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: "Reação inválida." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  await prisma.reaction.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId: user.id,
      type,
      count: 1,
    },
  });

  const reactions = await prisma.reaction.findMany({
    where: { userId: user.id },
  });

  const likes = reactions.find((item) => item.type === "like")?.count ?? 0;
  const dislikes = reactions.find((item) => item.type === "dislike")?.count ?? 0;

  return NextResponse.json({
    likes,
    dislikes,
    score: likes - dislikes,
  });
}