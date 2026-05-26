import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FaCircle, FaCrown, FaShieldHalved } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import { getCurrentUser } from "@/app/lib/auth";
import { getFeaturedPublicBadges } from "@/app/lib/badges";
import { resolveEquippedDecoration } from "@/app/lib/decorations";
import { readLiveEmbedMetadata } from "@/app/lib/live-embed";
import {
  isMissingProfileCompositionColumnError,
  normalizeProfileComposition,
} from "@/app/lib/profile-composition";
import { normalizeProfileMusic } from "@/app/lib/profile-music";
import {
  isMissingProfileCustomizationColumnError,
  normalizeProfileBackgroundIntensity,
  normalizeProfileBannerStyle,
  normalizeProfileCardStyle,
  normalizeProfileCornerStyle,
  normalizeProfileDensity,
  normalizeProfileGlassIntensity,
  normalizeProfileIntroMode,
  normalizeProfileMotionLevel,
  normalizeProfileNameEffects,
} from "@/app/lib/profile-customization";
import {
  isMissingProfileSceneColumnError,
  normalizeProfileScene,
} from "@/app/lib/profile-scenes";
import {
  normalizeProfileAura,
  normalizeProfileMood,
} from "@/app/lib/profile-presence";
import { getMediaKind } from "@/app/lib/profile-media";
import { hasPremiumAccess } from "@/app/lib/premium";
import { prisma } from "@/app/lib/prisma";
import PublicProfileRenderer, {
  type PublicProfileHeroPill,
  type PublicProfileReaction,
  type PublicProfileRenderUser,
} from "./PublicProfileRenderer";
import type { PublicProfileLayout } from "./ProfileLayoutVariants";
import type { PublicSocialBlock } from "./SocialPresenceSection";

type Props = {
  params: Promise<{ username: string }>;
};

type ProfileUserRecord = NonNullable<
  Awaited<ReturnType<typeof getProfileUser>>
>;

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  const user = await getProfileUser(username);

  if (!user || user.status === "banned") {
    notFound();
  }

  let initialMyReaction: PublicProfileReaction = null;
  const [myReaction, commentCount] = await Promise.all([
    currentUser && currentUser.id !== user.id
      ? prisma.reaction.findFirst({
          where: {
            fromUserId: currentUser.id,
            toUserId: user.id,
          },
          select: {
            type: true,
          },
        })
      : Promise.resolve(null),
    prisma.profileComment.count({
      where: {
        profileUserId: user.id,
        isDeleted: false,
      },
    }),
  ]);

  if (myReaction?.type === "like" || myReaction?.type === "dislike") {
    initialMyReaction = myReaction.type;
  }

  const profileData = buildProfileRenderData(user, {
    initialCommentCount: commentCount,
    canComment: Boolean(currentUser),
    isOwnProfile: currentUser?.id === user.id,
  });

  return (
    <PublicProfileRenderer
      {...profileData}
      initialMyReaction={initialMyReaction}
    />
  );
}

async function getProfileUser(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: buildProfileUserSelect(true, true),
    });
  } catch (error) {
    if (
      isMissingProfileCompositionColumnError(error) ||
      isMissingProfileSceneColumnError(error) ||
      isMissingProfileCustomizationColumnError(error)
    ) {
      return prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        select: buildProfileUserSelect(false, false),
      });
    }

    throw error;
  }
}

function buildProfileRenderData(
  user: ProfileUserRecord,
  interactionState: {
    initialCommentCount: number;
    canComment: boolean;
    isOwnProfile: boolean;
  },
) {
  const themeColor = normalizeThemeColor(user.themeColor);
  const layout = normalizeProfileLayout(user.profileLayout);
  const displayName = user.displayName || user.username;
  const composition = normalizeProfileComposition(
    "profileComposition" in user ? user.profileComposition : undefined,
  );
  const decorationScale = user.selectedDecorationScale ?? 165;
  const decorationOffsetX = user.selectedDecorationOffsetX ?? 0;
  const decorationOffsetY = user.selectedDecorationOffsetY ?? 0;
  const featuredBadgeShowcase = getFeaturedPublicBadges(
    user.badges,
    4,
    composition.metadata.favoriteBadgeSlugs,
  );
  const hasPremiumState = hasPremiumAccess(user);
  const selectedDecoration = resolveEquippedDecoration(user.selectedDecoration, user);

  return {
    layout,
    user: {
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      selectedDecorationScale: user.selectedDecorationScale,
      selectedDecorationOffsetX: user.selectedDecorationOffsetX,
      selectedDecorationOffsetY: user.selectedDecorationOffsetY,
      selectedDecoration,
      links: user.links,
    } satisfies PublicProfileRenderUser,
    displayName,
    themeColor,
    mood: normalizeProfileMood(user.profileMood),
    aura: normalizeProfileAura(user.profileAura),
    scene: normalizeProfileScene("profileScene" in user ? user.profileScene : undefined),
    nameEffects: normalizeProfileNameEffects(
      "profileNameEffects" in user ? user.profileNameEffects : [],
      hasPremiumState,
    ),
    backgroundIntensity: normalizeProfileBackgroundIntensity(
      "profileBackgroundIntensity" in user ? user.profileBackgroundIntensity : undefined,
    ),
    glassIntensity: normalizeProfileGlassIntensity(
      "profileGlassIntensity" in user ? user.profileGlassIntensity : undefined,
    ),
    bannerStyle: normalizeProfileBannerStyle(
      "profileBannerStyle" in user ? user.profileBannerStyle : undefined,
    ),
    introMode: normalizeProfileIntroMode(
      "profileIntroMode" in user ? user.profileIntroMode : undefined,
    ),
    density: normalizeProfileDensity("layoutStyle" in user ? user.layoutStyle : undefined),
    cardStyle: normalizeProfileCardStyle(
      "buttonStyle" in user ? user.buttonStyle : undefined,
    ),
    cornerStyle: normalizeProfileCornerStyle(
      "linksStyle" in user ? user.linksStyle : undefined,
    ),
    motionLevel: normalizeProfileMotionLevel(
      "avatarPosition" in user ? user.avatarPosition : undefined,
    ),
    composition,
    music: normalizeProfileMusic({
      enabled: user.profileMusicEnabled,
      title: user.profileMusicTitle,
      artist: user.profileMusicArtist,
      url: user.profileMusicUrl,
      provider: user.profileMusicProvider,
    }),
    bannerKind: getMediaKind(user.bannerUrl || ""),
    avatarInitials: getInitials(displayName),
    decorationScale,
    decorationOffsetX,
    decorationOffsetY,
    featuredBadges: featuredBadgeShowcase.badges,
    extraBadgeCount: featuredBadgeShowcase.extraCount,
    heroPills: buildHeroPills(user, hasPremiumState),
    likes: user.reactionsReceived.reduce(
      (acc, item) => (item.type === "like" ? acc + 1 : acc),
      0,
    ),
    dislikes: user.reactionsReceived.reduce(
      (acc, item) => (item.type === "dislike" ? acc + 1 : acc),
      0,
    ),
    views: user.profileViews.length,
    initialCommentCount: interactionState.initialCommentCount,
    canComment: interactionState.canComment,
    isOwnProfile: interactionState.isOwnProfile,
    socialBlocks: mapSocialBlocks(user.socialBlocks),
  };
}

function buildProfileUserSelect(
  includeProfileScene: boolean,
  includeCustomization: boolean,
) {
  return {
    id: true,
    username: true,
    displayName: true,
    bio: true,
    avatarUrl: true,
    bannerUrl: true,
    themeColor: true,
    profileLayout: true,
    profileMood: true,
    profileAura: true,
    ...(includeProfileScene ? { profileScene: true } : {}),
    ...(includeCustomization
      ? {
          profileNameEffects: true,
          profileBackgroundIntensity: true,
          profileGlassIntensity: true,
          profileBannerStyle: true,
          profileIntroMode: true,
          profileComposition: true,
          layoutStyle: true,
          buttonStyle: true,
          linksStyle: true,
          avatarPosition: true,
        }
      : {}),
    profileMusicTitle: true,
    profileMusicArtist: true,
    profileMusicUrl: true,
    profileMusicProvider: true,
    profileMusicEnabled: true,
    status: true,
    role: true,
    plan: true,
    premiumBadge: true,
    premiumUntil: true,
    subscriptionStatus: true,
    selectedDecorationScale: true,
    selectedDecorationOffsetX: true,
    selectedDecorationOffsetY: true,
    selectedDecoration: {
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        previewUrl: true,
        posterUrl: true,
        mediaType: true,
        overlayScale: true,
        overlayOffsetY: true,
      },
    },
    badges: {
      include: {
        badge: true,
      },
      orderBy: {
        createdAt: "desc" as const,
      },
    },
    links: {
      orderBy: [{ position: "asc" as const }, { createdAt: "asc" as const }],
      select: {
        id: true,
        title: true,
        url: true,
      },
    },
    socialBlocks: {
      where: {
        isEnabled: true,
      },
      orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
      select: {
        id: true,
        platform: true,
        title: true,
        username: true,
        url: true,
        metadata: true,
        isEnabled: true,
      },
    },
    reactionsReceived: {
      select: {
        type: true,
      },
    },
    profileViews: {
      select: {
        id: true,
      },
    },
  };
}

function buildHeroPills(
  user: Pick<
    ProfileUserRecord,
    "role" | "status"
  >,
  hasPremiumState: boolean,
): PublicProfileHeroPill[] {
  const statusLabel = getStatusLabel(user.status);

  return [
    ...(user.role === "owner"
      ? [
          {
            key: "owner",
            text: "Owner",
            icon: <FaCrown size={11} />,
            color: "#f4cf7c",
          },
        ]
      : []),
    ...(user.role === "admin"
      ? [
          {
            key: "admin",
            text: "Admin",
            icon: <FaShieldHalved size={11} />,
            color: "#88beff",
          },
        ]
      : []),
    ...(hasPremiumState
      ? [
          {
            key: "premium",
            text: "Premium",
            icon: <LuSparkles size={12} />,
            color: "#ff9fcb",
          },
        ]
      : []),
    {
      key: "status",
      text: statusLabel,
      icon: <FaCircle size={8} />,
      color: user.status === "active" ? "#51d88a" : "#b4bed2",
    },
  ];
}

function mapSocialBlocks(
  blocks: ProfileUserRecord["socialBlocks"],
): PublicSocialBlock[] {
  return blocks.map((block) => {
    const metadata = getMetadataObject(block.metadata);
    const liveMetadata = readLiveEmbedMetadata(block.metadata);

    return {
      id: block.id,
      platform: block.platform,
      title: block.title,
      username: block.username,
      url: block.url,
      statusText:
        block.platform === "github" || block.platform === "spotify"
          ? readMetadataValue(metadata, "statusText")
          : readMetadataValue(metadata, "shortStatus"),
      featuredRepo: readMetadataValue(metadata, "featuredRepo"),
      trackName: readMetadataValue(metadata, "trackName"),
      artistName: readMetadataValue(metadata, "artistName"),
      headline: readMetadataValue(metadata, "headline"),
      featuredVideoTitle: readMetadataValue(metadata, "featuredVideoTitle"),
      streamTitle: liveMetadata.streamTitle,
      embedUrl: liveMetadata.embedUrl,
      openUrl: liveMetadata.openUrl,
      accentColor: liveMetadata.accentColor,
      isLive: liveMetadata.isLive,
      isEnabled: block.isEnabled,
    };
  });
}

function normalizeProfileLayout(value: string | null | undefined): PublicProfileLayout {
  if (
    value === "default" ||
    value === "modern" ||
    value === "simplistic" ||
    value === "portfolio"
  ) {
    return value;
  }

  return "modern";
}

function getInitials(input: string) {
  return (
    input
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "Y"
  );
}

function getStatusLabel(status: string) {
  if (status === "active") {
    return "Online";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function normalizeThemeColor(value: string | null | undefined) {
  const trimmed = value?.trim() || "";
  const shortHexMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed);

  if (shortHexMatch) {
    return `#${shortHexMatch[1]
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`;
  }

  if (/^#([0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed;
  }

  return "#f472b6";
}

function getMetadataObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readMetadataValue(
  metadata: Record<string, unknown> | null,
  key: string,
) {
  if (!metadata) {
    return null;
  }

  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
