import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { syncUserAura } from "@/app/lib/aura-server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type RouteProps = {
  params: Promise<{
    username: string;
  }>;
};

function buildViewCookieName(userId: string) {
  return `yotei_profile_view_${userId}`;
}

function getDailyViewKey() {
  return new Date().toISOString().slice(0, 10);
}

function getViewCookieExpiry() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24);
}

export async function POST(_req: Request, { params }: RouteProps) {
  try {
    const { username } = await params;
    const currentUser = await getCurrentUser();
    const cookieStore = await cookies();
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername) {
      return NextResponse.json({ error: "Invalid username." }, { status: 400 });
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
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const existingResponse = NextResponse.json({
      ok: true,
      views: user._count.profileViews,
    });

    if (currentUser?.id === user.id) {
      return existingResponse;
    }

    const cookieName = buildViewCookieName(user.id);
    const dailyKey = getDailyViewKey();
    const alreadyTracked = cookieStore.get(cookieName)?.value === dailyKey;

    if (alreadyTracked) {
      return existingResponse;
    }

    await prisma.profileView.create({
      data: {
        userId: user.id,
      },
    });
    await syncUserAura(user.id);

    const trackedResponse = NextResponse.json({
      ok: true,
      views: user._count.profileViews + 1,
    });

    trackedResponse.cookies.set(cookieName, dailyKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: getViewCookieExpiry(),
    });

    return trackedResponse;
  } catch (error) {
    logServerError("profile.view-route", error);
    return NextResponse.json(
      { error: "Unable to register this profile view right now." },
      { status: 500 }
    );
  }
}
