"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

const VALID_PROFILE_LAYOUTS = new Set([
  "default",
  "modern",
  "simplistic",
  "portfolio",
]);

export async function saveProfileSettings(formData: FormData) {
  const sessionUser = await requireUser();

  const displayName = String(formData.get("displayName") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const themeColor =
    String(formData.get("themeColor") || "").trim() || "#f472b6";
  const requestedProfileLayout = String(formData.get("profileLayout") || "").trim();
  const profileLayout = VALID_PROFILE_LAYOUTS.has(requestedProfileLayout)
    ? requestedProfileLayout
    : "modern";

  const currentUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
    },
  });

  const resolvedUser = currentUser ?? (await redirectWithClearedSession());

  try {
    await prisma.user.update({
      where: { id: resolvedUser.id },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        themeColor,
        profileLayout,
      },
    });
  } catch (error) {
    logServerError("dashboard.profile.save-settings", error, {
      userId: sessionUser.id,
    });
    redirect("/dashboard/profile?error=save-failed");
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath(`/${resolvedUser.username}`);

  redirect("/dashboard/profile?success=saved");
}
