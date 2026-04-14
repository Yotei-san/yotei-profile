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
  const starter = [
    {
      name: "Neon Halo",
      slug: "neon-halo",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      sortOrder: 1,
    },
    {
      name: "Pink Ring",
      slug: "pink-ring",
      imageUrl: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=600&q=80",
      previewUrl: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=600&q=80",
      sortOrder: 2,
    },
    {
      name: "Arcane Circle",
      slug: "arcane-circle",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      sortOrder: 3,
    },
  ];

  for (const item of starter) {
    await prisma.decoration.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        imageUrl: item.imageUrl,
        previewUrl: item.previewUrl,
        isPublic: true,
        sortOrder: item.sortOrder,
      },
      create: {
        ...item,
        isPublic: true,
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
    },
  });
}
