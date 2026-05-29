import type { Prisma, PrismaClient } from "@prisma/client";
import { calculateAura, countAuraBadges, type AuraCalculationInput } from "@/app/lib/aura";
import { prisma } from "@/app/lib/prisma";

type AuraDbClient = PrismaClient | Prisma.TransactionClient;

export async function getAuraMetricsForUser(
  userId: string,
  db: AuraDbClient = prisma,
): Promise<AuraCalculationInput> {
  const [views, likes, dislikes, comments, configuredLinks, userBadges] =
    await Promise.all([
      db.profileView.count({
        where: {
          userId,
        },
      }),
      db.reaction.count({
        where: {
          toUserId: userId,
          type: "like",
        },
      }),
      db.reaction.count({
        where: {
          toUserId: userId,
          type: "dislike",
        },
      }),
      db.profileComment.count({
        where: {
          profileUserId: userId,
          isDeleted: false,
        },
      }),
      db.link.count({
        where: {
          userId,
        },
      }),
      db.userBadge.findMany({
        where: {
          userId,
        },
        select: {
          badge: {
            select: {
              rarity: true,
            },
          },
        },
      }),
    ]);
  const badgeCounts = countAuraBadges(
    userBadges.map((entry) => entry.badge.rarity),
  );

  return {
    views,
    likes,
    dislikes,
    comments,
    configuredLinks,
    rareBadges: badgeCounts.rare,
    legendaryBadges: badgeCounts.legendary,
  };
}

export async function syncUserAura(
  userId: string,
  db: AuraDbClient = prisma,
) {
  const metrics = await getAuraMetricsForUser(userId, db);
  const aura = calculateAura(metrics);

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      auraScore: aura.score,
      auraRank: aura.rank,
    },
  });

  return aura;
}

export async function syncManyUserAuras(
  userIds: Iterable<string>,
  db: AuraDbClient = prisma,
) {
  const uniqueUserIds = [...new Set(Array.from(userIds).filter(Boolean))];

  for (const userId of uniqueUserIds) {
    await syncUserAura(userId, db);
  }
}
