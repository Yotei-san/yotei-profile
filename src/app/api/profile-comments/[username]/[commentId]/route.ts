import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { canDeleteProfileComment } from "@/app/lib/profile-comments";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type RouteProps = {
  params: Promise<{
    username: string;
    commentId: string;
  }>;
};

export async function DELETE(_req: Request, { params }: RouteProps) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { error: "You need to sign in before deleting comments." },
        { status: 401 },
      );
    }

    const { username, commentId } = await params;
    const profileUser = await findProfileUser(username);

    if (!profileUser) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const comment = await prisma.profileComment.findFirst({
      where: {
        id: commentId,
        profileUserId: profileUser.id,
      },
      select: {
        id: true,
        profileUserId: true,
        authorUserId: true,
        isDeleted: true,
      },
    });

    if (!comment || comment.isDeleted) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    const canDelete = canDeleteProfileComment({
      viewerUserId: sessionUser.id,
      viewerRole: sessionUser.role,
      profileUserId: comment.profileUserId,
      authorUserId: comment.authorUserId,
    });

    if (!canDelete) {
      return NextResponse.json(
        { error: "You do not have permission to delete this comment." },
        { status: 403 },
      );
    }

    await prisma.profileComment.update({
      where: {
        id: comment.id,
      },
      data: {
        isDeleted: true,
        body: "",
      },
    });

    const count = await prisma.profileComment.count({
      where: {
        profileUserId: profileUser.id,
        isDeleted: false,
      },
    });

    return NextResponse.json({
      ok: true,
      count,
    });
  } catch (error) {
    logServerError("profile.comments.delete-route", error);

    return NextResponse.json(
      { error: "Unable to delete that comment right now." },
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
