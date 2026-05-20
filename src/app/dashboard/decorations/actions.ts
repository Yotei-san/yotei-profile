"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import {
  canUserEquipDecoration,
  inferMediaType,
  toDecorationCatalogItem,
} from "@/app/lib/decorations";
import { ensureStarterDecorations } from "@/app/lib/decoration-storage";
import { prisma } from "@/app/lib/prisma";

function toNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function saveSelectedDecoration(formData: FormData) {
  const sessionUser = await requireUser();

  const decorationSlug = String(formData.get("decorationSlug") || "").trim();
  const decorationId = String(formData.get("decorationId") || "").trim();

  if (!decorationSlug && !decorationId) {
    redirect("/dashboard/decorations?error=missing-decoration");
  }

  await ensureStarterDecorations();

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
    redirect("/dashboard/decorations?error=missing-decoration");
  }

  const decoration = await prisma.decoration.findFirst({
    where: decorationSlug
      ? { slug: decorationSlug, isPublic: true }
      : { id: decorationId, isPublic: true },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      previewUrl: true,
      posterUrl: true,
      mediaType: true,
      overlayScale: true,
      overlayOffsetY: true,
      createdByUserId: true,
    },
  });

  if (!decoration) {
    redirect("/dashboard/decorations?error=invalid-decoration");
  }

  const catalogItem = toDecorationCatalogItem(decoration, user);

  if (!canUserEquipDecoration(catalogItem, user)) {
    redirect(
      `/dashboard/decorations?error=${
        catalogItem.lockedReason === "owner" ? "owner-required" : "premium-required"
      }`,
    );
  }

  const scale = catalogItem.isStarter
    ? 165
    : toNumber(formData.get("scale"), decoration.overlayScale ?? 165);
  const offsetX = catalogItem.isStarter ? 0 : toNumber(formData.get("offsetX"), 0);
  const offsetY = catalogItem.isStarter ? 0 : toNumber(formData.get("offsetY"), 0);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      selectedDecorationId: decoration.id,
      selectedDecorationScale: scale,
      selectedDecorationOffsetX: offsetX,
      selectedDecorationOffsetY: offsetY,
    },
  });

  revalidatePath("/dashboard/decorations");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath(`/${user.username}`);

  redirect("/dashboard/decorations?success=decoration-saved");
}

export async function clearSelectedDecoration() {
  const sessionUser = await requireUser();

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      selectedDecorationId: null,
      selectedDecorationScale: 165,
      selectedDecorationOffsetX: 0,
      selectedDecorationOffsetY: 0,
    },
  });

  revalidatePath("/dashboard/decorations");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/decorations?success=decoration-cleared");
}

export async function createUploadedDecoration(formData: FormData) {
  const sessionUser = await requireUser();

  const name = String(formData.get("name") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const mediaType = String(formData.get("mediaType") || "").trim();
  const previewUrl = String(formData.get("previewUrl") || imageUrl).trim();
  const posterUrl = String(formData.get("posterUrl") || "").trim();

  if (!name || !imageUrl) {
    redirect("/dashboard/decorations?error=missing-upload-fields");
  }

  const slugBase = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const slug = `${slugBase}-${Date.now()}`;

  const decoration = await prisma.decoration.create({
    data: {
      name,
      slug,
      imageUrl,
      previewUrl: previewUrl || imageUrl,
      posterUrl: posterUrl || null,
      mediaType: mediaType || inferMediaType(imageUrl),
      isPublic: true,
      createdByUserId: sessionUser.id,
      sortOrder: 999,
    },
    select: {
      id: true,
    },
  });

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      selectedDecorationId: decoration.id,
      selectedDecorationScale: 165,
      selectedDecorationOffsetX: 0,
      selectedDecorationOffsetY: 0,
    },
  });

  revalidatePath("/dashboard/decorations");
  revalidatePath("/dashboard/profile");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/decorations?success=decoration-uploaded");
}
