"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { awardBadgeByKey, ensureDefaultBadges, syncAutomaticBadges } from "@/app/lib/badges";

export async function pinBadge(formData: FormData) {
  const user = await requireUser();
  const userBadgeId = String(formData.get("userBadgeId") ?? "").trim();

  if (!userBadgeId) {
    redirect("/dashboard/badges");
  }

  await prisma.userBadge.updateMany({
    where: { userId: user.id },
    data: { isPinned: false },
  });

  await prisma.userBadge.updateMany({
    where: {
      id: userBadgeId,
      userId: user.id,
    },
    data: { isPinned: true },
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

  if (
    badgeKey === "premium" ||
    badgeKey === "owner" ||
    badgeKey === "creator" ||
    badgeKey === "popular" ||
    badgeKey === "early-user"
  ) {
    redirect("/dashboard/badges");
  }

  redirect("/dashboard/badges");
}

export async function grantOwnerBadgeToCurrentUser() {
  const user = await requireUser();
  await ensureDefaultBadges();
  await awardBadgeByKey(user.id, "owner");
  revalidatePath("/dashboard/badges");
  revalidatePath(`/${user.username}`);
  redirect("/dashboard/badges");
}
