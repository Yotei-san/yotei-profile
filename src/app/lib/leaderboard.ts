import { prisma } from "@/app/lib/prisma";
import { hasPremiumAccess } from "@/app/lib/premium";

export type LeaderboardTab = "views" | "likes" | "dislikes" | "newest";
export type AuraLeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  isPremium: boolean;
  auraScore: number;
  auraRank: string;
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
  dislikes: number;
};

export type DashboardRankingSummary = {
  viewsRank: number;
  likesRank: number;
  commentCount: number;
};

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

export function normalizeLeaderboardTab(
  value: string | null | undefined,
): LeaderboardTab {
  if (value === "views" || value === "likes" || value === "dislikes" || value === "newest") {
    return value;
  }

  return "views";
}

export async function getLeaderboardEntries(
  tab: LeaderboardTab,
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const entries = await buildLeaderboardEntries();
  const sorted = sortLeaderboardEntries(entries, tab);

  return sorted.slice(0, limit).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export async function getDashboardRankingSummary(
  userId: string,
): Promise<DashboardRankingSummary | null> {
  const [entries, commentCount] = await Promise.all([
    buildLeaderboardEntries(),
    prisma.profileComment.count({
      where: {
        profileUserId: userId,
        isDeleted: false,
      },
    }),
  ]);

  const currentEntry = entries.find((entry) => entry.id === userId);

  if (!currentEntry) {
    return null;
  }

  const byViews = sortLeaderboardEntries(entries, "views");
  const byLikes = sortLeaderboardEntries(entries, "likes");

  return {
    viewsRank: byViews.findIndex((entry) => entry.id === userId) + 1,
    likesRank: byLikes.findIndex((entry) => entry.id === userId) + 1,
    commentCount,
  };
}

export async function getAuraLeaderboardEntries(
  limit = 50,
): Promise<AuraLeaderboardEntry[]> {
  const activeUsers = await prisma.user.findMany({
    where: {
      status: "active",
    },
    orderBy: [
      {
        auraScore: "desc",
      },
      {
        createdAt: "asc",
      },
      {
        username: "asc",
      },
    ],
    take: limit,
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
      auraScore: true,
      auraRank: true,
    },
  });

  return activeUsers.map((user, index) => ({
    id: user.id,
    rank: index + 1,
    username: user.username,
    displayName: user.displayName?.trim() || user.username,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isPremium: hasPremiumAccess(user),
    auraScore: user.auraScore,
    auraRank: user.auraRank,
  }));
}

async function buildLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  const [activeUsers, viewGroups, likeGroups, dislikeGroups] = await Promise.all([
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
    prisma.reaction.groupBy({
      by: ["toUserId"],
      where: {
        type: "dislike",
      },
      _count: {
        toUserId: true,
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
  const dislikesByUserId = new Map(
    dislikeGroups
      .filter((group) => activeUserIds.has(group.toUserId))
      .map((group) => [group.toUserId, group._count.toUserId]),
  );

  return activeUsers.map((user) => mapLeaderboardEntry(user, {
    views: viewsByUserId.get(user.id) ?? 0,
    likes: likesByUserId.get(user.id) ?? 0,
    dislikes: dislikesByUserId.get(user.id) ?? 0,
  }));
}

function mapLeaderboardEntry(
  user: LeaderboardUserRow,
  metrics: {
    views: number;
    likes: number;
    dislikes: number;
  },
): LeaderboardEntry {
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
    dislikes: metrics.dislikes,
  };
}

function sortLeaderboardEntries(entries: LeaderboardEntry[], tab: LeaderboardTab) {
  return [...entries].sort((left, right) => {
    if (tab === "newest") {
      return compareNumbers(
        right.createdAt.getTime(),
        left.createdAt.getTime(),
        right.views,
        left.views,
        left.username,
        right.username,
      );
    }

    if (tab === "likes") {
      return compareNumbers(
        right.likes,
        left.likes,
        right.views,
        left.views,
        left.username,
        right.username,
      );
    }

    if (tab === "dislikes") {
      return compareNumbers(
        right.dislikes,
        left.dislikes,
        right.views,
        left.views,
        left.username,
        right.username,
      );
    }

    return compareNumbers(
      right.views,
      left.views,
      right.likes,
      left.likes,
      left.username,
      right.username,
    );
  });
}

function compareNumbers(
  primaryLeft: number,
  primaryRight: number,
  secondaryLeft: number,
  secondaryRight: number,
  tertiaryLeft: string,
  tertiaryRight: string,
) {
  const primaryDifference = primaryLeft - primaryRight;

  if (primaryDifference !== 0) {
    return primaryDifference;
  }

  const secondaryDifference = secondaryLeft - secondaryRight;

  if (secondaryDifference !== 0) {
    return secondaryDifference;
  }

  return tertiaryLeft.localeCompare(tertiaryRight);
}
