import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FaCircle, FaCrown, FaShieldHalved } from "react-icons/fa6";
import {
  LuArrowUpRight,
  LuBadgeCheck,
  LuPlay,
  LuSparkles,
} from "react-icons/lu";
import { getCurrentUser } from "@/app/lib/auth";
import { getLinkPlatform } from "@/app/lib/link-icons";
import { getMediaKind } from "@/app/lib/profile-media";
import { prisma } from "@/app/lib/prisma";
import ProfileLayoutVariants, {
  type PublicProfileLayout,
} from "./ProfileLayoutVariants";
import ProfileHeroClient from "./ProfileHeroClient";
import SocialPresenceSection, {
  type PublicSocialBlock,
} from "./SocialPresenceSection";

type Props = {
  params: Promise<{ username: string }>;
};

type MyReaction = "like" | "dislike" | null;

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
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

function getLinkHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
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

function getMetadataObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readMetadataValue(
  metadata: Record<string, unknown> | null,
  key: string
) {
  if (!metadata) {
    return null;
  }

  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
      profileLayout: true,
      status: true,
      role: true,
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

  if (!user || user.status === "banned") {
    notFound();
  }

  let initialMyReaction: MyReaction = null;

  if (currentUser && currentUser.id !== user.id) {
    const myReaction = await prisma.reaction.findFirst({
      where: {
        fromUserId: currentUser.id,
        toUserId: user.id,
      },
      select: {
        type: true,
      },
    });

    if (myReaction?.type === "like" || myReaction?.type === "dislike") {
      initialMyReaction = myReaction.type;
    }
  }

  const themeColor = user.themeColor || "#f472b6";
  const profileLayout = normalizeProfileLayout(user.profileLayout);
  const displayName = user.displayName || user.username;
  const bannerUrl = user.bannerUrl?.trim() || null;
  const avatarUrl = user.avatarUrl?.trim() || null;
  const bannerKind = getMediaKind(bannerUrl || "");
  const decorationScale = user.selectedDecorationScale ?? 165;
  const decorationOffsetX = user.selectedDecorationOffsetX ?? 0;
  const decorationOffsetY = user.selectedDecorationOffsetY ?? 0;
  const avatarInitials = getInitials(displayName);
  const premiumBadges = user.badges.slice(0, 4);
  const likes = user.reactionsReceived.reduce(
    (acc, item) => (item.type === "like" ? acc + 1 : acc),
    0,
  );
  const dislikes = user.reactionsReceived.reduce(
    (acc, item) => (item.type === "dislike" ? acc + 1 : acc),
    0,
  );
  const views = user.profileViews.length;
  const statusLabel = getStatusLabel(user.status);
  const socialBlocks: PublicSocialBlock[] = user.socialBlocks.map((block) => {
    const metadata = getMetadataObject(block.metadata);

    return {
      id: block.id,
      platform: block.platform,
      title: block.title,
      username: block.username,
      url: block.url,
      statusText: readMetadataValue(metadata, "shortStatus"),
      isEnabled: block.isEnabled,
    };
  });
  const hasPremiumState =
    premiumBadges.length > 0 ||
    Boolean(user.selectedDecoration) ||
    user.role === "owner" ||
    user.role === "admin";

  const heroPills: Array<{
    key: string;
    text: string;
    icon: ReactNode;
    color: string;
  }> = [
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

  if (profileLayout !== "modern") {
    return (
      <ProfileLayoutVariants
        layout={profileLayout}
        user={user}
        displayName={displayName}
        themeColor={themeColor}
        bannerKind={bannerKind}
        avatarInitials={avatarInitials}
        decorationScale={decorationScale}
        decorationOffsetX={decorationOffsetX}
        decorationOffsetY={decorationOffsetY}
        premiumBadges={premiumBadges}
        heroPills={heroPills}
        likes={likes}
        dislikes={dislikes}
        views={views}
        socialBlocks={socialBlocks}
        initialMyReaction={initialMyReaction}
      />
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "clip",
        color: "#ffffff",
        fontFamily:
          '"Space Grotesk", Inter, Arial, Helvetica, system-ui, sans-serif',
        background: `
          radial-gradient(circle at top, ${withAlpha(themeColor, "22")} 0%, transparent 24%),
          radial-gradient(circle at 84% 14%, ${withAlpha(themeColor, "10")} 0%, transparent 16%),
          linear-gradient(180deg, #05060a 0%, #040508 46%, #030407 100%)
        `,
      }}
    >
      <style>{`
        .profile-stage,
        .profile-stage-media,
        .profile-stage-overlay,
        .profile-stage-vignette,
        .profile-stage-noise,
        .profile-stage-glow,
        .profile-stage-blur {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .profile-stage {
          z-index: 0;
        }

        .profile-stage-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: saturate(1.04) contrast(1.04);
        }

        .profile-stage-overlay {
          background:
            linear-gradient(180deg, rgba(4, 5, 9, 0.18) 0%, rgba(4, 5, 9, 0.36) 28%, rgba(4, 5, 9, 0.74) 72%, rgba(4, 5, 9, 0.92) 100%),
            radial-gradient(circle at 50% 16%, ${withAlpha(themeColor, "24")} 0%, transparent 44%);
        }

        .profile-stage-vignette {
          background:
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 42%, rgba(0, 0, 0, 0.38) 100%),
            linear-gradient(90deg, rgba(3, 4, 8, 0.46) 0%, rgba(3, 4, 8, 0.08) 22%, rgba(3, 4, 8, 0.08) 78%, rgba(3, 4, 8, 0.42) 100%);
        }

        .profile-stage-noise {
          opacity: 0.09;
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.86) 0.5px, transparent 0.6px),
            radial-gradient(rgba(255, 255, 255, 0.4) 0.5px, transparent 0.6px);
          background-position: 0 0, 7px 11px;
          background-size: 12px 12px, 15px 15px;
          mix-blend-mode: soft-light;
        }

        .profile-stage-glow {
          background:
            radial-gradient(circle at 22% 18%, ${withAlpha(themeColor, "22")} 0%, transparent 22%),
            radial-gradient(circle at 78% 82%, rgba(110, 146, 255, 0.14) 0%, transparent 24%);
          filter: blur(24px);
          opacity: 0.92;
        }

        .profile-stage-blur {
          inset: auto 0 0 0;
          height: 26vh;
          background: linear-gradient(180deg, rgba(4, 5, 9, 0), rgba(4, 5, 9, 0.4) 42%, rgba(4, 5, 9, 0.8) 100%);
          backdrop-filter: blur(10px);
        }

        .profile-shell {
          width: min(1180px, calc(100% - 40px));
          min-height: 100vh;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          padding: 34px 0;
        }

        .profile-floating-panel {
          width: 100%;
          position: relative;
          border-radius: 34px;
          background:
            linear-gradient(180deg, rgba(13, 15, 24, 0.52), rgba(8, 9, 15, 0.72)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 34px 80px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(22px);
          overflow: hidden;
        }

        .profile-floating-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255, 255, 255, 0.07), transparent 18%),
            radial-gradient(circle at top right, ${withAlpha(themeColor, "16")} 0%, transparent 28%);
          pointer-events: none;
        }

        .profile-floating-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(320px, 0.92fr) minmax(0, 1.08fr);
          gap: 0;
        }

        .profile-identity-column {
          padding: 34px 34px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .profile-links-column {
          padding: 34px 34px 32px;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          min-width: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.01));
        }

        .panel-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ambient-chip {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #edf2fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .ambient-chip.accent {
          color: #ffe5f1;
          border-color: ${withAlpha(themeColor, "32")};
          background: linear-gradient(135deg, ${withAlpha(themeColor, "20")}, rgba(255, 255, 255, 0.05));
          box-shadow: 0 16px 28px ${withAlpha(themeColor, "12")};
        }

        .identity-stack {
          margin-top: 28px;
        }

        .avatar-and-copy {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 22px;
          align-items: center;
        }

        .avatar-shell {
          position: relative;
          width: 182px;
          height: 182px;
          flex-shrink: 0;
        }

        .avatar-aura {
          position: absolute;
          inset: 10px;
          border-radius: 999px;
          background: radial-gradient(circle, ${withAlpha(themeColor, "36")} 0%, ${withAlpha(themeColor, "00")} 72%);
          filter: blur(18px);
          transform: scale(1.12);
        }

        .avatar-decoration {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          pointer-events: none;
        }

        .avatar-decoration-media {
          object-fit: contain;
          filter: drop-shadow(0 0 22px ${withAlpha(themeColor, "3a")});
        }

        .avatar-frame {
          position: absolute;
          inset: 10px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: linear-gradient(180deg, rgba(8, 9, 16, 0.96), rgba(11, 12, 20, 0.98));
          box-shadow:
            0 0 0 1px ${withAlpha(themeColor, "38")},
            0 22px 54px rgba(0, 0, 0, 0.26),
            0 0 34px ${withAlpha(themeColor, "1e")};
          z-index: 2;
        }

        .avatar-image,
        .avatar-fallback {
          width: 100%;
          height: 100%;
          display: block;
        }

        .avatar-image {
          object-fit: cover;
        }

        .avatar-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 24% 22%, rgba(255, 255, 255, 0.34), transparent 18%),
            linear-gradient(145deg, ${withAlpha(themeColor, "f0")} 0%, rgba(255, 110, 168, 0.9) 56%, rgba(90, 169, 255, 0.84) 100%);
          color: #ffffff;
          font-size: 56px;
          font-weight: 900;
          letter-spacing: -0.06em;
        }

        .avatar-status {
          position: absolute;
          right: 10px;
          bottom: 18px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #090d15;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 12px 18px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        .avatar-status i {
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: #45d483;
          box-shadow: 0 0 0 4px rgba(69, 212, 131, 0.12);
          display: inline-block;
        }

        .identity-copy {
          min-width: 0;
        }

        .profile-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          color: #ecf1fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .profile-name {
          margin: 16px 0 0;
          font-size: clamp(44px, 6vw, 66px);
          line-height: 0.9;
          letter-spacing: -0.08em;
          text-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
        }

        .profile-username {
          margin-top: 12px;
          color: #a2aec8;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .profile-pill-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .profile-pill {
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(10px);
        }

        .profile-summary {
          margin: 20px 0 0;
          max-width: 520px;
          color: #c5cfdf;
          font-size: 15px;
          line-height: 1.8;
        }

        .profile-bio {
          margin-top: 24px;
          max-width: 560px;
          color: #e0e6f0;
          font-size: 15px;
          line-height: 1.95;
          white-space: pre-wrap;
        }

        .profile-badge-rail {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .profile-badge-pill {
          min-height: 38px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .profile-badge-icon {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
          flex-shrink: 0;
        }

        .profile-badge-label {
          font-size: 12px;
          font-weight: 800;
          color: #f3f5fb;
          letter-spacing: 0.02em;
        }

        .links-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .links-copy h2 {
          margin: 16px 0 0;
          font-size: clamp(26px, 4vw, 36px);
          line-height: 0.96;
          letter-spacing: -0.06em;
        }

        .links-copy p {
          margin: 12px 0 0;
          max-width: 420px;
          color: #adb9d1;
          font-size: 14px;
          line-height: 1.75;
        }

        .links-count {
          min-height: 36px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ecf1fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .links-list {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .profile-link-card {
          position: relative;
          overflow: hidden;
          text-decoration: none;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 16px 16px 16px 14px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.016)),
            linear-gradient(180deg, rgba(10, 12, 18, 0.58), rgba(9, 10, 16, 0.68));
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow:
            0 16px 32px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .profile-link-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 22px 38px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .profile-link-glow {
          position: absolute;
          inset: 0 auto 0 0;
          width: 26%;
          opacity: 0.44;
          pointer-events: none;
        }

        .profile-link-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .profile-link-copy {
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .profile-link-top {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .profile-link-top strong {
          font-size: 17px;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .profile-link-platform {
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.03em;
          border: 1px solid currentColor;
        }

        .profile-link-host {
          margin-top: 6px;
          color: #9eabc6;
          font-size: 13px;
          line-height: 1.55;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-link-url {
          margin-top: 4px;
          color: #7f8ca7;
          font-size: 12px;
          line-height: 1.55;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-link-arrow {
          width: 40px;
          height: 40px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dce3f2;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          opacity: 0.82;
          transition: transform 180ms ease, opacity 180ms ease;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .profile-link-card:hover .profile-link-arrow {
          transform: translateX(3px) translateY(-1px);
          opacity: 1;
        }

        .empty-links {
          border: 1px dashed rgba(255, 255, 255, 0.16);
          border-radius: 24px;
          padding: 28px 18px;
          text-align: center;
          color: #95a2bc;
          background: rgba(255, 255, 255, 0.02);
        }

        @media (max-width: 980px) {
          .profile-shell {
            width: min(100% - 24px, 1180px);
            align-items: center;
            padding: 24px 0;
          }

          .profile-floating-grid {
            grid-template-columns: 1fr;
          }

          .profile-links-column {
            border-left: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
        }

        @media (max-width: 760px) {
          .profile-floating-panel {
            border-radius: 28px;
          }

          .profile-identity-column,
          .profile-links-column {
            padding: 22px 18px 20px;
          }

          .avatar-and-copy {
            grid-template-columns: 1fr;
            gap: 18px;
            text-align: center;
          }

          .avatar-shell {
            width: 156px;
            height: 156px;
            margin: 0 auto;
          }

          .profile-pill-row,
          .profile-badge-rail {
            justify-content: center;
          }

          .profile-summary,
          .profile-bio {
            margin-left: auto;
            margin-right: auto;
          }

          .links-header {
            align-items: flex-start;
          }
        }

        @media (max-width: 560px) {
          .profile-shell {
            width: min(100% - 18px, 1180px);
            padding: 18px 0;
          }

          .profile-floating-panel {
            border-radius: 24px;
          }

          .ambient-chip,
          .profile-kicker,
          .links-count {
            min-height: 34px;
            font-size: 11px;
          }

          .profile-name {
            font-size: clamp(36px, 12vw, 52px);
          }

          .profile-link-card {
            grid-template-columns: auto minmax(0, 1fr);
            gap: 14px;
            padding: 14px;
          }

          .profile-link-arrow {
            display: none;
          }

          .profile-link-host,
          .profile-link-url {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
          }
        }
      `}</style>

      <div className="profile-stage" aria-hidden>
        {bannerUrl ? (
          bannerKind === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="profile-stage-media"
            >
              <source src={bannerUrl} />
            </video>
          ) : (
            <img src={bannerUrl} alt="" className="profile-stage-media" />
          )
        ) : null}
        <div className="profile-stage-glow" />
        <div className="profile-stage-overlay" />
        <div className="profile-stage-vignette" />
        <div className="profile-stage-noise" />
        <div className="profile-stage-blur" />
      </div>

      <div className="profile-shell">
        <section className="profile-floating-panel">
          <div className="profile-floating-grid">
            <div className="profile-identity-column">
              <div>
                <div className="panel-topbar">
                  <div className="ambient-chip accent">
                    <LuSparkles size={13} />
                    Digital identity
                  </div>

                  <div className="ambient-chip">
                    {bannerUrl ? (
                      bannerKind === "video" ? (
                        <>
                          <LuPlay size={13} />
                          Motion background
                        </>
                      ) : (
                        <>
                          <LuBadgeCheck size={13} />
                          Custom background
                        </>
                      )
                    ) : (
                      <>
                        <LuBadgeCheck size={13} />
                        Ambient profile
                      </>
                    )}
                  </div>
                </div>

                <div className="identity-stack">
                  <div className="avatar-and-copy">
                    <div className="avatar-shell">
                      <div className="avatar-aura" />

                      {user.selectedDecoration ? (
                        <div
                          className="avatar-decoration"
                          style={{
                            transform: `translate(${decorationOffsetX}px, ${decorationOffsetY}px)`,
                          }}
                        >
                          {user.selectedDecoration.mediaType === "webm" ? (
                            <video
                              src={user.selectedDecoration.imageUrl}
                              poster={
                                user.selectedDecoration.posterUrl ||
                                user.selectedDecoration.previewUrl ||
                                undefined
                              }
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="avatar-decoration-media"
                              style={{
                                width: `${decorationScale}%`,
                                height: `${decorationScale}%`,
                              }}
                            />
                          ) : (
                            <img
                              src={
                                user.selectedDecoration.previewUrl ||
                                user.selectedDecoration.imageUrl
                              }
                              alt="Avatar decoration"
                              className="avatar-decoration-media"
                              style={{
                                width: `${decorationScale}%`,
                                height: `${decorationScale}%`,
                              }}
                            />
                          )}
                        </div>
                      ) : null}

                      <div className="avatar-frame">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={user.username}
                            className="avatar-image"
                          />
                        ) : (
                          <div className="avatar-fallback">{avatarInitials}</div>
                        )}
                      </div>

                      <div className="avatar-status" aria-label={statusLabel}>
                        <i />
                      </div>
                    </div>

                    <div className="identity-copy">
                      <div className="profile-kicker">
                        <LuBadgeCheck size={13} />
                        yotei.app/{user.username}
                      </div>

                      <h1 className="profile-name">{displayName}</h1>
                      <div className="profile-username">@{user.username}</div>

                      <div className="profile-pill-row">
                        {heroPills.map((pill) => (
                          <div
                            key={pill.key}
                            className="profile-pill"
                            style={{
                              color: pill.color,
                              background: withAlpha(pill.color, "14"),
                              borderColor: withAlpha(pill.color, "26"),
                              boxShadow: `0 12px 24px ${withAlpha(pill.color, "12")}`,
                            }}
                          >
                            {pill.icon}
                            {pill.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="profile-summary">
                    {user.bio
                      ? "A living public identity built for creators, gamers and developers who want their first impression to feel cinematic, intentional and premium."
                      : "A premium public profile designed to keep links, identity and social presence in one immersive destination."}
                  </p>

                  {user.bio ? <div className="profile-bio">{user.bio}</div> : null}

                  <ProfileHeroClient
                    username={user.username}
                    initialViews={views}
                    initialLikes={likes}
                    initialDislikes={dislikes}
                    themeColor={themeColor}
                    initialMyReaction={initialMyReaction}
                  />

                  {premiumBadges.length > 0 ? (
                    <div className="profile-badge-rail">
                      {premiumBadges.map((item) => (
                        <div
                          key={item.id}
                          className="profile-badge-pill"
                          title={item.badge.description || item.badge.name}
                        >
                          <div
                            className="profile-badge-icon"
                            style={{
                              background: withAlpha(item.badge.color || themeColor, "18"),
                              boxShadow: `0 10px 18px ${withAlpha(
                                item.badge.color || themeColor,
                                "16",
                              )}`,
                            }}
                          >
                            {item.badge.icon || "B"}
                          </div>
                          <span className="profile-badge-label">{item.badge.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="profile-links-column">
              <div className="links-header">
                <div className="links-copy">
                  <div className="profile-kicker">
                    <LuSparkles size={13} />
                    Featured destinations
                  </div>
                  <h2>Links integrated into the atmosphere.</h2>
                  <p>
                    Minimal platform cards with cleaner hierarchy, lighter surfaces and
                    more focus on identity than interface chrome.
                  </p>
                </div>

                <div className="links-count">
                  <LuBadgeCheck size={13} />
                  {user.links.length} link{user.links.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="links-list">
                <SocialPresenceSection blocks={socialBlocks} themeColor={themeColor} compact />

                {user.links.length > 0 ? (
                  user.links.map((link) => {
                    const platform = getLinkPlatform(link.url, link.title);
                    const color = platform.color || themeColor;
                    const PlatformIcon = platform.icon;
                    const hostname = getLinkHostname(link.url);

                    return (
                      <a
                        key={link.id}
                        href={`/go/${link.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="profile-link-card"
                        style={{
                          borderColor: withAlpha(color, "24"),
                          boxShadow: `0 18px 34px ${withAlpha(color, "0f")}`,
                        }}
                      >
                        <div
                          className="profile-link-glow"
                          style={{
                            background: `linear-gradient(90deg, ${withAlpha(
                              color,
                              "20",
                            )}, transparent)`,
                          }}
                        />

                        <div
                          className="profile-link-icon"
                          style={{
                            background: `linear-gradient(180deg, ${withAlpha(
                              color,
                              "20",
                            )}, ${withAlpha(color, "0c")})`,
                            borderColor: withAlpha(color, "30"),
                            boxShadow: `0 12px 24px ${withAlpha(color, "14")}`,
                          }}
                        >
                          <PlatformIcon size={21} color={color} aria-hidden="true" />
                        </div>

                        <div className="profile-link-copy">
                          <div className="profile-link-top">
                            <strong>{link.title || platform.name}</strong>
                            <span
                              className="profile-link-platform"
                              style={{
                                color,
                                background: withAlpha(color, "10"),
                              }}
                            >
                              {platform.name}
                            </span>
                          </div>

                          <div className="profile-link-host">{hostname}</div>
                          <div className="profile-link-url">{link.url}</div>
                        </div>

                        <div className="profile-link-arrow">
                          <LuArrowUpRight size={16} />
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="empty-links">No links added yet.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
