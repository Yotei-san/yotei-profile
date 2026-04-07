import { prisma } from "@/app/lib/prisma";
import { syncMissionBadges, getBadgeMissionProgress } from "@/app/lib/badge-missions";

export const DEFAULT_BADGES = [
  {
    key: "owner",
    name: "Owner",
    description: "Criador e dono do Yotei.",
    icon: "👑",
    color: "#f43f5e",
    category: "special",
    rarity: "owner",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "premium",
    name: "Premium",
    description: "Assinante do plano premium.",
    icon: "✦",
    color: "#c084fc",
    category: "premium",
    rarity: "epic",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "early-user",
    name: "Early User",
    description: "Entrou cedo na fase inicial do Yotei.",
    icon: "🌅",
    color: "#38bdf8",
    category: "milestone",
    rarity: "rare",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "creator",
    name: "Creator",
    description: "Criou 5 links ou mais no perfil.",
    icon: "🛠️",
    color: "#22c55e",
    category: "mission",
    rarity: "rare",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "popular",
    name: "Popular",
    description: "Alcançou 100 visualizações de perfil.",
    icon: "🔥",
    color: "#f97316",
    category: "mission",
    rarity: "epic",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "complete-profile",
    name: "Complete Profile",
    description: "Completou avatar, banner e bio do perfil.",
    icon: "🧩",
    color: "#14b8a6",
    category: "mission",
    rarity: "rare",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "click-master",
    name: "Click Master",
    description: "Acumulou 25 cliques nos links.",
    icon: "⚡",
    color: "#eab308",
    category: "mission",
    rarity: "epic",
    isHidden: false,
    isAutoAwarded: true,
  },
  {
    key: "verified",
    name: "Verified",
    description: "Badge manual concedida pelo dono.",
    icon: "✔️",
    color: "#0ea5e9",
    category: "manual",
    rarity: "epic",
    isHidden: false,
    isAutoAwarded: false,
  },
  {
    key: "beta-tester",
    name: "Beta Tester",
    description: "Participou da fase beta do produto.",
    icon: "🧪",
    color: "#fb7185",
    category: "event",
    rarity: "rare",
    isHidden: false,
    isAutoAwarded: false,
  },
  {
    key: "top10",
    name: "Top 10",
    description: "Entrou no top 10 do leaderboard.",
    icon: "🏆",
    color: "#facc15",
    category: "leaderboard",
    rarity: "legendary",
    isHidden: false,
    isAutoAwarded: false,
  },
] as const;

export function getBadgeGlow(color: string | null | undefined) {
  return `0 0 0 1px ${color ?? "rgba(255,255,255,0.08)"}, 0 12px 35px ${color ?? "rgba(255,255,255,0.10)"}22`;
}

export async function ensureDefaultBadges() {
  for (const badge of DEFAULT_BADGES) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        color: badge.color,
        category: badge.category,
        rarity: badge.rarity,
        isHidden: badge.isHidden,
        isAutoAwarded: badge.isAutoAwarded,
      },
      create: badge,
    });
  }
}

export async function awardBadgeByKey(userId: string, key: string) {
  const badge = await prisma.badge.findUnique({
    where: { key },
    select: { id: true },
  });

  if (!badge) return;

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

export async function removeBadgeByKey(userId: string, key: string) {
  const badge = await prisma.badge.findUnique({
    where: { key },
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

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

export async function syncAutomaticBadges(userId: string) {
  await ensureDefaultBadges();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      plan: true,
      premiumUntil: true,
    },
  });

  if (!user) return;

  const ownerUsername = process.env.BADGE_OWNER_USERNAME?.trim().toLowerCase() || "arthurro";
  const earlyUserDeadline = process.env.BADGE_EARLY_USER_DEADLINE
    ? new Date(process.env.BADGE_EARLY_USER_DEADLINE)
    : new Date("2026-12-31T23:59:59.999Z");

  if (user.username.toLowerCase() === ownerUsername) {
    await awardBadgeByKey(userId, "owner");
  }

  if (isPremiumPlan(user)) {
    await awardBadgeByKey(userId, "premium");
  } else {
    await removeBadgeByKey(userId, "premium");
  }

  if (user.createdAt <= earlyUserDeadline) {
    await awardBadgeByKey(userId, "early-user");
  }

  await syncMissionBadges(userId);
}

export { getBadgeMissionProgress };
