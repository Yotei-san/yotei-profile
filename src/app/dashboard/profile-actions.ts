"use server";

import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function hasField(formData: FormData, key: string) {
  return formData.has(key);
}

function getNullableString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value === null) return undefined;

  const parsed = value.toString().trim();
  return parsed === "" ? null : parsed;
}

function getNullableInt(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value === null) return undefined;

  const parsed = Number(value.toString());
  return Number.isNaN(parsed) ? undefined : parsed;
}

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      plan: true,
      premiumUntil: true,
    },
  });

  if (!dbUser) {
    throw new Error("Usuário não encontrado.");
  }

  const premium = isPremiumPlan(dbUser);
  const data: Record<string, unknown> = {};

  if (hasField(formData, "displayName")) {
    data.displayName = getNullableString(formData, "displayName");
  }

  if (hasField(formData, "bio")) {
    data.bio = getNullableString(formData, "bio");
  }

  if (hasField(formData, "avatarUrl")) {
    data.avatarUrl = getNullableString(formData, "avatarUrl");
  }

  if (hasField(formData, "bannerUrl")) {
    data.bannerUrl = getNullableString(formData, "bannerUrl");
  }

  if (hasField(formData, "backgroundUrl")) {
    data.backgroundUrl = getNullableString(formData, "backgroundUrl");
  }

  if (hasField(formData, "videoBgUrl")) {
    data.videoBgUrl = premium ? getNullableString(formData, "videoBgUrl") : null;
  }

  if (hasField(formData, "themeColor")) {
    data.themeColor = getNullableString(formData, "themeColor") ?? "#2563eb";
  }

  if (hasField(formData, "textColor")) {
    data.textColor = getNullableString(formData, "textColor") ?? "#ffffff";
  }

  if (hasField(formData, "cardOpacity")) {
    const value = getNullableInt(formData, "cardOpacity");
    if (value !== undefined) data.cardOpacity = value;
  }

  if (hasField(formData, "cardBlur")) {
    const value = getNullableInt(formData, "cardBlur");
    if (value !== undefined) data.cardBlur = value;
  }

  if (hasField(formData, "glowIntensity")) {
    const value = getNullableInt(formData, "glowIntensity");
    if (value !== undefined) data.glowIntensity = value;
  }

  if (hasField(formData, "backgroundStyle")) {
    data.backgroundStyle =
      getNullableString(formData, "backgroundStyle") ?? "gradient";
  }

  if (hasField(formData, "buttonStyle")) {
    data.buttonStyle =
      getNullableString(formData, "buttonStyle") ?? "solid";
  }

  if (hasField(formData, "presetTheme")) {
    data.presetTheme =
      getNullableString(formData, "presetTheme") ?? "custom";
  }

  if (hasField(formData, "layoutStyle")) {
    data.layoutStyle = premium
      ? getNullableString(formData, "layoutStyle") ?? "stacked"
      : "stacked";
  }

  if (hasField(formData, "containerWidth")) {
    data.containerWidth = premium
      ? getNullableString(formData, "containerWidth") ?? "normal"
      : "normal";
  }

  if (hasField(formData, "avatarPosition")) {
    data.avatarPosition = premium
      ? getNullableString(formData, "avatarPosition") ?? "center"
      : "center";
  }

  if (hasField(formData, "linksStyle")) {
    data.linksStyle = premium
      ? getNullableString(formData, "linksStyle") ?? "rounded"
      : "rounded";
  }

  if (hasField(formData, "blocksOrder")) {
    data.blocksOrder =
      getNullableString(formData, "blocksOrder") ??
      "stats,about,gallery,music,reactions,links";
  }

  if (hasField(formData, "aboutTitle")) {
    data.aboutTitle = getNullableString(formData, "aboutTitle");
  }

  if (hasField(formData, "aboutText")) {
    data.aboutText = getNullableString(formData, "aboutText");
  }

  if (hasField(formData, "badge1")) {
    data.badge1 = premium ? getNullableString(formData, "badge1") : null;
  }

  if (hasField(formData, "badge2")) {
    data.badge2 = premium ? getNullableString(formData, "badge2") : null;
  }

  if (hasField(formData, "badge3")) {
    data.badge3 = premium ? getNullableString(formData, "badge3") : null;
  }

  if (Object.keys(data).length === 0) {
    redirect("/dashboard");
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
  redirect("/dashboard");
}