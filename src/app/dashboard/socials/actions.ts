"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const DISCORD_PLATFORM = "discord";

export async function upsertDiscordBlock(formData: FormData) {
  const sessionUser = await requireUser();
  const discordUsername = normalizeOptionalText(formData.get("username"));
  const discordUserId = normalizeDiscordUserId(formData.get("discordUserId"));
  const inviteUrl = normalizeOptionalUrl(formData.get("url"));
  const shortStatus = normalizeOptionalText(formData.get("status"));
  const isEnabled = parseBoolean(formData.get("isEnabled"));

  if (!discordUsername) {
    redirect(buildSocialsPath("error", "discord-username-required"));
  }

  if (typeof inviteUrl === "undefined") {
    redirect(buildSocialsPath("error", "discord-url-invalid"));
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
  redirect(buildSocialsPath("success", "discord-saved"));
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
    },
  });

  if (!block) {
    redirect(buildSocialsPath("error", "social-block-not-found"));
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
  redirect(buildSocialsPath("success", block.isEnabled ? "discord-disabled" : "discord-enabled"));
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
    },
  });

  if (!block) {
    redirect(buildSocialsPath("error", "social-block-not-found"));
  }

  await prisma.socialBlock.delete({
    where: {
      id: block.id,
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${sessionUser.username}`);
  redirect(buildSocialsPath("success", "discord-deleted"));
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

function buildSocialsPath(param: "success" | "error", value: string) {
  return `/dashboard/socials?active=discord&${param}=${value}`;
}
