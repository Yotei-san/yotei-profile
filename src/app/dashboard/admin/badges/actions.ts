"use server";

import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId, createAdminAuditLog } from "@/app/lib/admin-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function giveBadge(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);

  const username = String(formData.get("username") || "").trim().toLowerCase();
  const badgeKey = String(formData.get("badgeKey") || "").trim();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  const badge = await prisma.badge.findUnique({
    where: { slug: badgeKey },
  });

  if (!user || !badge) {
    redirect("/dashboard/admin/badges?error=not-found");
  }

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: user.id,
        badgeId: badge.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      badgeId: badge.id,
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: user.id,
    action: "give_badge",
    details: `Badge aplicada: ${badgeKey}`,
  });

  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect("/dashboard/admin/badges?success=badge-given");
}

export async function removeBadge(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);

  const username = String(formData.get("username") || "").trim().toLowerCase();
  const badgeKey = String(formData.get("badgeKey") || "").trim();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  const badge = await prisma.badge.findUnique({
    where: { slug: badgeKey },
  });

  if (!user || !badge) {
    redirect("/dashboard/admin/badges?error=not-found");
  }

  await prisma.userBadge.deleteMany({
    where: {
      userId: user.id,
      badgeId: badge.id,
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: user.id,
    action: "remove_badge",
    details: `Badge removida: ${badgeKey}`,
  });

  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect("/dashboard/admin/badges?success=badge-removed");
}