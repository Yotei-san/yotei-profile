"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { normalizeProfileMusic } from "@/app/lib/profile-music";
import { normalizeProfileScene } from "@/app/lib/profile-scenes";
import {
  normalizeProfileAura,
  normalizeProfileMood,
} from "@/app/lib/profile-presence";
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
  const rawThemeColor = String(formData.get("themeColor") || "").trim();
  const themeColor = normalizeThemeColor(rawThemeColor);
  const requestedProfileLayout = String(formData.get("profileLayout") || "").trim();
  const profileMood = normalizeProfileMood(
    String(formData.get("profileMood") || "").trim(),
  );
  const profileAura = normalizeProfileAura(
    String(formData.get("profileAura") || "").trim(),
  );
  const profileScene = normalizeProfileScene(
    String(formData.get("profileScene") || "").trim(),
  );
  const profileMusic = normalizeProfileMusic({
    enabled: parseBooleanFormValue(formData.get("profileMusicEnabled")),
    title: String(formData.get("profileMusicTitle") || ""),
    artist: String(formData.get("profileMusicArtist") || ""),
    url: String(formData.get("profileMusicUrl") || ""),
    provider: String(formData.get("profileMusicProvider") || ""),
  });
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
        profileMood,
        profileAura,
        profileScene,
        profileMusicTitle: profileMusic.title,
        profileMusicArtist: profileMusic.artist,
        profileMusicUrl: profileMusic.url,
        profileMusicProvider: profileMusic.provider,
        profileMusicEnabled: profileMusic.enabled,
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

function normalizeThemeColor(value: string) {
  const trimmed = value.trim();
  const shortHexMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed);

  if (shortHexMatch) {
    return `#${shortHexMatch[1]
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`;
  }

  if (/^#([0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed;
  }

  return "#f472b6";
}

function parseBooleanFormValue(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}
