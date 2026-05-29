import { getFeaturedPublicBadges } from "@/app/lib/badges";
import { hasPremiumAccess } from "@/app/lib/premium";
import { normalizeProfileComposition } from "@/app/lib/profile-composition";
import { prisma } from "@/app/lib/prisma";

export type LeaderboardTab =
  | "aura"
  | "views"
  | "likes"
  | "comments"
  | "collectors"
  | "newest";

export type LeaderboardFeaturedBadge = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string | null;
  rarity: string | null;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  isPremium: boolean;
  createdAt: Date;
  auraScore: number;
  auraRank: string;
  views: number;
  likes: number;
  comments: number;
  badgeCount: number;
  rareBadgeCount: number;
  legendaryBadgeCount: number;
  featuredBadges: LeaderboardFeaturedBadge[];
  extraBadgeCount: number;
};

export type AuraLeaderboardEntry = LeaderboardEntry;

export type DashboardRankingSummary = {
  viewsRank: number;
  likesRank: number;
  commentCount: number;
};

type LeaderboardBaseEntry = Omit<
  LeaderboardEntry,
  "rareBadgeCount" | "legendaryBadgeCount" | "featuredBadges" | "extraBadgeCount"
>;

type LeaderboardUserRow = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
  createdAt: Date;
  auraScore: number;
  auraRank: string;
};

type LeaderboardUserDetailRow = {
  id: string;
  profileComposition: unknown;
  badges: Array<{
    id: string;
    badge: {
      slug: string;
      name: string;
      icon: string;
      color: string | null;
      rarity: string | null;
      description: string | null;
      category: string | null;
    };
  }>;
};

export function normalizeLeaderboardTab(
  value: string | null | undefined,
): LeaderboardTab {
  if (
    value === "aura" ||
    value === "views" ||
    value === "likes" ||
    value === "comments" ||
    value === "collectors" ||
    value === "newest"
  ) {
    return value;
  }

  return "aura";
}

export async function getLeaderboardEntries(
  tab: LeaderboardTab,
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const entries = await buildLeaderboardBaseEntries();
  const rankedEntries = sortLeaderboardEntries(entries, tab)
    .slice(0, limit)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return hydrateLeaderboardEntries(rankedEntries);
}

export async function getDashboardRankingSummary(
  userId: string,
): Promise<DashboardRankingSummary | null> {
  const entries = await buildLeaderboardBaseEntries();
  const currentEntry = entries.find((entry) => entry.id === userId);

  if (!currentEntry) {
    return null;
  }

  const byViews = sortLeaderboardEntries(entries, "views");
  const byLikes = sortLeaderboardEntries(entries, "likes");

  return {
    viewsRank: byViews.findIndex((entry) => entry.id === userId) + 1,
    likesRank: byLikes.findIndex((entry) => entry.id === userId) + 1,
    commentCount: currentEntry.comments,
  };
}

export async function getAuraLeaderboardEntries(
  limit = 50,
): Promise<AuraLeaderboardEntry[]> {
  return getLeaderboardEntries("aura", limit);
}

async function buildLeaderboardBaseEntries(): Promise<LeaderboardBaseEntry[]> {
  const [activeUsers, viewGroups, likeGroups, commentGroups, badgeGroups] =
    await Promise.all([
      prisma.user.findMany({
        where: {
          status: "active",
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          plan: true,
          premiumBadge: true,
          premiumUntil: true,
          subscriptionStatus: true,
          createdAt: true,
          auraScore: true,
          auraRank: true,
        },
      }),
      prisma.profileView.groupBy({
        by: ["userId"],
        _count: {
          userId: true,
        },
      }),
      prisma.reaction.groupBy({
        by: ["toUserId"],
        where: {
          type: "like",
        },
        _count: {
          toUserId: true,
        },
      }),
      prisma.profileComment.groupBy({
        by: ["profileUserId"],
        where: {
          isDeleted: false,
        },
        _count: {
          profileUserId: true,
        },
      }),
      prisma.userBadge.groupBy({
        by: ["userId"],
        _count: {
          userId: true,
        },
      }),
    ]);

  const activeUserIds = new Set(activeUsers.map((user) => user.id));
  const viewsByUserId = new Map(
    viewGroups
      .filter((group) => activeUserIds.has(group.userId))
      .map((group) => [group.userId, group._count.userId]),
  );
  const likesByUserId = new Map(
    likeGroups
      .filter((group) => activeUserIds.has(group.toUserId))
      .map((group) => [group.toUserId, group._count.toUserId]),
  );
  const commentsByUserId = new Map(
    commentGroups
      .filter((group) => activeUserIds.has(group.profileUserId))
      .map((group) => [group.profileUserId, group._count.profileUserId]),
  );
  const badgesByUserId = new Map(
    badgeGroups
      .filter((group) => activeUserIds.has(group.userId))
      .map((group) => [group.userId, group._count.userId]),
  );

  return activeUsers.map((user) =>
    mapLeaderboardEntry(user, {
      views: viewsByUserId.get(user.id) ?? 0,
      likes: likesByUserId.get(user.id) ?? 0,
      comments: commentsByUserId.get(user.id) ?? 0,
      badgeCount: badgesByUserId.get(user.id) ?? 0,
    }),
  );
}

async function hydrateLeaderboardEntries(
  entries: LeaderboardBaseEntry[],
): Promise<LeaderboardEntry[]> {
  if (entries.length === 0) {
    return [];
  }

  const userIds = entries.map((entry) => entry.id);
  const detailRows = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      profileComposition: true,
      badges: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          badge: {
            select: {
              slug: true,
              name: true,
              icon: true,
              color: true,
              rarity: true,
              description: true,
              category: true,
            },
          },
        },
      },
    },
  });
  const detailsByUserId = new Map(
    detailRows.map((detail) => [
      detail.id,
      detail as LeaderboardUserDetailRow,
    ]),
  );

  return entries.map((entry) => {
    const detail = detailsByUserId.get(entry.id);
    const composition = normalizeProfileComposition(detail?.profileComposition);
    const featuredBadgeShowcase = detail
      ? getFeaturedPublicBadges(
          detail.badges,
          3,
          composition.metadata.favoriteBadgeSlugs,
        )
      : { badges: [], extraCount: 0 };
    const rareBadgeCount =
      detail?.badges.filter((badgeEntry) => badgeEntry.badge.rarity === "rare")
        .length ?? 0;
    const legendaryBadgeCount =
      detail?.badges.filter(
        (badgeEntry) =>
          badgeEntry.badge.rarity === "legendary" ||
          badgeEntry.badge.rarity === "owner",
      ).length ?? 0;

    return {
      ...entry,
      rareBadgeCount,
      legendaryBadgeCount,
      featuredBadges: featuredBadgeShowcase.badges.map((badgeEntry) => ({
        id: badgeEntry.id,
        slug: badgeEntry.badge.slug,
        name: badgeEntry.badge.name,
        icon: badgeEntry.badge.icon,
        color: badgeEntry.badge.color,
        rarity: badgeEntry.badge.rarity,
      })),
      extraBadgeCount: featuredBadgeShowcase.extraCount,
    };
  });
}

function mapLeaderboardEntry(
  user: LeaderboardUserRow,
  metrics: {
    views: number;
    likes: number;
    comments: number;
    badgeCount: number;
  },
): LeaderboardBaseEntry {
  return {
    id: user.id,
    rank: 0,
    username: user.username,
    displayName: user.displayName?.trim() || user.username,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isPremium: hasPremiumAccess(user),
    createdAt: user.createdAt,
    auraScore: user.auraScore,
    auraRank: user.auraRank,
    views: metrics.views,
    likes: metrics.likes,
    comments: metrics.comments,
    badgeCount: metrics.badgeCount,
  };
}

function sortLeaderboardEntries(
  entries: LeaderboardBaseEntry[],
  tab: LeaderboardTab,
) {
  return [...entries].sort((left, right) => {
    if (tab === "newest") {
      return compareDescending(
        [left.createdAt.getTime(), left.auraScore, left.views],
        [right.createdAt.getTime(), right.auraScore, right.views],
        left.username,
        right.username,
      );
    }

    if (tab === "likes") {
      return compareDescending(
        [left.likes, left.views, left.auraScore],
        [right.likes, right.views, right.auraScore],
        left.username,
        right.username,
      );
    }

    if (tab === "comments") {
      return compareDescending(
        [left.comments, left.likes, left.auraScore],
        [right.comments, right.likes, right.auraScore],
        left.username,
        right.username,
      );
    }

    if (tab === "collectors") {
      return compareDescending(
        [left.badgeCount, left.auraScore, left.likes],
        [right.badgeCount, right.auraScore, right.likes],
        left.username,
        right.username,
      );
    }

    if (tab === "aura") {
      return compareDescending(
        [left.auraScore, left.likes, left.views],
        [right.auraScore, right.likes, right.views],
        left.username,
        right.username,
      );
    }

    return compareDescending(
      [left.views, left.likes, left.auraScore],
      [right.views, right.likes, right.auraScore],
      left.username,
      right.username,
    );
  });
}

function compareDescending(
  leftMetrics: number[],
  rightMetrics: number[],
  leftName: string,
  rightName: string,
) {
  for (let index = 0; index < Math.min(leftMetrics.length, rightMetrics.length); index += 1) {
    const difference = rightMetrics[index] - leftMetrics[index];

    if (difference !== 0) {
      return difference;
    }
  }

  return leftName.localeCompare(rightName);
}
