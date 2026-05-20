"use client";

import type { ReactNode } from "react";
import { LuArrowUpRight, LuBadgeCheck, LuMoonStar, LuSparkles } from "react-icons/lu";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import { getLinkPlatform } from "@/app/lib/link-icons";
import {
  getProfilePresence,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import type { ProfileMusicData } from "@/app/lib/profile-music";
import LivingAvatar from "@/app/components/LivingAvatar";
import ProfileLayoutVariants, { type PublicProfileLayout } from "./ProfileLayoutVariants";
import ProfileMusicCard from "./ProfileMusicCard";
import ProfileHeroClient from "./ProfileHeroClient";
import SocialPresenceSection, { type PublicSocialBlock } from "./SocialPresenceSection";

export type PublicProfileReaction = "like" | "dislike" | null;

export type PublicProfileBadgeEntry = {
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

export type PublicProfileRenderUser = {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  selectedDecorationScale?: number | null;
  selectedDecorationOffsetX?: number | null;
  selectedDecorationOffsetY?: number | null;
  selectedDecoration: {
    name: string;
    slug: string;
    imageUrl: string;
    previewUrl: string | null;
    posterUrl: string | null;
    mediaType: string;
    overlayScale: number | null;
    overlayOffsetY: number | null;
  } | null;
  links: Array<{
    id: string;
    title: string | null;
    url: string;
  }>;
};

export type PublicProfileHeroPill = {
  key: string;
  text: string;
  icon: ReactNode;
  color: string;
};

type Props = {
  layout: PublicProfileLayout;
  user: PublicProfileRenderUser;
  displayName: string;
  themeColor: string;
  mood: ProfileMood;
  aura: ProfileAura;
  music: ProfileMusicData;
  bannerKind: "image" | "video" | "unknown";
  avatarInitials: string;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  featuredBadges: PublicProfileBadgeEntry[];
  extraBadgeCount: number;
  heroPills: PublicProfileHeroPill[];
  likes: number;
  dislikes: number;
  views: number;
  socialBlocks: PublicSocialBlock[];
  initialMyReaction: PublicProfileReaction;
  preview?: boolean;
  previewMessage?: string;
};

export default function PublicProfileRenderer({
  layout,
  user,
  displayName,
  themeColor,
  mood,
  aura,
  music,
  bannerKind,
  avatarInitials,
  decorationScale,
  decorationOffsetX,
  decorationOffsetY,
  featuredBadges,
  extraBadgeCount,
  heroPills,
  likes,
  dislikes,
  views,
  socialBlocks,
  initialMyReaction,
  preview = false,
  previewMessage = "This is exactly how your live profile will look.",
}: Props) {
  if (layout !== "modern") {
    return (
      <ProfileLayoutVariants
        layout={layout}
        user={user}
        displayName={displayName}
        themeColor={themeColor}
        mood={mood}
        aura={aura}
        music={music}
        bannerKind={bannerKind}
        avatarInitials={avatarInitials}
        decorationScale={decorationScale}
        decorationOffsetX={decorationOffsetX}
        decorationOffsetY={decorationOffsetY}
        featuredBadges={featuredBadges}
        extraBadgeCount={extraBadgeCount}
        heroPills={heroPills}
        likes={likes}
        dislikes={dislikes}
        views={views}
        socialBlocks={socialBlocks}
        initialMyReaction={initialMyReaction}
        preview={preview}
      />
    );
  }

  const bannerUrl = user.bannerUrl?.trim() || null;
  const presence = getProfilePresence({ mood, aura, themeColor });

  return (
    <main
      style={{
        minHeight: preview ? "100%" : "100vh",
        height: preview ? "100%" : undefined,
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
        fontFamily:
          '"Space Grotesk", Inter, Arial, Helvetica, system-ui, sans-serif',
        background: `
          radial-gradient(circle at top, ${withAlpha(themeColor, "16")} 0%, transparent 24%),
          radial-gradient(circle at 84% 14%, ${withAlpha(presence.accent, "16")} 0%, transparent 18%),
          linear-gradient(180deg, #05060a 0%, #040508 46%, #030407 100%)
        `,
        pointerEvents: preview ? "none" : undefined,
        isolation: "isolate",
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
          position: absolute;
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
            radial-gradient(circle at 50% 16%, ${withAlpha(presence.accent, "22")} 0%, transparent 44%);
        }

        .profile-stage-vignette {
          background:
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 42%, rgba(0, 0, 0, 0.38) 100%),
            linear-gradient(90deg, rgba(3, 4, 8, 0.46) 0%, rgba(3, 4, 8, 0.08) 22%, rgba(3, 4, 8, 0.08) 78%, rgba(3, 4, 8, 0.42) 100%);
        }

        .profile-stage-noise {
          opacity: 0.08;
          background-image:
            ${presence.ambientGrid},
            radial-gradient(rgba(255, 255, 255, 0.82) 0.5px, transparent 0.6px),
            radial-gradient(rgba(255, 255, 255, 0.4) 0.5px, transparent 0.6px);
          background-position: 0 0, 0 0, 7px 11px;
          background-size: 80px 80px, 12px 12px, 15px 15px;
          mix-blend-mode: soft-light;
        }

        .profile-stage-glow {
          background: ${presence.stageGlow};
          filter: blur(22px);
          opacity: 0.92;
        }

        .profile-stage-blur {
          inset: auto 0 0 0;
          height: 26vh;
          background: linear-gradient(180deg, rgba(4, 5, 9, 0), rgba(4, 5, 9, 0.4) 42%, rgba(4, 5, 9, 0.8) 100%);
        }

        .profile-shell {
          width: min(1180px, calc(100% - 40px));
          max-width: 1180px;
          min-height: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: ${preview ? "stretch" : "flex-end"};
          padding: ${preview ? "26px 0" : "34px 0"};
          box-sizing: border-box;
        }

        .profile-floating-panel {
          width: 100%;
          max-width: 100%;
          position: relative;
          border-radius: 34px;
          background:
            linear-gradient(180deg, rgba(13, 15, 24, 0.56), rgba(8, 9, 15, 0.74)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            ${presence.panelGlow},
            0 34px 80px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .profile-floating-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255, 255, 255, 0.07), transparent 18%),
            radial-gradient(circle at top right, ${withAlpha(presence.accent, "14")} 0%, transparent 28%),
            ${presence.auraOverlay};
          pointer-events: none;
        }

        .profile-floating-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(320px, 0.92fr) minmax(0, 1.08fr);
          min-width: 0;
          min-height: 100%;
        }

        .profile-identity-column,
        .profile-links-column {
          padding: 34px;
          min-width: 0;
        }

        .profile-identity-column {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .profile-links-column {
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.01));
        }

        .panel-topbar,
        .links-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ambient-chip,
        .profile-kicker,
        .links-count,
        .preview-callout {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #edf2fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .ambient-chip.accent,
        .preview-callout {
          color: #ffe5f1;
          border-color: ${presence.presenceBorder};
          background: ${presence.presenceBackground};
          box-shadow: 0 16px 28px ${withAlpha(presence.accent, "12")};
        }

        .preview-callout {
          width: fit-content;
        }

        .presence-chip {
          width: fit-content;
          min-height: 34px;
          margin-top: 14px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f7fbff;
          background: ${presence.presenceBackground};
          border: 1px solid ${presence.presenceBorder};
          box-shadow: 0 14px 26px ${withAlpha(presence.accent, "12")};
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .identity-stack {
          margin-top: 28px;
          min-width: 0;
        }

        .avatar-and-copy {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 22px;
          align-items: center;
          min-width: 0;
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
          background: ${presence.avatarAuraBackground};
          filter: blur(18px);
          transform: scale(1.12);
          animation: profile-aura 4.8s ease-in-out infinite;
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
          filter: drop-shadow(0 0 22px ${withAlpha(presence.accent, "3a")});
        }

        .avatar-frame {
          position: absolute;
          inset: 10px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: linear-gradient(180deg, rgba(8, 9, 16, 0.96), rgba(11, 12, 20, 0.98));
          box-shadow:
            0 0 0 1px ${presence.avatarRing},
            0 22px 54px rgba(0, 0, 0, 0.26),
            0 0 34px ${presence.avatarGlow};
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
          background: ${presence.presenceDot};
          box-shadow: 0 0 0 4px ${withAlpha(presence.pulse, "20")};
          display: inline-block;
          animation: online-pulse 2.2s ease-in-out infinite;
        }

        .identity-copy,
        .links-copy,
        .profile-link-copy {
          min-width: 0;
        }

        .profile-name {
          margin: 16px 0 0;
          font-size: clamp(44px, 6vw, 66px);
          line-height: 0.9;
          letter-spacing: -0.08em;
          text-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
        }

        .profile-username,
        .profile-summary {
          color: #a2aec8;
        }

        .profile-username {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .profile-pill-row,
        .profile-badge-rail {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
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
        }

        .profile-bio {
          margin-top: 24px;
          max-width: 560px;
          color: #e0e6f0;
          font-size: 15px;
          line-height: 1.95;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .profile-badge-pill {
          min-height: 38px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          max-width: 100%;
        }

        .profile-badge-icon {
          width: auto;
          min-width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-badge-label {
          font-size: 12px;
          font-weight: 800;
          overflow-wrap: anywhere;
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

        .links-list {
          display: grid;
          gap: 12px;
          margin-top: 24px;
          min-width: 0;
        }

        .profile-link-card {
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
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
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
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

        .profile-link-top {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-link-top strong {
          font-size: 17px;
          letter-spacing: -0.03em;
          color: #ffffff;
          overflow-wrap: anywhere;
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

        .profile-link-host,
        .profile-link-url {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .profile-link-host {
          margin-top: 6px;
          color: #9eabc6;
          font-size: 13px;
          line-height: 1.55;
        }

        .profile-link-url {
          margin-top: 4px;
          color: #7f8ca7;
          font-size: 12px;
          line-height: 1.55;
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
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .empty-links {
          border: 1px dashed rgba(255, 255, 255, 0.16);
          border-radius: 24px;
          padding: 28px 18px;
          text-align: center;
          color: #95a2bc;
          background: rgba(255, 255, 255, 0.02);
        }

        @keyframes online-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 4px rgba(69, 212, 131, 0.12); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(69, 212, 131, 0.06); }
        }

        @keyframes profile-aura {
          0%, 100% { transform: scale(1.1); opacity: 0.78; }
          50% { transform: scale(1.16); opacity: 1; }
        }

        @media (max-width: 980px) {
          .profile-shell {
            width: min(100% - 24px, 1180px);
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
                    {preview ? "Live Preview" : presence.chipText}
                  </div>

                  <div className="ambient-chip">
                    <LuMoonStar size={13} />
                    {aura === "none"
                      ? "Clean aura"
                      : `${aura.charAt(0).toUpperCase()}${aura.slice(1)} aura`}
                  </div>
                </div>

                {preview ? (
                  <div style={{ marginTop: "18px" }} className="preview-callout">
                    <LuBadgeCheck size={13} />
                    {previewMessage}
                  </div>
                ) : null}

                <div className="identity-stack">
                  <div className="avatar-and-copy">
                    <div className="avatar-shell">
                      <div className="avatar-aura" />

                      <LivingAvatar
                        avatarUrl={user.avatarUrl?.trim() || null}
                        avatarInitials={avatarInitials}
                        avatarAlt={user.username}
                        selectedDecoration={user.selectedDecoration}
                        themeColor={themeColor}
                        accentColor={presence.accent}
                        contrastColor={presence.contrast}
                        softColor={presence.soft}
                        pulseColor={presence.pulse}
                        auraBackground={presence.avatarAuraBackground}
                        ringColor={presence.avatarRing}
                        glowColor={presence.avatarGlow}
                        size={182}
                        frameInset={10}
                        decorationScale={decorationScale}
                        decorationOffsetX={decorationOffsetX}
                        decorationOffsetY={decorationOffsetY}
                      />

                      <div className="avatar-status" aria-label="Online">
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
                      <div className="presence-chip">
                        <LuMoonStar size={13} />
                        {presence.statusLabel}
                      </div>

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

                {user.bio ? <div className="profile-bio">{user.bio}</div> : null}

                  <ProfileMusicCard
                    music={music}
                    themeColor={themeColor}
                    accentColor={presence.accent}
                    contrastColor={presence.contrast}
                    softColor={presence.soft}
                    compact
                  />

                  <ProfileHeroClient
                    username={user.username}
                    initialViews={views}
                    initialLikes={likes}
                    initialDislikes={dislikes}
                    themeColor={themeColor}
                    initialMyReaction={initialMyReaction}
                    preview={preview}
                  />

                  {featuredBadges.length > 0 ? (
                    <div className="profile-badge-rail">
                      {featuredBadges.map((item) => {
                        const visual = getProfileBadgeVisual(item.badge, themeColor);

                        return (
                          <div
                            key={item.id}
                            className="profile-badge-pill"
                            title={item.badge.description || item.badge.name}
                            style={{
                              background: visual.pillBackground,
                              borderColor: visual.pillBorder,
                              boxShadow: visual.pillShadow,
                            }}
                          >
                            <div className="profile-badge-icon">
                              <BadgeVisual
                                slug={item.badge.slug}
                                color={item.badge.color || visual.color}
                                rarity={item.badge.rarity}
                                category={item.badge.category}
                                size={30}
                                compact
                              />
                            </div>
                            <span
                              className="profile-badge-label"
                              style={{ color: visual.labelColor }}
                            >
                              {item.badge.name}
                            </span>
                          </div>
                        );
                      })}

                      {extraBadgeCount > 0 ? (
                        <div
                          className="profile-badge-pill"
                          title={`${extraBadgeCount} more badge${extraBadgeCount === 1 ? "" : "s"}`}
                        >
                          <div className="profile-badge-icon">+{extraBadgeCount}</div>
                          <span className="profile-badge-label">More</span>
                        </div>
                      ) : null}
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
                    Links
                  </div>
                  <h2>Selected links</h2>
                  <p>Premium cards, socials, and calls to action stay aligned across desktop and mobile.</p>
                </div>

                <div className="links-count">
                  <LuBadgeCheck size={13} />
                  {user.links.length} link{user.links.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="links-list">
                <SocialPresenceSection
                  blocks={socialBlocks}
                  themeColor={themeColor}
                  compact
                  preview={preview}
                />

                {user.links.length > 0 ? (
                  user.links.map((link) => {
                    const platform = getLinkPlatform(link.url, link.title);
                    const color = platform.color || themeColor;
                    const PlatformIcon = platform.icon;

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
                            background: `linear-gradient(90deg, ${withAlpha(color, "20")}, transparent)`,
                          }}
                        />

                        <div
                          className="profile-link-icon"
                          style={{
                            background: `linear-gradient(180deg, ${withAlpha(color, "20")}, ${withAlpha(color, "0c")})`,
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

                          <div className="profile-link-host">{getLinkHostname(link.url)}</div>
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

function getProfileBadgeVisual(
  badge: PublicProfileBadgeEntry["badge"],
  themeColor: string,
) {
  const color = badge.color || themeColor;
  const isPriority =
    badge.slug === "owner" ||
    badge.slug === "admin" ||
    badge.slug === "premium" ||
    badge.category === "official";

  return {
    color,
    pillBackground: isPriority
      ? `linear-gradient(135deg, ${withAlpha(color, "16")}, rgba(255,255,255,0.05))`
      : "rgba(255,255,255,0.04)",
    pillBorder: isPriority ? withAlpha(color, "34") : "rgba(255,255,255,0.08)",
    pillShadow: isPriority ? `0 14px 28px ${withAlpha(color, "18")}` : undefined,
    labelColor: isPriority ? "#ffffff" : "#f3f5fb",
  };
}

function getLinkHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}
