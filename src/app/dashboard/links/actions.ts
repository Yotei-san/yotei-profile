"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function createLink(formData: FormData) {
  const sessionUser = await requireUser();

  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));

  if (!url) {
    redirect("/dashboard/links?error=missing-url");
  }

  const lastLink = await prisma.link.findFirst({
    where: { userId: sessionUser.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const nextPosition = lastLink ? lastLink.position + 1 : 0;

  await prisma.link.create({
    data: {
      userId: sessionUser.id,
      title: title || null,
      url,
      position: nextPosition,
    },
  });

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/links?success=created");
}

export async function updateLink(formData: FormData) {
  const sessionUser = await requireUser();

  const linkId = String(formData.get("linkId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));

  if (!linkId || !url) {
    redirect("/dashboard/links?error=invalid-update");
  }

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: sessionUser.id,
    },
    select: { id: true },
  });

  if (!link) {
    redirect("/dashboard/links?error=link-not-found");
  }

  await prisma.link.update({
    where: { id: linkId },
    data: {
      title: title || null,
      url,
    },
  });

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/links?success=updated");
}

export async function deleteLink(formData: FormData) {
  const sessionUser = await requireUser();

  const linkId = String(formData.get("linkId") || "").trim();

  if (!linkId) {
    redirect("/dashboard/links?error=invalid-delete");
  }

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: sessionUser.id,
    },
    select: { id: true },
  });

  if (!link) {
    redirect("/dashboard/links?error=link-not-found");
  }

  await prisma.link.delete({
    where: { id: linkId },
  });

  const remainingLinks = await prisma.link.findMany({
    where: { userId: sessionUser.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  for (let index = 0; index < remainingLinks.length; index++) {
    await prisma.link.update({
      where: { id: remainingLinks[index].id },
      data: { position: index },
    });
  }

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/links?success=deleted");
}