"use server";

import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLink(formData: FormData): Promise<void> {
  const user = await requireUser();

  const title = formData.get("title")?.toString().trim() || "";
  const url = formData.get("url")?.toString().trim() || "";

  if (!title || !url) {
    throw new Error("Preencha título e URL.");
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("A URL precisa começar com http:// ou https://");
  }

  const lastLink = await prisma.link.findFirst({
    where: { userId: user.id },
    orderBy: { position: "desc" },
  });

  const nextPosition = lastLink ? lastLink.position + 1 : 1;

  await prisma.link.create({
    data: {
      title,
      url,
      position: nextPosition,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}

export async function deleteLink(formData: FormData): Promise<void> {
  const user = await requireUser();
  const linkId = formData.get("linkId")?.toString() || "";

  if (!linkId) {
    throw new Error("Link inválido.");
  }

  await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}

export async function updateLink(formData: FormData): Promise<void> {
  const user = await requireUser();

  const linkId = formData.get("linkId")?.toString() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const url = formData.get("url")?.toString().trim() || "";

  if (!linkId || !title || !url) {
    throw new Error("Dados inválidos.");
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("A URL precisa começar com http:// ou https://");
  }

  await prisma.link.updateMany({
    where: {
      id: linkId,
      userId: user.id,
    },
    data: {
      title,
      url,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}

export async function moveLinkUp(formData: FormData): Promise<void> {
  const user = await requireUser();
  const linkId = formData.get("linkId")?.toString() || "";

  const currentLink = await prisma.link.findFirst({
    where: { id: linkId, userId: user.id },
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

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}

export async function moveLinkDown(formData: FormData): Promise<void> {
  const user = await requireUser();
  const linkId = formData.get("linkId")?.toString() || "";

  const currentLink = await prisma.link.findFirst({
    where: { id: linkId, userId: user.id },
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

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}