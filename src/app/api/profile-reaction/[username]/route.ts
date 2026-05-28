import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type RouteProps = {
  params: Promise<{
    username: string;
  }>;
};

type ReactionCountGroup = {
  type: "like" | "dislike";
  _count: {
    type: number;
  };
};

async function runReactionTransaction<T>(callback: () => Promise<T>, attempts = 2): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    const isRetryableConflict =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";

    if (attempts > 0 && isRetryableConflict) {
      return runReactionTransaction(callback, attempts - 1);
    }

    throw error;
  }
}

function buildReactionCounts(grouped: ReactionCountGroup[]) {
  return {
    likes: grouped.find((item) => item.type === "like")?._count.type ?? 0,
    dislikes: grouped.find((item) => item.type === "dislike")?._count.type ?? 0,
  };
}

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const sessionUser = await getCurrentUser();
    const { username } = await params;

    if (!sessionUser) {
      return NextResponse.json(
        { ok: false, error: "LOGIN_REQUIRED" },
        { status: 401 },
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const body = await req.json().catch(() => null);
    const type = body?.type;

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { ok: false, error: "INVALID_REACTION_TYPE" },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: {
        id: true,
        status: true,
      },
    });

    if (!targetUser || targetUser.status !== "active") {
      return NextResponse.json(
        { ok: false, error: "PROFILE_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (targetUser.id === sessionUser.id) {
      return NextResponse.json(
        { ok: false, error: "SELF_REACTION_FORBIDDEN" },
        { status: 403 },
      );
    }

    const result = await runReactionTransaction(() =>
      prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`
            SELECT pg_advisory_xact_lock(
              hashtext(${sessionUser.id}),
              hashtext(${targetUser.id})
            )
          `;

          const existingReaction = await tx.reaction.findUnique({
            where: {
              fromUserId_toUserId: {
                fromUserId: sessionUser.id,
                toUserId: targetUser.id,
              },
            },
            select: {
              id: true,
              type: true,
            },
          });

          if (!existingReaction) {
            await tx.reaction.create({
              data: {
                fromUserId: sessionUser.id,
                toUserId: targetUser.id,
                type,
              },
            });
          } else if (existingReaction.type === type) {
            await tx.reaction.delete({
              where: {
                id: existingReaction.id,
              },
            });
          } else {
            await tx.reaction.update({
              where: {
                id: existingReaction.id,
              },
              data: {
                type,
              },
            });
          }

          const [grouped, currentReactionRow] = await Promise.all([
            tx.reaction.groupBy({
              by: ["type"],
              where: {
                toUserId: targetUser.id,
              },
              _count: {
                type: true,
              },
            }),
            tx.reaction.findUnique({
              where: {
                fromUserId_toUserId: {
                  fromUserId: sessionUser.id,
                  toUserId: targetUser.id,
                },
              },
              select: {
                type: true,
              },
            }),
          ]);

          const currentReaction =
            currentReactionRow?.type === "like" || currentReactionRow?.type === "dislike"
              ? currentReactionRow.type
              : null;
          const { likes, dislikes } = buildReactionCounts(grouped);

          return {
            currentReaction,
            likes,
            dislikes,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );

    return NextResponse.json({
      ok: true,
      currentReaction: result.currentReaction,
      likes: result.likes,
      dislikes: result.dislikes,
    });
  } catch (error) {
    logServerError("profile.reaction-route", error);

    return NextResponse.json(
      { ok: false, error: "REACTION_FAILED" },
      { status: 500 },
    );
  }
}
