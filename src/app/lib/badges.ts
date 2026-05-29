import { syncUserAura } from "@/app/lib/aura-server";
import { prisma } from "@/app/lib/prisma";

export type BadgeCategory = "official" | "premium" | "achievement";
export type BadgeClaimKind =
  | "official-only"
  | "premium-claim"
  | "premium-locked"
  | "achievement-claim"
  | "manual-review";

export type BadgeDefinition = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  category: BadgeCategory;
  rarity: string;
  claimKind: BadgeClaimKind;
  requirement: string;
  isHidden?: boolean;
  isAutoAwarded?: boolean;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    slug: "owner",
    name: "Founder Signal",
    icon: "y-crest",
    description: "Ceremonial founder relic reserved for the first command signal behind Yotei.",
    color: "#f4c97a",
    category: "official",
    rarity: "owner",
    claimKind: "official-only",
    requirement: "Bound manually by founder command.",
  },
  {
    slug: "admin",
    name: "Armory Command",
    icon: "command-shield",
    description: "Command-grade reactor crest reserved for platform administration.",
    color: "#7dc4ff",
    category: "official",
    rarity: "legendary",
    claimKind: "official-only",
    requirement: "Granted by admin or founder command.",
  },
  {
    slug: "staff",
    name: "Vault Steward",
    icon: "gear-star",
    description: "Operational vault seal carried by trusted Yotei stewards.",
    color: "#8ce6ff",
    category: "official",
    rarity: "rare",
    claimKind: "official-only",
    requirement: "Assigned manually by platform command.",
  },
  {
    slug: "verified",
    name: "Verified Presence",
    icon: "check-shield",
    description: "Identity seal for accounts verified directly by the platform.",
    color: "#6ee7b7",
    category: "official",
    rarity: "rare",
    claimKind: "official-only",
    requirement: "Reserved for manual identity verification.",
  },
  {
    slug: "premium",
    name: "Orbital Reactor",
    icon: "gem-star",
    description: "Charged premium reactor relic for accounts with elevated access.",
    color: "#ff8ccb",
    category: "premium",
    rarity: "epic",
    claimKind: "premium-claim",
    requirement: "Requires active premium access.",
  },
  {
    slug: "supporter",
    name: "Core Supporter",
    icon: "heart-gem",
    description: "Supporter-core relic reserved for future campaigns and loyalty drops.",
    color: "#f5d06e",
    category: "premium",
    rarity: "rare",
    claimKind: "premium-locked",
    requirement: "Vaulted until a future supporter drop.",
  },
  {
    slug: "early-supporter",
    name: "First Wave Relic",
    icon: "sunrise-star",
    description: "Limited launch-era relic reserved for early Yotei supporters.",
    color: "#f59e0b",
    category: "premium",
    rarity: "legendary",
    claimKind: "premium-locked",
    requirement: "Vaulted until a limited founder-era release.",
  },
  {
    slug: "first-profile",
    name: "V1 Identity",
    icon: "flag-spark",
    description: "Launch-phase identity plate for finishing the first public profile core.",
    color: "#7dd3fc",
    category: "achievement",
    rarity: "common",
    claimKind: "achievement-claim",
    requirement: "Complete avatar, banner and bio.",
  },
  {
    slug: "first-link",
    name: "Signal Link",
    icon: "chain-link",
    description: "Utility shard for publishing the first outbound signal from your page.",
    color: "#c4b5fd",
    category: "achievement",
    rarity: "common",
    claimKind: "achievement-claim",
    requirement: "Create at least one live link.",
  },
  {
    slug: "social-starter",
    name: "Ghost Archive",
    icon: "chat-orbit",
    description: "Archive seal for activating your first social identity fragment.",
    color: "#60a5fa",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable at least one social block.",
  },
  {
    slug: "social-pro",
    name: "Presence Grid",
    icon: "network-orbit",
    description: "Multi-node presence array for profiles carrying a fuller social grid.",
    color: "#a78bfa",
    category: "achievement",
    rarity: "epic",
    claimKind: "achievement-claim",
    requirement: "Enable at least three social blocks.",
  },
  {
    slug: "template-creator",
    name: "Identity Builder",
    icon: "layout-grid",
    description: "Builder-grade construct earned by forging your first reusable profile layout.",
    color: "#f472b6",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Create at least one template.",
  },
  {
    slug: "popular",
    name: "Heat Signature",
    icon: "flame",
    description: "Audience heat relic awarded when your profile starts pulling real attention.",
    color: "#fb7185",
    category: "achievement",
    rarity: "epic",
    claimKind: "achievement-claim",
    requirement: "Reach 100 public profile views.",
  },
  {
    slug: "rising",
    name: "Ascendant Signal",
    icon: "arrow-star",
    description: "Rising signal crest for profiles drawing an early wave of positive response.",
    color: "#38bdf8",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Reach 10 profile likes.",
  },
  {
    slug: "builder",
    name: "Dev Verified",
    icon: "hammer-cube",
    description: "Developer seal for profiles carrying a visible GitHub build trail.",
    color: "#93c5fd",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable an active GitHub block.",
  },
  {
    slug: "music-taste",
    name: "Audio Relay",
    icon: "music-wave",
    description: "Audio-linked relay for profiles with an active listening signature.",
    color: "#34d399",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable an active Spotify block.",
  },
  {
    slug: "streamer",
    name: "Stream Sync",
    icon: "broadcast-live",
    description: "Broadcast relic reserved for creators with proven live presence and manual review.",
    color: "#fb7185",
    category: "achievement",
    rarity: "epic",
    claimKind: "manual-review",
    requirement:
      "Requires manual proof of a significant live audience on a supported platform.",
  },
];

const PUBLIC_BADGE_PRIORITY: Record<string, number> = {
  owner: 120,
  admin: 110,
  staff: 100,
  premium: 95,
  verified: 92,
  "early-supporter": 88,
  supporter: 84,
  streamer: 72,
  "social-pro": 70,
  popular: 68,
  rising: 66,
  builder: 64,
  "music-taste": 62,
  "template-creator": 60,
  "social-starter": 58,
  "first-profile": 56,
  "first-link": 54,
};

const RARITY_PRIORITY: Record<string, number> = {
  owner: 80,
  legendary: 70,
  epic: 60,
  rare: 50,
  common: 40,
};

export function getBadgeDefinition(slug: string) {
  return BADGE_DEFINITIONS.find((badge) => badge.slug === slug) ?? null;
}

export async function ensureDefaultBadges() {
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        color: badge.color,
        category: badge.category,
        rarity: badge.rarity,
        isHidden: badge.isHidden ?? false,
        isAutoAwarded: badge.isAutoAwarded ?? false,
      },
      create: {
        slug: badge.slug,
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        color: badge.color,
        category: badge.category,
        rarity: badge.rarity,
        isHidden: badge.isHidden ?? false,
        isAutoAwarded: badge.isAutoAwarded ?? false,
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
    throw new Error("Badge nao encontrada.");
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
  await syncUserAura(userId);
}

export async function awardBadgeByKey(userId: string, badgeSlug: string) {
  await giveBadgeToUser(userId, badgeSlug);
}

export async function removeBadgeFromUser(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug },
    select: { id: true },
  });

  if (!badge) {
    return;
  }

  await prisma.userBadge.deleteMany({
    where: {
      userId,
      badgeId: badge.id,
    },
  });
  await syncUserAura(userId);
}

export function isAdminOrOwnerRole(role: string | null | undefined) {
  return role === "admin" || role === "owner";
}

export function isPremiumOrPrivilegedUser(user: {
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
}) {
  if (isAdminOrOwnerRole(user.role)) {
    return true;
  }

  const hasPremiumPlan =
    user.plan === "premium" &&
    (!user.premiumUntil || new Date(user.premiumUntil) > new Date());

  return (
    hasPremiumPlan ||
    user.premiumBadge ||
    user.subscriptionStatus === "active" ||
    user.subscriptionStatus === "trialing" ||
    user.subscriptionStatus === "past_due"
  );
}

type PublicBadgeEntry = {
  id: string;
  badge: {
    slug: string;
    name: string;
    icon: string;
    description: string | null;
    color: string | null;
    category: string | null;
    rarity: string | null;
  };
};

export function sortBadgesForPublicProfile<T extends PublicBadgeEntry>(badges: T[]) {
  return [...badges].sort((left, right) => {
    const scoreDifference = getPublicBadgeScore(right.badge) - getPublicBadgeScore(left.badge);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.badge.name.localeCompare(right.badge.name);
  });
}

export function getFeaturedPublicBadges<T extends PublicBadgeEntry>(
  badges: T[],
  limit = 4,
  favoriteBadgeSlugs: string[] = [],
) {
  const sorted = sortBadgesForPublicProfile(badges);
  const favoriteSet = new Set(
    favoriteBadgeSlugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean),
  );
  const featured = favoriteSet.size
    ? [
        ...sorted.filter((entry) => favoriteSet.has(entry.badge.slug)),
        ...sorted.filter((entry) => !favoriteSet.has(entry.badge.slug)),
      ]
    : sorted;

  return {
    badges: featured.slice(0, limit),
    extraCount: Math.max(0, featured.length - limit),
  };
}

function getPublicBadgeScore(badge: {
  slug: string;
  category: string | null;
  rarity: string | null;
}) {
  const slugScore = PUBLIC_BADGE_PRIORITY[badge.slug] ?? 0;
  const categoryScore =
    badge.category === "official" ? 30 : badge.category === "premium" ? 20 : 10;
  const rarityScore = RARITY_PRIORITY[badge.rarity || "common"] ?? 0;

  return slugScore + categoryScore + rarityScore;
}
