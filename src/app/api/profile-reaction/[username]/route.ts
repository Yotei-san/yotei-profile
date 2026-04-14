import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

type RouteProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const sessionUser = await requireUser();
    const { username } = await params;

    const normalizedUsername = username.trim().toLowerCase();

    const body = await req.json().catch(() => null);
    const type = body?.type;

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { error: "Tipo de reação inválido." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: {
        id: true,
        status: true,
      },
    });

    if (!targetUser || targetUser.status === "banned") {
      return NextResponse.json(
        { error: "Perfil não encontrado." },
        { status: 404 }
      );
    }

    if (targetUser.id === sessionUser.id) {
      return NextResponse.json(
        { error: "Você não pode reagir ao próprio perfil." },
        { status: 403 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${sessionUser.id}),
            hashtext(${targetUser.id})
          )
        `;

        const existingReactions = await tx.reaction.findMany({
          where: {
            fromUserId: sessionUser.id,
            toUserId: targetUser.id,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            type: true,
          },
        });

        const existing = existingReactions[0] ?? null;

        if (existingReactions.length > 1) {
          await tx.reaction.deleteMany({
            where: {
              id: {
                in: existingReactions.slice(1).map((item) => item.id),
              },
            },
          });
        }

        if (!existing) {
          await tx.reaction.create({
            data: {
              fromUserId: sessionUser.id,
              toUserId: targetUser.id,
              type,
            },
          });
        } else if (existing.type === type) {
          await tx.reaction.delete({
            where: {
              id: existing.id,
            },
          });
        } else {
          await tx.reaction.update({
            where: {
              id: existing.id,
            },
            data: {
              type,
            },
          });
        }

        const grouped = await tx.reaction.groupBy({
          by: ["type"],
          where: {
            toUserId: targetUser.id,
          },
          _count: {
            type: true,
          },
        });

        const likes =
          grouped.find((item) => item.type === "like")?._count.type ?? 0;

        const dislikes =
          grouped.find((item) => item.type === "dislike")?._count.type ?? 0;

        const myReactionRow = await tx.reaction.findFirst({
          where: {
            fromUserId: sessionUser.id,
            toUserId: targetUser.id,
          },
          select: {
            type: true,
          },
        });

        const myReaction =
          myReactionRow?.type === "like" || myReactionRow?.type === "dislike"
            ? myReactionRow.type
            : null;

        return {
          likes,
          dislikes,
          myReaction,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return NextResponse.json({
      ok: true,
      likes: result.likes,
      dislikes: result.dislikes,
      myReaction: result.myReaction,
    });
  } catch (error) {
    console.error("profile reaction route error", error);

    return NextResponse.json(
      { error: "Erro ao reagir." },
      { status: 500 }
    );
  }
}