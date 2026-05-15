"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import {
  claimMissionBadgeForUser,
  parseBadgeFilter,
} from "@/app/lib/badge-missions";

export async function claimBadge(formData: FormData) {
  const sessionUser = await requireUser();
  const badgeSlug = String(formData.get("badgeSlug") ?? "").trim();
  const filter = parseBadgeFilter(String(formData.get("filter") ?? ""));

  if (!badgeSlug) {
    redirect(buildBadgesPath(filter, "error", "badge-not-found"));
  }

  const result = await claimMissionBadgeForUser(sessionUser.id, badgeSlug);

  if (result.status !== "claimed") {
    redirect(buildBadgesPath(filter, "error", result.status));
  }

  revalidatePath("/dashboard/badges");
  revalidatePath(`/${result.username}`);
  redirect(buildBadgesPath(filter, "success", "badge-claimed"));
}

function buildBadgesPath(
  filter: ReturnType<typeof parseBadgeFilter>,
  param: "success" | "error",
  value: string
) {
  return `/dashboard/badges?filter=${filter}&${param}=${value}`;
}
