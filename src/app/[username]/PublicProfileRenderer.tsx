"use client";

import type { CSSProperties, ReactNode } from "react";
import { LuArrowUpRight, LuBadgeCheck, LuMoonStar, LuSparkles } from "react-icons/lu";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import { getLinkPlatform } from "@/app/lib/link-icons";
import {
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import type { ProfileMusicData } from "@/app/lib/profile-music";
import {
  normalizeProfileBackgroundIntensity,
  normalizeProfileBannerStyle,
  normalizeProfileCardStyle,
  normalizeProfileCornerStyle,
  normalizeProfileDensity,
  normalizeProfileMotionLevel,
  normalizeProfileNameEffects,
  getProfileBannerStyleTokens,
  getProfileCardStyleTokens,
  getProfileCornerTokens,
  getProfileDensityTokens,
  getProfileGlassTokens,
  getProfileMotionTokens,
  type ProfileBackgroundIntensity,
  type ProfileBannerStyle,
  type ProfileCardStyle,
  type ProfileCornerStyle,
  type ProfileDensity,
  type ProfileGlassIntensity,
  type ProfileMotionLevel,
  type ProfileNameEffect,
} from "@/app/lib/profile-customization";
import {
  getProfileSceneAppearance,
  normalizeProfileScene,
  type ProfileScene,
} from "@/app/lib/profile-scenes";
import LivingAvatar from "@/app/components/LivingAvatar";
import LivingProfileBackground from "./LivingProfileBackground";
import ProfileBannerMedia from "./ProfileBannerMedia";
import ProfileRenderBoundary from "./ProfileRenderBoundary";
import ProfileNamePlate from "./ProfileNamePlate";
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
  scene: ProfileScene;
  nameEffects: ProfileNameEffect[];
  backgroundIntensity: ProfileBackgroundIntensity;
  glassIntensity: ProfileGlassIntensity;
  bannerStyle: ProfileBannerStyle;
  density: ProfileDensity;
  cardStyle: ProfileCardStyle;
  cornerStyle: ProfileCornerStyle;
  motionLevel: ProfileMotionLevel;
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
  scene = "default",
  nameEffects,
  backgroundIntensity,
  glassIntensity,
  bannerStyle,
  density,
  cardStyle,
  cornerStyle,
  motionLevel,
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
  const safeLayout = normalizeProfileLayout(layout);
  const safeScene = normalizeProfileScene(scene);
  const safeMotionLevel = normalizeProfileMotionLevel(motionLevel);
  const safeBackgroundIntensity = normalizeProfileBackgroundIntensity(backgroundIntensity);
  const safeGlassIntensity = glassIntensity;
  const safeBannerStyle = normalizeProfileBannerStyle(bannerStyle);
  const safeDensity = normalizeProfileDensity(density);
  const safeCardStyle = normalizeProfileCardStyle(cardStyle);
  const safeCornerStyle = normalizeProfileCornerStyle(cornerStyle);
  const safeNameEffects = normalizeProfileNameEffects(nameEffects ?? [], true);
  const safeUser = sanitizeUser(user);
  const safeThemeColor = normalizeThemeColor(themeColor);
  const safeDisplayName = displayName.trim() || safeUser.username;
  const safeHeroPills = sanitizeHeroPills(heroPills);
  const safeFeaturedBadges = sanitizeFeaturedBadges(featuredBadges);
  const safeSocialBlocks = sanitizeSocialBlocks(socialBlocks);
  const safeExtraBadgeCount =
    safeFeaturedBadges.length === 0 ? 0 : Math.max(0, extraBadgeCount);
  const safeBannerUrl = sanitizeRenderableUrl(safeUser.bannerUrl);
  const safeBannerKind = safeBannerUrl ? bannerKind : "unknown";

  if (safeLayout !== "modern") {
    return (
      <ProfileLayoutVariants
        layout={safeLayout}
        user={safeUser}
        displayName={safeDisplayName}
        themeColor={safeThemeColor}
        mood={mood}
        aura={aura}
        scene={safeScene}
        nameEffects={safeNameEffects}
        backgroundIntensity={safeBackgroundIntensity}
        glassIntensity={safeGlassIntensity}
        bannerStyle={safeBannerStyle}
        density={safeDensity}
        cardStyle={safeCardStyle}
        cornerStyle={safeCornerStyle}
        motionLevel={safeMotionLevel}
        music={music}
        bannerKind={safeBannerKind}
        avatarInitials={avatarInitials}
        decorationScale={decorationScale}
        decorationOffsetX={decorationOffsetX}
        decorationOffsetY={decorationOffsetY}
        featuredBadges={safeFeaturedBadges}
        extraBadgeCount={safeExtraBadgeCount}
        heroPills={safeHeroPills}
        likes={likes}
        dislikes={dislikes}
        views={views}
        socialBlocks={safeSocialBlocks}
        initialMyReaction={initialMyReaction}
        preview={preview}
      />
    );
  }

  const sceneAppearance = getProfileSceneAppearance({
    scene: safeScene,
    mood,
    aura,
    themeColor: safeThemeColor,
  });
  const { presence, depth } = sceneAppearance;
  const glassTokens = getProfileGlassTokens(safeGlassIntensity);
  const bannerStyleTokens = getProfileBannerStyleTokens(safeBannerStyle);
  const densityTokens = getProfileDensityTokens(safeDensity);
  const cardStyleTokens = getProfileCardStyleTokens(safeCardStyle);
  const cornerTokens = getProfileCornerTokens(safeCornerStyle);
  const motionTokens = getProfileMotionTokens(safeMotionLevel);
  const panelBackdropFilter =
    safeCardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter;
  const resolvedPanelBackdropFilter = preview
    ? safeCardStyle === "glass"
      ? "blur(14px) saturate(116%)"
      : safeCardStyle === "minimal"
        ? "blur(8px) saturate(104%)"
        : "none"
    : panelBackdropFilter;
  const spacingScale = densityTokens.sectionGap * depth.spacingScale;
  const panelBackground = [
    `linear-gradient(180deg, rgba(255,255,255,${Math.max(0.01, 0.06 - depth.shellShadeOpacity * 0.2)}), rgba(4,6,10,${depth.shellShadeOpacity}) 100%)`,
    safeCardStyle === "glass" ? glassTokens.backgroundLayer : "",
    cardStyleTokens.shellOverlay,
    sceneAppearance.shellBackground,
  ]
    .filter(Boolean)
    .join(", ");
  const surfaceBackground = [
    `linear-gradient(180deg, rgba(255,255,255,${Math.max(0.01, 0.04 - depth.surfaceShadeOpacity * 0.08)}), rgba(3,4,9,${depth.surfaceShadeOpacity}) 100%)`,
    safeCardStyle === "glass" ? glassTokens.backgroundLayer : "",
    cardStyleTokens.shellOverlay,
    sceneAppearance.surfaceBackground,
  ]
    .filter(Boolean)
    .join(", ");
  const shellPadding = preview
    ? `${Math.round(16 * densityTokens.shellPadding * depth.spacingScale)}px 0 ${Math.round(18 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(34 * densityTokens.shellPadding * depth.spacingScale)}px 0 ${Math.round(14 * densityTokens.shellPadding * depth.spacingScale)}px`;
  const columnPadding = preview
    ? `${Math.round(24 * densityTokens.contentPadding * depth.spacingScale)}px`
    : `${Math.round(30 * densityTokens.contentPadding * depth.spacingScale)}px`;
  const stageGlowBlur =
    safeMotionLevel === "alive"
      ? depth.stageGlowBlur
      : safeMotionLevel === "subtle"
        ? Math.max(12, depth.stageGlowBlur - 4)
        : 10;
  const stageGlowOpacity =
    safeMotionLevel === "alive"
      ? depth.stageGlowOpacity
      : safeMotionLevel === "subtle"
        ? Math.max(0.28, depth.stageGlowOpacity * 0.74)
        : 0.22;
  const linkHoverLift = preview ? 0 : motionTokens.hoverLiftPx;
  const linkHoverScale = preview ? 1 : motionTokens.hoverScale;
  const linkTransition = preview ? 0 : motionTokens.transitionDurationMs;
  const avatarAuraAnimation = motionTokens.allowDecorativeMotion
    ? safeMotionLevel === "subtle"
      ? "profile-aura 6.2s ease-in-out infinite"
      : "profile-aura 4.8s ease-in-out infinite"
    : "none";
  const statusPulseAnimation = motionTokens.allowDecorativeMotion
    ? safeMotionLevel === "subtle"
      ? "online-pulse 3.4s ease-in-out infinite"
      : "online-pulse 2.2s ease-in-out infinite"
    : "none";

  return (
    <main
      style={{
        minHeight: preview ? "auto" : "100vh",
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
        fontFamily:
          '"Space Grotesk", Inter, Arial, Helvetica, system-ui, sans-serif',
        background: `
          radial-gradient(circle at top, ${withAlpha(sceneAppearance.linkThemeColor, "18")} 0%, transparent 24%),
          radial-gradient(circle at 84% 14%, ${withAlpha(presence.accent, "16")} 0%, transparent 18%),
          radial-gradient(circle at 50% 100%, ${withAlpha(presence.soft, "10")} 0%, transparent 32%),
          linear-gradient(180deg, #05060a 0%, #040508 46%, #030407 100%)
        `,
        pointerEvents: preview ? "none" : undefined,
        isolation: "isolate",
        "--profile-panel-radius": `${cornerTokens.shellRadius + 4}px`,
        "--profile-card-radius": `${cornerTokens.cardRadius}px`,
        "--profile-chip-radius": `${cornerTokens.chipRadius}px`,
        "--profile-link-hover-lift": `${linkHoverLift}px`,
        "--profile-link-hover-scale": `${linkHoverScale}`,
        "--profile-transition-duration": `${linkTransition}ms`,
        "--profile-stack-gap": `${Math.round(18 * spacingScale)}px`,
      } as CSSProperties}
    >
      <style>{`
        .profile-stage,
        .profile-stage-media,
        .profile-stage-light,
        .profile-stage-overlay,
        .profile-stage-depth,
        .profile-stage-vignette,
        .profile-stage-noise,
        .profile-stage-foreground,
        .profile-stage-glow,
        .profile-stage-blur,
        .profile-shell-orb {
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
          transform: scale(${bannerStyleTokens.mediaScale});
          filter: ${bannerStyleTokens.mediaFilter};
          will-change: transform;
        }

        .profile-stage-light {
          background:
            radial-gradient(circle at 18% 16%, ${withAlpha(presence.accent, "16")} 0%, transparent 24%),
            radial-gradient(circle at 82% 22%, ${withAlpha(presence.soft, "12")} 0%, transparent 28%);
          opacity: ${Math.max(0.16, depth.lightingOpacity)};
        }

        .profile-stage-overlay {
          background:
            linear-gradient(
              180deg,
              rgba(4, 5, 9, ${(bannerStyleTokens.stageOverlayTop * depth.overlayStrength).toFixed(3)}) 0%,
              rgba(4, 5, 9, ${(bannerStyleTokens.stageOverlayMid * depth.overlayStrength).toFixed(3)}) 28%,
              rgba(4, 5, 9, ${(bannerStyleTokens.stageOverlayBottom * depth.overlayStrength).toFixed(3)}) 72%,
              rgba(4, 5, 9, ${Math.min(bannerStyleTokens.stageOverlayBottom * depth.overlayStrength + 0.12, 0.96).toFixed(3)}) 100%
            ),
            radial-gradient(
              circle at 50% 16%,
              ${withAlpha(
                presence.accent,
                decimalOpacityToHex(Math.min(0.32, bannerStyleTokens.stageAccentOpacity * (0.74 + depth.lightingOpacity))),
              )} 0%,
              transparent 44%
            );
        }

        .profile-stage-depth {
          background:
            linear-gradient(180deg, rgba(5, 6, 10, 0) 0%, rgba(5, 6, 10, ${Math.min(0.24, depth.shellShadeOpacity + 0.06).toFixed(3)}) 58%, rgba(5, 6, 10, ${Math.min(0.52, depth.surfaceShadeOpacity + 0.18).toFixed(3)}) 100%),
            radial-gradient(circle at 50% 100%, rgba(0, 0, 0, ${Math.min(0.18, depth.shadowDepth * 0.12).toFixed(3)}) 0%, transparent 48%);
        }

        .profile-stage-vignette {
          background:
            radial-gradient(
              circle at center,
              rgba(0, 0, 0, 0) 42%,
              rgba(0, 0, 0, ${(bannerStyleTokens.vignetteOpacity * depth.vignetteStrength).toFixed(3)}) 100%
            ),
            linear-gradient(
              90deg,
              rgba(3, 4, 8, ${(bannerStyleTokens.sideShadeOpacity * depth.vignetteStrength).toFixed(3)}) 0%,
              rgba(3, 4, 8, 0.08) 22%,
              rgba(3, 4, 8, 0.08) 78%,
              rgba(3, 4, 8, ${(bannerStyleTokens.sideShadeOpacity * depth.vignetteStrength).toFixed(3)}) 100%
            );
        }

        .profile-stage-noise {
          opacity: ${Math.min(0.12, 0.04 + depth.lightingOpacity * 0.1)};
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
          filter: blur(${stageGlowBlur}px);
          opacity: ${stageGlowOpacity};
        }

        .profile-stage-foreground {
          inset: auto 0 0 0;
          height: 28%;
          background:
            linear-gradient(180deg, rgba(5, 6, 10, 0), rgba(5, 6, 10, ${Math.min(0.18, depth.foregroundHazeOpacity).toFixed(3)}) 100%),
            radial-gradient(circle at 50% 90%, ${withAlpha(presence.soft, "14")} 0%, transparent 36%);
          z-index: 1;
        }

        .profile-stage-blur {
          inset: auto 0 0 0;
          height: ${preview
            ? bannerStyleTokens.previewStageBlurHeight
            : bannerStyleTokens.stageBlurHeight};
          background: linear-gradient(180deg, rgba(4, 5, 9, 0), rgba(4, 5, 9, 0.4) 42%, rgba(4, 5, 9, 0.8) 100%);
        }

        .profile-shell {
          width: min(${preview ? Math.min(depth.shellMaxWidth, 920) : depth.shellMaxWidth}px, calc(100% - ${preview ? "32px" : "112px"}));
          max-width: ${preview ? Math.min(depth.shellMaxWidth, 920) : depth.shellMaxWidth}px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: ${preview ? "flex-start" : "flex-end"};
          padding: ${shellPadding};
          box-sizing: border-box;
          min-width: 0;
        }

        .profile-shell-orb {
          inset: auto;
          width: 136px;
          height: 136px;
          border-radius: 999px;
          background: radial-gradient(circle, ${withAlpha(presence.accent, "12")} 0%, transparent 72%);
          opacity: ${preview ? 0.34 : 0.5};
          z-index: 0;
        }

        .profile-shell-orb.left {
          left: -24px;
          top: 20px;
        }

        .profile-shell-orb.right {
          right: -18px;
          bottom: 12px;
          background: radial-gradient(circle, ${withAlpha(presence.soft, "12")} 0%, transparent 72%);
        }

        .profile-floating-panel {
          width: 100%;
          max-width: 100%;
          position: relative;
          border-radius: var(--profile-panel-radius);
          background: ${panelBackground};
          border: 1px solid ${sceneAppearance.surfaceBorder};
          box-shadow:
            ${presence.panelGlow},
            ${glassTokens.shadowBoost},
            0 ${Math.round(32 * depth.shadowDepth)}px ${Math.round(72 * depth.shadowDepth)}px rgba(0, 0, 0, ${Math.min(0.4, 0.22 + depth.shadowDepth * 0.1)}),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          overflow: hidden;
          backdrop-filter: ${resolvedPanelBackdropFilter};
          -webkit-backdrop-filter: ${resolvedPanelBackdropFilter};
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
          grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1fr);
          gap: ${preview ? "0" : `${Math.round(16 * spacingScale)}px`};
          min-width: 0;
        }

        .profile-identity-column,
        .profile-links-column {
          padding: ${columnPadding};
          min-width: 0;
        }

        .profile-identity-column {
          display: flex;
          flex-direction: column;
          justify-content: ${preview ? "flex-start" : "space-between"};
          gap: ${preview ? `${Math.round(18 * spacingScale)}px` : `${Math.round(8 * spacingScale)}px`};
        }

        .profile-links-column {
          border-left: 1px solid ${withAlpha(presence.accent, "16")};
          background: ${surfaceBackground};
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
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #edf2fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 14px 24px rgba(0, 0, 0, 0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
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
          border-radius: var(--profile-chip-radius);
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
          margin-top: ${preview ? `${Math.round(20 * spacingScale)}px` : `${Math.round(26 * spacingScale)}px`};
          min-width: 0;
        }

        .avatar-and-copy {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: ${Math.round(20 * spacingScale)}px;
          align-items: flex-start;
          min-width: 0;
        }

        .avatar-shell {
          position: relative;
          width: ${preview ? "156px" : "182px"};
          height: ${preview ? "156px" : "182px"};
          flex-shrink: 0;
        }

        .avatar-aura {
          position: absolute;
          inset: 10px;
          border-radius: 999px;
          background: ${presence.avatarAuraBackground};
          filter: blur(18px);
          transform: scale(1.12);
          animation: ${avatarAuraAnimation};
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
            linear-gradient(145deg, ${withAlpha(safeThemeColor, "f0")} 0%, rgba(255, 110, 168, 0.9) 56%, rgba(90, 169, 255, 0.84) 100%);
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
          animation: ${statusPulseAnimation};
        }

        .identity-copy,
        .links-copy,
        .profile-link-copy {
          min-width: 0;
        }

        .profile-name {
          margin: 16px 0 0;
          font-size: ${preview
            ? `clamp(${Math.round(34 * densityTokens.bannerScale)}px, 5vw, ${Math.round(58 * densityTokens.bannerScale)}px)`
            : `clamp(${Math.round(42 * densityTokens.bannerScale)}px, 6vw, ${Math.round(66 * densityTokens.bannerScale)}px)`};
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
          margin-top: ${Math.round(18 * spacingScale)}px;
        }

        .profile-pill {
          min-height: 34px;
          padding: 0 12px;
          border-radius: var(--profile-chip-radius);
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
          margin-top: ${preview ? `${Math.round(16 * spacingScale)}px` : `${Math.round(20 * spacingScale)}px`};
          max-width: 520px;
          color: #e0e6f0;
          font-size: 15px;
          line-height: ${densityTokens.bioLineHeight};
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .widget-shell {
          position: relative;
          min-width: 0;
          transform: translate3d(0, 0, 0);
        }

        .widget-shell.music {
          margin-top: ${Math.round(6 * spacingScale)}px;
        }

        .widget-shell.social {
          margin-bottom: ${Math.round(8 * spacingScale)}px;
        }

        .widget-shell::before {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: calc(var(--profile-card-radius) + 12px);
          background:
            radial-gradient(circle at 16% 18%, ${withAlpha(presence.accent, "0e")} 0%, transparent 34%),
            radial-gradient(circle at 84% 72%, ${withAlpha(presence.soft, "0c")} 0%, transparent 30%);
          opacity: 0.9;
          z-index: -1;
        }

        .profile-badge-pill {
          min-height: 38px;
          padding: 0 12px;
          border-radius: var(--profile-chip-radius);
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
          gap: ${Math.round(14 * spacingScale)}px;
          margin-top: ${preview ? `${Math.round(16 * spacingScale)}px` : `${Math.round(24 * spacingScale)}px`};
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
          border-radius: var(--profile-card-radius);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.016)),
            linear-gradient(180deg, rgba(10, 12, 18, 0.58), rgba(9, 10, 16, 0.68));
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow:
            0 16px 32px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition:
            transform var(--profile-transition-duration) ease,
            border-color var(--profile-transition-duration) ease,
            box-shadow var(--profile-transition-duration) ease;
          will-change: transform;
        }

        .profile-link-card:hover,
        .profile-link-card:focus-visible {
          transform: translateY(var(--profile-link-hover-lift)) scale(var(--profile-link-hover-scale));
        }

        .profile-link-card.float-a {
          margin-inline-end: 16px;
        }

        .profile-link-card.float-b {
          margin-inline-start: 22px;
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
          border-radius: calc(var(--profile-card-radius) - 4px);
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
          border-radius: var(--profile-chip-radius);
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
          border-radius: calc(var(--profile-card-radius) - 7px);
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
          border-radius: var(--profile-card-radius);
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
            width: min(100% - 28px, ${preview ? Math.min(depth.shellMaxWidth, 920) : depth.shellMaxWidth}px);
          }

          .profile-floating-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .profile-links-column {
            border-left: 0;
            border-top: 1px solid ${sceneAppearance.surfaceBorder};
          }

          .profile-link-card.float-a,
          .profile-link-card.float-b {
            margin-inline: 0;
          }
        }

        @media (max-width: 760px) {
          .profile-floating-panel {
            border-radius: calc(var(--profile-panel-radius) - 6px);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }

          .profile-identity-column,
          .profile-links-column {
            padding: ${Math.round(20 * densityTokens.contentPadding)}px 18px 20px;
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

          .profile-shell-orb {
            display: none;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .profile-link-card {
            will-change: auto;
          }

          .profile-link-card:hover,
          .profile-link-card:focus-visible {
            transform: none;
          }
        }
      `}</style>

      <LivingProfileBackground
        mood={mood}
        aura={aura}
        themeColor={safeThemeColor}
        scene={safeScene}
        previewMode={preview}
        intensity={safeBackgroundIntensity}
        motionLevel={safeMotionLevel}
      />

      <div className="profile-stage" aria-hidden>
        <ProfileBannerMedia
          url={safeBannerUrl}
          kind={safeBannerKind}
          className="profile-stage-media"
        />
        <div className="profile-stage-light" />
        <div className="profile-stage-glow" />
        <div className="profile-stage-overlay" />
        <div className="profile-stage-depth" />
        <div className="profile-stage-vignette" />
        <div className="profile-stage-noise" />
        <div className="profile-stage-foreground" />
        <div className="profile-stage-blur" />
      </div>

      <div className="profile-shell">
        <div className="profile-shell-orb left" />
        <div className="profile-shell-orb right" />
        <section className="profile-floating-panel">
          <div className="profile-floating-grid">
            <div className="profile-identity-column">
              <div>
                <div className="panel-topbar">
                  <div className="ambient-chip accent">
                    <LuSparkles size={13} />
                    {preview ? `${sceneAppearance.scene.name} Preview` : presence.chipText}
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
                        avatarUrl={sanitizeRenderableUrl(safeUser.avatarUrl)}
                        avatarInitials={avatarInitials}
                        avatarAlt={safeUser.username}
                        selectedDecoration={safeUser.selectedDecoration}
                        themeColor={safeThemeColor}
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
                        {sceneAppearance.scene.name}
                      </div>

                      <ProfileNamePlate
                        displayName={safeDisplayName}
                        username={safeUser.username}
                        effects={safeNameEffects}
                        motionLevel={safeMotionLevel}
                        nameClassName="profile-name"
                        usernameClassName="profile-username"
                      />
                      <div className="presence-chip">
                        <LuMoonStar size={13} />
                        {presence.statusLabel}
                      </div>

                      <div className="profile-pill-row">
                        {safeHeroPills.map((pill) => (
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

                  {safeUser.bio ? <div className="profile-bio">{safeUser.bio}</div> : null}

                  <div className="widget-shell music">
                    <ProfileRenderBoundary label="Music card" compact resetKey={safeUser.username}>
                      <ProfileMusicCard
                        music={music}
                        themeColor={sceneAppearance.linkThemeColor}
                        accentColor={presence.accent}
                        contrastColor={presence.contrast}
                        softColor={presence.soft}
                        compact
                        motionLevel={safeMotionLevel}
                      />
                    </ProfileRenderBoundary>
                  </div>

                  {preview ? null : (
                    <ProfileRenderBoundary label="Profile reactions" compact resetKey={safeUser.username}>
                      <ProfileHeroClient
                        username={safeUser.username}
                        initialViews={views}
                        initialLikes={likes}
                        initialDislikes={dislikes}
                        themeColor={sceneAppearance.linkThemeColor}
                        initialMyReaction={initialMyReaction}
                        preview={preview}
                      />
                    </ProfileRenderBoundary>
                  )}

                  {safeFeaturedBadges.length > 0 ? (
                    <div className="profile-badge-rail">
                      {safeFeaturedBadges.map((item) => {
                        const visual = getProfileBadgeVisual(
                          item.badge,
                          sceneAppearance.linkThemeColor,
                        );

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

                      {safeExtraBadgeCount > 0 ? (
                        <div
                          className="profile-badge-pill"
                          title={`${safeExtraBadgeCount} more badge${safeExtraBadgeCount === 1 ? "" : "s"}`}
                        >
                          <div className="profile-badge-icon">+{safeExtraBadgeCount}</div>
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
                  {safeUser.links.length} link{safeUser.links.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="links-list">
                <div className="widget-shell social">
                  <ProfileRenderBoundary label="Social presence" compact resetKey={safeUser.username}>
                    <SocialPresenceSection
                      blocks={safeSocialBlocks}
                      themeColor={sceneAppearance.socialThemeColor}
                      compact
                      preview={preview}
                    />
                  </ProfileRenderBoundary>
                </div>

                {safeUser.links.length > 0 ? (
                  safeUser.links.map((link, index) => {
                    const platform = getLinkPlatform(link.url, link.title);
                    const color = platform.color || sceneAppearance.linkThemeColor;
                    const PlatformIcon = platform.icon;

                    return (
                      <a
                        key={link.id}
                        href={`/go/${link.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`profile-link-card ${index % 2 === 0 ? "float-a" : "float-b"}`}
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

function sanitizeUser(user: PublicProfileRenderUser): PublicProfileRenderUser {
  const links = Array.isArray(user.links)
    ? user.links.filter((link): link is PublicProfileRenderUser["links"][number] => {
        return Boolean(
          link &&
            typeof link.id === "string" &&
            link.id &&
            typeof link.url === "string" &&
            sanitizeRenderableUrl(link.url),
        );
      })
    : [];

  const selectedDecoration = user.selectedDecoration
    ? sanitizeRenderableUrl(user.selectedDecoration.imageUrl)
      ? {
          ...user.selectedDecoration,
          imageUrl: sanitizeRenderableUrl(user.selectedDecoration.imageUrl) ?? "",
          previewUrl: sanitizeRenderableUrl(user.selectedDecoration.previewUrl),
          posterUrl: sanitizeRenderableUrl(user.selectedDecoration.posterUrl),
        }
      : null
    : null;

  return {
    ...user,
    username: user.username?.trim() || "yotei",
    bio: typeof user.bio === "string" && user.bio.trim() ? user.bio.trim() : null,
    avatarUrl: sanitizeRenderableUrl(user.avatarUrl),
    bannerUrl: sanitizeRenderableUrl(user.bannerUrl),
    selectedDecoration,
    links: links.map((link) => ({
      ...link,
      title: typeof link.title === "string" && link.title.trim() ? link.title.trim() : null,
      url: sanitizeRenderableUrl(link.url) ?? link.url,
    })),
  };
}

function sanitizeHeroPills(pills: PublicProfileHeroPill[]) {
  if (!Array.isArray(pills)) {
    return [];
  }

  return pills.filter((pill): pill is PublicProfileHeroPill => {
    return Boolean(
      pill &&
        typeof pill.key === "string" &&
        typeof pill.text === "string" &&
        typeof pill.color === "string",
    );
  });
}

function sanitizeFeaturedBadges(badges: PublicProfileBadgeEntry[]) {
  if (!Array.isArray(badges)) {
    return [];
  }

  return badges.filter((badge): badge is PublicProfileBadgeEntry => {
    return Boolean(
      badge &&
        typeof badge.id === "string" &&
        badge.badge &&
        typeof badge.badge.slug === "string" &&
        typeof badge.badge.name === "string",
    );
  });
}

function sanitizeSocialBlocks(blocks: PublicSocialBlock[]) {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.filter((block): block is PublicSocialBlock => {
    return Boolean(block && typeof block.id === "string" && typeof block.platform === "string");
  });
}

function sanitizeRenderableUrl(value: string | null | undefined) {
  const trimmed = value?.trim() || "";

  if (!trimmed) {
    return null;
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function normalizeProfileLayout(value: PublicProfileLayout): PublicProfileLayout {
  return value === "default" || value === "modern" || value === "simplistic" || value === "portfolio"
    ? value
    : "modern";
}

function normalizeThemeColor(value: string) {
  const trimmed = value.trim();
  const shortHexMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed);

  if (shortHexMatch) {
    return `#${shortHexMatch[1]
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`;
  }

  return /^#([0-9a-fA-F]{6})$/.test(trimmed) ? trimmed : "#f472b6";
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

function decimalOpacityToHex(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");
}
