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

type ReactionType = "like" | "dislike";

type ReactionCountGroup = {
  type: ReactionType;
  _count: {
    type: number;
  };
};

type ReactionSnapshot = {
  currentReaction: ReactionType | null;
  likes: number;
  dislikes: number;
};

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

function logReactionDebug(step: string, payload: Record<string, unknown>) {
  if (!IS_DEVELOPMENT) {
    return;
  }

  console.info(
    `[profile-reaction] ${JSON.stringify({
      step,
      ...payload,
    })}`,
  );
}

function logReactionDebugError(step: string, payload: Record<string, unknown>) {
  if (!IS_DEVELOPMENT) {
    return;
  }

  console.error(
    `[profile-reaction:error] ${JSON.stringify({
      step,
      ...payload,
    })}`,
  );
}

function getErrorStack(error: unknown) {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

function isRecoverableReactionConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

function buildReactionCounts(grouped: ReactionCountGroup[]) {
  return {
    likes: grouped.find((item) => item.type === "like")?._count.type ?? 0,
    dislikes: grouped.find((item) => item.type === "dislike")?._count.type ?? 0,
  };
}

async function readReactionSnapshot(
  currentUserId: string,
  targetUserId: string,
): Promise<ReactionSnapshot> {
  const [grouped, currentReactionRow] = await Promise.all([
    prisma.reaction.groupBy({
      by: ["type"],
      where: {
        toUserId: targetUserId,
      },
      _count: {
        type: true,
      },
    }),
    prisma.reaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: currentUserId,
          toUserId: targetUserId,
        },
      },
      select: {
        type: true,
      },
    }),
  ]);

  return {
    currentReaction:
      currentReactionRow?.type === "like" || currentReactionRow?.type === "dislike"
        ? currentReactionRow.type
        : null,
    ...buildReactionCounts(grouped),
  };
}

export async function POST(req: Request, { params }: RouteProps) {
  let transactionStep = "request:start";
  let currentUserId: string | null = null;
  let targetUserId: string | null = null;
  let reactionType: ReactionType | null = null;
  let normalizedUsername = "";

  try {
    const sessionUser = await getCurrentUser();
    const { username } = await params;
    normalizedUsername = username.trim().toLowerCase();
    currentUserId = sessionUser?.id ?? null;

    logReactionDebug("request:received", {
      username: normalizedUsername,
      currentUserId,
    });

    if (!sessionUser) {
      return NextResponse.json(
        { ok: false, error: "LOGIN_REQUIRED" },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => null);
    const type = body?.type;

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { ok: false, error: "INVALID_REACTION_TYPE" },
        { status: 400 },
      );
    }

    reactionType = type;

    transactionStep = "target:lookup";
    const targetUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: {
        id: true,
        status: true,
      },
    });

    targetUserId = targetUser?.id ?? null;

    logReactionDebug("target:loaded", {
      username: normalizedUsername,
      currentUserId,
      targetProfileId: targetUserId,
      reactionType,
      targetStatus: targetUser?.status ?? null,
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

    try {
      const result = await prisma.$transaction(async (tx) => {
        transactionStep = "transaction:load-existing";
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

        logReactionDebug("transaction:existing-reaction", {
          username: normalizedUsername,
          currentUserId,
          targetProfileId: targetUser.id,
          reactionType,
          existingReaction,
          transactionStep,
        });

        transactionStep = "transaction:apply-mutation";

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

        transactionStep = "transaction:load-final-counts";
        const grouped = await tx.reaction.groupBy({
          by: ["type"],
          where: {
            toUserId: targetUser.id,
          },
          _count: {
            type: true,
          },
        });

        transactionStep = "transaction:load-current-reaction";
        const currentReactionRow = await tx.reaction.findUnique({
          where: {
            fromUserId_toUserId: {
              fromUserId: sessionUser.id,
              toUserId: targetUser.id,
            },
          },
          select: {
            type: true,
          },
        });

        const snapshot: ReactionSnapshot = {
          currentReaction:
            currentReactionRow?.type === "like" || currentReactionRow?.type === "dislike"
              ? currentReactionRow.type
              : null,
          ...buildReactionCounts(grouped),
        };

        logReactionDebug("transaction:completed", {
          username: normalizedUsername,
          currentUserId,
          targetProfileId: targetUser.id,
          reactionType,
          existingReaction,
          transactionStep,
          finalCounts: {
            likes: snapshot.likes,
            dislikes: snapshot.dislikes,
          },
          currentReaction: snapshot.currentReaction,
        });

        return snapshot;
      });

      return NextResponse.json({
        ok: true,
        currentReaction: result.currentReaction,
        likes: result.likes,
        dislikes: result.dislikes,
      });
    } catch (error) {
      if (isRecoverableReactionConflict(error)) {
        logReactionDebugError("transaction:recoverable-conflict", {
          username: normalizedUsername,
          currentUserId,
          targetProfileId: targetUser.id,
          reactionType,
          transactionStep,
          errorStack: getErrorStack(error),
        });

        const snapshot = await readReactionSnapshot(sessionUser.id, targetUser.id);

        logReactionDebug("transaction:recovered-snapshot", {
          username: normalizedUsername,
          currentUserId,
          targetProfileId: targetUser.id,
          reactionType,
          transactionStep,
          finalCounts: {
            likes: snapshot.likes,
            dislikes: snapshot.dislikes,
          },
          currentReaction: snapshot.currentReaction,
        });

        return NextResponse.json({
          ok: true,
          currentReaction: snapshot.currentReaction,
          likes: snapshot.likes,
          dislikes: snapshot.dislikes,
        });
      }

      throw error;
    }
  } catch (error) {
    logReactionDebugError("request:failed", {
      username: normalizedUsername,
      currentUserId,
      targetProfileId: targetUserId,
      reactionType,
      transactionStep,
      errorStack: getErrorStack(error),
    });
    logServerError("profile.reaction-route", error);

    return NextResponse.json(
      { ok: false, error: "REACTION_FAILED" },
      { status: 500 },
    );
  }
}
