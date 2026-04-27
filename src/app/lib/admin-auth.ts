import { prisma } from "@/app/lib/prisma";

export async function requireAdminByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (user.status === "banned") {
    throw new Error("Conta banida.");
  }

  if (user.role !== "admin" && user.role !== "owner") {
    throw new Error("Acesso negado.");
  }

  return user;
}

export async function requireOwnerByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (user.status === "banned") {
    throw new Error("Conta banida.");
  }

  if (user.role !== "owner") {
    throw new Error("Acesso negado.");
  }

  return user;
}

export async function createAdminAuditLog(input: {
  actorUserId: string;
  targetUserId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
}) {
  const metadata =
    input.ipAddress || input.details
      ? JSON.stringify({
          ipAddress: input.ipAddress ?? null,
        })
      : null;

  await prisma.adminAuditLog.create({
    data: {
      actorUserId: input.actorUserId,
      targetUserId: input.targetUserId ?? null,
      action: input.action,
      reason: input.details ?? null,
      metadata,
    },
  });
}

export async function getRequestIp() {
  return "local-dev";
}
