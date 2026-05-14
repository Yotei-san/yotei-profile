import { createHash, randomBytes } from "crypto";
import { prisma } from "@/app/lib/prisma";
import { sendVerificationEmail } from "@/app/lib/email";

const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;
const RESEND_COOLDOWN_MS = 1000 * 60 * 5;

type VerificationResult =
  | { status: "verified" }
  | { status: "already-verified" }
  | { status: "expired" }
  | { status: "invalid" };

type VerificationUser = {
  id: string;
  email: string;
  username: string;
  emailVerified: Date | null;
  emailVerificationExpires: Date | null;
};

type VerificationTokenUser = {
  id: string;
  emailVerified: Date | null;
  emailVerificationExpires: Date | null;
};

export async function createAndSendEmailVerification(input: {
  userId: string;
  email: string;
  username: string;
}) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashVerificationToken(token);
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: expiresAt,
    } as any,
  });

  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  console.info("[Yotei email verification] Preparing verification email.", {
    userId: input.userId,
    email: input.email,
    username: input.username,
    expiresAt: expiresAt.toISOString(),
    baseUrl,
  });

  await sendVerificationEmail({
    email: input.email,
    username: input.username,
    verificationUrl,
  });
}

export async function resendEmailVerificationForUser(userId: string) {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      emailVerified: true,
      emailVerificationExpires: true,
    } as any,
  })) as VerificationUser | null;

  if (!user) {
    return { status: "not-found" as const };
  }

  if (user.emailVerified) {
    return { status: "already-verified" as const };
  }

  if (
    user.emailVerificationExpires &&
    user.emailVerificationExpires.getTime() - Date.now() >
      VERIFICATION_TTL_MS - RESEND_COOLDOWN_MS
  ) {
    return { status: "rate-limited" as const };
  }

  await createAndSendEmailVerification({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return { status: "sent" as const };
}

export async function verifyEmailToken(rawToken: string): Promise<VerificationResult> {
  const normalizedToken = rawToken.trim();

  if (!normalizedToken) {
    return { status: "invalid" };
  }

  const tokenHash = hashVerificationToken(normalizedToken);
  const user = (await prisma.user.findFirst({
    where: {
      emailVerificationToken: tokenHash,
    } as any,
    select: {
      id: true,
      emailVerified: true,
      emailVerificationExpires: true,
    } as any,
  })) as VerificationTokenUser | null;

  if (!user) {
    return { status: "invalid" };
  }

  if (user.emailVerified) {
    return { status: "already-verified" };
  }

  if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: null,
        emailVerificationExpires: null,
      } as any,
    });

    return { status: "expired" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
    } as any,
  });

  return { status: "verified" };
}

export function isEmailVerified(user: { emailVerified?: Date | null }) {
  return Boolean(user.emailVerified);
}

function hashVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getBaseUrl() {
  const explicitUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (explicitUrl) {
    const normalizedUrl = explicitUrl.replace(/\/+$/, "");
    console.info("[Yotei email verification] Using configured base URL.", {
      source: process.env.APP_URL ? "APP_URL" : "NEXT_PUBLIC_APP_URL",
      value: normalizedUrl,
    });
    return normalizedUrl;
  }

  if (process.env.VERCEL_URL) {
    const vercelUrl = `https://${process.env.VERCEL_URL}`;
    console.warn("[Yotei email verification] APP_URL/NEXT_PUBLIC_APP_URL missing. Falling back to VERCEL_URL.", {
      value: vercelUrl,
    });
    return vercelUrl;
  }

  console.warn(
    "[Yotei email verification] APP_URL, NEXT_PUBLIC_APP_URL and VERCEL_URL are missing. Falling back to localhost."
  );
  return "http://localhost:3000";
}
