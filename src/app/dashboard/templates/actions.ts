"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type TemplateTab = "all" | "mine" | "premium";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

export async function createTemplate(formData: FormData) {
  const sessionUser = await requireUser();
  const tab = parseTemplateTab(formData.get("tab"));

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
      role: true,
    },
  });

  if (!user) {
    redirect(buildTemplatesPath(tab, "error", "user-not-found"));
  }

  const name = String(formData.get("name") || "").trim();
  const description = normalizeOptionalText(formData.get("description"));
  const previewImageUrl = normalizeOptionalText(formData.get("previewImageUrl"));
  const tags = parseTags(formData.get("tags"));
  const isPublic = parseBoolean(formData.get("isPublic"));
  const wantsPremium = parseBoolean(formData.get("isPremium"));
  const canCreatePremium = isAdminOrOwner(user.role);

  if (!name) {
    redirect(buildTemplatesPath(tab, "error", "name-required"));
  }

  if (wantsPremium && !canCreatePremium) {
    redirect(buildTemplatesPath(tab, "error", "premium-create-blocked"));
  }

  await prisma.profileTemplate.create({
    data: {
      name,
      description,
      previewImageUrl,
      tags,
      isPublic,
      isPremium: canCreatePremium && wantsPremium,
      createdByUserId: user.id,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      themeColor: user.themeColor,
    },
  });

  revalidatePath("/dashboard/templates");
  redirect(buildTemplatesPath("mine", "success", "template-created"));
}

export async function applyTemplate(formData: FormData) {
  const sessionUser = await requireUser();
  const tab = parseTemplateTab(formData.get("tab"));
  const templateId = String(formData.get("templateId") || "").trim();

  if (!templateId) {
    redirect(buildTemplatesPath(tab, "error", "template-not-found"));
  }

  const user = await prisma.user.findUnique({
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

  if (!user) {
    redirect(buildTemplatesPath(tab, "error", "user-not-found"));
  }

  const template = await prisma.profileTemplate.findUnique({
    where: { id: templateId },
    select: {
      id: true,
      isPublic: true,
      isPremium: true,
      createdByUserId: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
    },
  });

  if (!template) {
    redirect(buildTemplatesPath(tab, "error", "template-not-found"));
  }

  if (!template.isPublic && template.createdByUserId !== user.id) {
    redirect(buildTemplatesPath(tab, "error", "template-private"));
  }

  if (template.isPremium && !isPremiumOrPrivilegedUser(user)) {
    redirect(buildTemplatesPath(tab, "error", "premium-required"));
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: template.displayName,
        bio: template.bio,
        avatarUrl: template.avatarUrl,
        bannerUrl: template.bannerUrl,
        themeColor: template.themeColor,
      },
    }),
    prisma.profileTemplate.update({
      where: { id: template.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    }),
  ]);

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/templates");
  revalidatePath(`/${user.username}`);
  redirect(buildTemplatesPath(tab, "success", "template-applied"));
}

function parseTemplateTab(value: FormDataEntryValue | null): TemplateTab {
  if (value === "mine" || value === "premium") {
    return value;
  }

  return "all";
}

function parseBoolean(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return false;
  return value === "true" || value === "on" || value === "1";
}

function parseTags(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8)
    )
  );
}

function normalizeOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function isAdminOrOwner(role: string | null | undefined) {
  return role === "admin" || role === "owner";
}

function isPremiumOrPrivilegedUser(user: {
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
}) {
  if (isAdminOrOwner(user.role)) {
    return true;
  }

  const hasPremiumPlan =
    user.plan === "premium" &&
    (!user.premiumUntil || new Date(user.premiumUntil) > new Date());

  return (
    hasPremiumPlan ||
    user.premiumBadge ||
    ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus || "")
  );
}

function buildTemplatesPath(
  tab: TemplateTab,
  param: "success" | "error",
  value: string
) {
  return `/dashboard/templates?tab=${tab}&${param}=${value}`;
}
