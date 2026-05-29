"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { syncUserAura } from "@/app/lib/aura-server";
import {
  isMissingProfileCompositionColumnError,
  parseProfileCompositionInput,
} from "@/app/lib/profile-composition";
import { normalizeProfileMusic } from "@/app/lib/profile-music";
import {
  getStoredAvatarPosition,
  getStoredButtonStyle,
  getStoredLayoutStyle,
  getStoredLinksStyle,
  isMissingProfileCustomizationColumnError,
  normalizeProfileBackgroundIntensity,
  normalizeProfileBannerStyle,
  normalizeProfileCardStyle,
  normalizeProfileCornerStyle,
  normalizeProfileDensity,
  normalizeProfileGlassIntensity,
  normalizeProfileIntroMode,
  normalizeProfileMotionLevel,
  normalizeProfileNameEffectsForUser,
} from "@/app/lib/profile-customization";
import {
  isMissingProfileSceneColumnError,
  normalizeProfileScene,
} from "@/app/lib/profile-scenes";
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
  const requestedProfileNameEffects = formData.getAll("profileNameEffects").map((value) =>
    typeof value === "string" ? value : String(value),
  );
  const profileBackgroundIntensity = normalizeProfileBackgroundIntensity(
    String(formData.get("profileBackgroundIntensity") || "").trim(),
  );
  const profileDensity = normalizeProfileDensity(
    String(formData.get("profileDensity") || "").trim(),
  );
  const profileCardStyle = normalizeProfileCardStyle(
    String(formData.get("profileCardStyle") || "").trim(),
  );
  const profileCornerStyle = normalizeProfileCornerStyle(
    String(formData.get("profileCornerStyle") || "").trim(),
  );
  const profileMotionLevel = normalizeProfileMotionLevel(
    String(formData.get("profileMotionLevel") || "").trim(),
  );
  const profileGlassIntensity = normalizeProfileGlassIntensity(
    String(formData.get("profileGlassIntensity") || "").trim(),
  );
  const profileBannerStyle = normalizeProfileBannerStyle(
    String(formData.get("profileBannerStyle") || "").trim(),
  );
  const profileIntroMode = normalizeProfileIntroMode(
    String(formData.get("profileIntroMode") || "").trim(),
  );
  const profileComposition = parseProfileCompositionInput(
    String(formData.get("profileComposition") || ""),
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
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
    },
  });

  const resolvedUser = currentUser ?? (await redirectWithClearedSession());
  const normalizedNameEffects = normalizeProfileNameEffectsForUser(
    requestedProfileNameEffects,
    resolvedUser,
  );

  try {
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
          profileNameEffects: normalizedNameEffects,
          profileBackgroundIntensity,
          profileGlassIntensity,
          profileBannerStyle,
          profileIntroMode,
          profileComposition,
          layoutStyle: getStoredLayoutStyle(profileDensity),
          buttonStyle: getStoredButtonStyle(profileCardStyle),
          linksStyle: getStoredLinksStyle(profileCornerStyle),
          avatarPosition: getStoredAvatarPosition(profileMotionLevel),
          profileMusicTitle: profileMusic.title,
          profileMusicArtist: profileMusic.artist,
          profileMusicUrl: profileMusic.url,
          profileMusicProvider: profileMusic.provider,
          profileMusicEnabled: profileMusic.enabled,
        },
      });
    } catch (error) {
      if (
        !isMissingProfileCompositionColumnError(error) &&
        !isMissingProfileSceneColumnError(error) &&
        !isMissingProfileCustomizationColumnError(error)
      ) {
        throw error;
      }

      await prisma.user.update({
        where: { id: resolvedUser.id },
        data: {
          displayName: displayName || null,
          bio: bio || null,
          themeColor,
          profileLayout,
          profileMood,
          profileAura,
          ...(isMissingProfileSceneColumnError(error) ? {} : { profileScene }),
          ...(isMissingProfileCustomizationColumnError(error)
            ? {}
            : {
                profileNameEffects: normalizedNameEffects,
                profileBackgroundIntensity,
                profileGlassIntensity,
                profileBannerStyle,
                profileIntroMode,
                layoutStyle: getStoredLayoutStyle(profileDensity),
                buttonStyle: getStoredButtonStyle(profileCardStyle),
                linksStyle: getStoredLinksStyle(profileCornerStyle),
                avatarPosition: getStoredAvatarPosition(profileMotionLevel),
              }),
          ...(isMissingProfileCompositionColumnError(error)
            ? {}
            : {
                profileComposition,
              }),
          profileMusicTitle: profileMusic.title,
          profileMusicArtist: profileMusic.artist,
          profileMusicUrl: profileMusic.url,
          profileMusicProvider: profileMusic.provider,
          profileMusicEnabled: profileMusic.enabled,
        },
      });
    }
  } catch (error) {
    logServerError("dashboard.profile.save-settings", error, {
      userId: sessionUser.id,
    });
    redirect("/dashboard/profile?error=save-failed");
  }

  await syncUserAura(resolvedUser.id);

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
