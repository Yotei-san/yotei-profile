import { prisma } from "@/app/lib/prisma";
import {
  BADGE_DEFINITIONS,
  ensureDefaultBadges,
  getBadgeDefinition,
  giveBadgeToUser,
  isPremiumOrPrivilegedUser,
  type BadgeCategory,
  type BadgeDefinition,
} from "@/app/lib/badges";

export type BadgeFilter =
  | "all"
  | "official"
  | "premium"
  | "achievements"
  | "claimed"
  | "locked";

export type BadgeCardStatus =
  | "claimed"
  | "claimable"
  | "official-only"
  | "premium-required"
  | "manual-review"
  | "locked"
  | "not-available";

export type BadgeMissionCardState = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  category: BadgeCategory;
  rarity: string;
  requirement: string;
  progressText: string;
  status: BadgeCardStatus;
  statusLabel: string;
  buttonLabel: string;
  canClaim: boolean;
  isClaimed: boolean;
};

export type BadgeMissionCollection = {
  badges: BadgeMissionCardState[];
  claimedCount: number;
  claimableCount: number;
  lockedCount: number;
};

type BadgeMissionContext = {
  userId: string;
  username: string;
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
  emailVerified: Date | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  claimedSlugs: Set<string>;
  linkCount: number;
  activeSocialBlockCount: number;
  githubBlockCount: number;
  spotifyBlockCount: number;
  streamerBlockCount: number;
  templateCount: number;
  profileViewCount: number;
  likeCount: number;
};

type ClaimBadgeResult =
  | { status: "claimed"; username: string }
  | { status: "already-claimed" }
  | { status: "badge-not-found" }
  | { status: "official-only" }
  | { status: "premium-required" }
  | { status: "manual-review" }
  | { status: "locked" }
  | { status: "not-available" };

export async function getBadgeMissionCollection(
  userId: string
): Promise<BadgeMissionCollection> {
  await ensureDefaultBadges();

  const context = await loadBadgeMissionContext(userId);

  if (!context) {
    return {
      badges: [],
      claimedCount: 0,
      claimableCount: 0,
      lockedCount: 0,
    };
  }

  const badges = BADGE_DEFINITIONS.map((definition) =>
    buildBadgeMissionCardState(definition, context)
  );

  return {
    badges,
    claimedCount: badges.filter((badge) => badge.isClaimed).length,
    claimableCount: badges.filter((badge) => badge.status === "claimable").length,
    lockedCount: badges.filter((badge) => badge.status !== "claimed").length,
  };
}

export async function claimMissionBadgeForUser(
  userId: string,
  badgeSlug: string
): Promise<ClaimBadgeResult> {
  await ensureDefaultBadges();

  const definition = getBadgeDefinition(badgeSlug);

  if (!definition) {
    return { status: "badge-not-found" };
  }

  const context = await loadBadgeMissionContext(userId);

  if (!context) {
    return { status: "badge-not-found" };
  }

  const state = buildBadgeMissionCardState(definition, context);

  if (state.isClaimed) {
    return { status: "already-claimed" };
  }

  if (state.status === "official-only") {
    return { status: "official-only" };
  }

  if (state.status === "premium-required") {
    return { status: "premium-required" };
  }

  if (state.status === "manual-review") {
    return { status: "manual-review" };
  }

  if (state.status === "locked") {
    return { status: "locked" };
  }

  if (state.status === "not-available") {
    return { status: "not-available" };
  }

  await giveBadgeToUser(userId, badgeSlug);

  return {
    status: "claimed",
    username: context.username,
  };
}

export function parseBadgeFilter(value: string | undefined): BadgeFilter {
  if (
    value === "official" ||
    value === "premium" ||
    value === "achievements" ||
    value === "claimed" ||
    value === "locked"
  ) {
    return value;
  }

  return "all";
}

export function filterBadgeMissionCards(
  badges: BadgeMissionCardState[],
  filter: BadgeFilter
) {
  if (filter === "official") {
    return badges.filter((badge) => badge.category === "official");
  }

  if (filter === "premium") {
    return badges.filter((badge) => badge.category === "premium");
  }

  if (filter === "achievements") {
    return badges.filter((badge) => badge.category === "achievement");
  }

  if (filter === "claimed") {
    return badges.filter((badge) => badge.isClaimed);
  }

  if (filter === "locked") {
    return badges.filter(
      (badge) => !badge.isClaimed && badge.status !== "claimable"
    );
  }

  return badges;
}

async function loadBadgeMissionContext(userId: string): Promise<BadgeMissionContext | null> {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
      emailVerified: true,
      avatarUrl: true,
      bannerUrl: true,
      bio: true,
      badges: {
        select: {
          badge: {
            select: {
              slug: true,
            },
          },
        },
      },
    } as any,
  })) as
    | {
        id: string;
        username: string;
        role: string;
        plan: string;
        premiumBadge: boolean;
        premiumUntil: Date | null;
        subscriptionStatus: string | null;
        emailVerified: Date | null;
        avatarUrl: string | null;
        bannerUrl: string | null;
        bio: string | null;
        badges: Array<{
          badge: {
            slug: string;
          };
        }>;
      }
    | null;

  if (!user) {
    return null;
  }

  const [
    linkCount,
    activeSocialBlockCount,
    githubBlockCount,
    spotifyBlockCount,
    streamerBlockCount,
    templateCount,
    profileViewCount,
    likeCount,
  ] = await Promise.all([
    prisma.link.count({
      where: {
        userId,
      },
    }),
    prisma.socialBlock.count({
      where: {
        userId,
        isEnabled: true,
      },
    }),
    prisma.socialBlock.count({
      where: {
        userId,
        isEnabled: true,
        platform: "github",
      },
    }),
    prisma.socialBlock.count({
      where: {
        userId,
        isEnabled: true,
        platform: "spotify",
      },
    }),
    prisma.socialBlock.count({
      where: {
        userId,
        isEnabled: true,
        platform: {
          in: ["youtube", "twitch", "twitch_live", "youtube_live", "kick_live"],
        },
      },
    }),
    prisma.profileTemplate.count({
      where: {
        createdByUserId: userId,
      },
    }),
    prisma.profileView.count({
      where: {
        userId,
      },
    }),
    prisma.reaction.count({
      where: {
        toUserId: userId,
        type: "like",
      },
    }),
  ]);

  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    plan: user.plan,
    premiumBadge: user.premiumBadge,
    premiumUntil: user.premiumUntil,
    subscriptionStatus: user.subscriptionStatus,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    claimedSlugs: new Set(user.badges.map((item) => item.badge.slug)),
    linkCount,
    activeSocialBlockCount,
    githubBlockCount,
    spotifyBlockCount,
    streamerBlockCount,
    templateCount,
    profileViewCount,
    likeCount,
  };
}

function buildBadgeMissionCardState(
  definition: BadgeDefinition,
  context: BadgeMissionContext
): BadgeMissionCardState {
  const isClaimed = context.claimedSlugs.has(definition.slug);

  if (definition.category === "official") {
    return {
      ...baseCardState(definition, isClaimed),
      progressText: isClaimed
        ? "Assigned to this account by the Yotei team."
        : "Visible in your armory, but reserved for official Yotei assignment.",
      status: isClaimed ? "claimed" : "official-only",
      statusLabel: isClaimed ? "Equipped" : "Official only",
      buttonLabel: isClaimed ? "Equipped" : "Official only",
      canClaim: false,
    };
  }

  if (definition.category === "premium") {
    return buildPremiumBadgeState(definition, context, isClaimed);
  }

  if (definition.claimKind === "manual-review") {
    return buildManualReviewBadgeState(definition, context, isClaimed);
  }

  return buildAchievementBadgeState(definition, context, isClaimed);
}

function buildPremiumBadgeState(
  definition: BadgeDefinition,
  context: BadgeMissionContext,
  isClaimed: boolean
): BadgeMissionCardState {
  const hasPremium = isPremiumOrPrivilegedUser(context);

  if (isClaimed) {
    return {
      ...baseCardState(definition, true),
      progressText: "Premium access confirmed on this account.",
      status: "claimed",
      statusLabel: "Equipped",
      buttonLabel: "Equipped",
      canClaim: false,
    };
  }

  if (definition.slug === "premium") {
    return {
      ...baseCardState(definition, false),
      progressText: hasPremium
        ? "Premium is active. This badge is ready to equip."
        : "Upgrade to Premium to unlock this badge.",
      status: hasPremium ? "claimable" : "premium-required",
      statusLabel: hasPremium ? "Unlocked" : "Premium required",
      buttonLabel: hasPremium ? "Equip badge" : "View Premium",
      canClaim: hasPremium,
    };
  }

  return {
    ...baseCardState(definition, false),
    progressText: hasPremium
      ? "This premium badge exists, but it has not been released yet."
      : "Upgrade to Premium before this badge can become available.",
    status: hasPremium ? "not-available" : "premium-required",
    statusLabel: hasPremium ? "Coming soon" : "Premium required",
    buttonLabel: hasPremium ? "Coming soon" : "View Premium",
    canClaim: false,
  };
}

function buildAchievementBadgeState(
  definition: BadgeDefinition,
  context: BadgeMissionContext,
  isClaimed: boolean
): BadgeMissionCardState {
  const progress = getAchievementProgress(definition.slug, context);
  const completed = progress.current >= progress.target;

  if (isClaimed) {
    return {
      ...baseCardState(definition, true),
      progressText: progress.completedText,
      status: "claimed",
      statusLabel: "Equipped",
      buttonLabel: "Equipped",
      canClaim: false,
    };
  }

  return {
    ...baseCardState(definition, false),
    progressText: completed ? progress.completedText : progress.progressText,
    status: completed ? "claimable" : "locked",
    statusLabel: completed ? "Unlocked" : "Locked",
    buttonLabel: completed ? "Equip badge" : "Complete mission",
    canClaim: completed,
  };
}

function buildManualReviewBadgeState(
  definition: BadgeDefinition,
  context: BadgeMissionContext,
  isClaimed: boolean
): BadgeMissionCardState {
  if (isClaimed) {
    return {
      ...baseCardState(definition, true),
      progressText: "Granted after manual review and creator proof validation.",
      status: "claimed",
      statusLabel: "Equipped",
      buttonLabel: "Equipped",
      canClaim: false,
    };
  }

  const hasStreamingPresence = context.streamerBlockCount > 0;

  return {
    ...baseCardState(definition, false),
    progressText: hasStreamingPresence
      ? "Live presence detected. Manual review and audience proof are still required."
      : "Connect a supported stream presence first. After that, this badge goes to manual review.",
    status: "manual-review",
    statusLabel: "Review queue",
    buttonLabel: "Review queue",
    canClaim: false,
  };
}

function getAchievementProgress(slug: string, context: BadgeMissionContext) {
  const profileEssentials = [
    Boolean(context.avatarUrl),
    Boolean(context.bannerUrl),
    Boolean(context.bio && context.bio.trim().length > 0),
  ].filter(Boolean).length;

  if (slug === "first-profile") {
    return {
      current: profileEssentials,
      target: 3,
      progressText: `${profileEssentials} / 3 profile basics complete`,
      completedText: "Avatar, banner and bio are ready.",
    };
  }

  if (slug === "first-link") {
    return {
      current: Math.min(context.linkCount, 1),
      target: 1,
      progressText: `${Math.min(context.linkCount, 1)} / 1 link added`,
      completedText: "Your first link is live.",
    };
  }

  if (slug === "social-starter") {
    return {
      current: Math.min(context.activeSocialBlockCount, 1),
      target: 1,
      progressText: `${Math.min(context.activeSocialBlockCount, 1)} / 1 social block enabled`,
      completedText: "Your first social block is live.",
    };
  }

  if (slug === "social-pro") {
    return {
      current: Math.min(context.activeSocialBlockCount, 3),
      target: 3,
      progressText: `${Math.min(context.activeSocialBlockCount, 3)} / 3 social blocks enabled`,
      completedText: "Three social blocks are live.",
    };
  }

  if (slug === "template-creator") {
    return {
      current: Math.min(context.templateCount, 1),
      target: 1,
      progressText: `${Math.min(context.templateCount, 1)} / 1 preset created`,
      completedText: "Your first preset is ready.",
    };
  }

  if (slug === "popular") {
    return {
      current: Math.min(context.profileViewCount, 100),
      target: 100,
      progressText: `${context.profileViewCount} / 100 profile views`,
      completedText: "Your profile passed 100 views.",
    };
  }

  if (slug === "rising") {
    return {
      current: Math.min(context.likeCount, 10),
      target: 10,
      progressText: `${context.likeCount} / 10 likes`,
      completedText: "Your profile reached 10 likes.",
    };
  }

  if (slug === "builder") {
    return {
      current: Math.min(context.githubBlockCount, 1),
      target: 1,
      progressText: `${Math.min(context.githubBlockCount, 1)} / 1 GitHub block enabled`,
      completedText: "Your GitHub block is live.",
    };
  }

  if (slug === "music-taste") {
    return {
      current: Math.min(context.spotifyBlockCount, 1),
      target: 1,
      progressText: `${Math.min(context.spotifyBlockCount, 1)} / 1 Spotify block enabled`,
      completedText: "Your Spotify block is live.",
    };
  }

  return {
    current: Math.min(context.streamerBlockCount, 1),
    target: 1,
    progressText: `${Math.min(context.streamerBlockCount, 1)} / 1 stream block enabled`,
    completedText: "Your stream block is live.",
  };
}

function baseCardState(definition: BadgeDefinition, isClaimed: boolean) {
  return {
    slug: definition.slug,
    name: definition.name,
    icon: definition.icon,
    description: definition.description,
    color: definition.color,
    category: definition.category,
    rarity: definition.rarity,
    requirement: definition.requirement,
    isClaimed,
  };
}
