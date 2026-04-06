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

function getPresetThemeValues(presetTheme: string | null) {
  switch (presetTheme) {
    case "minimal":
      return {
        themeColor: "#64748b",
        textColor: "#f8fafc",
        backgroundStyle: "solid",
        buttonStyle: "solid",
        glowIntensity: 20,
      };
    case "dark-glass":
      return {
        themeColor: "#8b5cf6",
        textColor: "#f8fafc",
        backgroundStyle: "gradient",
        buttonStyle: "glass",
        glowIntensity: 35,
      };
    case "neon-blue":
      return {
        themeColor: "#00e5ff",
        textColor: "#f8fafc",
        backgroundStyle: "gradient",
        buttonStyle: "solid",
        glowIntensity: 55,
      };
    case "crimson":
      return {
        themeColor: "#ef4444",
        textColor: "#fff1f2",
        backgroundStyle: "gradient",
        buttonStyle: "solid",
        glowIntensity: 45,
      };
    case "cyber":
      return {
        themeColor: "#22c55e",
        textColor: "#ecfeff",
        backgroundStyle: "gradient",
        buttonStyle: "outline",
        glowIntensity: 50,
      };
    default:
      return null;
  }
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
    const presetTheme =
      getNullableString(formData, "presetTheme") ?? "custom";

    data.presetTheme = presetTheme;

    if (presetTheme !== "custom") {
      const presetValues = getPresetThemeValues(presetTheme);

      if (presetValues) {
        data.themeColor = presetValues.themeColor;
        data.textColor = presetValues.textColor;
        data.backgroundStyle = presetValues.backgroundStyle;
        data.buttonStyle = presetValues.buttonStyle;
        data.glowIntensity = presetValues.glowIntensity;
      }
    }
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
