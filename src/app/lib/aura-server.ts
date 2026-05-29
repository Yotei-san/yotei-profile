import type { Prisma, PrismaClient } from "@prisma/client";
import { calculateAura, type AuraCalculationInput } from "@/app/lib/aura";
import {
  getAuraQuestSnapshotForUser,
  getCompletedAuraQuestIdsForUser,
  syncUserAuraQuestCompletions,
} from "@/app/lib/aura-quests-server";
import { getTotalQuestAuraReward } from "@/app/lib/aura-quests";
import { prisma } from "@/app/lib/prisma";

type AuraDbClient = PrismaClient | Prisma.TransactionClient;

export async function getAuraMetricsForUser(
  userId: string,
  db: AuraDbClient = prisma,
): Promise<AuraCalculationInput> {
  const [snapshot, completedQuestIds] = await Promise.all([
    getAuraQuestSnapshotForUser(userId, db),
    getCompletedAuraQuestIdsForUser(userId, db),
  ]);

  return {
    views: snapshot.views,
    likes: snapshot.likes,
    dislikes: snapshot.dislikes,
    comments: snapshot.comments,
    configuredLinks: snapshot.linkCount,
    rareBadges: snapshot.rareBadgeCount,
    legendaryBadges: snapshot.legendaryBadgeCount,
    questAura: getTotalQuestAuraReward(completedQuestIds),
  };
}

export async function syncUserAura(
  userId: string,
  db: AuraDbClient = prisma,
) {
  const { snapshot, completedQuestIds } = await syncUserAuraQuestCompletions(
    userId,
    db,
  );
  const metrics = {
    views: snapshot.views,
    likes: snapshot.likes,
    dislikes: snapshot.dislikes,
    comments: snapshot.comments,
    configuredLinks: snapshot.linkCount,
    rareBadges: snapshot.rareBadgeCount,
    legendaryBadges: snapshot.legendaryBadgeCount,
    questAura: getTotalQuestAuraReward(completedQuestIds),
  } satisfies AuraCalculationInput;
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
