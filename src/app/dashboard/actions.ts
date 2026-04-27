"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireUser, destroyUserSession } from "@/app/lib/auth";

function normalizeUrl(input: string) {
  const trimmed = input.trim();

  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeOptionalUrl(input: string) {
  const value = normalizeUrl(input);
  if (!value) return null;

  if (value.startsWith("/")) return value;

  try {
    new URL(value);
    return value;
  } catch {
    return null;
  }
}

function normalizeHexColor(input: string, fallback: string) {
  const value = input.trim();
  const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexColorRegex.test(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parseBooleanFormValue(value: FormDataEntryValue | null) {
  return value === "on";
}

function normalizeBackgroundStyle(input: string) {
  const value = input.trim().toLowerCase();
  return ["gradient", "solid", "image", "banner-soft"].includes(value)
    ? value
    : "gradient";
}

function normalizeButtonStyle(input: string) {
  const value = input.trim().toLowerCase();
  return ["solid", "glass", "outline"].includes(value) ? value : "solid";
}

function normalizePresetTheme(input: string) {
  const value = input.trim().toLowerCase();
  return ["custom", "minimal", "dark-glass", "neon-blue", "crimson", "cyber"].includes(value)
    ? value
    : "custom";
}

function normalizeLayoutStyle(input: string) {
  const value = input.trim().toLowerCase();
  return ["stacked", "compact", "wide"].includes(value) ? value : "stacked";
}

function normalizeContainerWidth(input: string) {
  const value = input.trim().toLowerCase();
  return ["narrow", "normal", "wide"].includes(value) ? value : "normal";
}

function normalizeAvatarPosition(input: string) {
  const value = input.trim().toLowerCase();
  return ["left", "center", "right"].includes(value) ? value : "center";
}

function normalizeLinksStyle(input: string) {
  const value = input.trim().toLowerCase();
  return ["rounded", "square", "pill"].includes(value) ? value : "rounded";
}

function normalizeBlocksOrder(input: string) {
  const fallback = "stats,about,gallery,music,reactions,links";
  const allowed = new Set(["stats", "about", "gallery", "music", "reactions", "links"]);

  const parts = input
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  const unique = [...new Set(parts)].filter((p) => allowed.has(p));
  if (unique.length === 0) return fallback;

  const missing = [...allowed].filter((item) => !unique.includes(item));
  return [...unique, ...missing].join(",");
}

function applyPresetTheme(presetTheme: string) {
  switch (presetTheme) {
    case "dark-glass":
      return {
        themeColor: "#60a5fa",
        textColor: "#ffffff",
        cardOpacity: 72,
        cardBlur: 18,
        buttonStyle: "glass",
        glowIntensity: 35,
        backgroundStyle: "gradient",
      };
    case "neon-blue":
      return {
        themeColor: "#00e5ff",
        textColor: "#f8fafc",
        cardOpacity: 68,
        cardBlur: 20,
        buttonStyle: "solid",
        glowIntensity: 60,
        backgroundStyle: "gradient",
      };
    case "crimson":
      return {
        themeColor: "#dc2626",
        textColor: "#ffffff",
        cardOpacity: 74,
        cardBlur: 16,
        buttonStyle: "solid",
        glowIntensity: 52,
        backgroundStyle: "gradient",
      };
    case "minimal":
      return {
        themeColor: "#e5e7eb",
        textColor: "#ffffff",
        cardOpacity: 55,
        cardBlur: 10,
        buttonStyle: "outline",
        glowIntensity: 10,
        backgroundStyle: "solid",
      };
    case "cyber":
      return {
        themeColor: "#a855f7",
        textColor: "#ffffff",
        cardOpacity: 70,
        cardBlur: 22,
        buttonStyle: "glass",
        glowIntensity: 72,
        backgroundStyle: "gradient",
      };
    default:
      return null;
  }
}

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

export async function activatePremiumPlan() {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "premium",
      premiumUntil: null,
      premiumBadge: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/pricing");
  revalidatePath(`/${user.username}`);
}

export async function deactivatePremiumPlan() {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "free",
      premiumUntil: null,
      premiumBadge: false,
      videoBgUrl: null,
      badge1: null,
      badge2: null,
      badge3: null,
      gallery3: null,
      gallery4: null,
      gallery5: null,
      gallery6: null,
      presetTheme: "custom",
      layoutStyle: "stacked",
      containerWidth: "normal",
      avatarPosition: "center",
      linksStyle: "rounded",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/pricing");
  revalidatePath(`/${user.username}`);
}

export async function createLink(formData: FormData) {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      plan: true,
      premiumUntil: true,
      username: true,
      _count: { select: { links: true } },
    },
  });

  if (!dbUser) return;

  const premium = isPremiumPlan(dbUser);

  if (!premium && dbUser._count.links >= 5) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeUrl(rawUrl);

  if (!url) return;

  try {
    if (!url.startsWith("/")) new URL(url);
  } catch {
    return;
  }

  const lastLink = await prisma.link.findFirst({
  where: { userId: user.id },
  orderBy: { position: "desc" },
  select: {
    position: true,
  },
});

const nextPosition = lastLink ? lastLink.position + 1 : 0;

await prisma.link.create({
  data: {
    title: title || null,
    url,
    userId: user.id,
    position: nextPosition,
  },
});

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
}

export async function deleteLink(formData: FormData) {
  const user = await requireUser();
  const linkId = String(formData.get("linkId") ?? "");

  if (!linkId) return;

  await prisma.link.deleteMany({
    where: { id: linkId, userId: user.id },
  });

  revalidatePath("/dashboard");
}

export async function savePreset(formData: FormData) {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      plan: true,
      premiumUntil: true,
      _count: { select: { presets: true } },
    },
  });

  if (!dbUser) return;

  const premium = isPremiumPlan(dbUser);

  if (!premium) return;
  if (dbUser._count.presets >= 10) return;

  const name = String(formData.get("presetName") ?? "").trim();
  if (!name) return;

  await prisma.preset.create({
    data: {
      userId: user.id,
      name,
      themeColor: String(formData.get("themeColor") ?? "") || null,
      textColor: String(formData.get("textColor") ?? "") || null,
      cardOpacity: Number(formData.get("cardOpacity") ?? 72),
      cardBlur: Number(formData.get("cardBlur") ?? 16),
      backgroundStyle: String(formData.get("backgroundStyle") ?? "") || null,
      buttonStyle: String(formData.get("buttonStyle") ?? "") || null,
      glowIntensity: Number(formData.get("glowIntensity") ?? 35),
      presetTheme: String(formData.get("presetTheme") ?? "") || null,
      layoutStyle: String(formData.get("layoutStyle") ?? "") || null,
      containerWidth: String(formData.get("containerWidth") ?? "") || null,
      avatarPosition: String(formData.get("avatarPosition") ?? "") || null,
      linksStyle: String(formData.get("linksStyle") ?? "") || null,
      blocksOrder: String(formData.get("blocksOrder") ?? "") || null,
    },
  });

  revalidatePath("/dashboard");
}

export async function applySavedPreset(formData: FormData) {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      plan: true,
      premiumUntil: true,
      username: true,
    },
  });

  if (!dbUser) return;
  if (!isPremiumPlan(dbUser)) return;

  const presetId = String(formData.get("presetId") ?? "");

  const preset = await prisma.preset.findFirst({
    where: { id: presetId, userId: user.id },
  });

  if (!preset) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      themeColor: preset.themeColor || undefined,
      textColor: preset.textColor || undefined,
      cardOpacity: preset.cardOpacity ?? undefined,
      cardBlur: preset.cardBlur ?? undefined,
      backgroundStyle: preset.backgroundStyle || undefined,
      buttonStyle: preset.buttonStyle || undefined,
      glowIntensity: preset.glowIntensity ?? undefined,
      presetTheme: preset.presetTheme || undefined,
      layoutStyle: preset.layoutStyle || undefined,
      containerWidth: preset.containerWidth || undefined,
      avatarPosition: preset.avatarPosition || undefined,
      linksStyle: preset.linksStyle || undefined,
      blocksOrder: preset.blocksOrder || undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${dbUser.username}`);
}

export async function deletePreset(formData: FormData) {
  const user = await requireUser();
  const presetId = String(formData.get("presetId") ?? "");

  await prisma.preset.deleteMany({
    where: { id: presetId, userId: user.id },
  });

  revalidatePath("/dashboard");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      plan: true,
      premiumUntil: true,
      username: true,
    },
  });

  if (!dbUser) return;

  const premium = isPremiumPlan(dbUser);

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const avatarUrlInput = String(formData.get("avatarUrl") ?? "").trim();
  const bannerUrlInput = String(formData.get("bannerUrl") ?? "").trim();
  const backgroundUrlInput = String(formData.get("backgroundUrl") ?? "").trim();
  const videoBgUrlInput = String(formData.get("videoBgUrl") ?? "").trim();

  const themeColorInput = String(formData.get("themeColor") ?? "").trim();
  const textColorInput = String(formData.get("textColor") ?? "").trim();

  const cardOpacityInput = Number(formData.get("cardOpacity") ?? 72);
  const cardBlurInput = Number(formData.get("cardBlur") ?? 16);
  const glowIntensityInput = Number(formData.get("glowIntensity") ?? 35);

  const backgroundStyleInput = String(formData.get("backgroundStyle") ?? "").trim();
  const buttonStyleInput = String(formData.get("buttonStyle") ?? "").trim();
  const presetThemeInput = String(formData.get("presetTheme") ?? "").trim();
  const layoutStyleInput = String(formData.get("layoutStyle") ?? "").trim();
  const containerWidthInput = String(formData.get("containerWidth") ?? "").trim();
  const avatarPositionInput = String(formData.get("avatarPosition") ?? "").trim();
  const linksStyleInput = String(formData.get("linksStyle") ?? "").trim();
  const blocksOrderInput = String(formData.get("blocksOrder") ?? "").trim();

  const websiteUrlInput = String(formData.get("websiteUrl") ?? "").trim();
  const discordUrlInput = String(formData.get("discordUrl") ?? "").trim();
  const githubUrlInput = String(formData.get("githubUrl") ?? "").trim();
  const xUrlInput = String(formData.get("xUrl") ?? "").trim();
  const instagramUrlInput = String(formData.get("instagramUrl") ?? "").trim();
  const youtubeUrlInput = String(formData.get("youtubeUrl") ?? "").trim();
  const tiktokUrlInput = String(formData.get("tiktokUrl") ?? "").trim();

  const musicUrlInput = String(formData.get("musicUrl") ?? "").trim();
  const musicTitle = String(formData.get("musicTitle") ?? "").trim();
  const musicArtist = String(formData.get("musicArtist") ?? "").trim();
  const musicCoverUrlInput = String(formData.get("musicCoverUrl") ?? "").trim();

  const aboutTitle = String(formData.get("aboutTitle") ?? "").trim();
  const aboutText = String(formData.get("aboutText") ?? "").trim();

  const stat1Label = String(formData.get("stat1Label") ?? "").trim();
  const stat1Value = String(formData.get("stat1Value") ?? "").trim();
  const stat2Label = String(formData.get("stat2Label") ?? "").trim();
  const stat2Value = String(formData.get("stat2Value") ?? "").trim();
  const stat3Label = String(formData.get("stat3Label") ?? "").trim();
  const stat3Value = String(formData.get("stat3Value") ?? "").trim();

  const badge1Input = String(formData.get("badge1") ?? "").trim();
  const badge2Input = String(formData.get("badge2") ?? "").trim();
  const badge3Input = String(formData.get("badge3") ?? "").trim();

  const gallery1Input = String(formData.get("gallery1") ?? "").trim();
  const gallery2Input = String(formData.get("gallery2") ?? "").trim();
  const gallery3Input = String(formData.get("gallery3") ?? "").trim();
  const gallery4Input = String(formData.get("gallery4") ?? "").trim();
  const gallery5Input = String(formData.get("gallery5") ?? "").trim();
  const gallery6Input = String(formData.get("gallery6") ?? "").trim();

  const showSocials = parseBooleanFormValue(formData.get("showSocials"));
  const showMusic = parseBooleanFormValue(formData.get("showMusic"));
  const showStats = parseBooleanFormValue(formData.get("showStats"));
  const showAbout = parseBooleanFormValue(formData.get("showAbout"));
  const showGallery = parseBooleanFormValue(formData.get("showGallery"));
  const showReactions = parseBooleanFormValue(formData.get("showReactions"));

  const avatarUrl = normalizeOptionalUrl(avatarUrlInput);
  const bannerUrl = normalizeOptionalUrl(bannerUrlInput);
  const backgroundUrl = normalizeOptionalUrl(backgroundUrlInput);
  const videoBgUrl = premium ? normalizeOptionalUrl(videoBgUrlInput) : null;

  const gallery1 = normalizeOptionalUrl(gallery1Input);
  const gallery2 = normalizeOptionalUrl(gallery2Input);
  const gallery3 = premium ? normalizeOptionalUrl(gallery3Input) : null;
  const gallery4 = premium ? normalizeOptionalUrl(gallery4Input) : null;
  const gallery5 = premium ? normalizeOptionalUrl(gallery5Input) : null;
  const gallery6 = premium ? normalizeOptionalUrl(gallery6Input) : null;

  let themeColor = normalizeHexColor(themeColorInput, "#2563eb");
  let textColor = normalizeHexColor(textColorInput, "#ffffff");
  let cardOpacity = clampNumber(Number.isFinite(cardOpacityInput) ? cardOpacityInput : 72, 20, 100);
  let cardBlur = clampNumber(Number.isFinite(cardBlurInput) ? cardBlurInput : 16, 0, 40);
  let glowIntensity = clampNumber(Number.isFinite(glowIntensityInput) ? glowIntensityInput : 35, 0, 100);
  let backgroundStyle = normalizeBackgroundStyle(backgroundStyleInput);
  let buttonStyle = normalizeButtonStyle(buttonStyleInput);

  let presetTheme = normalizePresetTheme(presetThemeInput);
  let layoutStyle = normalizeLayoutStyle(layoutStyleInput);
  let containerWidth = normalizeContainerWidth(containerWidthInput);
  let avatarPosition = normalizeAvatarPosition(avatarPositionInput);
  let linksStyle = normalizeLinksStyle(linksStyleInput);
  let blocksOrder = normalizeBlocksOrder(blocksOrderInput);

  if (!premium) {
    if (["dark-glass", "neon-blue", "crimson", "cyber"].includes(presetTheme)) {
      presetTheme = "custom";
    }
    if (["compact", "wide"].includes(layoutStyle)) {
      layoutStyle = "stacked";
    }
    if (containerWidth !== "normal") {
      containerWidth = "normal";
    }
    if (avatarPosition !== "center") {
      avatarPosition = "center";
    }
    if (["square", "pill"].includes(linksStyle)) {
      linksStyle = "rounded";
    }
  }

  const presetValues = applyPresetTheme(presetTheme);

  if (presetValues) {
    themeColor = presetValues.themeColor;
    textColor = presetValues.textColor;
    cardOpacity = presetValues.cardOpacity;
    cardBlur = presetValues.cardBlur;
    buttonStyle = presetValues.buttonStyle;
    glowIntensity = presetValues.glowIntensity;
    backgroundStyle = presetValues.backgroundStyle;
  }

  const websiteUrl = normalizeOptionalUrl(websiteUrlInput);
  const discordUrl = normalizeOptionalUrl(discordUrlInput);
  const githubUrl = normalizeOptionalUrl(githubUrlInput);
  const xUrl = normalizeOptionalUrl(xUrlInput);
  const instagramUrl = normalizeOptionalUrl(instagramUrlInput);
  const youtubeUrl = normalizeOptionalUrl(youtubeUrlInput);
  const tiktokUrl = normalizeOptionalUrl(tiktokUrlInput);

  const musicUrl = normalizeOptionalUrl(musicUrlInput);
  const musicCoverUrl = normalizeOptionalUrl(musicCoverUrlInput);

  const badge1 = premium ? badge1Input || null : null;
  const badge2 = premium ? badge2Input || null : null;
  const badge3 = premium ? badge3Input || null : null;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: displayName || undefined,
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

      websiteUrl,
      discordUrl,
      githubUrl,
      xUrl,
      instagramUrl,
      youtubeUrl,
      tiktokUrl,

      musicUrl,
      musicTitle: musicTitle || null,
      musicArtist: musicArtist || null,
      musicCoverUrl,

      aboutTitle: aboutTitle || null,
      aboutText: aboutText || null,

      stat1Label: stat1Label || null,
      stat1Value: stat1Value || null,
      stat2Label: stat2Label || null,
      stat2Value: stat2Value || null,
      stat3Label: stat3Label || null,
      stat3Value: stat3Value || null,

      badge1,
      badge2,
      badge3,

      gallery1,
      gallery2,
      gallery3,
      gallery4,
      gallery5,
      gallery6,

      showSocials,
      showMusic,
      showStats,
      showAbout,
      showGallery,
      showReactions,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/pricing");
  revalidatePath(`/${dbUser.username}`);
}

export async function logoutAction() {
  await destroyUserSession();
  redirect("/login");
}