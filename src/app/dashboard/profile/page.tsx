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
import { readLiveEmbedMetadata } from "@/app/lib/live-embed";
import { getMediaKind } from "@/app/lib/profile-media";
import { hasPremiumAccess } from "@/app/lib/premium";
import { prisma } from "@/app/lib/prisma";
import type { PublicProfileHeroPill } from "@/app/[username]/PublicProfileRenderer";
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
        socialBlocks={profileData.socialBlocks}
      />
    </main>
  );
}

async function getDashboardProfileUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
      profileLayout: true,
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
          imageUrl: true,
          previewUrl: true,
          posterUrl: true,
          mediaType: true,
        },
      },
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
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
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
    },
  });
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

  return {
    layout,
    user,
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
    socialBlocks: mapSocialBlocks(user.socialBlocks),
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
