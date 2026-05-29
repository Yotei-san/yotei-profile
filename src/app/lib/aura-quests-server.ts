import type { Prisma, PrismaClient } from "@prisma/client";
import {
  getAuraQuestCompletionSummary,
  getAuraQuestDefinitions,
  getAuraQuestProgressState,
  getQuestAuraRewardAmount,
  type AuraQuestDefinition,
  type AuraQuestProgressSnapshot,
} from "@/app/lib/aura-quests";
import { countAuraBadges } from "@/app/lib/aura";
import { prisma } from "@/app/lib/prisma";

type QuestDbClient = PrismaClient | Prisma.TransactionClient;

export type UserAuraQuestProgressSummary = ReturnType<
  typeof getAuraQuestCompletionSummary
> & {
  currentQuestProgress:
    | {
        quest: AuraQuestDefinition;
        current: number;
        target: number;
        nextAuraReward: number;
      }
    | null;
};

export async function getAuraQuestSnapshotForUser(
  userId: string,
  db: QuestDbClient = prisma,
): Promise<AuraQuestProgressSnapshot> {
  const [user, linkCount, likes, dislikes, comments, views, userBadges] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          avatarUrl: true,
          bannerUrl: true,
          bio: true,
          socialBlocks: {
            select: {
              platform: true,
            },
          },
        },
      }),
      db.link.count({
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
      db.profileView.count({
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
    hasAvatar: Boolean(user?.avatarUrl?.trim()),
    hasBanner: Boolean(user?.bannerUrl?.trim()),
    hasBio: Boolean(user?.bio?.trim()),
    linkCount,
    socialPlatforms: Array.from(
      new Set(
        (user?.socialBlocks ?? []).map((block) => block.platform).filter(Boolean),
      ),
    ),
    likes,
    dislikes,
    comments,
    views,
    badgeCount: userBadges.length,
    rareBadgeCount: badgeCounts.rare,
    legendaryBadgeCount: badgeCounts.legendary,
  };
}

export async function getCompletedAuraQuestIdsForUser(
  userId: string,
  db: QuestDbClient = prisma,
) {
  const completions = await db.userQuestCompletion.findMany({
    where: {
      userId,
    },
    select: {
      questId: true,
    },
    orderBy: {
      completedAt: "asc",
    },
  });

  return completions.map((completion) => completion.questId);
}

export async function syncUserAuraQuestCompletions(
  userId: string,
  db: QuestDbClient = prisma,
  snapshot?: AuraQuestProgressSnapshot,
) {
  const [resolvedSnapshot, completedQuestIds] = await Promise.all([
    snapshot ? Promise.resolve(snapshot) : getAuraQuestSnapshotForUser(userId, db),
    getCompletedAuraQuestIdsForUser(userId, db),
  ]);
  const completedQuestIdSet = new Set(completedQuestIds);
  const questsToComplete = getAuraQuestDefinitions().filter((quest) => {
    if (completedQuestIdSet.has(quest.id)) {
      return false;
    }

    return quest.getProgress(resolvedSnapshot).completed;
  });

  if (questsToComplete.length > 0) {
    await db.userQuestCompletion.createMany({
      data: questsToComplete.map((quest) => ({
        userId,
        questId: quest.id,
      })),
      skipDuplicates: true,
    });
  }

  return {
    snapshot: resolvedSnapshot,
    completedQuestIds: [...completedQuestIds, ...questsToComplete.map((quest) => quest.id)],
    newlyCompletedQuestIds: questsToComplete.map((quest) => quest.id),
  };
}

export async function getUserAuraQuestProgressSummary(
  userId: string,
  db: QuestDbClient = prisma,
): Promise<UserAuraQuestProgressSummary> {
  const [snapshot, completedQuestIds] = await Promise.all([
    getAuraQuestSnapshotForUser(userId, db),
    getCompletedAuraQuestIdsForUser(userId, db),
  ]);
  const summary = getAuraQuestCompletionSummary(completedQuestIds);
  const currentQuest = summary.currentQuest;

  if (!currentQuest) {
    return {
      ...summary,
      currentQuestProgress: null,
    };
  }

  const progressState = currentQuest.getProgress(snapshot);

  return {
    ...summary,
    currentQuestProgress: {
      quest: currentQuest,
      current: progressState.current,
      target: progressState.target,
      nextAuraReward: getQuestAuraRewardAmount(currentQuest),
    },
  };
}

export function getQuestAuraRewardTotalFromIds(questIds: Iterable<string>) {
  return getAuraQuestCompletionSummary(questIds).totalAuraRewards;
}

export function getQuestProgressDisplayForSummary(
  questId: string,
  snapshot: AuraQuestProgressSnapshot,
) {
  return getAuraQuestProgressState(questId, snapshot);
}
