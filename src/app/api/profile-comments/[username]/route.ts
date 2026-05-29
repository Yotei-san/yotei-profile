import { NextResponse } from "next/server";
import { syncUserAura } from "@/app/lib/aura-server";
import { getCurrentUser } from "@/app/lib/auth";
import {
  PROFILE_COMMENT_RATE_LIMIT_MS,
  normalizeProfileCommentSort,
  resolveProfileCommentAuthorName,
  sanitizeProfileCommentBody,
} from "@/app/lib/profile-comments";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type RouteProps = {
  params: Promise<{
    username: string;
  }>;
};

const COMMENT_SELECT = {
  id: true,
  authorUserId: true,
  authorName: true,
  body: true,
  createdAt: true,
  profileUserId: true,
  authorUser: {
    select: {
      username: true,
      displayName: true,
    },
  },
} as const;

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { username } = await params;
    const sessionUser = await getCurrentUser();
    const sort = normalizeProfileCommentSort(
      new URL(req.url).searchParams.get("sort"),
    );
    const profileUser = await findProfileUser(username);

    if (!profileUser) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const [count, comments] = await Promise.all([
      prisma.profileComment.count({
        where: {
          profileUserId: profileUser.id,
          isDeleted: false,
        },
      }),
      prisma.profileComment.findMany({
        where: {
          profileUserId: profileUser.id,
          isDeleted: false,
        },
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc",
        },
        take: 100,
        select: COMMENT_SELECT,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      count,
      sort,
      comments: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        authorName: resolveProfileCommentAuthorName(comment),
        createdAt: comment.createdAt.toISOString(),
        canDelete: Boolean(
          sessionUser &&
            (sessionUser.role === "admin" ||
              sessionUser.role === "owner" ||
              sessionUser.id === comment.profileUserId ||
              sessionUser.id === comment.authorUserId),
        ),
      })),
    });
  } catch (error) {
    logServerError("profile.comments.list-route", error);

    return NextResponse.json(
      { error: "Unable to load comments right now." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { error: "You need to sign in before commenting." },
        { status: 401 },
      );
    }

    const { username } = await params;
    const profileUser = await findProfileUser(username);

    if (!profileUser) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const payload = await req.json().catch(() => null);
    const bodyResult = sanitizeProfileCommentBody(payload?.body);

    if (!bodyResult.ok) {
      return NextResponse.json({ error: bodyResult.error }, { status: 400 });
    }

    const latestComment = await prisma.profileComment.findFirst({
      where: {
        profileUserId: profileUser.id,
        authorUserId: sessionUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    if (
      latestComment &&
      Date.now() - latestComment.createdAt.getTime() < PROFILE_COMMENT_RATE_LIMIT_MS
    ) {
      return NextResponse.json(
        { error: "Slow down a bit before posting another comment." },
        { status: 429 },
      );
    }

    const createdComment = await prisma.profileComment.create({
      data: {
        profileUserId: profileUser.id,
        authorUserId: sessionUser.id,
        authorName: sessionUser.displayName?.trim() || sessionUser.username,
        body: bodyResult.body,
      },
      select: COMMENT_SELECT,
    });

    const [count] = await Promise.all([
      prisma.profileComment.count({
        where: {
          profileUserId: profileUser.id,
          isDeleted: false,
        },
      }),
      syncUserAura(profileUser.id),
    ]);

    return NextResponse.json({
      ok: true,
      count,
      comment: {
        id: createdComment.id,
        body: createdComment.body,
        authorName: resolveProfileCommentAuthorName(createdComment),
        createdAt: createdComment.createdAt.toISOString(),
        canDelete: true,
      },
    });
  } catch (error) {
    logServerError("profile.comments.create-route", error);

    return NextResponse.json(
      { error: "Unable to post that comment right now." },
      { status: 500 },
    );
  }
}

async function findProfileUser(username: string) {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      username: normalizedUsername,
    },
    select: {
      id: true,
      status: true,
    },
  }).then((user) => {
    if (!user || user.status === "banned") {
      return null;
    }

    return user;
  });
}
