"use server";

import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

function toNullableString(value: FormDataEntryValue | null) {
  const parsed = value?.toString().trim() || "";
  return parsed || null;
}

function toNullableInt(value: FormDataEntryValue | null, fallback?: number) {
  const parsed = Number(value?.toString() ?? "");
  if (Number.isNaN(parsed)) return fallback ?? null;
  return parsed;
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
      username: true,
      plan: true,
      premiumUntil: true,
    },
  });

  if (!dbUser) {
    throw new Error("Usuário não encontrado.");
  }

  const premium = isPremiumPlan(dbUser);

  const displayName = toNullableString(formData.get("displayName"));
  const bio = toNullableString(formData.get("bio"));

  const avatarUrl = toNullableString(formData.get("avatarUrl"));
  const bannerUrl = toNullableString(formData.get("bannerUrl"));
  const backgroundUrl = toNullableString(formData.get("backgroundUrl"));
  const videoBgUrl = premium ? toNullableString(formData.get("videoBgUrl")) : null;

  const themeColor = toNullableString(formData.get("themeColor")) ?? "#2563eb";
  const textColor = toNullableString(formData.get("textColor")) ?? "#ffffff";

  const cardOpacity = toNullableInt(formData.get("cardOpacity"), 72);
  const cardBlur = toNullableInt(formData.get("cardBlur"), 16);
  const glowIntensity = toNullableInt(formData.get("glowIntensity"), 35);

  const backgroundStyle =
    toNullableString(formData.get("backgroundStyle")) ?? "gradient";
  const buttonStyle =
    toNullableString(formData.get("buttonStyle")) ?? "solid";

  const presetTheme = toNullableString(formData.get("presetTheme")) ?? "custom";

  const layoutStyle = premium
    ? toNullableString(formData.get("layoutStyle")) ?? "stacked"
    : "stacked";

  const containerWidth = premium
    ? toNullableString(formData.get("containerWidth")) ?? "normal"
    : "normal";

  const avatarPosition = premium
    ? toNullableString(formData.get("avatarPosition")) ?? "center"
    : "center";

  const linksStyle = premium
    ? toNullableString(formData.get("linksStyle")) ?? "rounded"
    : "rounded";

  const blocksOrder =
    toNullableString(formData.get("blocksOrder")) ??
    "stats,about,gallery,music,reactions,links";

  const aboutTitle = toNullableString(formData.get("aboutTitle"));
  const aboutText = toNullableString(formData.get("aboutText"));

  const badge1 = premium ? toNullableString(formData.get("badge1")) : null;
  const badge2 = premium ? toNullableString(formData.get("badge2")) : null;
  const badge3 = premium ? toNullableString(formData.get("badge3")) : null;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName,
      bio,

      avatarUrl,
      bannerUrl,
      backgroundUrl,
      videoBgUrl,

      themeColor,
      textColor,
      cardOpacity,
      cardBlur,
      glowIntensity,

      backgroundStyle,
      buttonStyle,
      presetTheme,

      layoutStyle,
      containerWidth,
      avatarPosition,
      linksStyle,
      blocksOrder,

      aboutTitle,
      aboutText,

      badge1,
      badge2,
      badge3,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
}