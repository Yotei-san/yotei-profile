import { prisma } from "@/app/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function inferMediaType(url: string) {
  const lower = url.toLowerCase();
  if (lower.endsWith(".webm")) return "webm";
  if (lower.endsWith(".gif")) return "gif";
  return "image";
}

export async function createAvatarDecoration(input: {
  name: string;
  imageUrl: string;
  previewUrl?: string | null;
  posterUrl?: string | null;
  mediaType?: string | null;
  createdByUserId?: string | null;
  overlayScale?: number | null;
  overlayOffsetY?: number | null;
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
      previewUrl: input.previewUrl ?? input.imageUrl,
      posterUrl: input.posterUrl ?? null,
      mediaType: input.mediaType || inferMediaType(input.imageUrl),
      createdByUserId: input.createdByUserId ?? null,
      isPublic: true,
      overlayScale: input.overlayScale ?? 100,
      overlayOffsetY: input.overlayOffsetY ?? 0,
    },
  });
}
