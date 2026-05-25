import type { CSSProperties } from "react";
import Link from "next/link";
import { FaCircle, FaCrown, FaShieldHalved } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import {
  DashboardNotice,
  DashboardPageHeader,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
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
import type {
  PublicProfileHeroPill,
  PublicProfileRenderUser,
} from "@/app/[username]/PublicProfileRenderer";
import type { PublicProfileLayout } from "@/app/[username]/ProfileLayoutVariants";
import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
import ProfileLayoutExperience from "./ProfileLayoutExperience";
import ProfileMediaUploader from "./ProfileMediaUploader";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type ProfileUserRecord = NonNullable<
  Awaited<ReturnType<typeof getDashboardProfileUser>>
>;

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};
  const user = await getDashboardProfileUser(sessionUser.id);
  const resolvedUser = user ?? (await redirectWithClearedSession());
  const profileData = buildProfileRenderData(resolvedUser);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Profile editor"
        title="Refine the public identity visitors see first."
        description="Update profile copy, theme color, media, and layout while keeping a real preview of the final presentation."
        actions={
          <>
            <Link href="/dashboard" style={dashboardButtonStyle("secondary")}>
              Back to dashboard
            </Link>
            <Link
              href={`/${resolvedUser.username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
            >
              Open profile
            </Link>
          </>
        }
        aside={
          <div style={summaryCardStyle}>
            <div style={dashboardTagStyle("pink")}>
              {profileData.layout} layout
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={summaryValueStyle}>
                {resolvedUser.displayName || resolvedUser.username}
              </div>
              <div style={dashboardMutedTextStyle}>@{resolvedUser.username}</div>
              <div style={dashboardMutedTextStyle}>
                {resolvedUser.bio || "Add a short bio to make the profile feel more complete."}
              </div>
            </div>
          </div>
        }
      />

      {params.success === "saved" ? (
        <DashboardNotice tone="success">Profile saved successfully.</DashboardNotice>
      ) : null}
      {params.error === "save-failed" ? (
        <DashboardNotice tone="error">
          Unable to save the profile right now.
        </DashboardNotice>
      ) : null}

      <section style={dashboardAutoGridStyle(320)}>
        <ProfileMediaUploader
          type="avatar"
          currentUrl={resolvedUser.avatarUrl}
          themeColor={resolvedUser.themeColor}
        />

        <ProfileMediaUploader
          type="banner"
          currentUrl={resolvedUser.bannerUrl}
          themeColor={resolvedUser.themeColor}
        />
      </section>

      <ProfileLayoutExperience
        initialDisplayName={resolvedUser.displayName || ""}
        initialBio={resolvedUser.bio || ""}
        initialThemeColor={resolvedUser.themeColor || "#f472b6"}
        savedLayout={profileData.layout}
        savedMood={profileData.mood}
        savedAura={profileData.aura}
        savedScene={profileData.scene}
        savedNameEffects={profileData.nameEffects}
        savedBackgroundIntensity={profileData.backgroundIntensity}
        savedGlassIntensity={profileData.glassIntensity}
        savedBannerStyle={profileData.bannerStyle}
        savedIntroMode={profileData.introMode}
        savedDensity={profileData.density}
        savedCardStyle={profileData.cardStyle}
        savedCornerStyle={profileData.cornerStyle}
        savedMotionLevel={profileData.motionLevel}
        savedComposition={profileData.composition}
        initialMusic={profileData.music}
        previewUser={profileData.user}
        bannerKind={profileData.bannerKind}
        avatarInitials={profileData.avatarInitials}
        decorationScale={profileData.decorationScale}
        decorationOffsetX={profileData.decorationOffsetX}
        decorationOffsetY={profileData.decorationOffsetY}
        featuredBadges={profileData.featuredBadges}
        extraBadgeCount={profileData.extraBadgeCount}
        heroPills={profileData.heroPills}
        likes={profileData.likes}
        dislikes={profileData.dislikes}
        views={profileData.views}
        initialCommentCount={profileData.initialCommentCount}
        canComment={profileData.canComment}
        isOwnProfile={profileData.isOwnProfile}
        socialBlocks={profileData.socialBlocks}
        hasPremiumAccess={profileData.hasPremiumState}
      />
    </main>
  );
}

async function getDashboardProfileUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: buildDashboardProfileUserSelect(true, true),
    });
  } catch (error) {
    if (
      isMissingProfileCompositionColumnError(error) ||
      isMissingProfileSceneColumnError(error) ||
      isMissingProfileCustomizationColumnError(error)
    ) {
      return prisma.user.findUnique({
        where: { id: userId },
        select: buildDashboardProfileUserSelect(false, false),
      });
    }

    throw error;
  }
}

function buildProfileRenderData(user: ProfileUserRecord) {
  const themeColor = normalizeThemeColor(user.themeColor);
  const layout = normalizeProfileLayout(user.profileLayout);
  const displayName = user.displayName || user.username;
  const decorationScale = user.selectedDecorationScale ?? 165;
  const decorationOffsetX = user.selectedDecorationOffsetX ?? 0;
  const decorationOffsetY = user.selectedDecorationOffsetY ?? 0;
  const featuredBadgeShowcase = getFeaturedPublicBadges(user.badges, 4);
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
    composition: normalizeProfileComposition(
      "profileComposition" in user ? user.profileComposition : undefined,
    ),
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
    initialCommentCount: user.profileCommentsReceived.length,
    canComment: true,
    isOwnProfile: true,
    socialBlocks: mapSocialBlocks(user.socialBlocks),
    hasPremiumState,
  };
}

function buildDashboardProfileUserSelect(
  includeProfileScene: boolean,
  includeCustomization: boolean,
) {
  return {
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
    profileCommentsReceived: {
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
      },
    },
  };
}


function buildHeroPills(
  user: Pick<ProfileUserRecord, "role" | "status">,
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

const summaryCardStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "20px",
  gap: "14px",
};

const summaryValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 900,
  lineHeight: 1.2,
};
