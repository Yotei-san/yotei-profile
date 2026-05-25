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
    name: "Owner",
    icon: "y-crest",
    description: "Official Yotei founder badge.",
    color: "#f4c97a",
    category: "official",
    rarity: "owner",
    claimKind: "official-only",
    requirement: "Granted manually by admin or owner.",
  },
  {
    slug: "admin",
    name: "Admin",
    icon: "command-shield",
    description: "Official Yotei administration badge.",
    color: "#7dc4ff",
    category: "official",
    rarity: "legendary",
    claimKind: "official-only",
    requirement: "Granted manually by admin or owner.",
  },
  {
    slug: "staff",
    name: "Staff",
    icon: "gear-star",
    description: "Official staff member badge.",
    color: "#8ce6ff",
    category: "official",
    rarity: "rare",
    claimKind: "official-only",
    requirement: "Granted manually by admin or owner.",
  },
  {
    slug: "verified",
    name: "Verified",
    icon: "check-shield",
    description: "Official verified account badge.",
    color: "#6ee7b7",
    category: "official",
    rarity: "rare",
    claimKind: "official-only",
    requirement: "Reserved for manual platform verification.",
  },
  {
    slug: "premium",
    name: "Premium",
    icon: "gem-star",
    description: "Premium account badge for active subscribers and privileged accounts.",
    color: "#ff8ccb",
    category: "premium",
    rarity: "epic",
    claimKind: "premium-claim",
    requirement: "Requires an active premium plan or premium access.",
  },
  {
    slug: "supporter",
    name: "Supporter",
    icon: "heart-gem",
    description: "Reserved for supporter rewards and future premium campaigns.",
    color: "#f5d06e",
    category: "premium",
    rarity: "rare",
    claimKind: "premium-locked",
    requirement: "Not available for claim in this phase.",
  },
  {
    slug: "early-supporter",
    name: "Early Supporter",
    icon: "sunrise-star",
    description: "Reserved for early support campaigns and limited Yotei drops.",
    color: "#f59e0b",
    category: "premium",
    rarity: "legendary",
    claimKind: "premium-locked",
    requirement: "Not available for claim in this phase.",
  },
  {
    slug: "first-profile",
    name: "First Profile",
    icon: "flag-spark",
    description: "Finished the first core version of your public profile.",
    color: "#7dd3fc",
    category: "achievement",
    rarity: "common",
    claimKind: "achievement-claim",
    requirement: "Add avatar, banner and bio.",
  },
  {
    slug: "first-link",
    name: "First Link",
    icon: "chain-link",
    description: "Published the first actionable link on your profile.",
    color: "#c4b5fd",
    category: "achievement",
    rarity: "common",
    claimKind: "achievement-claim",
    requirement: "Create at least 1 link.",
  },
  {
    slug: "social-starter",
    name: "Social Starter",
    icon: "chat-orbit",
    description: "Activated your first social identity block.",
    color: "#60a5fa",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable at least 1 social block.",
  },
  {
    slug: "social-pro",
    name: "Social Pro",
    icon: "network-orbit",
    description: "Built a richer social presence with multiple active blocks.",
    color: "#a78bfa",
    category: "achievement",
    rarity: "epic",
    claimKind: "achievement-claim",
    requirement: "Enable at least 3 social blocks.",
  },
  {
    slug: "template-creator",
    name: "Template Creator",
    icon: "layout-grid",
    description: "Created your first reusable profile template.",
    color: "#f472b6",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Create at least 1 template.",
  },
  {
    slug: "popular",
    name: "Popular",
    icon: "flame",
    description: "Reached a meaningful audience on your public profile.",
    color: "#fb7185",
    category: "achievement",
    rarity: "epic",
    claimKind: "achievement-claim",
    requirement: "Reach at least 100 profile views.",
  },
  {
    slug: "rising",
    name: "Rising",
    icon: "arrow-star",
    description: "Collected the first wave of positive reactions from visitors.",
    color: "#38bdf8",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Reach at least 10 likes.",
  },
  {
    slug: "builder",
    name: "Builder",
    icon: "hammer-cube",
    description: "Showed your build-in-public side with an active GitHub block.",
    color: "#93c5fd",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable an active GitHub social block.",
  },
  {
    slug: "music-taste",
    name: "Music Taste",
    icon: "music-wave",
    description: "Connected your music identity through Spotify.",
    color: "#34d399",
    category: "achievement",
    rarity: "rare",
    claimKind: "achievement-claim",
    requirement: "Enable an active Spotify social block.",
  },
  {
    slug: "streamer",
    name: "Streamer",
    icon: "broadcast-live",
    description: "Reserved for creators with proven live audience and manual Yotei review.",
    color: "#fb7185",
    category: "achievement",
    rarity: "epic",
    claimKind: "manual-review",
    requirement:
      "Requires proof of 10,000+ followers/subscribers on Twitch, YouTube, Kick, TikTok Live or another live platform.",
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
  limit = 4
) {
  const sorted = sortBadgesForPublicProfile(badges);

  return {
    badges: sorted.slice(0, limit),
    extraCount: Math.max(0, sorted.length - limit),
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
