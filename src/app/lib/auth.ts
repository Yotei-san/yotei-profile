import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { prisma } from "@/app/lib/prisma";

export const SESSION_COOKIE_NAME = "yotei_session";
export const SESSION_PERSISTENCE_COOKIE_NAME = "yotei_session_mode";

const PERSISTENT_SESSION_MS = 1000 * 60 * 60 * 24 * 30;
const SESSION_BROWSER_MS = 1000 * 60 * 60 * 24;
const SESSION_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  emailVerified: true,
  role: true,
  status: true,
  plan: true,
  premiumBadge: true,
  premiumUntil: true,
  subscriptionStatus: true,
  stripeCustomerId: true,
} as const;

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    select: {
      id: true,
      token: true,
      userId: true,
      expiresAt: true,
      user: {
        select: SESSION_USER_SELECT,
      },
    },
  });

  if (!session) {
    await clearSessionCookies();
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({
      where: { token },
    });
    await clearSessionCookies();
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function createUserSession(
  userId: string,
  options?: { remember?: boolean }
) {
  const token = randomUUID();
  const remember = options?.remember ?? true;
  const expiresAt = new Date(
    Date.now() + (remember ? PERSISTENT_SESSION_MS : SESSION_BROWSER_MS)
  );

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    buildSessionCookieOptions({
      remember,
      expiresAt,
    })
  );
  cookieStore.set(
    SESSION_PERSISTENCE_COOKIE_NAME,
    remember ? "remember" : "session",
    buildPersistenceCookieOptions({
      remember,
      expiresAt,
    })
  );
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", buildExpiredCookieOptions());
  cookieStore.set(
    SESSION_PERSISTENCE_COOKIE_NAME,
    "",
    buildExpiredCookieOptions()
  );
}

export async function redirectWithClearedSession(): Promise<never> {
  await destroyUserSession();
  redirect("/login?error=session-expired");
}

function buildSessionCookieOptions({
  remember,
  expiresAt,
}: {
  remember: boolean;
  expiresAt: Date;
}) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { expires: expiresAt } : {}),
  };
}

function buildPersistenceCookieOptions({
  remember,
  expiresAt,
}: {
  remember: boolean;
  expiresAt: Date;
}) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { expires: expiresAt } : {}),
  };
}

function buildExpiredCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  };
}

async function clearSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", buildExpiredCookieOptions());
  cookieStore.set(
    SESSION_PERSISTENCE_COOKIE_NAME,
    "",
    buildExpiredCookieOptions()
  );
}
