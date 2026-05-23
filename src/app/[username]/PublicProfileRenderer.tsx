"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  LuArrowUpRight,
  LuBadgeCheck,
  LuChevronDown,
  LuMoonStar,
  LuMusic4,
  LuSparkles,
} from "react-icons/lu";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import { getLinkPlatform } from "@/app/lib/link-icons";
import {
  getProfileFloatingCompositionPlan,
  getProfileCompositionSpacingScale,
  getRenderableCompositionOrder,
  normalizeProfileComposition,
  partitionSocialBlocks,
  type ProfileComposition,
  type ProfileCompositionBlock,
  type ProfileCompositionLinksStyle,
  type ProfileFloatingModulePlacement,
  type ProfileFloatingPersonality,
} from "@/app/lib/profile-composition";
import {
  getProfileDnaTuning,
  type ProfileDnaTuning,
} from "@/app/lib/profile-dna";
import { getProfileMotionPersonalityTokens } from "@/app/lib/profile-motion";
import {
  getProfilePresetRenderTuning,
  type ProfilePresetRenderTuning,
} from "@/app/lib/profile-presets";
import type { ProfileCustomBlock } from "@/app/lib/profile-custom-blocks";
import {
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import {
  shouldRenderProfileMusic,
  type ProfileMusicData,
} from "@/app/lib/profile-music";
import {
  normalizeProfileBackgroundIntensity,
  normalizeProfileBannerStyle,
  normalizeProfileCardStyle,
  normalizeProfileCornerStyle,
  normalizeProfileDensity,
  normalizeProfileMotionLevel,
  normalizeProfileNameEffects,
  normalizeProfileIntroMode,
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
  type ProfileIntroMode,
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
import ProfileCustomBlockCard from "./ProfileCustomBlock";
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
  introMode: ProfileIntroMode;
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
  composition: ProfileComposition;
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
  introMode,
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
  composition,
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
  const safeIntroMode = normalizeProfileIntroMode(introMode);
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
  const safeComposition = normalizeProfileComposition(composition);
  const safeExtraBadgeCount =
    safeFeaturedBadges.length === 0 ? 0 : Math.max(0, extraBadgeCount);
  const safeBannerUrl = sanitizeRenderableUrl(safeUser.bannerUrl);
  const safeBannerKind = safeBannerUrl ? bannerKind : "unknown";

  const sceneAppearance = getProfileSceneAppearance({
    scene: safeScene,
    mood,
    aura,
    themeColor: safeThemeColor,
  });
  const { presence, depth } = sceneAppearance;
  const compositionDensityScale = getProfileCompositionSpacingScale(
    safeComposition.density,
  );
  const presetRenderTuning = getProfilePresetRenderTuning(safeComposition.preset);
  const dnaTuning = getProfileDnaTuning(safeComposition.dna);
  const glassTokens = getProfileGlassTokens(safeGlassIntensity);
  const bannerStyleTokens = getProfileBannerStyleTokens(safeBannerStyle);
  const densityTokens = getProfileDensityTokens(safeDensity);
  const cardStyleTokens = getProfileCardStyleTokens(safeCardStyle);
  const cornerTokens = getProfileCornerTokens(safeCornerStyle);
  const motionTokens = getProfileMotionTokens(safeMotionLevel);
  const motionPersonalityTokens = getProfileMotionPersonalityTokens({
    personality:
      presetRenderTuning.motionPersonality ?? dnaTuning.motionPersonality,
    motionLevel: safeMotionLevel,
  });
  const shellShadeScale =
    presetRenderTuning.shellVisibility === "ghost"
      ? 0.58
      : presetRenderTuning.shellVisibility === "solid"
        ? 1.08
        : 0.82;
  const panelBackdropFilter =
    safeCardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter;
  const resolvedPanelBackdropFilter = preview
    ? safeCardStyle === "glass"
      ? "blur(14px) saturate(116%)"
      : safeCardStyle === "minimal"
        ? "blur(8px) saturate(104%)"
        : "none"
    : scaleBlurInFilter(panelBackdropFilter, dnaTuning.blurScale);
  const surfaceOpacityScale = clampNumber(1 / dnaTuning.transparencyScale, 0.7, 1.2);
  const spacingScale =
    densityTokens.sectionGap *
    depth.spacingScale *
    compositionDensityScale *
    presetRenderTuning.moduleGapScale *
    dnaTuning.spacingScale *
    dnaTuning.separationScale;
  const panelBackground = [
    `linear-gradient(180deg, rgba(255,255,255,${Math.max(0.008, (0.06 - depth.shellShadeOpacity * 0.2) * (shellShadeScale + 0.08) * surfaceOpacityScale)}), rgba(4,6,10,${(depth.shellShadeOpacity * shellShadeScale * surfaceOpacityScale).toFixed(3)}) 100%)`,
    safeCardStyle === "glass" ? glassTokens.backgroundLayer : "",
    cardStyleTokens.shellOverlay,
    sceneAppearance.shellBackground,
  ]
    .filter(Boolean)
    .join(", ");
  const surfaceBackground = [
    `linear-gradient(180deg, rgba(255,255,255,${Math.max(0.008, (0.04 - depth.surfaceShadeOpacity * 0.08) * (shellShadeScale + 0.08) * surfaceOpacityScale)}), rgba(3,4,9,${(depth.surfaceShadeOpacity * shellShadeScale * surfaceOpacityScale).toFixed(3)}) 100%)`,
    safeCardStyle === "glass" ? glassTokens.backgroundLayer : "",
    cardStyleTokens.shellOverlay,
    sceneAppearance.surfaceBackground,
  ]
    .filter(Boolean)
    .join(", ");
  const shellMaxWidth = Math.round(
    depth.shellMaxWidth *
      densityTokens.stageWidthScale *
      presetRenderTuning.stageWidthScale *
      dnaTuning.compactnessScale,
  );
  const shellPadding = preview
    ? `${Math.round(10 * densityTokens.shellPadding * depth.spacingScale)}px 0 ${Math.round(12 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(22 * densityTokens.shellPadding * depth.spacingScale)}px 0 ${Math.round(10 * densityTokens.shellPadding * depth.spacingScale)}px`;
  const columnPadding = preview
    ? `${Math.round(15 * densityTokens.contentPadding * depth.spacingScale)}px`
    : `${Math.round(18 * densityTokens.contentPadding * depth.spacingScale)}px`;
  const avatarSize = Math.round(
    (preview ? 136 : 152) *
      densityTokens.avatarScale *
      dnaTuning.compactnessScale,
  );
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
  const tunedStageGlowBlur = Math.round(
    stageGlowBlur * dnaTuning.ambientScale * dnaTuning.glowScale,
  );
  const tunedStageGlowOpacity = clampNumber(
    stageGlowOpacity * dnaTuning.ambientScale * 0.94,
    0.14,
    0.88,
  );
  const linkHoverLift = preview
    ? 0
    : Number(
        (
          motionTokens.hoverLiftPx *
          dnaTuning.hoverEnergy *
          motionPersonalityTokens.hoverEnergy
        ).toFixed(2),
      );
  const linkHoverScale = preview
    ? 1
    : Number(
        (
          1 +
          (motionTokens.hoverScale - 1) *
            dnaTuning.hoverEnergy *
            dnaTuning.motionScale *
            motionPersonalityTokens.hoverEnergy
        ).toFixed(3),
      );
  const linkTransition = preview
    ? 0
    : Math.round(
        motionPersonalityTokens.transitionDurationMs /
          clampNumber(dnaTuning.motionScale, 0.82, 1.18),
      );
  const partitionedSocialBlocks = partitionSocialBlocks(safeSocialBlocks);
  const renderableCompositionOrder = getRenderableCompositionOrder(safeComposition, {
    hero: true,
    music: preview ? true : shouldRenderProfileMusic(music),
    socials: partitionedSocialBlocks.socials.length > 0,
    live: partitionedSocialBlocks.live.length > 0,
    links: true,
    badges: safeFeaturedBadges.length > 0 || safeExtraBadgeCount > 0,
    stats: true,
  });
  const orderedContentBlocks = renderableCompositionOrder.filter(
    (block) => block !== "hero",
  );
  const visibleCustomBlocks = safeComposition.customBlocks.filter((block) => block.visible);
  const isFloatingComposition = safeComposition.mode === "floating";
  const hasIntroDetails =
    Boolean(safeUser.bio) ||
    orderedContentBlocks.length > 0 ||
    visibleCustomBlocks.length > 0;
  const avatarAuraAnimation = motionTokens.allowDecorativeMotion
    ? `profile-aura ${motionPersonalityTokens.glowPulseDurationS.toFixed(2)}s ${motionPersonalityTokens.transitionEasing} infinite`
    : "none";
  const statusPulseAnimation = motionTokens.allowDecorativeMotion
    ? `online-pulse ${Math.max(2.6, motionPersonalityTokens.glowPulseDurationS * 0.72).toFixed(2)}s ${motionPersonalityTokens.transitionEasing} infinite`
    : "none";
  const scrollAtmosphereProgress = useScrollAtmosphere(
    !preview && safeIntroMode === "off",
    380,
  );
  usePublicProfileScrollbarMode(!preview);

  if (safeIntroMode !== "off") {
    return (
      <IntroProfileStage
        mode={safeIntroMode}
        floating={isFloatingComposition}
        preview={preview}
        previewMessage={previewMessage}
        displayName={safeDisplayName}
        user={safeUser}
        themeColor={safeThemeColor}
        mood={mood}
        aura={aura}
        sceneAppearance={sceneAppearance}
        nameEffects={safeNameEffects}
        backgroundIntensity={safeBackgroundIntensity}
        densityTokens={densityTokens}
        cardStyle={safeCardStyle}
        motionLevel={safeMotionLevel}
        motionPersonalityTokens={motionPersonalityTokens}
        music={music}
        bannerKind={safeBannerKind}
        presetRenderTuning={presetRenderTuning}
        dnaTuning={dnaTuning}
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
        initialMyReaction={initialMyReaction}
        regularSocialBlocks={partitionedSocialBlocks.socials}
        liveSocialBlocks={partitionedSocialBlocks.live}
        composition={safeComposition}
        orderedContentBlocks={orderedContentBlocks}
        customBlocks={visibleCustomBlocks}
        hasDetails={hasIntroDetails}
      />
    );
  }

  if (isFloatingComposition) {
    return (
      <FloatingProfileScene
        preview={preview}
        displayName={safeDisplayName}
        user={safeUser}
        themeColor={safeThemeColor}
        mood={mood}
        aura={aura}
        sceneAppearance={sceneAppearance}
        nameEffects={safeNameEffects}
        backgroundIntensity={safeBackgroundIntensity}
        densityTokens={densityTokens}
        cardStyle={safeCardStyle}
        cornerTokens={cornerTokens}
        motionLevel={safeMotionLevel}
        motionPersonalityTokens={motionPersonalityTokens}
        music={music}
        bannerKind={safeBannerKind}
        presetRenderTuning={presetRenderTuning}
        dnaTuning={dnaTuning}
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
        initialMyReaction={initialMyReaction}
        regularSocialBlocks={partitionedSocialBlocks.socials}
        liveSocialBlocks={partitionedSocialBlocks.live}
        composition={safeComposition}
        orderedContentBlocks={orderedContentBlocks}
        customBlocks={visibleCustomBlocks}
      />
    );
  }

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
        composition={safeComposition}
        initialMyReaction={initialMyReaction}
        preview={preview}
      />
    );
  }

  return (
    <main
      className="yotei-public-profile-root yotei-scrollbar-hidden"
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
        "--profile-motion-ease": motionPersonalityTokens.transitionEasing,
        "--profile-motion-emphasis": motionPersonalityTokens.emphasisEasing,
        "--profile-reveal-duration": `${motionPersonalityTokens.revealDurationMs}ms`,
        "--profile-reveal-distance": `${motionPersonalityTokens.revealDistancePx}px`,
        "--profile-reveal-stagger": `${motionPersonalityTokens.staggerDelayMs}ms`,
        "--profile-ambient-drift-distance": `${motionPersonalityTokens.ambientDriftDistancePx}px`,
        "--profile-ambient-drift-duration": `${motionPersonalityTokens.ambientDriftDurationS}s`,
        "--profile-blur-breath-distance": `${motionPersonalityTokens.blurBreathingPx}px`,
        "--profile-blur-breath-duration": `${motionPersonalityTokens.blurBreathingDurationS}s`,
        "--profile-glow-pulse-duration": `${motionPersonalityTokens.glowPulseDurationS}s`,
        "--profile-glow-pulse-opacity": `${motionPersonalityTokens.glowPulseOpacity}`,
        "--profile-aura-breath-scale": `${motionPersonalityTokens.auraBreathScale}`,
        "--profile-hero-spill-opacity": `${motionPersonalityTokens.heroSpillOpacity}`,
        "--profile-hero-depth-opacity": `${motionPersonalityTokens.heroDepthOpacity}`,
        "--profile-label-tracking": `${motionPersonalityTokens.labelLetterSpacingEm}em`,
        "--profile-label-opacity": `${motionPersonalityTokens.labelOpacity}`,
        "--profile-scroll-progress": `${scrollAtmosphereProgress.toFixed(3)}`,
        "--profile-scroll-settle": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollSettleDistancePx
        ).toFixed(2)}px`,
        "--profile-scroll-blur-shift": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollBlurShiftPx
        ).toFixed(2)}px`,
        "--profile-scroll-focus": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollFocusStrength
        ).toFixed(3)}`,
        "--profile-stack-gap": `${Math.round(14 * spacingScale)}px`,
        "--profile-chip-height": `${Math.max(24, Math.round(28 * dnaTuning.chipScale))}px`,
        "--profile-chip-padding-x": `${Math.max(8, Math.round(10 * dnaTuning.chipScale))}px`,
        "--profile-chip-font-size": `${Math.max(9, Math.round(10 * dnaTuning.chipScale))}px`,
        "--profile-chip-gap": `${Math.max(5, Math.round(6 * dnaTuning.chipScale))}px`,
        "--profile-border-alpha": `${clampNumber(0.08 * dnaTuning.borderScale, 0.04, 0.18).toFixed(3)}`,
        "--profile-shadow-alpha": `${clampNumber(0.16 * dnaTuning.shadowScale, 0.08, 0.28).toFixed(3)}`,
        "--profile-widget-glow-opacity": `${clampNumber(0.72 * dnaTuning.glowScale, 0.38, 1).toFixed(3)}`,
        "--profile-panel-blur": `${Math.max(0, Math.round(10 * dnaTuning.blurScale))}px`,
        "--profile-dna-label-scale": `${dnaTuning.typographyScale}`,
        "--profile-dna-surface-opacity": `${surfaceOpacityScale.toFixed(3)}`,
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
            radial-gradient(circle at 82% 22%, ${withAlpha(presence.soft, "12")} 0%, transparent 28%),
            radial-gradient(circle at 50% 72%, ${withAlpha(presence.accent, "10")} 0%, transparent 34%);
          opacity: calc(${Math.max(0.16, depth.lightingOpacity)} + var(--profile-scroll-focus) * 0.18);
          transform: translate3d(0, calc(var(--profile-scroll-settle) * -0.2), 0);
          animation: ambient-drift var(--profile-ambient-drift-duration) var(--profile-motion-ease) infinite;
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
            ),
            radial-gradient(
              circle at 50% 56%,
              ${withAlpha(
                presence.soft,
                decimalOpacityToHex(clampNumber(motionPersonalityTokens.heroSpillOpacity, 0.04, 0.24)),
              )} 0%,
              transparent 52%
            );
        }

        .profile-stage-depth {
          background:
            linear-gradient(180deg, rgba(5, 6, 10, 0) 0%, rgba(5, 6, 10, ${Math.min(0.24, depth.shellShadeOpacity + 0.06).toFixed(3)}) 58%, rgba(5, 6, 10, ${Math.min(0.52, depth.surfaceShadeOpacity + 0.18).toFixed(3)}) 100%),
            radial-gradient(circle at 50% 100%, rgba(0, 0, 0, ${Math.min(0.18, depth.shadowDepth * 0.12).toFixed(3)}) 0%, transparent 48%);
          opacity: calc(1 + var(--profile-scroll-focus) * ${motionPersonalityTokens.heroDepthOpacity.toFixed(3)});
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
          filter: blur(calc(${tunedStageGlowBlur}px + var(--profile-blur-breath-distance) + var(--profile-scroll-blur-shift)));
          opacity: calc(${tunedStageGlowOpacity} + var(--profile-glow-pulse-opacity) * 0.7 + var(--profile-scroll-focus) * 0.08);
          animation:
            glow-breathe var(--profile-glow-pulse-duration) var(--profile-motion-ease) infinite,
            ambient-drift calc(var(--profile-ambient-drift-duration) * 1.14) var(--profile-motion-ease) infinite;
        }

        .profile-stage-foreground {
          inset: auto 0 0 0;
          height: 28%;
          background:
            linear-gradient(180deg, rgba(5, 6, 10, 0), rgba(5, 6, 10, ${Math.min(0.18, depth.foregroundHazeOpacity).toFixed(3)}) 100%),
            radial-gradient(circle at 50% 90%, ${withAlpha(presence.soft, "14")} 0%, transparent 36%);
          z-index: 1;
          opacity: calc(1 + var(--profile-scroll-focus) * 0.2);
        }

        .profile-stage-blur {
          inset: auto 0 0 0;
          height: ${preview
            ? bannerStyleTokens.previewStageBlurHeight
            : bannerStyleTokens.stageBlurHeight};
          background: linear-gradient(180deg, rgba(4, 5, 9, 0), rgba(4, 5, 9, 0.4) 42%, rgba(4, 5, 9, 0.8) 100%);
          transform: translate3d(0, var(--profile-scroll-settle), 0);
          filter: blur(calc(var(--profile-blur-breath-distance) * 0.6));
          opacity: calc(0.88 + var(--profile-scroll-focus) * 0.18);
        }

        .profile-shell {
          width: min(${preview ? Math.min(shellMaxWidth, 780) : shellMaxWidth}px, calc(100% - ${preview ? "24px" : "184px"}));
          max-width: ${preview ? Math.min(shellMaxWidth, 780) : shellMaxWidth}px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: ${preview ? "flex-start" : "flex-end"};
          padding: ${shellPadding};
          box-sizing: border-box;
          min-width: 0;
          transform: translate3d(0, calc(var(--profile-scroll-settle) * -0.68), 0);
          transition: transform var(--profile-transition-duration) var(--profile-motion-ease);
        }

        .profile-shell-orb {
          inset: auto;
          width: 84px;
          height: 84px;
          border-radius: 999px;
          background: radial-gradient(circle, ${withAlpha(presence.accent, "12")} 0%, transparent 72%);
          opacity: ${preview ? 0.22 : 0.34};
          z-index: 0;
          animation: ambient-drift calc(var(--profile-ambient-drift-duration) * 0.94) var(--profile-motion-ease) infinite;
        }

        .profile-shell-orb.left {
          left: -16px;
          top: 18px;
        }

        .profile-shell-orb.right {
          right: -14px;
          bottom: 10px;
          background: radial-gradient(circle, ${withAlpha(presence.soft, "12")} 0%, transparent 72%);
        }

        .profile-floating-panel {
          width: 100%;
          max-width: 100%;
          position: relative;
          border-radius: var(--profile-panel-radius);
          background: ${panelBackground};
          border: 1px solid rgba(255, 255, 255, calc(var(--profile-border-alpha) + 0.015));
          box-shadow:
            ${presence.panelGlow},
            ${glassTokens.shadowBoost},
            0 ${Math.round(24 * depth.shadowDepth * dnaTuning.shadowScale)}px ${Math.round(54 * depth.shadowDepth * dnaTuning.shadowScale)}px rgba(0, 0, 0, calc(var(--profile-shadow-alpha) + 0.04)),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          overflow: hidden;
          backdrop-filter: ${resolvedPanelBackdropFilter};
          -webkit-backdrop-filter: ${resolvedPanelBackdropFilter};
          transform: translate3d(0, calc(var(--profile-scroll-settle) * -0.3), 0);
          transition:
            transform var(--profile-transition-duration) var(--profile-motion-ease),
            box-shadow var(--profile-transition-duration) var(--profile-motion-ease);
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
          opacity: calc(0.92 + var(--profile-scroll-focus) * 0.12);
        }

        .profile-floating-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(220px, 0.64fr) minmax(0, 0.84fr);
          gap: ${preview ? "0" : `${Math.round(8 * spacingScale)}px`};
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
          gap: ${preview ? `${Math.round(10 * spacingScale)}px` : `${Math.round(4 * spacingScale)}px`};
        }

        .profile-links-column {
          border-left: 1px solid ${withAlpha(presence.accent, "12")};
          background:
            linear-gradient(180deg, rgba(255,255,255,0.018), transparent 22%),
            ${surfaceBackground};
        }

        .panel-topbar,
        .links-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ambient-chip,
        .profile-kicker,
        .links-count,
        .preview-callout {
          min-height: var(--profile-chip-height);
          padding: 0 var(--profile-chip-padding-x);
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          gap: var(--profile-chip-gap);
          color: #edf2fb;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, var(--profile-border-alpha));
          font-size: var(--profile-chip-font-size);
          font-weight: 800;
          letter-spacing: var(--profile-label-tracking);
          text-transform: uppercase;
          opacity: var(--profile-label-opacity);
          box-shadow: 0 10px 20px rgba(0, 0, 0, calc(var(--profile-shadow-alpha) - 0.04));
          backdrop-filter: blur(var(--profile-panel-blur));
          -webkit-backdrop-filter: blur(var(--profile-panel-blur));
          transition:
            transform var(--profile-transition-duration) var(--profile-motion-ease),
            opacity var(--profile-transition-duration) var(--profile-motion-ease);
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
          min-height: var(--profile-chip-height);
          margin-top: 8px;
          padding: 0 var(--profile-chip-padding-x);
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f7fbff;
          background: ${presence.presenceBackground};
          border: 1px solid ${presence.presenceBorder};
          box-shadow: 0 10px 22px ${withAlpha(presence.accent, dnaTuning.glowScale >= 1.1 ? "16" : "10")};
          font-size: var(--profile-chip-font-size);
          font-weight: 800;
          letter-spacing: calc(var(--profile-label-tracking) - 0.02em);
        }

        .identity-stack {
          margin-top: ${preview ? `${Math.round(12 * spacingScale)}px` : `${Math.round(14 * spacingScale)}px`};
          min-width: 0;
          transform: translate3d(0, calc(var(--profile-scroll-settle) * -0.24), 0);
          transition: transform var(--profile-transition-duration) var(--profile-motion-ease);
        }

        .avatar-and-copy {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: ${Math.round(12 * spacingScale)}px;
          align-items: flex-start;
          min-width: 0;
        }

        .avatar-shell {
          position: relative;
          width: ${avatarSize}px;
          height: ${avatarSize}px;
          flex-shrink: 0;
        }

        .avatar-aura {
          position: absolute;
          inset: 8px;
          border-radius: 999px;
          background: ${presence.avatarAuraBackground};
          filter: blur(calc(16px + var(--profile-blur-breath-distance)));
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
          right: 8px;
          bottom: 14px;
          width: 26px;
          height: 26px;
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
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: ${presence.presenceDot};
          box-shadow: 0 0 0 3px ${withAlpha(presence.pulse, "20")};
          display: inline-block;
          animation: ${statusPulseAnimation};
        }

        .identity-copy,
        .links-copy,
        .profile-link-copy {
          min-width: 0;
        }

        .profile-name {
          margin: 10px 0 0;
          font-size: ${preview
            ? `clamp(${Math.round(26 * densityTokens.bannerScale)}px, 4.1vw, ${Math.round(42 * densityTokens.bannerScale)}px)`
            : `clamp(${Math.round(31 * densityTokens.bannerScale)}px, 4.4vw, ${Math.round(48 * densityTokens.bannerScale)}px)`};
          line-height: 0.92;
          letter-spacing: -0.08em;
          text-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
          transition: transform var(--profile-transition-duration) var(--profile-motion-emphasis);
        }

        .profile-username,
        .profile-summary {
          color: #a2aec8;
        }

        .profile-username {
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: calc(var(--profile-label-tracking) - 0.03em);
        }

        .profile-pill-row,
        .profile-badge-rail {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: ${Math.round(11 * spacingScale)}px;
        }

        .profile-pill {
          min-height: var(--profile-chip-height);
          padding: 0 ${Math.max(7, Math.round(9 * dnaTuning.chipScale))}px;
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--profile-chip-font-size);
          font-weight: 800;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, var(--profile-border-alpha));
          background: rgba(255, 255, 255, 0.04);
        }

        .profile-bio {
          margin-top: ${preview ? `${Math.round(10 * spacingScale)}px` : `${Math.round(13 * spacingScale)}px`};
          max-width: 380px;
          color: #e0e6f0;
          font-size: 13px;
          line-height: ${densityTokens.bioLineHeight};
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .widget-shell {
          position: relative;
          min-width: 0;
          transform: translate3d(0, 0, 0);
          margin-inline: 0;
          transition:
            transform var(--profile-transition-duration) var(--profile-motion-ease),
            filter var(--profile-transition-duration) var(--profile-motion-ease);
        }

        .widget-shell.music {
          margin-top: ${Math.round(2 * spacingScale)}px;
          transform: translate3d(4px, 0, 0);
        }

        .widget-shell.social {
          margin-bottom: ${Math.round(2 * spacingScale)}px;
          transform: translate3d(-4px, 0, 0);
        }

        .widget-shell.live {
          transform: translate3d(6px, 0, 0);
        }

        .widget-shell.links {
          transform: translate3d(6px, 0, 0);
        }

        .widget-shell.badges {
          transform: translate3d(-2px, 0, 0);
        }

        .widget-shell.stats {
          transform: translate3d(4px, 0, 0);
        }

        .widget-shell::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: calc(var(--profile-card-radius) + 8px);
          background:
            radial-gradient(circle at 16% 18%, ${withAlpha(presence.accent, "0e")} 0%, transparent 34%),
            radial-gradient(circle at 84% 72%, ${withAlpha(presence.soft, "0c")} 0%, transparent 30%);
          opacity: var(--profile-widget-glow-opacity);
          z-index: -1;
          animation: glow-breathe calc(var(--profile-glow-pulse-duration) * 1.2) var(--profile-motion-ease) infinite;
        }

        .profile-badge-pill {
          min-height: ${Math.max(26, Math.round(30 * dnaTuning.chipScale))}px;
          padding: 0 ${Math.max(7, Math.round(9 * dnaTuning.chipScale))}px;
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, var(--profile-border-alpha));
          background: rgba(255, 255, 255, 0.04);
          max-width: 100%;
        }

        .profile-badge-icon {
          width: auto;
          min-width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-badge-label {
          font-size: var(--profile-chip-font-size);
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .links-list {
          display: grid;
          gap: ${Math.round(9 * spacingScale)}px;
          margin-top: ${preview ? `${Math.round(10 * spacingScale)}px` : `${Math.round(12 * spacingScale)}px`};
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
          gap: 11px;
          padding: 12px 12px 12px 11px;
          border-radius: var(--profile-card-radius);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.016)),
            linear-gradient(180deg, rgba(10, 12, 18, 0.58), rgba(9, 10, 16, 0.68));
          border: 1px solid rgba(255, 255, 255, calc(var(--profile-border-alpha) - 0.01));
          box-shadow:
            0 12px 24px rgba(0, 0, 0, var(--profile-shadow-alpha)),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition:
            transform var(--profile-transition-duration) var(--profile-motion-ease),
            border-color var(--profile-transition-duration) var(--profile-motion-ease),
            box-shadow var(--profile-transition-duration) var(--profile-motion-ease),
            background var(--profile-transition-duration) var(--profile-motion-ease);
          will-change: transform;
        }

        .profile-link-card:hover,
        .profile-link-card:focus-visible {
          transform: translateY(var(--profile-link-hover-lift)) scale(var(--profile-link-hover-scale));
          box-shadow:
            0 calc(14px + var(--profile-link-hover-lift) * 4) calc(26px + var(--profile-link-hover-lift) * 5) rgba(0, 0, 0, calc(var(--profile-shadow-alpha) + 0.04)),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .profile-link-card.float-a {
          margin-inline-end: 6px;
        }

        .profile-link-card.float-b {
          margin-inline-start: 8px;
        }

        .profile-link-glow {
          position: absolute;
          inset: 0 auto 0 0;
          width: 26%;
          opacity: 0.44;
          pointer-events: none;
        }

        .profile-link-icon {
          width: 42px;
          height: 42px;
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
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-link-top strong {
          font-size: 14px;
          letter-spacing: -0.03em;
          color: #ffffff;
          overflow-wrap: anywhere;
        }

        .profile-link-platform {
          min-height: 22px;
          padding: 0 7px;
          border-radius: var(--profile-chip-radius);
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: calc(var(--profile-label-tracking) - 0.02em);
          border: 1px solid currentColor;
        }

        .profile-link-host,
        .profile-link-url {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .profile-link-host {
          margin-top: 4px;
          color: #9eabc6;
          font-size: 11px;
          line-height: 1.55;
        }

        .profile-link-url {
          margin-top: 3px;
          color: #7f8ca7;
          font-size: 10px;
          line-height: 1.55;
        }

        .profile-link-arrow {
          width: 30px;
          height: 30px;
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
          padding: 16px 14px;
          text-align: center;
          color: #95a2bc;
          background: rgba(255, 255, 255, 0.02);
        }

        @keyframes online-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 4px rgba(69, 212, 131, 0.12); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(69, 212, 131, 0.06); }
        }

        @keyframes profile-aura {
          0%, 100% { transform: scale(calc(1.1 + var(--profile-aura-breath-scale))); opacity: calc(0.78 + var(--profile-glow-pulse-opacity)); }
          50% { transform: scale(calc(1.1 + var(--profile-aura-breath-scale) + 0.04)); opacity: 1; }
        }

        @keyframes ambient-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, var(--profile-ambient-drift-distance), 0); }
        }

        @keyframes glow-breathe {
          0%, 100% { opacity: calc(1 - var(--profile-glow-pulse-opacity)); }
          50% { opacity: calc(1 + var(--profile-glow-pulse-opacity)); }
        }

        @media (max-width: 920px) {
          .profile-shell {
            width: min(100% - 28px, ${preview ? Math.min(shellMaxWidth, 780) : shellMaxWidth}px);
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
          .profile-link-card.float-b,
          .widget-shell.music,
          .widget-shell.social,
          .widget-shell.live,
          .widget-shell.links,
          .widget-shell.badges,
          .widget-shell.stats {
            margin-inline: 0;
            transform: none;
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
            padding: ${Math.round(14 * densityTokens.contentPadding)}px 14px 14px;
          }

          .avatar-and-copy {
            grid-template-columns: 1fr;
            gap: 14px;
            text-align: center;
          }

          .avatar-shell {
            width: ${Math.min(132, avatarSize)}px;
            height: ${Math.min(132, avatarSize)}px;
            margin: 0 auto;
          }

          .profile-pill-row,
          .profile-badge-rail {
            justify-content: center;
          }

          .profile-shell-orb {
            display: none;
          }

          .profile-link-card {
            gap: 10px;
            padding: 12px 11px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .profile-floating-panel,
          .identity-stack,
          .profile-shell {
            transform: none;
          }

          .profile-link-card {
            will-change: auto;
          }

          .profile-link-card:hover,
          .profile-link-card:focus-visible {
            transform: none;
            box-shadow:
              0 12px 24px rgba(0, 0, 0, var(--profile-shadow-alpha)),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
                        size={avatarSize}
                        frameInset={8}
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

                </div>
              </div>
            </div>

            <div className="profile-links-column">
              <div className="links-list">
                {orderedContentBlocks.map((block) =>
                  renderModernCompositionBlock(block, {
                    preview,
                    music,
                    motionLevel: safeMotionLevel,
                    username: safeUser.username,
                    themeColor: sceneAppearance.linkThemeColor,
                    socialThemeColor: sceneAppearance.socialThemeColor,
                    accentColor: presence.accent,
                    contrastColor: presence.contrast,
                    softColor: presence.soft,
                    dnaTuning,
                    featuredBadges: safeFeaturedBadges,
                    extraBadgeCount: safeExtraBadgeCount,
                    likes,
                    dislikes,
                    views,
                    initialMyReaction,
                    regularSocialBlocks: partitionedSocialBlocks.socials,
                    liveSocialBlocks: partitionedSocialBlocks.live,
                    previewMessage,
                    links: safeUser.links,
                    linksStyle: safeComposition.linksStyle,
                    socialsStyle: safeComposition.socialsStyle,
                  }),
                )}
                {visibleCustomBlocks.map((block, index) =>
                  renderContainedCustomBlock(block, {
                    key: `custom-${block.id}`,
                    preview,
                    accentColor: sceneAppearance.linkThemeColor,
                    contrastColor: presence.contrast,
                    softColor: presence.soft,
                    dnaTuning,
                    style: getContainedCustomBlockStyle(block, index),
                  }),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FloatingProfileScene({
  preview,
  displayName,
  user,
  themeColor,
  mood,
  aura,
  sceneAppearance,
  nameEffects,
  backgroundIntensity,
  densityTokens,
  cardStyle,
  cornerTokens,
  motionLevel,
  motionPersonalityTokens,
  music,
  bannerKind,
  presetRenderTuning,
  dnaTuning,
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
  initialMyReaction,
  regularSocialBlocks,
  liveSocialBlocks,
  composition,
  orderedContentBlocks,
  customBlocks,
}: {
  preview: boolean;
  displayName: string;
  user: PublicProfileRenderUser;
  themeColor: string;
  mood: ProfileMood;
  aura: ProfileAura;
  sceneAppearance: ReturnType<typeof getProfileSceneAppearance>;
  nameEffects: ProfileNameEffect[];
  backgroundIntensity: ProfileBackgroundIntensity;
  densityTokens: ReturnType<typeof getProfileDensityTokens>;
  cardStyle: ProfileCardStyle;
  cornerTokens: ReturnType<typeof getProfileCornerTokens>;
  motionLevel: ProfileMotionLevel;
  motionPersonalityTokens: ReturnType<typeof getProfileMotionPersonalityTokens>;
  music: ProfileMusicData;
  bannerKind: "image" | "video" | "unknown";
  presetRenderTuning: ProfilePresetRenderTuning;
  dnaTuning: ProfileDnaTuning;
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
  initialMyReaction: PublicProfileReaction;
  regularSocialBlocks: PublicSocialBlock[];
  liveSocialBlocks: PublicSocialBlock[];
  composition: ProfileComposition;
  orderedContentBlocks: ProfileCompositionBlock[];
  customBlocks: ProfileCustomBlock[];
}) {
  const { presence, depth, socialThemeColor, linkThemeColor } = sceneAppearance;
  const scrollAtmosphereProgress = useScrollAtmosphere(!preview, 320);
  const resolvedBannerUrl = sanitizeRenderableUrl(user.bannerUrl);
  const floatingPlan = getProfileFloatingCompositionPlan({
    density: composition.density,
    introMode: "off",
    orderedBlocks: orderedContentBlocks,
    personalityOverride: presetRenderTuning.floatingPersonality,
  });
  const personality = floatingPlan.personality;
  const tunedFloatingIntensity = resolveFloatingIntensity(dnaTuning, personality);
  const floatingAvatarSize = Math.max(
    102,
    Math.round(132 * densityTokens.avatarScale * dnaTuning.compactnessScale),
  );
  const identityWidth = Math.min(
    Math.round(
      depth.shellMaxWidth *
        densityTokens.stageWidthScale *
        presetRenderTuning.stageWidthScale *
        dnaTuning.compactnessScale *
        0.58,
    ),
    Math.round(
      500 * presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
    ),
  );
  const stageWidth = Math.min(
    Math.round(
      depth.shellMaxWidth *
        densityTokens.stageWidthScale *
        presetRenderTuning.stageWidthScale *
        dnaTuning.compactnessScale,
    ),
    Math.round(
      860 * presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
    ),
  );
  const compactPills = heroPills.slice(0, 3);
  const identityJustifySelf =
    personality === "scattered"
      ? "start"
      : personality === "cinematic"
        ? "center"
        : personality === "minimal"
          ? "center"
          : "center";
  const identityTransform =
    personality === "scattered"
      ? `translate3d(${Math.round(-18 * tunedFloatingIntensity)}px, 0, 0)`
      : personality === "cinematic"
        ? `translate3d(${Math.round(10 * tunedFloatingIntensity)}px, ${Math.round(8 * tunedFloatingIntensity)}px, 0)`
        : personality === "minimal"
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, 0, 0)";
  const bioTransform =
    personality === "cinematic"
      ? `translate3d(${Math.round(28 * tunedFloatingIntensity)}px, ${Math.round(4 * tunedFloatingIntensity)}px, 0)`
      : personality === "scattered"
        ? `translate3d(${Math.round(-20 * tunedFloatingIntensity)}px, 0, 0)`
        : personality === "minimal"
          ? "translate3d(0, 0, 0)"
          : `translate3d(${Math.round(10 * tunedFloatingIntensity)}px, 0, 0)`;
  const floatingBodyGap = Math.max(
    12,
    Math.round(
      (personality === "scattered" ? 14 : personality === "cinematic" ? 16 : 15) *
        presetRenderTuning.moduleGapScale *
        dnaTuning.spacingScale,
    ),
  );
  const floatingGridRowGap = Math.max(
    10,
    Math.round(
      (personality === "scattered" ? 12 : 13) *
        presetRenderTuning.moduleGapScale *
        dnaTuning.spacingScale,
    ),
  );
  const floatingGridColumnGap = Math.max(
    12,
    Math.round(14 * presetRenderTuning.moduleGapScale * dnaTuning.spacingScale),
  );

  return (
    <main
      className="yotei-public-profile-root yotei-scrollbar-hidden"
      style={{
        minHeight: preview ? "auto" : "100vh",
        position: "relative",
        overflowX: "hidden",
        color: "#ffffff",
        fontFamily:
          '"Space Grotesk", Inter, Arial, Helvetica, system-ui, sans-serif',
        background: `
          radial-gradient(circle at top, ${withAlpha(linkThemeColor, "22")} 0%, transparent 30%),
          radial-gradient(circle at 84% 16%, ${withAlpha(presence.accent, "16")} 0%, transparent 20%),
          linear-gradient(180deg, #05060a 0%, #040508 46%, #030407 100%)
        `,
        pointerEvents: preview ? "none" : undefined,
        isolation: "isolate",
        "--floating-motion-ease": motionPersonalityTokens.transitionEasing,
        "--floating-motion-emphasis": motionPersonalityTokens.emphasisEasing,
        "--floating-transition-duration": `${motionPersonalityTokens.transitionDurationMs}ms`,
        "--floating-ambient-drift-distance": `${motionPersonalityTokens.ambientDriftDistancePx}px`,
        "--floating-ambient-drift-duration": `${motionPersonalityTokens.ambientDriftDurationS}s`,
        "--floating-blur-breath-distance": `${motionPersonalityTokens.blurBreathingPx}px`,
        "--floating-glow-pulse-duration": `${motionPersonalityTokens.glowPulseDurationS}s`,
        "--floating-glow-pulse-opacity": `${motionPersonalityTokens.glowPulseOpacity}`,
        "--floating-label-tracking": `${motionPersonalityTokens.labelLetterSpacingEm}em`,
        "--floating-label-opacity": `${motionPersonalityTokens.labelOpacity}`,
        "--floating-scroll-progress": `${scrollAtmosphereProgress.toFixed(3)}`,
        "--floating-scroll-settle": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollSettleDistancePx
        ).toFixed(2)}px`,
        "--floating-scroll-focus": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollFocusStrength
        ).toFixed(3)}`,
      } as CSSProperties}
    >
      <style>{`
        .floating-profile-stage,
        .floating-profile-stage-media,
        .floating-profile-stage-overlay,
        .floating-profile-stage-glow,
        .floating-profile-stage-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-profile-stage-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: brightness(0.82) saturate(1.02);
        }

        .floating-profile-stage-overlay {
          background:
            linear-gradient(180deg, rgba(4,5,9,0.22) 0%, rgba(4,5,9,0.44) 36%, rgba(4,5,9,0.78) 100%),
            radial-gradient(circle at 50% 18%, ${withAlpha(presence.accent, "26")} 0%, transparent 38%),
            radial-gradient(circle at 50% 56%, ${withAlpha(presence.soft, decimalOpacityToHex(motionPersonalityTokens.heroSpillOpacity))} 0%, transparent 50%);
        }

        .floating-profile-stage-glow {
          background: ${presence.stageGlow};
          filter: blur(calc(${Math.max(14, Math.round(depth.stageGlowBlur * dnaTuning.ambientScale * dnaTuning.glowScale))}px + var(--floating-blur-breath-distance)));
          opacity: calc(${clampNumber(depth.stageGlowOpacity * 0.62 * dnaTuning.ambientScale, 0.26, 0.8)} + var(--floating-glow-pulse-opacity));
          animation:
            glow-breathe var(--floating-glow-pulse-duration) var(--floating-motion-ease) infinite,
            ambient-drift var(--floating-ambient-drift-duration) var(--floating-motion-ease) infinite;
        }

        .floating-profile-stage-vignette {
          background:
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.44) 100%),
            linear-gradient(90deg, rgba(4,5,9,0.28) 0%, rgba(4,5,9,0.06) 24%, rgba(4,5,9,0.06) 76%, rgba(4,5,9,0.28) 100%);
        }

        .floating-profile-body {
          position: relative;
          z-index: 1;
          width: min(${stageWidth}px, calc(100% - 28px));
          max-width: ${stageWidth}px;
          margin: 0 auto;
          padding: ${preview ? "26px 0 18px" : "34px 0 30px"};
          display: grid;
          gap: ${floatingBodyGap}px;
          transform: translate3d(0, calc(var(--floating-scroll-settle) * -0.5), 0);
          transition: transform var(--floating-transition-duration) var(--floating-motion-ease);
        }

        .floating-identity-block {
          width: min(${identityWidth}px, 100%);
          justify-self: ${identityJustifySelf};
          transform: ${identityTransform};
          display: grid;
          justify-items: ${dnaTuning.alignment === "offset" ? "start" : "center"};
          gap: ${Math.max(10, Math.round(12 * dnaTuning.spacingScale))}px;
          text-align: ${dnaTuning.alignment === "offset" ? "left" : "center"};
          padding: ${Math.max(14, Math.round(18 * dnaTuning.compactnessScale))}px ${Math.max(13, Math.round(16 * dnaTuning.compactnessScale))}px;
          border-radius: ${Math.max(cornerTokens.panelRadius, 20)}px;
          border: 1px solid rgba(255,255,255,${clampNumber(0.06 * dnaTuning.borderScale, 0.03, 0.12).toFixed(3)});
          background:
            linear-gradient(180deg, rgba(255,255,255,${clampNumber(0.03 / dnaTuning.transparencyScale, 0.014, 0.042).toFixed(3)}), rgba(7,9,14,${clampNumber(0.4 / dnaTuning.transparencyScale, 0.22, 0.54).toFixed(3)})),
            ${cardStyle === "glass"
              ? "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))"
              : "none"};
          box-shadow:
            0 ${Math.round(20 * dnaTuning.shadowScale)}px ${Math.round(48 * dnaTuning.shadowScale)}px rgba(0,0,0,${clampNumber(0.18 * dnaTuning.shadowScale, 0.1, 0.3).toFixed(3)}),
            inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: ${cardStyle === "glass" ? `blur(${Math.max(8, Math.round(10 * dnaTuning.blurScale))}px) saturate(${Math.round(108 + (dnaTuning.glowScale - 1) * 20)}%)` : "none"};
          -webkit-backdrop-filter: ${cardStyle === "glass" ? `blur(${Math.max(8, Math.round(10 * dnaTuning.blurScale))}px) saturate(${Math.round(108 + (dnaTuning.glowScale - 1) * 20)}%)` : "none"};
          transition:
            transform var(--floating-transition-duration) var(--floating-motion-ease),
            box-shadow var(--floating-transition-duration) var(--floating-motion-ease);
        }

        .floating-chip-row,
        .floating-pill-row,
        .floating-badge-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .floating-chip {
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #eef2fb;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--floating-label-tracking);
          text-transform: uppercase;
          opacity: var(--floating-label-opacity);
        }

        .floating-chip.accent {
          background: ${presence.presenceBackground};
          border-color: ${presence.presenceBorder};
          color: #fff2fb;
        }

        .floating-name {
          margin: 0;
          font-size: clamp(30px, 4.4vw, 48px);
          line-height: 0.92;
          letter-spacing: -0.08em;
          text-shadow: 0 18px 40px rgba(0,0,0,0.3);
        }

        .floating-username {
          margin-top: -4px;
          color: #afbbd2;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .floating-pill {
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
        }

        .floating-bio-strip {
          justify-self: ${personality === "scattered" ? "start" : personality === "cinematic" ? "end" : "center"};
          transform: ${bioTransform};
          width: min(${personality === "minimal" ? "560px" : personality === "cinematic" ? "600px" : "640px"}, 100%);
          padding: 12px 14px;
          border-radius: ${Math.max(cornerTokens.cardRadius, 16)}px;
          border: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(7,9,14,0.66));
          color: #dfe7f6;
          font-size: 13px;
          line-height: ${densityTokens.bioLineHeight};
          text-align: center;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          box-shadow: 0 16px 32px rgba(0,0,0,0.16);
          transition:
            transform var(--floating-transition-duration) var(--floating-motion-ease),
            opacity var(--floating-transition-duration) var(--floating-motion-ease);
        }

        .floating-modules-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: ${floatingGridRowGap}px ${floatingGridColumnGap}px;
          align-items: start;
        }

        .floating-module {
          position: relative;
          min-width: 0;
          overflow: hidden;
          grid-column: var(--floating-col-start, 1) / span var(--floating-col-span, 12);
          justify-self: var(--floating-justify, stretch);
          width: var(--floating-width, 100%);
          max-width: var(--floating-max-width, none);
          transform: translate3d(var(--floating-x, 0px), calc(var(--floating-y, 0px) - var(--floating-scroll-settle) * 0.18), 0);
          border-radius: ${Math.max(cornerTokens.cardRadius - 2, 16)}px;
          border: 1px solid rgba(255,255,255,0.05);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.028), rgba(8,10,16,0.72)),
            ${sceneAppearance.surfaceBackground};
          box-shadow:
            0 16px 30px rgba(0,0,0,0.14),
            inset 0 1px 0 rgba(255,255,255,0.03);
          padding: 12px;
          backdrop-filter: ${cardStyle === "glass" ? "blur(8px) saturate(106%)" : "none"};
          -webkit-backdrop-filter: ${cardStyle === "glass" ? "blur(8px) saturate(106%)" : "none"};
          transition:
            transform var(--floating-transition-duration) var(--floating-motion-ease),
            box-shadow var(--floating-transition-duration) var(--floating-motion-ease),
            opacity var(--floating-transition-duration) var(--floating-motion-ease);
        }

        .floating-module::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, ${withAlpha(presence.accent, "0f")} 0%, transparent 28%),
            linear-gradient(120deg, rgba(255,255,255,0.04), transparent 18%);
          pointer-events: none;
          opacity: calc(0.92 + var(--floating-scroll-focus) * 0.12);
        }

        .floating-module > * {
          position: relative;
          z-index: 1;
        }

        .floating-module-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .floating-module-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #eef2fb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--floating-label-tracking);
          text-transform: uppercase;
          opacity: var(--floating-label-opacity);
        }

        .floating-module-meta {
          color: #9ba7c0;
          font-size: 11px;
          font-weight: 700;
        }

        .floating-module .links-list {
          margin-top: 0;
          display: grid;
          grid-template-columns: ${personality === "minimal"
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))"};
          gap: 10px 12px;
        }

        .floating-module .profile-link-card.float-a,
        .floating-module .profile-link-card.float-b {
          margin-inline: 0;
        }

        .floating-module.links .profile-link-card:nth-child(odd) {
          justify-self: start;
          max-width: ${personality === "cinematic" ? "320px" : "300px"};
          margin-top: ${personality === "scattered" ? "8px" : "0"};
        }

        .floating-module.links .profile-link-card:nth-child(even) {
          justify-self: end;
          max-width: ${personality === "minimal" ? "100%" : "280px"};
          margin-top: ${personality === "cinematic" ? "18px" : personality === "scattered" ? "14px" : "10px"};
        }

        .floating-module .profile-badge-rail {
          margin-top: 0;
        }

        @media (max-width: 920px) {
          .floating-modules-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .floating-module {
            grid-column: 1 / -1 !important;
            justify-self: stretch !important;
            width: 100% !important;
            max-width: none !important;
            transform: none !important;
          }
        }

        @media (max-width: 680px) {
          .floating-profile-body {
            width: min(${stageWidth}px, calc(100% - 20px));
            gap: 14px;
            padding: ${preview ? "20px 0 14px" : "24px 0 24px"};
          }

          .floating-identity-block {
            width: 100%;
            justify-self: stretch;
            transform: none;
          }

          .floating-bio-strip {
            width: 100%;
            justify-self: stretch;
            transform: none;
          }

          .floating-modules-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .floating-module .links-list {
            grid-template-columns: minmax(0, 1fr);
          }

          .floating-module.links .profile-link-card:nth-child(odd),
          .floating-module.links .profile-link-card:nth-child(even) {
            justify-self: stretch;
            max-width: 100%;
            margin-top: 0;
          }
        }

        @keyframes ambient-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, var(--floating-ambient-drift-distance), 0); }
        }

        @keyframes glow-breathe {
          0%, 100% { opacity: calc(1 - var(--floating-glow-pulse-opacity)); }
          50% { opacity: calc(1 + var(--floating-glow-pulse-opacity)); }
        }
      `}</style>

      <LivingProfileBackground
        mood={mood}
        aura={aura}
        themeColor={themeColor}
        scene={sceneAppearance.scene.value}
        previewMode={preview}
        intensity={backgroundIntensity}
        motionLevel={motionLevel}
      />

      <div className="floating-profile-stage" aria-hidden>
        <ProfileBannerMedia
          url={resolvedBannerUrl}
          kind={resolvedBannerUrl ? bannerKind : "unknown"}
          className="floating-profile-stage-media"
        />
        <div className="floating-profile-stage-glow" />
        <div className="floating-profile-stage-overlay" />
        <div className="floating-profile-stage-vignette" />
      </div>

      <section className="floating-profile-body">
        <div className="floating-identity-block">
          <div className="floating-chip-row">
            <div className="floating-chip accent">
              <LuMoonStar size={12} />
              {presence.statusLabel}
            </div>
            <div className="floating-chip">
              <LuSparkles size={12} />
              {sceneAppearance.scene.name}
            </div>
          </div>

          <LivingAvatar
            avatarUrl={sanitizeRenderableUrl(user.avatarUrl)}
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
            size={floatingAvatarSize}
            frameInset={7}
            decorationScale={decorationScale}
            decorationOffsetX={decorationOffsetX}
            decorationOffsetY={decorationOffsetY}
          />

          <ProfileNamePlate
            displayName={displayName}
            username={user.username}
            effects={nameEffects}
            motionLevel={motionLevel}
            nameClassName="floating-name"
            usernameClassName="floating-username"
          />

          {compactPills.length > 0 ? (
            <div className="floating-pill-row">
              {compactPills.map((pill) => (
                <div
                  key={pill.key}
                  className="floating-pill"
                  style={{
                    color: pill.color,
                    background: withAlpha(pill.color, "14"),
                    borderColor: withAlpha(pill.color, "22"),
                  }}
                >
                  {pill.icon}
                  {pill.text}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {user.bio ? <div className="floating-bio-strip">{user.bio}</div> : null}

        <FloatingModulesField
          orderedContentBlocks={orderedContentBlocks}
          customBlocks={customBlocks}
          placements={floatingPlan.placements}
          personality={personality}
          widgetWidthScale={presetRenderTuning.widgetWidthScale}
          dnaTuning={dnaTuning}
          preview={preview}
          username={user.username}
          music={music}
          motionLevel={motionLevel}
          themeColor={linkThemeColor}
          socialThemeColor={socialThemeColor}
          accentColor={presence.accent}
          contrastColor={presence.contrast}
          softColor={presence.soft}
          featuredBadges={featuredBadges}
          extraBadgeCount={extraBadgeCount}
          likes={likes}
          dislikes={dislikes}
          views={views}
          initialMyReaction={initialMyReaction}
          regularSocialBlocks={regularSocialBlocks}
          liveSocialBlocks={liveSocialBlocks}
          links={user.links}
          linksStyle={composition.linksStyle}
          socialsStyle={composition.socialsStyle}
        />
      </section>
    </main>
  );
}

function getIntroRevealStyle(
  revealIndex: number,
  extra?: CSSProperties,
): CSSProperties {
  return {
    "--intro-reveal-delay": `calc(var(--intro-reveal-stagger) * ${Math.min(revealIndex, 6)})`,
    ...extra,
  } as CSSProperties;
}

function useScrollAtmosphere(enabled: boolean, distance: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setProgress(0);
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const nextProgress = clampNumber(window.scrollY / Math.max(distance, 1), 0, 1);
      setProgress((current) =>
        Math.abs(current - nextProgress) < 0.01 ? current : nextProgress,
      );
    };

    updateProgress();

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [distance, enabled]);

  return progress;
}

function usePublicProfileScrollbarMode(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.classList.add("yotei-public-profile-route");
    bodyElement.classList.add("yotei-public-profile-route");

    return () => {
      htmlElement.classList.remove("yotei-public-profile-route");
      bodyElement.classList.remove("yotei-public-profile-route");
    };
  }, [enabled]);
}

function IntroProfileStage({
  mode,
  floating,
  preview,
  previewMessage,
  displayName,
  user,
  themeColor,
  mood,
  aura,
  sceneAppearance,
  nameEffects,
  backgroundIntensity,
  densityTokens,
  cardStyle,
  motionLevel,
  motionPersonalityTokens,
  music,
  bannerKind,
  presetRenderTuning,
  dnaTuning,
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
  initialMyReaction,
  regularSocialBlocks,
  liveSocialBlocks,
  composition,
  orderedContentBlocks,
  customBlocks,
  hasDetails,
}: {
  mode: ProfileIntroMode;
  floating: boolean;
  preview: boolean;
  previewMessage: string;
  displayName: string;
  user: PublicProfileRenderUser;
  themeColor: string;
  mood: ProfileMood;
  aura: ProfileAura;
  sceneAppearance: ReturnType<typeof getProfileSceneAppearance>;
  nameEffects: ProfileNameEffect[];
  backgroundIntensity: ProfileBackgroundIntensity;
  densityTokens: ReturnType<typeof getProfileDensityTokens>;
  cardStyle: ProfileCardStyle;
  motionLevel: ProfileMotionLevel;
  motionPersonalityTokens: ReturnType<typeof getProfileMotionPersonalityTokens>;
  music: ProfileMusicData;
  bannerKind: "image" | "video" | "unknown";
  presetRenderTuning: ProfilePresetRenderTuning;
  dnaTuning: ProfileDnaTuning;
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
  initialMyReaction: PublicProfileReaction;
  regularSocialBlocks: PublicSocialBlock[];
  liveSocialBlocks: PublicSocialBlock[];
  composition: ProfileComposition;
  orderedContentBlocks: ProfileCompositionBlock[];
  customBlocks: ProfileCustomBlock[];
  hasDetails: boolean;
}) {
  const { presence, depth, socialThemeColor, linkThemeColor } = sceneAppearance;
  const introAvatarSize = Math.max(
    mode === "cinematic" ? 132 : 108,
    Math.round(
      (mode === "cinematic" ? 150 : 122) *
        densityTokens.avatarScale *
        dnaTuning.compactnessScale,
    ),
  );
  const introMaxWidth = Math.min(
    Math.round(
      depth.shellMaxWidth *
        densityTokens.stageWidthScale *
        presetRenderTuning.stageWidthScale *
        presetRenderTuning.introStageScale *
        dnaTuning.introStageScale *
        (mode === "cinematic" ? 0.7 : 0.6),
    ),
    Math.round(
      (mode === "cinematic" ? 540 : 460) *
        presetRenderTuning.introStageScale *
        dnaTuning.introStageScale,
    ),
  );
  const detailsMaxWidth = Math.min(
    Math.round(
      depth.shellMaxWidth *
        densityTokens.stageWidthScale *
        presetRenderTuning.stageWidthScale *
        dnaTuning.compactnessScale,
    ),
    Math.round(
      (mode === "cinematic" ? 820 : 780) *
        presetRenderTuning.stageWidthScale *
        dnaTuning.compactnessScale,
    ),
  );
  const introPills = mode === "cinematic" ? heroPills.slice(0, 3) : heroPills.slice(0, 2);
  const introBadges = featuredBadges.slice(0, mode === "cinematic" ? 3 : 2);
  const resolvedBannerUrl = sanitizeRenderableUrl(user.bannerUrl);
  const detailsSectionId = `profile-details-${user.username}-${mode}${preview ? "-preview" : ""}`;
  const floatingPersonality = floating
    ? getProfileFloatingCompositionPlan({
        density: composition.density,
        introMode: mode,
        orderedBlocks: orderedContentBlocks,
        personalityOverride: presetRenderTuning.floatingPersonality,
      }).personality
    : "centered";
  const introDetailsGap = Math.max(
    10,
    Math.round(
      (floating ? 14 : 12) *
        presetRenderTuning.moduleGapScale *
        dnaTuning.spacingScale,
    ),
  );
  const introFloatingGridRowGap = Math.max(
    10,
    Math.round(
      (floatingPersonality === "scattered" ? 12 : 13) *
        presetRenderTuning.moduleGapScale *
        dnaTuning.spacingScale,
    ),
  );
  const introFloatingGridColumnGap = Math.max(
    12,
    Math.round(14 * presetRenderTuning.moduleGapScale * dnaTuning.spacingScale),
  );
  const detailsRef = useRef<HTMLElement | null>(null);
  const [scrollHintOpacity, setScrollHintOpacity] = useState(1);
  const scrollAtmosphereProgress = useScrollAtmosphere(
    !preview && hasDetails,
    260,
  );

  useEffect(() => {
    if (preview || !hasDetails || typeof window === "undefined") {
      return;
    }

    let frame = 0;

    const updateScrollHint = () => {
      frame = 0;
      const nextOpacity = Math.max(0, 1 - Math.min(window.scrollY / 120, 1));
      setScrollHintOpacity((current) =>
        Math.abs(current - nextOpacity) < 0.02 ? current : nextOpacity,
      );
    };

    updateScrollHint();

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateScrollHint);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasDetails, preview]);

  useEffect(() => {
    const detailsElement = detailsRef.current;

    if (!detailsElement) {
      return;
    }

    const revealElements = [
      detailsElement,
      ...Array.from(
        detailsElement.querySelectorAll<HTMLElement>("[data-intro-reveal='item']"),
      ),
    ];

    const showAll = () => {
      revealElements.forEach((element) => {
        element.dataset.revealed = "true";
      });
    };

    if (
      preview ||
      !hasDetails ||
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      showAll();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      showAll();
      return;
    }

    revealElements.forEach((element) => {
      element.dataset.revealed = "false";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [
    customBlocks,
    hasDetails,
    orderedContentBlocks,
    preview,
    user.bio,
  ]);

  const scrollToDetails = () => {
    if (preview || !hasDetails || typeof document === "undefined") {
      return;
    }

    const target = document.getElementById(detailsSectionId);

    if (!target) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main
      className="yotei-public-profile-root yotei-scrollbar-hidden"
      style={{
        minHeight: preview ? "auto" : "100vh",
        position: "relative",
        overflowX: "hidden",
        color: "#ffffff",
        fontFamily:
          '"Space Grotesk", Inter, Arial, Helvetica, system-ui, sans-serif',
        background: `
          radial-gradient(circle at top, ${withAlpha(linkThemeColor, mode === "cinematic" || floating ? "22" : "16")} 0%, transparent 28%),
          radial-gradient(circle at 82% 14%, ${withAlpha(presence.accent, "18")} 0%, transparent 18%),
          linear-gradient(180deg, #05060a 0%, #040508 46%, #030407 100%)
        `,
        pointerEvents: preview ? "none" : undefined,
        isolation: "isolate",
        "--intro-motion-ease": motionPersonalityTokens.transitionEasing,
        "--intro-motion-emphasis": motionPersonalityTokens.emphasisEasing,
        "--intro-transition-duration": `${motionPersonalityTokens.transitionDurationMs}ms`,
        "--intro-reveal-duration": `${motionPersonalityTokens.revealDurationMs}ms`,
        "--intro-reveal-distance": `${motionPersonalityTokens.revealDistancePx}px`,
        "--intro-reveal-scale": `${motionPersonalityTokens.revealScale}`,
        "--intro-reveal-stagger": `${motionPersonalityTokens.staggerDelayMs}ms`,
        "--intro-ambient-drift-distance": `${motionPersonalityTokens.ambientDriftDistancePx}px`,
        "--intro-ambient-drift-duration": `${motionPersonalityTokens.ambientDriftDurationS}s`,
        "--intro-blur-breath-distance": `${motionPersonalityTokens.blurBreathingPx}px`,
        "--intro-blur-breath-duration": `${motionPersonalityTokens.blurBreathingDurationS}s`,
        "--intro-glow-pulse-duration": `${motionPersonalityTokens.glowPulseDurationS}s`,
        "--intro-glow-pulse-opacity": `${motionPersonalityTokens.glowPulseOpacity}`,
        "--intro-label-tracking": `${motionPersonalityTokens.labelLetterSpacingEm}em`,
        "--intro-label-opacity": `${motionPersonalityTokens.labelOpacity}`,
        "--intro-scroll-progress": `${scrollAtmosphereProgress.toFixed(3)}`,
        "--intro-scroll-settle": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollSettleDistancePx
        ).toFixed(2)}px`,
        "--intro-scroll-focus": `${(
          scrollAtmosphereProgress * motionPersonalityTokens.scrollFocusStrength
        ).toFixed(3)}`,
      } as CSSProperties}
    >
      <style>{`
        .profile-intro-stage,
        .profile-intro-stage-media,
        .profile-intro-stage-overlay,
        .profile-intro-stage-glow,
        .profile-intro-stage-vignette,
        .profile-intro-stage-depth {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .profile-intro-stage {
          z-index: 0;
        }

        .profile-intro-stage-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(${mode === "cinematic" ? 1.06 : 1.03});
          filter: ${mode === "cinematic"
            ? "brightness(0.9) saturate(1.04)"
            : "brightness(0.82) saturate(0.98)"};
        }

        .profile-intro-stage-overlay {
          background:
            linear-gradient(
              180deg,
              rgba(4, 5, 9, ${mode === "cinematic" ? "0.18" : "0.32"}) 0%,
              rgba(4, 5, 9, ${mode === "cinematic" ? "0.34" : "0.54"}) 38%,
              rgba(4, 5, 9, 0.82) 100%
            ),
            radial-gradient(circle at 50% 16%, ${withAlpha(presence.accent, mode === "cinematic" ? "2e" : "18")} 0%, transparent 38%);
        }

        .profile-intro-stage-glow {
          background: ${presence.stageGlow};
          filter: blur(calc(${mode === "cinematic" ? Math.max(depth.stageGlowBlur, 16) : 12}px + var(--intro-blur-breath-distance) + var(--intro-scroll-focus) * 2px));
          opacity: calc(${mode === "cinematic" ? Math.max(depth.stageGlowOpacity * 0.7, 0.4) : 0.26} + var(--intro-glow-pulse-opacity) + var(--intro-scroll-focus) * 0.08);
          animation:
            intro-glow-breathe var(--intro-glow-pulse-duration) var(--intro-motion-ease) infinite,
            intro-ambient-drift var(--intro-ambient-drift-duration) var(--intro-motion-ease) infinite;
        }

        .profile-intro-stage-vignette {
          background:
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 42%, rgba(0, 0, 0, ${mode === "cinematic" ? "0.34" : "0.42"}) 100%),
            linear-gradient(90deg, rgba(4, 5, 9, 0.34) 0%, rgba(4, 5, 9, 0.06) 22%, rgba(4, 5, 9, 0.06) 78%, rgba(4, 5, 9, 0.34) 100%);
        }

        .profile-intro-stage-depth {
          background:
            linear-gradient(180deg, rgba(5, 6, 10, 0) 0%, rgba(5, 6, 10, 0.16) 52%, rgba(5, 6, 10, 0.46) 100%),
            radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.18) 0%, transparent 42%);
          opacity: calc(1 + var(--intro-scroll-focus) * ${motionPersonalityTokens.heroDepthOpacity.toFixed(3)});
        }

        .profile-intro-hero {
          position: relative;
          z-index: 1;
          min-height: ${preview ? (mode === "cinematic" ? "540px" : "500px") : "100svh"};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${preview ? "24px 14px 8px" : "32px 18px 10px"};
          box-sizing: border-box;
          transform: translate3d(0, calc(var(--intro-scroll-settle) * -0.72), 0);
          transition: transform var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-shell {
          width: min(${introMaxWidth}px, calc(100% - 24px));
          max-width: ${introMaxWidth}px;
          position: relative;
          display: grid;
          justify-items: center;
          gap: ${mode === "cinematic" ? "16px" : "13px"};
          padding: ${mode === "cinematic" ? "22px 20px" : "18px 16px"};
          text-align: center;
          border-radius: ${mode === "cinematic" ? "28px" : "24px"};
          border: 1px solid ${mode === "cinematic" || floating ? withAlpha(presence.accent, "18") : "rgba(255,255,255,0.07)"};
          background:
            ${mode === "cinematic" || floating
              ? "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(8,10,16,0.28) 42%, rgba(8,10,16,0.12) 100%)"
              : "linear-gradient(180deg, rgba(8,10,16,0.72), rgba(7,8,14,0.52))"},
            ${cardStyle === "glass"
              ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
              : "none"};
          box-shadow:
            0 28px 60px rgba(0, 0, 0, 0.18),
            0 0 0 1px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: ${cardStyle === "glass" && mode === "cinematic"
            ? "blur(14px) saturate(112%)"
            : cardStyle === "glass"
              ? "blur(12px) saturate(108%)"
              : "blur(8px) saturate(104%)"};
          -webkit-backdrop-filter: ${cardStyle === "glass" && mode === "cinematic"
            ? "blur(14px) saturate(112%)"
            : cardStyle === "glass"
              ? "blur(12px) saturate(108%)"
              : "blur(8px) saturate(104%)"};
          transform: translate3d(0, calc(var(--intro-scroll-settle) * -0.18), 0);
          transition:
            transform var(--intro-transition-duration) var(--intro-motion-ease),
            box-shadow var(--intro-transition-duration) var(--intro-motion-ease),
            opacity var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(circle at top, ${withAlpha(presence.soft, mode === "cinematic" ? "18" : "0d")} 0%, transparent 38%),
            linear-gradient(135deg, rgba(255,255,255,0.05), transparent 20%);
          pointer-events: none;
          opacity: calc(0.92 + var(--intro-scroll-focus) * 0.16);
        }

        .profile-intro-chip-row,
        .profile-intro-pill-row,
        .profile-intro-badge-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-intro-chip,
        .profile-intro-scroll {
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #eef3fc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--intro-label-tracking);
          text-transform: uppercase;
          opacity: var(--intro-label-opacity);
        }

        .profile-intro-chip.accent {
          border-color: ${presence.presenceBorder};
          background: ${presence.presenceBackground};
          color: #fff4fb;
        }

        .profile-intro-avatar,
        .profile-intro-name,
        .profile-intro-username {
          position: relative;
          z-index: 1;
        }

        .profile-intro-name {
          margin: 0;
          font-size: clamp(${mode === "cinematic" ? "34px" : "28px"}, ${mode === "cinematic" ? "5vw" : "4.6vw"}, ${mode === "cinematic" ? "54px" : "44px"});
          line-height: 0.92;
          letter-spacing: -0.08em;
          text-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
          transition: transform var(--intro-transition-duration) var(--intro-motion-emphasis);
        }

        .profile-intro-username {
          margin-top: -4px;
          color: #b0bdd6;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: calc(var(--intro-label-tracking) - 0.03em);
        }

        .profile-intro-bio-hint {
          position: relative;
          z-index: 1;
          max-width: 38ch;
          color: #cdd8eb;
          font-size: 13px;
          line-height: 1.65;
        }

        .profile-intro-pill {
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: calc(var(--intro-label-tracking) - 0.03em);
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
        }

        .profile-intro-badge-pill {
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          max-width: 100%;
        }

        .profile-intro-badge-label {
          font-size: 10px;
          font-weight: 800;
          color: #f5f7fb;
        }

        .profile-intro-scroll-wrap {
          position: absolute;
          left: 50%;
          bottom: ${preview ? "10px" : "20px"};
          transform: translateX(-50%);
          z-index: 1;
          transition:
            opacity var(--intro-transition-duration) var(--intro-motion-ease),
            transform var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-scroll {
          cursor: pointer;
          position: relative;
          min-height: 40px;
          padding: 5px 8px 5px 6px;
          gap: 10px;
          border-color: rgba(255,255,255,0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(8,10,16,0.48));
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.18),
            0 0 22px ${withAlpha(linkThemeColor, "18")},
            inset 0 1px 0 rgba(255,255,255,0.08);
          transition:
            opacity var(--intro-transition-duration) var(--intro-motion-ease),
            transform var(--intro-transition-duration) var(--intro-motion-ease),
            border-color var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-scroll:hover,
        .profile-intro-scroll:focus-visible {
          opacity: 1;
          transform: translateY(-2px);
          border-color: ${withAlpha(linkThemeColor, "32")};
          outline: none;
        }

        .profile-intro-scroll-orb {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f8fbff;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 52%),
            linear-gradient(180deg, ${withAlpha(linkThemeColor, "32")}, rgba(255,255,255,0.04));
          box-shadow:
            0 0 0 1px ${withAlpha(linkThemeColor, "24")},
            0 0 18px ${withAlpha(linkThemeColor, "18")};
          animation: intro-scroll-pulse calc(var(--intro-glow-pulse-duration) * 0.9) var(--intro-motion-ease) infinite;
        }

        .profile-intro-scroll-arrow {
          animation: intro-scroll-hint calc(var(--intro-glow-pulse-duration) * 0.72) var(--intro-motion-ease) infinite;
        }

        .profile-intro-scroll-copy {
          color: #eef4ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: calc(var(--intro-label-tracking) + 0.01em);
          text-transform: uppercase;
        }

        .profile-intro-details {
          position: relative;
          z-index: 1;
          width: min(${detailsMaxWidth}px, calc(100% - 28px));
          max-width: ${detailsMaxWidth}px;
          margin: 0 auto ${preview ? "18px" : "28px"};
          padding-top: ${preview ? "12px" : "24px"};
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: ${Math.max(16, introDetailsGap + 6)}px;
          scroll-margin-top: 28px;
          align-items: start;
        }

        .profile-intro-details[data-revealed="false"] {
          opacity: 1;
          transform: none;
        }

        .profile-intro-details[data-revealed="true"] {
          opacity: 1;
          transform: none;
        }

        .profile-intro-chapter,
        .profile-intro-divider-row {
          width: min(100%, 720px);
          justify-self: center;
          min-width: 0;
        }

        .profile-intro-chapter {
          position: relative;
          overflow: hidden;
          display: grid;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.06);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(9,11,17,0.16)),
            radial-gradient(circle at top, ${withAlpha(presence.accent, "0d")} 0%, transparent 48%);
          box-shadow:
            0 12px 26px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(6px) saturate(104%);
          -webkit-backdrop-filter: blur(6px) saturate(104%);
          transition:
            transform var(--intro-transition-duration) var(--intro-motion-ease),
            opacity var(--intro-transition-duration) var(--intro-motion-ease),
            box-shadow var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-chapter::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.045), transparent 22%),
            radial-gradient(circle at top right, ${withAlpha(presence.soft, "08")} 0%, transparent 32%);
          pointer-events: none;
        }

        .profile-intro-chapter > * {
          position: relative;
          z-index: 1;
        }

        .profile-intro-chapter-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .profile-intro-chapter-label,
        .profile-intro-chapter-subtitle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          min-height: 24px;
          padding: 0 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.035);
          color: #eef3fc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--intro-label-tracking);
          text-transform: uppercase;
          opacity: var(--intro-label-opacity);
        }

        .profile-intro-chapter-note {
          color: #9ca8c1;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .profile-intro-chapter-body,
        .profile-intro-chapter-stack {
          display: grid;
          gap: 12px;
          min-width: 0;
        }

        .profile-intro-chapter-copy {
          color: #e4ebf8;
          font-size: 13px;
          line-height: ${densityTokens.bioLineHeight};
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .profile-intro-chapter-subsection {
          display: grid;
          gap: 10px;
          min-width: 0;
        }

        .profile-intro-chapter-subsection + .profile-intro-chapter-subsection {
          padding-top: 4px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .profile-intro-inline-block {
          width: 100%;
          min-width: 0;
        }

        .profile-intro-inline-block.custom-image-card {
          max-width: 100%;
        }

        .profile-intro-divider-row {
          padding: 2px 0;
        }

        .profile-intro-bio-strip,
        .floating-bio-strip {
          position: relative;
          overflow: hidden;
          min-width: 0;
          grid-column: 2 / span 10;
          justify-self: center;
          width: min(100%, 720px);
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.07);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(7,9,14,0.42)),
            radial-gradient(circle at top, ${withAlpha(presence.accent, "12")} 0%, transparent 46%);
          color: #dfe7f6;
          font-size: 13px;
          line-height: ${densityTokens.bioLineHeight};
          text-align: center;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          backdrop-filter: blur(12px) saturate(108%);
          -webkit-backdrop-filter: blur(12px) saturate(108%);
          box-shadow: 0 18px 36px rgba(0,0,0,0.14);
          transition:
            transform var(--intro-transition-duration) var(--intro-motion-ease),
            opacity var(--intro-transition-duration) var(--intro-motion-ease),
            box-shadow var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-bio-strip::before,
        .floating-bio-strip::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.05), transparent 24%);
          pointer-events: none;
        }

        .profile-intro-bio-strip > *,
        .floating-bio-strip > * {
          position: relative;
          z-index: 1;
        }

        .profile-intro-module {
          position: relative;
          overflow: hidden;
          min-width: 0;
          grid-column: span 6;
          border-radius: ${floating ? "18px" : "24px"};
          border: 1px solid ${floating ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.06)"};
          background:
            linear-gradient(180deg, rgba(255,255,255,${floating ? "0.032" : "0.045"}), rgba(8,10,16,${floating ? "0.6" : "0.68"})),
            ${sceneAppearance.surfaceBackground};
          box-shadow:
            0 ${floating ? "16px 30px" : "18px 36px"} rgba(0, 0, 0, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.04);
          padding: ${floating ? "12px" : "13px"};
          backdrop-filter: blur(${floating ? "10px" : "12px"}) saturate(108%);
          -webkit-backdrop-filter: blur(${floating ? "10px" : "12px"}) saturate(108%);
          transition:
            transform var(--intro-transition-duration) var(--intro-motion-ease),
            box-shadow var(--intro-transition-duration) var(--intro-motion-ease),
            opacity var(--intro-transition-duration) var(--intro-motion-ease);
        }

        .profile-intro-module[data-revealed="false"],
        .profile-intro-chapter[data-revealed="false"],
        .floating-module[data-revealed="false"],
        .profile-intro-bio-strip[data-revealed="false"],
        .floating-bio-strip[data-revealed="false"] {
          opacity: 0;
          transform: translate3d(0, var(--intro-reveal-distance), 0) scale(var(--intro-reveal-scale));
        }

        .profile-intro-module[data-revealed="true"],
        .profile-intro-chapter[data-revealed="true"],
        .floating-module[data-revealed="true"],
        .profile-intro-bio-strip[data-revealed="true"],
        .floating-bio-strip[data-revealed="true"] {
          opacity: 1;
          transform: none;
          transition:
            opacity var(--intro-reveal-duration) var(--intro-motion-ease),
            transform var(--intro-reveal-duration) var(--intro-motion-emphasis);
          transition-delay: var(--intro-reveal-delay, 0ms);
          will-change: transform, opacity;
        }

        .profile-intro-module::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.04), transparent 22%),
            radial-gradient(circle at top right, ${withAlpha(presence.accent, "0e")} 0%, transparent 28%);
          pointer-events: none;
        }

        .profile-intro-module > * {
          position: relative;
          z-index: 1;
        }

        .profile-intro-module-stack {
          display: grid;
          gap: 10px;
        }

        .profile-intro-module-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .profile-intro-module-copy {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #eef3fc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--intro-label-tracking);
          text-transform: uppercase;
          opacity: var(--intro-label-opacity);
        }

        .profile-intro-module-count {
          color: #9aa7c2;
          font-size: 11px;
          font-weight: 700;
        }

        .profile-intro-bio-card {
          color: #dfe7f6;
          font-size: 13px;
          line-height: ${densityTokens.bioLineHeight};
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .profile-intro-module.detail-music {
          grid-column: 1 / -1;
          padding-block: 11px;
          border-radius: 999px;
        }

        .profile-intro-module.detail-music .profile-intro-module-stack {
          gap: 8px;
        }

        .profile-intro-module.detail-socials,
        .profile-intro-module.detail-links {
          grid-column: span 6;
        }

        .profile-intro-module.detail-live {
          grid-column: span 6;
        }

        .profile-intro-module.detail-badges {
          grid-column: span 7;
        }

        .profile-intro-module.detail-stats {
          grid-column: span 5;
        }

        .profile-intro-module.custom-block-shell.width-normal,
        .profile-intro-module.custom-image-card {
          grid-column: span 7;
        }

        .profile-intro-module.custom-block-shell.width-compact {
          grid-column: span 5;
        }

        .profile-intro-module.custom-divider,
        .profile-intro-module.custom-text-strip,
        .profile-intro-module.custom-status-banner {
          grid-column: 1 / -1;
        }

        .profile-intro-module .links-list {
          margin-top: 0;
        }

        .profile-intro-chapter .links-list {
          margin-top: 0;
        }

        .profile-intro-module .profile-link-card.float-a,
        .profile-intro-module .profile-link-card.float-b {
          margin-inline: 0;
        }

        .floating-modules-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: ${introFloatingGridRowGap}px ${introFloatingGridColumnGap}px;
          align-items: start;
        }

        .floating-module {
          position: relative;
          min-width: 0;
          overflow: hidden;
          grid-column: var(--floating-col-start, 1) / span var(--floating-col-span, 12);
          justify-self: var(--floating-justify, stretch);
          width: var(--floating-width, 100%);
          max-width: var(--floating-max-width, none);
          transform: translate3d(var(--floating-x, 0px), var(--floating-y, 0px), 0);
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.05);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.032), rgba(8,10,16,0.54)),
            ${sceneAppearance.surfaceBackground};
          box-shadow:
            0 16px 30px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.03);
          padding: 12px;
          backdrop-filter: ${cardStyle === "glass" ? "blur(10px) saturate(108%)" : "blur(8px) saturate(104%)"};
          -webkit-backdrop-filter: ${cardStyle === "glass" ? "blur(10px) saturate(108%)" : "blur(8px) saturate(104%)"};
        }

        .floating-module::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, ${withAlpha(presence.accent, "0f")} 0%, transparent 28%),
            linear-gradient(120deg, rgba(255,255,255,0.04), transparent 18%);
          pointer-events: none;
        }

        .floating-module > * {
          position: relative;
          z-index: 1;
        }

        .floating-module-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .floating-module-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #eef2fb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: var(--intro-label-tracking);
          text-transform: uppercase;
          opacity: var(--intro-label-opacity);
        }

        .floating-module-meta {
          color: #9ba7c0;
          font-size: 11px;
          font-weight: 700;
        }

        .floating-module .links-list {
          margin-top: 0;
          display: grid;
          grid-template-columns: ${floatingPersonality === "minimal"
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))"};
          gap: 10px 12px;
        }

        .floating-module .profile-link-card.float-a,
        .floating-module .profile-link-card.float-b {
          margin-inline: 0;
        }

        .floating-module.links .profile-link-card:nth-child(odd) {
          justify-self: start;
          max-width: ${floatingPersonality === "cinematic" ? "320px" : "300px"};
          margin-top: ${floatingPersonality === "scattered" ? "8px" : "0"};
        }

        .floating-module.links .profile-link-card:nth-child(even) {
          justify-self: end;
          max-width: ${floatingPersonality === "minimal" ? "100%" : "280px"};
          margin-top: ${floatingPersonality === "cinematic"
            ? "18px"
            : floatingPersonality === "scattered"
              ? "14px"
              : "10px"};
        }

        @keyframes intro-scroll-hint {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(4px);
          }
        }

        @keyframes intro-scroll-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px ${withAlpha(linkThemeColor, "24")},
              0 0 14px ${withAlpha(linkThemeColor, "14")};
          }

          50% {
            box-shadow:
              0 0 0 1px ${withAlpha(linkThemeColor, "34")},
              0 0 24px ${withAlpha(linkThemeColor, "22")};
          }
        }

        @keyframes intro-ambient-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, var(--intro-ambient-drift-distance), 0); }
        }

        @keyframes intro-glow-breathe {
          0%, 100% { opacity: calc(1 - var(--intro-glow-pulse-opacity)); }
          50% { opacity: calc(1 + var(--intro-glow-pulse-opacity)); }
        }

        @media (max-width: 920px) {
          .profile-intro-chapter,
          .profile-intro-divider-row,
          .profile-intro-bio-strip,
          .floating-bio-strip,
          .profile-intro-module,
          .profile-intro-module.custom-block-shell.width-normal,
          .profile-intro-module.custom-block-shell.width-compact,
          .profile-intro-module.custom-image-card,
          .profile-intro-module.detail-socials,
          .profile-intro-module.detail-links,
          .profile-intro-module.detail-live,
          .profile-intro-module.detail-badges,
          .profile-intro-module.detail-stats {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 720px) {
          .profile-intro-hero {
            min-height: ${preview ? "460px" : "100svh"};
            padding: 22px 14px 6px;
          }

          .profile-intro-shell {
            width: min(${Math.min(introMaxWidth, 420)}px, calc(100% - 12px));
            padding: 16px 14px;
            border-radius: 22px;
          }

          .profile-intro-details {
            width: min(${Math.min(detailsMaxWidth, 760)}px, calc(100% - 20px));
            margin: 0 auto ${preview ? "18px" : "24px"};
            padding-top: ${preview ? "10px" : "18px"};
            grid-template-columns: minmax(0, 1fr);
          }

          .profile-intro-chapter {
            width: 100%;
            padding: 14px 14px;
            border-radius: 22px;
          }

          .profile-intro-bio-strip,
          .floating-bio-strip {
            grid-column: 1 / -1;
            width: 100%;
            border-radius: 22px;
            padding: 12px 14px;
            text-align: left;
          }

          .profile-intro-module {
            grid-column: 1 / -1;
            padding: 12px;
            border-radius: 20px;
          }

          .profile-intro-module.detail-music {
            border-radius: 20px;
          }

          .profile-intro-scroll {
            min-height: 36px;
            padding-right: 7px;
            gap: 8px;
          }

          .profile-intro-scroll-copy {
            font-size: 9px;
            letter-spacing: 0.07em;
          }

          .profile-intro-scroll-orb {
            width: 24px;
            height: 24px;
          }

          .floating-modules-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .floating-module {
            grid-column: 1 / -1 !important;
            justify-self: stretch !important;
            width: 100% !important;
            max-width: none !important;
            transform: none !important;
          }

          .floating-module .links-list {
            grid-template-columns: minmax(0, 1fr);
          }

          .floating-module.links .profile-link-card:nth-child(odd),
          .floating-module.links .profile-link-card:nth-child(even) {
            justify-self: stretch;
            max-width: 100%;
            transform: translateY(0);
            margin-top: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-intro-details,
          .profile-intro-module,
          .profile-intro-bio-strip,
          .floating-bio-strip,
          .floating-module,
          .profile-intro-scroll,
          .profile-intro-scroll-arrow,
          .profile-intro-scroll-orb {
            transition: none !important;
            animation: none;
            transform: none !important;
          }
        }
      `}</style>

      <LivingProfileBackground
        mood={mood}
        aura={aura}
        themeColor={themeColor}
        scene={sceneAppearance.scene.value}
        previewMode={preview}
        intensity={backgroundIntensity}
        motionLevel={motionLevel}
      />

      <div className="profile-intro-stage" aria-hidden>
        <ProfileBannerMedia
          url={resolvedBannerUrl}
          kind={resolvedBannerUrl ? bannerKind : "unknown"}
          className="profile-intro-stage-media"
        />
        <div className="profile-intro-stage-glow" />
        <div className="profile-intro-stage-overlay" />
        <div className="profile-intro-stage-depth" />
        <div className="profile-intro-stage-vignette" />
      </div>

      <section className="profile-intro-hero">
        <div className="profile-intro-shell">
          <div className="profile-intro-chip-row">
            <div className="profile-intro-chip accent">
              <LuMoonStar size={12} />
              {presence.statusLabel}
            </div>
            <div className="profile-intro-chip">
              <LuSparkles size={12} />
              {sceneAppearance.scene.name}
            </div>
          </div>

          {preview ? (
            <div className="profile-intro-chip">
              <LuBadgeCheck size={12} />
              {previewMessage}
            </div>
          ) : null}

          <div className="profile-intro-avatar">
            <LivingAvatar
              avatarUrl={sanitizeRenderableUrl(user.avatarUrl)}
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
              size={introAvatarSize}
              frameInset={Math.max(6, Math.round(introAvatarSize * 0.05))}
              decorationScale={decorationScale}
              decorationOffsetX={decorationOffsetX}
              decorationOffsetY={decorationOffsetY}
            />
          </div>

          <ProfileNamePlate
            displayName={displayName}
            username={user.username}
            effects={nameEffects}
            motionLevel={motionLevel}
            nameClassName="profile-intro-name"
            usernameClassName="profile-intro-username"
          />

          {user.bio && mode === "cinematic" ? (
            <div className="profile-intro-bio-hint">{truncateProfileBio(user.bio, 120)}</div>
          ) : null}

          {introPills.length > 0 && mode === "cinematic" ? (
            <div className="profile-intro-pill-row">
              {introPills.map((pill) => (
                <div
                  key={pill.key}
                  className="profile-intro-pill"
                  style={{
                    color: pill.color,
                    background: withAlpha(pill.color, "16"),
                    borderColor: withAlpha(pill.color, "24"),
                  }}
                >
                  {pill.icon}
                  {pill.text}
                </div>
              ))}
            </div>
          ) : null}

          {introBadges.length > 0 ? (
            <div className="profile-intro-badge-row">
              {introBadges.map((item) => {
                const visual = getProfileBadgeVisual(item.badge, themeColor);

                return (
                  <div
                    key={item.id}
                    className="profile-intro-badge-pill"
                    style={{
                      background: visual.pillBackground,
                      borderColor: visual.pillBorder,
                      boxShadow: visual.pillShadow,
                    }}
                  >
                    <BadgeVisual
                      slug={item.badge.slug}
                      color={item.badge.color || visual.color}
                      rarity={item.badge.rarity}
                      category={item.badge.category}
                      size={24}
                      compact
                    />
                    <span className="profile-intro-badge-label">{item.badge.name}</span>
                  </div>
                );
              })}
              {extraBadgeCount > 0 ? (
                <div className="profile-intro-badge-pill">
                  <span className="profile-intro-badge-label">+{extraBadgeCount} more</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {hasDetails ? (
          <div
            className="profile-intro-scroll-wrap"
            style={{
              opacity: scrollHintOpacity,
              transform: `translateX(-50%) translateY(${((1 - scrollHintOpacity) * 8).toFixed(2)}px)`,
              pointerEvents: scrollHintOpacity < 0.08 ? "none" : "auto",
            }}
          >
            <button type="button" className="profile-intro-scroll" onClick={scrollToDetails}>
              <span className="profile-intro-scroll-orb" aria-hidden="true">
                <span className="profile-intro-scroll-arrow">
                  <LuChevronDown size={14} />
                </span>
              </span>
              <span className="profile-intro-scroll-copy">Scroll down for more</span>
            </button>
          </div>
        ) : null}
      </section>

      {hasDetails ? (
        <section
          id={detailsSectionId}
          ref={detailsRef}
          className="profile-intro-details is-contained"
          data-revealed={preview ? "true" : "false"}
        >
          {renderIntroChapterSequence({
            preview,
            user,
            orderedContentBlocks,
            customBlocks,
            music,
            motionLevel,
            username: user.username,
            themeColor: linkThemeColor,
            socialThemeColor,
            accentColor: presence.accent,
            contrastColor: presence.contrast,
            softColor: presence.soft,
            dnaTuning,
            featuredBadges,
            extraBadgeCount,
            likes,
            dislikes,
            views,
            initialMyReaction,
            regularSocialBlocks,
            liveSocialBlocks,
            linksStyle: composition.linksStyle,
            socialsStyle: composition.socialsStyle,
          })}
        </section>
      ) : null}
    </main>
  );
}

function FloatingModulesField(input: {
  orderedContentBlocks: ProfileCompositionBlock[];
  customBlocks: ProfileCustomBlock[];
  placements: Partial<Record<ProfileCompositionBlock, ProfileFloatingModulePlacement>>;
  personality: ProfileFloatingPersonality;
  widgetWidthScale: number;
  dnaTuning: ProfileDnaTuning;
  preview: boolean;
  music: ProfileMusicData;
  motionLevel: ProfileMotionLevel;
  username: string;
  themeColor: string;
  socialThemeColor: string;
  accentColor: string;
  contrastColor: string;
  softColor: string;
  featuredBadges: PublicProfileBadgeEntry[];
  extraBadgeCount: number;
  likes: number;
  dislikes: number;
  views: number;
  initialMyReaction: PublicProfileReaction;
  regularSocialBlocks: PublicSocialBlock[];
  liveSocialBlocks: PublicSocialBlock[];
  links: PublicProfileRenderUser["links"];
  linksStyle: ProfileCompositionLinksStyle;
  socialsStyle: ProfileComposition["socialsStyle"];
  revealOffset?: number;
}) {
  const revealOffset = input.revealOffset ?? 0;

  return (
    <div className="floating-modules-grid">
      {input.orderedContentBlocks.map((block, index) =>
        renderFloatingCompositionBlock(block, {
          placement:
            input.placements[block] ?? {
              columnStart: 1,
              span: 12,
              width: "wide",
              align: "center",
              xOffset: 0,
              yOffset: index * 4,
            },
          personality: input.personality,
          widgetWidthScale: input.widgetWidthScale,
          dnaTuning: input.dnaTuning,
          preview: input.preview,
          username: input.username,
          music: input.music,
          motionLevel: input.motionLevel,
          themeColor: input.themeColor,
          socialThemeColor: input.socialThemeColor,
          accentColor: input.accentColor,
          contrastColor: input.contrastColor,
          softColor: input.softColor,
          featuredBadges: input.featuredBadges,
          extraBadgeCount: input.extraBadgeCount,
          likes: input.likes,
          dislikes: input.dislikes,
          views: input.views,
          initialMyReaction: input.initialMyReaction,
          regularSocialBlocks: input.regularSocialBlocks,
          liveSocialBlocks: input.liveSocialBlocks,
          links: input.links,
          linksStyle: input.linksStyle,
          socialsStyle: input.socialsStyle,
          revealIndex: revealOffset + index,
        }),
      )}
      {input.customBlocks.map((block, index) =>
        renderFloatingCustomBlock(block, {
          key: `custom-${block.id}`,
          personality: input.personality,
          widgetWidthScale: input.widgetWidthScale,
          dnaTuning: input.dnaTuning,
          placement: getFloatingCustomBlockPlacement(
            block,
            index,
            input.personality,
          ),
          preview: input.preview,
          accentColor: input.accentColor,
          contrastColor: input.contrastColor,
          softColor: input.softColor,
          revealIndex: revealOffset + input.orderedContentBlocks.length + index,
        }),
      )}
    </div>
  );
}

function renderContainedCustomBlock(
  block: ProfileCustomBlock,
  input: {
    key: string;
    preview: boolean;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    dnaTuning: ProfileDnaTuning;
    style?: CSSProperties;
  },
) {
  return (
    <div key={input.key} className="widget-shell custom-block-shell" style={input.style}>
      <ProfileCustomBlockCard
        block={block}
        accentColor={input.accentColor}
        contrastColor={input.contrastColor}
        softColor={input.softColor}
        dnaTuning={input.dnaTuning}
        preview={input.preview}
        compact
      />
    </div>
  );
}

function renderIntroChapterSequence(input: {
  preview: boolean;
  user: PublicProfileRenderUser;
  orderedContentBlocks: ProfileCompositionBlock[];
  customBlocks: ProfileCustomBlock[];
  music: ProfileMusicData;
  motionLevel: ProfileMotionLevel;
  username: string;
  themeColor: string;
  socialThemeColor: string;
  accentColor: string;
  contrastColor: string;
  softColor: string;
  dnaTuning: ProfileDnaTuning;
  featuredBadges: PublicProfileBadgeEntry[];
  extraBadgeCount: number;
  likes: number;
  dislikes: number;
  views: number;
  initialMyReaction: PublicProfileReaction;
  regularSocialBlocks: PublicSocialBlock[];
  liveSocialBlocks: PublicSocialBlock[];
  linksStyle: ProfileCompositionLinksStyle;
  socialsStyle: ProfileComposition["socialsStyle"];
}) {
  const orderedBlockSet = new Set(input.orderedContentBlocks);
  const aboutBlocks = input.customBlocks.filter((block) => block.type === "quote");
  const interestBlocks = input.customBlocks.filter(
    (block) =>
      block.type === "text-strip" ||
      block.type === "mood" ||
      block.type === "status-banner",
  );
  const workBlocks = input.customBlocks.filter((block) => block.type === "image-card");
  const dividerBlocks = input.customBlocks.filter((block) => block.type === "divider");

  let revealIndex = 0;
  let dividerIndex = 0;
  const sections: ReactNode[] = [];

  const renderDivider = () => {
    const block = dividerBlocks[dividerIndex];

    if (!block) {
      return null;
    }

    dividerIndex += 1;

    return (
      <div
        key={`divider-${block.id}`}
        className="profile-intro-divider-row"
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={getIntroRevealStyle(revealIndex++)}
      >
        <ProfileCustomBlockCard
          block={block}
          accentColor={block.accentColor || input.themeColor}
          contrastColor={input.contrastColor}
          softColor={input.softColor}
          dnaTuning={input.dnaTuning}
          preview={input.preview}
          compact
        />
      </div>
    );
  };

  const pushChapter = (chapter: ReactNode | null) => {
    if (!chapter) {
      return;
    }

    if (sections.length > 0) {
      const divider = renderDivider();

      if (divider) {
        sections.push(divider);
      }
    }

    sections.push(chapter);
  };

  if (input.user.bio || aboutBlocks.length > 0) {
    pushChapter(
      renderIntroChapter({
        key: "about",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "About",
        icon: <LuMoonStar size={12} />,
        note:
          input.user.bio && aboutBlocks.length > 0
            ? `${aboutBlocks.length + 1} notes`
            : undefined,
        children: (
          <div className="profile-intro-chapter-stack">
            {input.user.bio ? (
              <div className="profile-intro-chapter-copy">{input.user.bio}</div>
            ) : null}
            {aboutBlocks.map((block) =>
              renderIntroInlineCustomBlock(block, {
                key: `about-${block.id}`,
                preview: input.preview,
                accentColor: input.themeColor,
                contrastColor: input.contrastColor,
                softColor: input.softColor,
                dnaTuning: input.dnaTuning,
              }),
            )}
          </div>
        ),
      }),
    );
  }

  if (orderedBlockSet.has("music")) {
    pushChapter(
      renderIntroChapter({
        key: "music",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "Music",
        icon: <LuMusic4 size={12} />,
        children: (
          <ProfileRenderBoundary
            label="Music card"
            compact
            resetKey={`${input.username}-intro-music`}
          >
            <ProfileMusicCard
              music={input.music}
              themeColor={input.themeColor}
              accentColor={input.accentColor}
              contrastColor={input.contrastColor}
              softColor={input.softColor}
              compact
              showPlaceholder={input.preview}
              motionLevel={input.motionLevel}
            />
          </ProfileRenderBoundary>
        ),
      }),
    );
  }

  if (orderedBlockSet.has("links") || interestBlocks.length > 0) {
    pushChapter(
      renderIntroChapter({
        key: "links-interests",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "Links / Interests",
        icon: <LuSparkles size={12} />,
        note:
          orderedBlockSet.has("links") && input.user.links.length > 0
            ? `${input.user.links.length} link${input.user.links.length === 1 ? "" : "s"}`
            : undefined,
        children: (
          <div className="profile-intro-chapter-stack">
            {interestBlocks.length > 0 ? (
              <div className="profile-intro-chapter-subsection">
                {interestBlocks.map((block) =>
                  renderIntroInlineCustomBlock(block, {
                    key: `interest-${block.id}`,
                    preview: input.preview,
                    accentColor: input.themeColor,
                    contrastColor: input.contrastColor,
                    softColor: input.softColor,
                    dnaTuning: input.dnaTuning,
                  }),
                )}
              </div>
            ) : null}
            {orderedBlockSet.has("links") ? (
              <div className="profile-intro-chapter-subsection">
                <div className="profile-intro-chapter-subtitle">
                  <LuArrowUpRight size={12} />
                  Link collection
                </div>
                <div className="links-list">
                  {renderModernLinks(
                    input.user.links,
                    input.themeColor,
                    input.linksStyle,
                    input.dnaTuning,
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ),
      }),
    );
  }

  if (orderedBlockSet.has("socials") || orderedBlockSet.has("live")) {
    pushChapter(
      renderIntroChapter({
        key: "socials",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "Socials",
        icon: <LuSparkles size={12} />,
        note:
          orderedBlockSet.has("socials") && orderedBlockSet.has("live")
            ? "Connected presence"
            : undefined,
        children: (
          <div className="profile-intro-chapter-stack">
            {orderedBlockSet.has("socials") ? (
              <div className="profile-intro-chapter-subsection">
                {orderedBlockSet.has("live") ? (
                  <div className="profile-intro-chapter-subtitle">
                    <LuSparkles size={12} />
                    Social channels
                  </div>
                ) : null}
                <ProfileRenderBoundary
                  label="Social presence"
                  compact
                  resetKey={`${input.username}-intro-socials`}
                >
                  <SocialPresenceSection
                    blocks={input.regularSocialBlocks}
                    themeColor={input.socialThemeColor}
                    compact
                    preview={input.preview}
                    mode="socials"
                    displayStyle={input.socialsStyle}
                  />
                </ProfileRenderBoundary>
              </div>
            ) : null}
            {orderedBlockSet.has("live") ? (
              <div className="profile-intro-chapter-subsection">
                <div className="profile-intro-chapter-subtitle">
                  <LuSparkles size={12} />
                  Live now
                </div>
                <ProfileRenderBoundary
                  label="Live presence"
                  compact
                  resetKey={`${input.username}-intro-live`}
                >
                  <SocialPresenceSection
                    blocks={input.liveSocialBlocks}
                    themeColor={input.socialThemeColor}
                    compact
                    preview={input.preview}
                    mode="live"
                    displayStyle={input.socialsStyle}
                  />
                </ProfileRenderBoundary>
              </div>
            ) : null}
          </div>
        ),
      }),
    );
  }

  if (workBlocks.length > 0) {
    pushChapter(
      renderIntroChapter({
        key: "work",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "Work / Projects",
        icon: <LuArrowUpRight size={12} />,
        note: `${workBlocks.length} visual${workBlocks.length === 1 ? "" : "s"}`,
        children: (
          <div className="profile-intro-chapter-stack">
            {workBlocks.map((block) =>
              renderIntroInlineCustomBlock(block, {
                key: `work-${block.id}`,
                preview: input.preview,
                accentColor: input.themeColor,
                contrastColor: input.contrastColor,
                softColor: input.softColor,
                dnaTuning: input.dnaTuning,
              }),
            )}
          </div>
        ),
      }),
    );
  }

  if (orderedBlockSet.has("badges") || orderedBlockSet.has("stats")) {
    pushChapter(
      renderIntroChapter({
        key: "extras",
        preview: input.preview,
        revealIndex: revealIndex++,
        label: "Extras",
        icon: <LuBadgeCheck size={12} />,
        children: (
          <div className="profile-intro-chapter-stack">
            {orderedBlockSet.has("badges") ? (
              <div className="profile-intro-chapter-subsection">
                {orderedBlockSet.has("stats") ? (
                  <div className="profile-intro-chapter-subtitle">
                    <LuBadgeCheck size={12} />
                    Badges
                  </div>
                ) : null}
                <div className="profile-badge-rail">
                  {input.featuredBadges.map((item) => {
                    const visual = getProfileBadgeVisual(item.badge, input.themeColor);

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
                            size={28}
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
                  {input.extraBadgeCount > 0 ? (
                    <div className="profile-badge-pill">
                      <div className="profile-badge-icon">+{input.extraBadgeCount}</div>
                      <span className="profile-badge-label">More</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {orderedBlockSet.has("stats") ? (
              <div className="profile-intro-chapter-subsection">
                {orderedBlockSet.has("badges") ? (
                  <div className="profile-intro-chapter-subtitle">
                    <LuBadgeCheck size={12} />
                    Activity
                  </div>
                ) : null}
                {input.preview ? (
                  <div className="empty-links">
                    <strong style={{ display: "block", color: "#ffffff", marginBottom: "8px" }}>
                      Stats preview
                    </strong>
                    <span>
                      {input.views} views, {input.likes} likes, {input.dislikes} dislikes
                    </span>
                  </div>
                ) : (
                  <ProfileRenderBoundary
                    label="Profile stats"
                    compact
                    resetKey={`${input.username}-intro-stats`}
                  >
                    <ProfileHeroClient
                      username={input.username}
                      initialViews={input.views}
                      initialLikes={input.likes}
                      initialDislikes={input.dislikes}
                      themeColor={input.themeColor}
                      initialMyReaction={input.initialMyReaction}
                      preview={input.preview}
                    />
                  </ProfileRenderBoundary>
                )}
              </div>
            ) : null}
          </div>
        ),
      }),
    );
  }

  return sections;
}

function renderIntroChapter(input: {
  key: string;
  preview: boolean;
  revealIndex: number;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  note?: string;
}) {
  return (
    <div
      key={input.key}
      className="profile-intro-chapter"
      data-intro-reveal="item"
      data-revealed={input.preview ? "true" : "false"}
      style={getIntroRevealStyle(input.revealIndex)}
    >
      <div className="profile-intro-chapter-head">
        <div className="profile-intro-chapter-label">
          {input.icon}
          {input.label}
        </div>
        {input.note ? <div className="profile-intro-chapter-note">{input.note}</div> : null}
      </div>
      <div className="profile-intro-chapter-body">{input.children}</div>
    </div>
  );
}

function renderIntroInlineCustomBlock(
  block: ProfileCustomBlock,
  input: {
    key: string;
    preview: boolean;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    dnaTuning: ProfileDnaTuning;
  },
) {
  return (
    <div key={input.key} className={`profile-intro-inline-block custom-${block.type}`}>
      <ProfileCustomBlockCard
        block={block}
        accentColor={block.accentColor || input.accentColor}
        contrastColor={input.contrastColor}
        softColor={input.softColor}
        dnaTuning={input.dnaTuning}
        preview={input.preview}
        compact
      />
    </div>
  );
}

function renderFloatingCustomBlock(
  block: ProfileCustomBlock,
  input: {
    key: string;
    placement: ProfileFloatingModulePlacement;
    personality: ProfileFloatingPersonality;
    widgetWidthScale: number;
    dnaTuning: ProfileDnaTuning;
    preview: boolean;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    revealIndex: number;
  },
) {
  const floatingStyle = {
    ...getIntroRevealStyle(
      input.revealIndex,
      getFloatingModuleStyle(
        input.placement,
        input.widgetWidthScale,
        input.dnaTuning,
      ),
    ),
    padding: block.type === "divider" ? "8px" : "10px",
    background:
      block.transparency && block.type !== "divider"
        ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(8,10,16,0.5))"
        : undefined,
    border:
      block.type === "divider"
        ? "1px solid rgba(255,255,255,0.03)"
        : undefined,
  } as CSSProperties;

  return (
    <div
      key={input.key}
      className={`floating-module custom-block-shell custom-${block.type} personality-${input.personality}`}
      data-intro-reveal="item"
      data-revealed={input.preview ? "true" : "false"}
      style={floatingStyle}
    >
      <ProfileCustomBlockCard
        block={block}
        accentColor={input.accentColor}
        contrastColor={input.contrastColor}
        softColor={input.softColor}
        dnaTuning={input.dnaTuning}
        preview={input.preview}
        compact
      />
    </div>
  );
}

function renderModernCompositionBlock(
  block: ProfileCompositionBlock,
  input: {
    preview: boolean;
    music: ProfileMusicData;
    motionLevel: ProfileMotionLevel;
    username: string;
    themeColor: string;
    socialThemeColor: string;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    dnaTuning: ProfileDnaTuning;
    featuredBadges: PublicProfileBadgeEntry[];
    extraBadgeCount: number;
    likes: number;
    dislikes: number;
    views: number;
    initialMyReaction: PublicProfileReaction;
    regularSocialBlocks: PublicSocialBlock[];
    liveSocialBlocks: PublicSocialBlock[];
    links: PublicProfileRenderUser["links"];
    linksStyle: ProfileCompositionLinksStyle;
    socialsStyle: ProfileComposition["socialsStyle"];
    previewMessage: string;
  },
) {
  if (block === "music") {
    return (
      <div key={block} className="widget-shell music">
        <ProfileRenderBoundary label="Music card" compact resetKey={`${input.username}-${block}`}>
          <ProfileMusicCard
            music={input.music}
            themeColor={input.themeColor}
            accentColor={input.accentColor}
            contrastColor={input.contrastColor}
            softColor={input.softColor}
            compact
            showPlaceholder={input.preview}
            motionLevel={input.motionLevel}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "socials") {
    return (
      <div key={block} className="widget-shell social">
        <ProfileRenderBoundary label="Social presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.regularSocialBlocks}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="socials"
            displayStyle={input.socialsStyle}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "live") {
    return (
      <div key={block} className="widget-shell social live">
        <ProfileRenderBoundary label="Live presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.liveSocialBlocks}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="live"
            displayStyle={input.socialsStyle}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "links") {
    return (
      <div key={block} className="widget-shell links">
        <div className="links-header">
          <div className="profile-kicker">
            <LuSparkles size={13} />
            Links
          </div>

          <div className="links-count">
            <LuBadgeCheck size={13} />
            {input.links.length} link{input.links.length === 1 ? "" : "s"}
          </div>
        </div>

        {renderModernLinks(
          input.links,
          input.themeColor,
          input.linksStyle,
          input.dnaTuning,
        )}
      </div>
    );
  }

  if (block === "badges") {
    return (
      <div key={block} className="widget-shell badges">
        <div className="profile-kicker" style={{ marginBottom: "14px", width: "fit-content" }}>
          <LuBadgeCheck size={13} />
          Badges
        </div>
        <div className="profile-badge-rail">
          {input.featuredBadges.map((item) => {
            const visual = getProfileBadgeVisual(item.badge, input.themeColor);

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
                <span className="profile-badge-label" style={{ color: visual.labelColor }}>
                  {item.badge.name}
                </span>
              </div>
            );
          })}

          {input.extraBadgeCount > 0 ? (
            <div
              className="profile-badge-pill"
              title={`${input.extraBadgeCount} more badge${input.extraBadgeCount === 1 ? "" : "s"}`}
            >
              <div className="profile-badge-icon">+{input.extraBadgeCount}</div>
              <span className="profile-badge-label">More</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div key={block} className="widget-shell stats">
      {input.preview ? (
        <div className="empty-links">
          <strong style={{ display: "block", color: "#ffffff", marginBottom: "8px" }}>
            Stats preview
          </strong>
          <span>
            {input.views} views, {input.likes} likes, {input.dislikes} dislikes
          </span>
        </div>
      ) : (
        <ProfileRenderBoundary label="Profile stats" compact resetKey={`${input.username}-${block}`}>
          <ProfileHeroClient
            username={input.username}
            initialViews={input.views}
            initialLikes={input.likes}
            initialDislikes={input.dislikes}
            themeColor={input.themeColor}
            initialMyReaction={input.initialMyReaction}
            preview={input.preview}
          />
        </ProfileRenderBoundary>
      )}
    </div>
  );
}

function renderFloatingCompositionBlock(
  block: ProfileCompositionBlock,
  input: {
    placement: ProfileFloatingModulePlacement;
    personality: ProfileFloatingPersonality;
    widgetWidthScale: number;
    dnaTuning: ProfileDnaTuning;
    preview: boolean;
    music: ProfileMusicData;
    motionLevel: ProfileMotionLevel;
    username: string;
    themeColor: string;
    socialThemeColor: string;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    featuredBadges: PublicProfileBadgeEntry[];
    extraBadgeCount: number;
    likes: number;
    dislikes: number;
    views: number;
    initialMyReaction: PublicProfileReaction;
    regularSocialBlocks: PublicSocialBlock[];
    liveSocialBlocks: PublicSocialBlock[];
    links: PublicProfileRenderUser["links"];
    linksStyle: ProfileCompositionLinksStyle;
    socialsStyle: ProfileComposition["socialsStyle"];
    revealIndex: number;
  },
) {
  const floatingStyle = getIntroRevealStyle(
    input.revealIndex,
    getFloatingModuleStyle(
      input.placement,
      input.widgetWidthScale,
      input.dnaTuning,
    ),
  );
  const floatingClassName = `floating-module ${block} personality-${input.personality}`;

  if (block === "music") {
    return (
      <div
        key={block}
        className={floatingClassName}
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={floatingStyle}
      >
        <div className="floating-module-head">
          <div className="floating-module-label">
            <LuMusic4 size={12} />
            Music
          </div>
        </div>
        <ProfileRenderBoundary label="Music card" compact resetKey={`${input.username}-${block}`}>
          <ProfileMusicCard
            music={input.music}
            themeColor={input.themeColor}
            accentColor={input.accentColor}
            contrastColor={input.contrastColor}
            softColor={input.softColor}
            compact
            showPlaceholder={input.preview}
            motionLevel={input.motionLevel}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "socials") {
    return (
      <div
        key={block}
        className={floatingClassName}
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={floatingStyle}
      >
        <div className="floating-module-head">
          <div className="floating-module-label">
            <LuSparkles size={12} />
            Socials
          </div>
        </div>
        <ProfileRenderBoundary label="Social presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.regularSocialBlocks}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="socials"
            displayStyle={input.socialsStyle}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "live") {
    return (
      <div
        key={block}
        className={floatingClassName}
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={floatingStyle}
      >
        <div className="floating-module-head">
          <div className="floating-module-label">
            <LuSparkles size={12} />
            Live
          </div>
        </div>
        <ProfileRenderBoundary label="Live presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.liveSocialBlocks}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="live"
            displayStyle={input.socialsStyle}
          />
        </ProfileRenderBoundary>
      </div>
    );
  }

  if (block === "links") {
    return (
      <div
        key={block}
        className={floatingClassName}
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={floatingStyle}
      >
        <div className="floating-module-head">
          <div className="floating-module-label">
            <LuSparkles size={12} />
            Links
          </div>
          <div className="floating-module-meta">
            {input.links.length} link{input.links.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="links-list">
          {renderModernLinks(
            input.links,
            input.themeColor,
            input.linksStyle,
            input.dnaTuning,
          )}
        </div>
      </div>
    );
  }

  if (block === "badges") {
    return (
      <div
        key={block}
        className={floatingClassName}
        data-intro-reveal="item"
        data-revealed={input.preview ? "true" : "false"}
        style={floatingStyle}
      >
        <div className="floating-module-head">
          <div className="floating-module-label">
            <LuBadgeCheck size={12} />
            Badges
          </div>
        </div>
        <div className="profile-badge-rail">
          {input.featuredBadges.map((item) => {
            const visual = getProfileBadgeVisual(item.badge, input.themeColor);

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
                    size={28}
                    compact
                  />
                </div>
                <span className="profile-badge-label" style={{ color: visual.labelColor }}>
                  {item.badge.name}
                </span>
              </div>
            );
          })}
          {input.extraBadgeCount > 0 ? (
            <div className="profile-badge-pill">
              <div className="profile-badge-icon">+{input.extraBadgeCount}</div>
              <span className="profile-badge-label">More</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      key={block}
      className={floatingClassName}
      data-intro-reveal="item"
      data-revealed={input.preview ? "true" : "false"}
      style={floatingStyle}
    >
      <div className="floating-module-head">
        <div className="floating-module-label">
          <LuBadgeCheck size={12} />
          Stats
        </div>
      </div>
      {input.preview ? (
        <div className="empty-links">
          <strong style={{ display: "block", color: "#ffffff", marginBottom: "8px" }}>
            Stats preview
          </strong>
          <span>
            {input.views} views, {input.likes} likes, {input.dislikes} dislikes
          </span>
        </div>
      ) : (
        <ProfileRenderBoundary label="Profile stats" compact resetKey={`${input.username}-${block}`}>
          <ProfileHeroClient
            username={input.username}
            initialViews={input.views}
            initialLikes={input.likes}
            initialDislikes={input.dislikes}
            themeColor={input.themeColor}
            initialMyReaction={input.initialMyReaction}
            preview={input.preview}
          />
        </ProfileRenderBoundary>
      )}
    </div>
  );
}

function renderModernLinks(
  links: PublicProfileRenderUser["links"],
  themeColor: string,
  linksStyle: ProfileCompositionLinksStyle,
  dnaTuning: ProfileDnaTuning,
) {
  if (links.length === 0) {
    return <div className="empty-links">No links added yet.</div>;
  }

  return links.map((link, index) => {
    const platform = getLinkPlatform(link.url, link.title);
    const color = platform.color || themeColor;
    const PlatformIcon = platform.icon;
    const isPill = linksStyle === "pills";
    const isMinimal = linksStyle === "minimal";
    const isStacked = linksStyle === "stacked";

    return (
      <a
        key={link.id}
        href={`/go/${link.id}`}
        target="_blank"
        rel="noreferrer"
        className={`profile-link-card ${isStacked ? "" : index % 2 === 0 ? "float-a" : "float-b"}`}
        style={{
          borderColor: withAlpha(color, isMinimal ? "18" : "24"),
          boxShadow: `0 ${Math.round(18 * dnaTuning.shadowScale)}px ${Math.round(34 * dnaTuning.shadowScale)}px ${withAlpha(color, isMinimal ? "08" : dnaTuning.glowScale >= 1.08 ? "12" : "0f")}`,
          padding: isPill
            ? `${Math.max(9, Math.round(10 * dnaTuning.compactnessScale))}px ${Math.max(11, Math.round(12 * dnaTuning.compactnessScale))}px`
            : isMinimal
              ? `${Math.max(11, Math.round(12 * dnaTuning.compactnessScale))}px`
              : isStacked
                ? `${Math.max(12, Math.round(14 * dnaTuning.compactnessScale))}px ${Math.max(12, Math.round(14 * dnaTuning.compactnessScale))}px ${Math.max(12, Math.round(14 * dnaTuning.compactnessScale))}px ${Math.max(12, Math.round(13 * dnaTuning.compactnessScale))}px`
                : undefined,
          background: isMinimal
            ? "rgba(255,255,255,0.02)"
            : isPill
              ? "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(8,10,16,0.76))"
              : undefined,
        }}
      >
        <div
          className="profile-link-glow"
          style={{
            background: `linear-gradient(90deg, ${withAlpha(color, isMinimal ? "14" : "20")}, transparent)`,
            width: isPill ? "18%" : "26%",
          }}
        />

        <div
          className="profile-link-icon"
          style={{
            width: isPill ? "38px" : "42px",
            height: isPill ? "38px" : "42px",
            background: `linear-gradient(180deg, ${withAlpha(color, "20")}, ${withAlpha(color, "0c")})`,
            borderColor: withAlpha(color, "30"),
            boxShadow: `0 ${Math.round(12 * dnaTuning.shadowScale)}px ${Math.round(24 * dnaTuning.shadowScale)}px ${withAlpha(color, dnaTuning.glowScale >= 1.08 ? "18" : "14")}`,
          }}
        >
          <PlatformIcon size={isPill ? 16 : 18} color={color} aria-hidden="true" />
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

          {isPill ? (
            <div className="profile-link-host">{getLinkHostname(link.url)}</div>
          ) : (
            <>
              <div className="profile-link-host">{getLinkHostname(link.url)}</div>
              {isMinimal ? null : <div className="profile-link-url">{link.url}</div>}
            </>
          )}
        </div>

        <div className="profile-link-arrow">
          <LuArrowUpRight size={14} />
        </div>
      </a>
    );
  });
}

function getContainedCustomBlockStyle(
  block: ProfileCustomBlock,
  index: number,
): CSSProperties {
  return {
    justifySelf:
      block.alignment === "start"
        ? "start"
        : block.alignment === "end"
          ? "end"
          : "center",
    width: "100%",
    maxWidth:
      block.width === "compact"
        ? block.type === "divider"
          ? "360px"
          : "340px"
        : block.type === "image-card"
          ? "520px"
          : block.type === "status-banner" || block.type === "text-strip"
            ? "560px"
            : "480px",
    marginTop: index === 0 ? "0" : `${Math.max(0, (index % 2) * 4)}px`,
  };
}

function getFloatingCustomBlockPlacement(
  block: ProfileCustomBlock,
  index: number,
  personality: ProfileFloatingPersonality,
): ProfileFloatingModulePlacement {
  const compact = block.width === "compact";
  const isWideStrip =
    block.type === "divider" ||
    block.type === "status-banner" ||
    block.type === "text-strip";

  return {
    columnStart:
      block.alignment === "start"
        ? personality === "scattered"
          ? 1
          : 2
        : block.alignment === "end"
          ? personality === "cinematic"
            ? 7
            : 8
          : compact
            ? 4
            : 3,
    span: isWideStrip ? 8 : compact ? 4 : 6,
    width: isWideStrip ? "bar" : compact ? "compact" : "medium",
    align: block.alignment,
    xOffset:
      block.alignment === "start"
        ? personality === "scattered"
          ? -10
          : -4
        : block.alignment === "end"
          ? personality === "cinematic"
            ? 12
            : 6
          : 0,
    yOffset:
      block.type === "divider"
        ? index * 2
        : block.type === "image-card"
          ? 8 + index * 4
          : 4 + index * 6,
  };
}

function getFloatingModuleStyle(
  placement: ProfileFloatingModulePlacement,
  widthScale = 1,
  dnaTuning: ProfileDnaTuning = getProfileDnaTuning(null),
): CSSProperties {
  const floatingOffsetScale = resolveFloatingIntensity(dnaTuning);
  const maxWidth =
    placement.width === "compact"
      ? `${Math.round(320 * widthScale)}px`
      : placement.width === "medium"
        ? `${Math.round(440 * widthScale)}px`
        : placement.width === "bar"
          ? `${Math.round(560 * widthScale)}px`
          : placement.width === "footer"
            ? `${Math.round(300 * widthScale)}px`
            : "100%";

  return {
    "--floating-col-start": `${placement.columnStart}`,
    "--floating-col-span": `${placement.span}`,
    "--floating-justify":
      placement.align === "center"
        ? "center"
        : placement.align === "end"
          ? "end"
          : "start",
    "--floating-width": placement.width === "wide" ? "100%" : `min(100%, ${maxWidth})`,
    "--floating-max-width": maxWidth,
    "--floating-x": `${Math.round(placement.xOffset * floatingOffsetScale)}px`,
    "--floating-y": `${Math.round(placement.yOffset * floatingOffsetScale)}px`,
  } as CSSProperties;
}

function resolveFloatingIntensity(
  dnaTuning: ProfileDnaTuning,
  personality?: ProfileFloatingPersonality,
) {
  const personalityBoost =
    personality === "cinematic"
      ? 1.06
      : personality === "scattered"
        ? 1.1
        : personality === "minimal"
          ? 0.92
          : 1;

  return clampNumber(dnaTuning.floatingIntensity * personalityBoost, 0.8, 1.28);
}

function scaleBlurInFilter(filter: string, scale: number) {
  if (filter === "none" || !filter) {
    return filter;
  }

  return filter.replace(/blur\(([\d.]+)px\)/g, (_, value: string) => {
    const nextBlur = Math.max(0, Math.round(Number(value) * scale));
    return `blur(${nextBlur}px)`;
  });
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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

function truncateProfileBio(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
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
