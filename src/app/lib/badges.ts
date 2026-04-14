import { prisma } from "@/app/lib/prisma";

export const DEFAULT_BADGES = [
  {
    slug: "owner",
    name: "Owner",
    icon: "👑",
    description: "Criador e dono do Yotei.",
  },
  {
    slug: "admin",
    name: "Admin",
    icon: "🛡️",
    description: "Administrador oficial da plataforma.",
  },
  {
    slug: "premium",
    name: "Premium",
    icon: "✦",
    description: "Usuário premium.",
  },
  {
    slug: "verified",
    name: "Verified",
    icon: "✔️",
    description: "Conta verificada.",
  },
  {
    slug: "beta-tester",
    name: "Beta Tester",
    icon: "🧪",
    description: "Participou da fase inicial.",
  },
];

export async function ensureDefaultBadges() {
  for (const badge of DEFAULT_BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        icon: badge.icon,
        description: badge.description ?? null,
      },
      create: {
        slug: badge.slug,
        name: badge.name,
        icon: badge.icon,
        description: badge.description ?? null,
      },
    });
  }
}

export async function giveBadgeToUser(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug },
    select: { id: true },
  });

  if (!badge) {
    throw new Error("Badge não encontrada.");
  }

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
    update: {},
    create: {
      userId,
      badgeId: badge.id,
    },
  });
}

export async function removeBadgeFromUser(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug },
    select: { id: true },
  });

  if (!badge) return;

  await prisma.userBadge.deleteMany({
    where: {
      userId,
      badgeId: badge.id,
    },
  });
}