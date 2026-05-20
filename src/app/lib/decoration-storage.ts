import {
  getStarterDecorations,
  inferMediaType,
} from "@/app/lib/decorations";
import { prisma } from "@/app/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function ensureStarterDecorations() {
  for (const item of getStarterDecorations()) {
    await prisma.decoration.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        imageUrl: `starter://${item.slug}`,
        previewUrl: `starter://${item.slug}`,
        posterUrl: null,
        mediaType: "starter",
        isPublic: true,
        sortOrder: item.sortOrder,
        overlayScale: 165,
        overlayOffsetY: 0,
      },
      create: {
        name: item.name,
        slug: item.slug,
        imageUrl: `starter://${item.slug}`,
        previewUrl: `starter://${item.slug}`,
        posterUrl: null,
        mediaType: "starter",
        isPublic: true,
        sortOrder: item.sortOrder,
        overlayScale: 165,
        overlayOffsetY: 0,
      },
    });
  }
}

export async function createDecorationFromUpload(input: {
  name: string;
  imageUrl: string;
  createdByUserId?: string | null;
}) {
  const baseSlug = slugify(input.name) || "decoration";
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.decoration.findUnique({ where: { slug }, select: { id: true } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return prisma.decoration.create({
    data: {
      name: input.name.trim(),
      slug,
      imageUrl: input.imageUrl,
      previewUrl: input.imageUrl,
      isPublic: true,
      createdByUserId: input.createdByUserId ?? null,
      mediaType: inferMediaType(input.imageUrl),
    },
  });
}
