"use server";

import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function createLink(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeUrl(rawUrl);

  if (!url) {
    throw new Error("URL inválida.");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true, premiumUntil: true },
  });

  if (!dbUser) {
    throw new Error("Usuário não encontrado.");
  }

  const isPremium =
    dbUser.plan === "premium" &&
    (!dbUser.premiumUntil || new Date(dbUser.premiumUntil) > new Date());

  const totalLinks = await prisma.link.count({
    where: { userId: user.id },
  });

  if (!isPremium && totalLinks >= 5) {
    throw new Error("Plano Free permite no máximo 5 links.");
  }

  const lastLink = await prisma.link.findFirst({
    where: { userId: user.id },
    orderBy: { sortOrder: "desc" },
  });

  const nextSortOrder = lastLink ? lastLink.sortOrder + 1 : 1;

  await prisma.link.create({
    data: {
      userId: user.id,
      title: title || null,
      url,
      sortOrder: nextSortOrder,
    },
  });
}

export async function deleteLink(formData: FormData) {
  const user = await requireUser();

  const linkId = String(formData.get("linkId") ?? "").trim();

  if (!linkId) {
    throw new Error("Link inválido.");
  }

  const existingLink = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: user.id,
    },
  });

  if (!existingLink) {
    throw new Error("Link não encontrado.");
  }

  await prisma.link.delete({
    where: { id: existingLink.id },
  });
}

export async function moveLinkUp(formData: FormData) {
  const user = await requireUser();

  const linkId = String(formData.get("linkId") ?? "").trim();

  if (!linkId) {
    throw new Error("Link inválido.");
  }

  const currentLink = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: user.id,
    },
  });

  if (!currentLink) {
    throw new Error("Link não encontrado.");
  }

  const previousLink = await prisma.link.findFirst({
    where: {
      userId: user.id,
      sortOrder: { lt: currentLink.sortOrder },
    },
    orderBy: { sortOrder: "desc" },
  });

  if (!previousLink) {
    return;
  }

  await prisma.$transaction([
    prisma.link.update({
      where: { id: currentLink.id },
      data: { sortOrder: previousLink.sortOrder },
    }),
    prisma.link.update({
      where: { id: previousLink.id },
      data: { sortOrder: currentLink.sortOrder },
    }),
  ]);
}

export async function moveLinkDown(formData: FormData) {
  const user = await requireUser();

  const linkId = String(formData.get("linkId") ?? "").trim();

  if (!linkId) {
    throw new Error("Link inválido.");
  }

  const currentLink = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: user.id,
    },
  });

  if (!currentLink) {
    throw new Error("Link não encontrado.");
  }

  const nextLink = await prisma.link.findFirst({
    where: {
      userId: user.id,
      sortOrder: { gt: currentLink.sortOrder },
    },
    orderBy: { sortOrder: "asc" },
  });

  if (!nextLink) {
    return;
  }

  await prisma.$transaction([
    prisma.link.update({
      where: { id: currentLink.id },
      data: { sortOrder: nextLink.sortOrder },
    }),
    prisma.link.update({
      where: { id: nextLink.id },
      data: { sortOrder: currentLink.sortOrder },
    }),
  ]);
}