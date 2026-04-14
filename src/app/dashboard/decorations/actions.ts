"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function toNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function saveSelectedDecoration(formData: FormData) {
  const sessionUser = await requireUser();

  const decorationId = String(formData.get("decorationId") || "").trim();
  const scale = toNumber(formData.get("scale"), 165);
  const offsetX = toNumber(formData.get("offsetX"), 0);
  const offsetY = toNumber(formData.get("offsetY"), 0);

  if (!decorationId) {
    redirect("/dashboard/decorations?error=missing-decoration");
  }

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      selectedDecorationId: decorationId,
      selectedDecorationScale: scale,
      selectedDecorationOffsetX: offsetX,
      selectedDecorationOffsetY: offsetY,
    },
  });

  revalidatePath("/dashboard/decorations");
  revalidatePath("/dashboard");
  revalidatePath(`/${sessionUser.username}`);

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
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/decorations?success=decoration-cleared");
}

export async function createUploadedDecoration(formData: FormData) {
  const sessionUser = await requireUser();

  const name = String(formData.get("name") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const mediaType = String(formData.get("mediaType") || "image").trim();
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
      mediaType: mediaType || "image",
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
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/decorations?success=decoration-uploaded");
}