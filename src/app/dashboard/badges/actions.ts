"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import {
  awardBadgeByKey,
  ensureDefaultBadges,
  syncAutomaticBadges,
} from "@/app/lib/badges";
import { prisma } from "@/app/lib/prisma";

const MAX_PINNED_BADGES = 5;

export async function pinBadge(formData: FormData) {
  const user = await requireUser();
  const userBadgeId = String(formData.get("userBadgeId") ?? "").trim();

  if (!userBadgeId) {
    redirect("/dashboard/badges");
  }

  const badge = await prisma.userBadge.findUnique({
    where: { id: userBadgeId },
    select: {
      id: true,
      userId: true,
      isPinned: true,
    },
  });

  if (!badge || badge.userId !== user.id) {
    redirect("/dashboard/badges");
  }

  const pinnedCount = await prisma.userBadge.count({
    where: {
      userId: user.id,
      isPinned: true,
    },
  });

  if (!badge.isPinned && pinnedCount >= MAX_PINNED_BADGES) {
    redirect("/dashboard/badges");
  }

  await prisma.userBadge.update({
    where: { id: badge.id },
    data: {
      isPinned: !badge.isPinned,
    },
  });

  revalidatePath("/dashboard/badges");
  revalidatePath(`/${user.username}`);
  redirect("/dashboard/badges");
}

export async function unpinAllBadges() {
  const user = await requireUser();

  await prisma.userBadge.updateMany({
    where: { userId: user.id },
    data: { isPinned: false },
  });

  revalidatePath("/dashboard/badges");
  revalidatePath(`/${user.username}`);
  redirect("/dashboard/badges");
}

export async function claimBadge(formData: FormData) {
  const user = await requireUser();
  const badgeKey = String(formData.get("badgeKey") ?? "").trim();

  await ensureDefaultBadges();
  await syncAutomaticBadges(user.id);

  if (!badgeKey) {
    redirect("/dashboard/badges");
  }

  const manualClaimableBadges = ["beta-tester", "verified"];

  if (!manualClaimableBadges.includes(badgeKey)) {
    redirect("/dashboard/badges");
  }

  await awardBadgeByKey(user.id, badgeKey);

  revalidatePath("/dashboard/badges");
  revalidatePath(`/${user.username}`);
  redirect("/dashboard/badges");
}

export async function grantOwnerBadgeToCurrentUser() {
  const user = await requireUser();

  await ensureDefaultBadges();
  await awardBadgeByKey(user.id, "owner");
  await syncAutomaticBadges(user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/badges");
  revalidatePath(`/${user.username}`);

  redirect("/dashboard/badges");
}