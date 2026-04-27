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
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const nextPosition = lastLink ? lastLink.position + 1 : 0;

  await prisma.link.create({
    data: {
      userId: user.id,
      title: title || null,
      url,
      position: nextPosition,
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
      position: { lt: currentLink.position },
    },
    orderBy: { position: "desc" },
  });

  if (!previousLink) {
    return;
  }

  await prisma.$transaction([
    prisma.link.update({
      where: { id: currentLink.id },
      data: { position: previousLink.position },
    }),
    prisma.link.update({
      where: { id: previousLink.id },
      data: { position: currentLink.position },
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
      position: { gt: currentLink.position },
    },
    orderBy: { position: "asc" },
  });

  if (!nextLink) {
    return;
  }

  await prisma.$transaction([
    prisma.link.update({
      where: { id: currentLink.id },
      data: { position: nextLink.position },
    }),
    prisma.link.update({
      where: { id: nextLink.id },
      data: { position: currentLink.position },
    }),
  ]);
}
