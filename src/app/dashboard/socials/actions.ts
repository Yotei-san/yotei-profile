"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const DISCORD_PLATFORM = "discord";
const GITHUB_PLATFORM = "github";
const SPOTIFY_PLATFORM = "spotify";

export async function upsertDiscordBlock(formData: FormData) {
  const sessionUser = await requireUser();
  const discordUsername = normalizeOptionalText(formData.get("username"));
  const discordUserId = normalizeDiscordUserId(formData.get("discordUserId"));
  const inviteUrl = normalizeOptionalUrl(formData.get("url"));
  const shortStatus = normalizeOptionalText(formData.get("status"));
  const isEnabled = parseBoolean(formData.get("isEnabled"));

  if (!discordUsername) {
    redirect(buildSocialsPath(DISCORD_PLATFORM, "error", "discord-username-required"));
  }

  if (typeof inviteUrl === "undefined") {
    redirect(buildSocialsPath(DISCORD_PLATFORM, "error", "discord-url-invalid"));
  }

  await prisma.socialBlock.upsert({
    where: {
      userId_platform: {
        userId: sessionUser.id,
        platform: DISCORD_PLATFORM,
      },
    },
    update: {
      title: "Discord",
      username: discordUsername,
      url: inviteUrl,
      metadata: buildDiscordMetadata({
        discordUserId,
        shortStatus,
      }),
      isEnabled,
      sortOrder: 0,
    },
    create: {
      userId: sessionUser.id,
      platform: DISCORD_PLATFORM,
      title: "Discord",
      username: discordUsername,
      url: inviteUrl,
      metadata: buildDiscordMetadata({
        discordUserId,
        shortStatus,
      }),
      isEnabled,
      sortOrder: 0,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(buildSocialsPath(DISCORD_PLATFORM, "success", "discord-saved"));
}

export async function upsertGitHubBlock(formData: FormData) {
  const sessionUser = await requireUser();
  const githubUsername = normalizeOptionalText(formData.get("username"));
  const profileUrl = normalizeOptionalUrl(formData.get("url"));
  const statusText = normalizeOptionalText(formData.get("status"));
  const featuredRepo = normalizeOptionalText(formData.get("featuredRepo"));
  const isEnabled = parseBoolean(formData.get("isEnabled"));

  if (!githubUsername) {
    redirect(buildSocialsPath(GITHUB_PLATFORM, "error", "github-username-required"));
  }

  if (typeof profileUrl === "undefined") {
    redirect(buildSocialsPath(GITHUB_PLATFORM, "error", "github-url-invalid"));
  }

  await prisma.socialBlock.upsert({
    where: {
      userId_platform: {
        userId: sessionUser.id,
        platform: GITHUB_PLATFORM,
      },
    },
    update: {
      title: "GitHub",
      username: githubUsername,
      url: profileUrl,
      metadata: buildGitHubMetadata({
        statusText,
        featuredRepo,
      }),
      isEnabled,
      sortOrder: 1,
    },
    create: {
      userId: sessionUser.id,
      platform: GITHUB_PLATFORM,
      title: "GitHub",
      username: githubUsername,
      url: profileUrl,
      metadata: buildGitHubMetadata({
        statusText,
        featuredRepo,
      }),
      isEnabled,
      sortOrder: 1,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(buildSocialsPath(GITHUB_PLATFORM, "success", "github-saved"));
}

export async function upsertSpotifyBlock(formData: FormData) {
  const sessionUser = await requireUser();
  const spotifyUsername = normalizeOptionalText(formData.get("username"));
  const spotifyUrl = normalizeOptionalUrl(formData.get("url"));
  const trackName = normalizeOptionalText(formData.get("trackName"));
  const artistName = normalizeOptionalText(formData.get("artistName"));
  const statusText = normalizeOptionalText(formData.get("status"));
  const isEnabled = parseBoolean(formData.get("isEnabled"));

  if (!spotifyUsername) {
    redirect(buildSocialsPath(SPOTIFY_PLATFORM, "error", "spotify-username-required"));
  }

  if (typeof spotifyUrl === "undefined") {
    redirect(buildSocialsPath(SPOTIFY_PLATFORM, "error", "spotify-url-invalid"));
  }

  await prisma.socialBlock.upsert({
    where: {
      userId_platform: {
        userId: sessionUser.id,
        platform: SPOTIFY_PLATFORM,
      },
    },
    update: {
      title: "Spotify",
      username: spotifyUsername,
      url: spotifyUrl,
      metadata: buildSpotifyMetadata({
        trackName,
        artistName,
        statusText,
      }),
      isEnabled,
      sortOrder: 2,
    },
    create: {
      userId: sessionUser.id,
      platform: SPOTIFY_PLATFORM,
      title: "Spotify",
      username: spotifyUsername,
      url: spotifyUrl,
      metadata: buildSpotifyMetadata({
        trackName,
        artistName,
        statusText,
      }),
      isEnabled,
      sortOrder: 2,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(buildSocialsPath(SPOTIFY_PLATFORM, "success", "spotify-saved"));
}

export async function toggleSocialBlock(blockId: string) {
  const sessionUser = await requireUser();

  const block = await prisma.socialBlock.findFirst({
    where: {
      id: blockId,
      userId: sessionUser.id,
    },
    select: {
      id: true,
      isEnabled: true,
      platform: true,
    },
  });

  if (!block) {
    redirect(buildSocialsPath(DISCORD_PLATFORM, "error", "social-block-not-found"));
  }

  await prisma.socialBlock.update({
    where: {
      id: block.id,
    },
    data: {
      isEnabled: !block.isEnabled,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(
    buildSocialsPath(
      block.platform,
      "success",
      block.platform === GITHUB_PLATFORM
        ? block.isEnabled
          ? "github-disabled"
          : "github-enabled"
        : block.platform === SPOTIFY_PLATFORM
          ? block.isEnabled
            ? "spotify-disabled"
            : "spotify-enabled"
        : block.isEnabled
          ? "discord-disabled"
          : "discord-enabled"
    )
  );
}

export async function deleteSocialBlock(blockId: string) {
  const sessionUser = await requireUser();

  const block = await prisma.socialBlock.findFirst({
    where: {
      id: blockId,
      userId: sessionUser.id,
    },
    select: {
      id: true,
      platform: true,
    },
  });

  if (!block) {
    redirect(buildSocialsPath(DISCORD_PLATFORM, "error", "social-block-not-found"));
  }

  await prisma.socialBlock.delete({
    where: {
      id: block.id,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(
    buildSocialsPath(
      block.platform,
      "success",
      block.platform === GITHUB_PLATFORM
        ? "github-deleted"
        : block.platform === SPOTIFY_PLATFORM
          ? "spotify-deleted"
          : "discord-deleted"
    )
  );
}

function buildDiscordMetadata({
  discordUserId,
  shortStatus,
}: {
  discordUserId: string | null;
  shortStatus: string | null;
}) {
  if (!discordUserId && !shortStatus) {
    return Prisma.JsonNull;
  }

  return {
    discordUserId,
    shortStatus,
    presenceReady: false,
  };
}

function buildGitHubMetadata({
  statusText,
  featuredRepo,
}: {
  statusText: string | null;
  featuredRepo: string | null;
}) {
  if (!statusText && !featuredRepo) {
    return Prisma.JsonNull;
  }

  return {
    statusText,
    featuredRepo,
    profileReady: false,
  };
}

function buildSpotifyMetadata({
  trackName,
  artistName,
  statusText,
}: {
  trackName: string | null;
  artistName: string | null;
  statusText: string | null;
}) {
  if (!trackName && !artistName && !statusText) {
    return Prisma.JsonNull;
  }

  return {
    trackName,
    artistName,
    statusText,
    nowPlayingReady: false,
  };
}

function normalizeDiscordUserId(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  return /^[0-9]{5,32}$/.test(normalized) ? normalized : null;
}

function normalizeOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized.slice(0, 120) : null;
}

function normalizeOptionalUrl(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  try {
    const url = new URL(normalized);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

function parseBoolean(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return false;
  }

  return value === "true" || value === "on" || value === "1";
}

function buildSocialsPath(
  platform: string,
  param: "success" | "error",
  value: string
) {
  const active =
    platform === GITHUB_PLATFORM
      ? GITHUB_PLATFORM
      : platform === SPOTIFY_PLATFORM
        ? SPOTIFY_PLATFORM
        : DISCORD_PLATFORM;
  return `/dashboard/socials?active=${active}&${param}=${value}`;
}
