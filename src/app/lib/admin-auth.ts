import { prisma } from "@/app/lib/prisma";

export async function requireAdminByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (user.role !== "admin") {
    throw new Error("Acesso negado.");
  }

  if (user.status === "banned") {
    throw new Error("Conta admin banida.");
  }

  return user;
}

export async function createAdminAuditLog(input: {
  actorUserId: string;
  targetUserId?: string | null;
  action: string;
  badgeKey?: string | null;
  ipAddress?: string | null;
  details?: string | null;
}) {
  await prisma.adminAuditLog.create({
    data: {
      actorUserId: input.actorUserId,
      targetUserId: input.targetUserId ?? null,
      action: input.action,
      badgeKey: input.badgeKey ?? null,
      ipAddress: input.ipAddress ?? null,
      details: input.details ?? null,
    },
  });
}

export async function logUserIp(input: {
  userId: string;
  ipAddress: string;
  route?: string | null;
}) {
  if (!input.ipAddress) return;

  await prisma.userIpLog.create({
    data: {
      userId: input.userId,
      ipAddress: input.ipAddress,
      route: input.route ?? null,
    },
  });
}

export function getRequestIp(headersObj: Headers) {
  const forwardedFor = headersObj.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  const realIp = headersObj.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "";
}