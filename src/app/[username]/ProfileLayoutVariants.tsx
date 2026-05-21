import type { CSSProperties, ReactNode } from "react";
import { LuArrowUpRight, LuSparkles } from "react-icons/lu";
import LivingAvatar from "@/app/components/LivingAvatar";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import { getLinkPlatform } from "@/app/lib/link-icons";
import {
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import type { ProfileMusicData } from "@/app/lib/profile-music";
import {
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
  type ProfileSceneDepth,
  type ProfileScene,
} from "@/app/lib/profile-scenes";
import LivingProfileBackground from "./LivingProfileBackground";
import ProfileBannerMedia from "./ProfileBannerMedia";
import ProfileNamePlate from "./ProfileNamePlate";
import ProfileHeroClient from "./ProfileHeroClient";
import ProfileMusicCard from "./ProfileMusicCard";
import ProfileRenderBoundary from "./ProfileRenderBoundary";
import SocialPresenceSection, {
  type PublicSocialBlock,
} from "./SocialPresenceSection";

export type PublicProfileLayout = "default" | "modern" | "simplistic" | "portfolio";

type BadgeEntry = {
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

type LinkEntry = {
  id: string;
  title: string | null;
  url: string;
};

type DecorationEntry = {
  name: string;
  slug: string;
  imageUrl: string;
  previewUrl: string | null;
  posterUrl: string | null;
  mediaType: string;
  overlayScale: number | null;
  overlayOffsetY: number | null;
};

type LayoutUser = {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  selectedDecoration: DecorationEntry | null;
  links: LinkEntry[];
};

type HeroPill = {
  key: string;
  text: string;
  icon: ReactNode;
  color: string;
};

type Props = {
  layout: Exclude<PublicProfileLayout, "modern">;
  user: LayoutUser;
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
  featuredBadges: BadgeEntry[];
  extraBadgeCount: number;
  heroPills: HeroPill[];
  likes: number;
  dislikes: number;
  views: number;
  socialBlocks: PublicSocialBlock[];
  initialMyReaction: "like" | "dislike" | null;
  preview?: boolean;
};

export default function ProfileLayoutVariants(props: Props) {
  const resolvedProps = {
    ...props,
    scene: props.scene || "default",
  };

  if (resolvedProps.layout === "default") {
    return <DefaultLayout {...resolvedProps} />;
  }

  if (resolvedProps.layout === "simplistic") {
    return <SimplisticLayout {...resolvedProps} />;
  }

  return <PortfolioLayout {...resolvedProps} />;
}

function DefaultLayout(props: Props) {
  const sceneAppearance = getProfileSceneAppearance({
    scene: props.scene,
    mood: props.mood,
    aura: props.aura,
    themeColor: props.themeColor,
  });
  const { presence, depth } = sceneAppearance;
  const glassTokens = getProfileGlassTokens(props.glassIntensity);
  const densityTokens = getProfileDensityTokens(props.density);
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const motionTokens = getProfileMotionTokens(props.motionLevel);
  const resolvedBackdrop =
    props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter;
  const resolvedSurfaceBackground = getLayeredSurfaceBackground(
    sceneAppearance.surfaceBackground,
    glassTokens.backgroundLayer,
    cardStyleTokens.shellOverlay,
    props.cardStyle === "glass",
  );

  return (
    <main
      style={defaultPageStyle(
        sceneAppearance.linkThemeColor,
        props.preview,
        presence.stageGlow,
        densityTokens,
        depth,
      )}
    >
      <LivingProfileBackground
        mood={props.mood}
        aura={props.aura}
        themeColor={props.themeColor}
        scene={props.scene}
        previewMode={props.preview}
        intensity={props.backgroundIntensity}
        motionLevel={props.motionLevel}
      />
      <section
        style={defaultShellStyle(
          props.preview,
          presence.panelGlow,
          sceneAppearance.surfaceBorder,
          resolvedSurfaceBackground,
          resolvedBackdrop,
          glassTokens.shadowBoost,
          cornerTokens,
          depth,
        )}
      >
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={Math.round((props.preview ? 220 : 260) * densityTokens.bannerScale)}
          roundedTop
          preview={props.preview}
          presenceOverlay={presence.auraOverlay}
          accentColor={presence.accent}
          bannerStyle={props.bannerStyle}
          cornerRadius={cornerTokens.shellRadius}
        />

        <div style={defaultContentStyle(props.preview, densityTokens, depth)}>
          <div style={defaultIdentityStyle(depth)}>
            <AvatarVisual
              avatarUrl={props.user.avatarUrl}
              avatarInitials={props.avatarInitials}
              themeColor={props.themeColor}
              selectedDecoration={props.user.selectedDecoration}
              decorationScale={props.decorationScale}
              decorationOffsetX={props.decorationOffsetX}
              decorationOffsetY={props.decorationOffsetY}
              size={126}
              frameInset={8}
              presenceAccent={presence.accent}
              presenceContrast={presence.contrast}
              presenceSoft={presence.soft}
              presencePulse={presence.pulse}
              presenceAura={presence.avatarAuraBackground}
              presenceRing={presence.avatarRing}
              presenceGlow={presence.avatarGlow}
            />

            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <div style={eyebrowStyle(sceneAppearance.linkThemeColor)}>
                {sceneAppearance.scene.name}
              </div>
              <ProfileNamePlate
                displayName={props.displayName}
                username={props.user.username}
                effects={props.nameEffects}
                motionLevel={props.motionLevel}
                nameStyle={defaultNameStyle(densityTokens)}
                usernameStyle={usernameStyle}
              />
              <div
                style={presenceChipStyle(
                  presence.presenceBackground,
                  presence.presenceBorder,
                  cornerTokens,
                )}
              >
                {presence.statusLabel}
              </div>
              <PillRow pills={props.heroPills} compact />
              {props.user.bio ? <p style={defaultBioStyle(densityTokens)}>{props.user.bio}</p> : null}
            </div>
          </div>

          {props.preview ? null : (
            <ProfileHeroClient
              username={props.user.username}
              initialViews={props.views}
              initialLikes={props.likes}
              initialDislikes={props.dislikes}
              themeColor={sceneAppearance.linkThemeColor}
              initialMyReaction={props.initialMyReaction}
              preview={props.preview}
            />
          )}

          <BadgeRail
            badges={props.featuredBadges}
            extraBadgeCount={props.extraBadgeCount}
            themeColor={sceneAppearance.linkThemeColor}
          />
          <DetachedWidget depth={depth}>
            <ProfileRenderBoundary label="Music card" compact resetKey={props.user.username}>
              <ProfileMusicCard
                music={props.music}
                themeColor={sceneAppearance.linkThemeColor}
                accentColor={presence.accent}
                contrastColor={presence.contrast}
                softColor={presence.soft}
                compact
                motionLevel={props.motionLevel}
              />
            </ProfileRenderBoundary>
          </DetachedWidget>
          <DetachedWidget depth={depth} accent={presence.soft}>
            <ProfileRenderBoundary label="Social presence" compact resetKey={props.user.username}>
              <SocialPresenceSection
                blocks={props.socialBlocks}
                themeColor={sceneAppearance.socialThemeColor}
                compact
                preview={props.preview}
              />
            </ProfileRenderBoundary>
          </DetachedWidget>
          <LinksSection
            layout="default"
            links={props.user.links}
            themeColor={sceneAppearance.linkThemeColor}
            surfaceBackground={sceneAppearance.surfaceBackground}
            surfaceBorder={sceneAppearance.surfaceBorder}
            density={densityTokens}
            cardStyle={props.cardStyle}
            cornerTokens={cornerTokens}
            motionTokens={motionTokens}
            depth={depth}
          />
        </div>
      </section>
    </main>
  );
}

function SimplisticLayout(props: Props) {
  const sceneAppearance = getProfileSceneAppearance({
    scene: props.scene,
    mood: props.mood,
    aura: props.aura,
    themeColor: props.themeColor,
  });
  const { presence, depth } = sceneAppearance;
  const glassTokens = getProfileGlassTokens(props.glassIntensity);
  const densityTokens = getProfileDensityTokens(props.density);
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const resolvedBackdrop =
    props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter;

  return (
    <main
      style={simplisticPageStyle(
        props.preview,
        presence.stageGlow,
        sceneAppearance.surfaceBackground,
        densityTokens,
        depth,
      )}
    >
      <LivingProfileBackground
        mood={props.mood}
        aura={props.aura}
        themeColor={props.themeColor}
        scene={props.scene}
        previewMode={props.preview}
        intensity={props.backgroundIntensity}
        motionLevel={props.motionLevel}
      />
      <div style={simplisticShellStyle(props.preview, resolvedBackdrop, densityTokens, depth)}>
        <div style={simplisticHeaderStyle(densityTokens, depth)}>
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={92}
            frameInset={6}
            minimal
            presenceAccent={presence.accent}
            presenceContrast={presence.contrast}
            presenceSoft={presence.soft}
            presencePulse={presence.pulse}
            presenceAura={presence.avatarAuraBackground}
            presenceRing={presence.avatarRing}
            presenceGlow={presence.avatarGlow}
          />

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={simpleKickerStyle(sceneAppearance.linkThemeColor)}>
              {sceneAppearance.scene.name}
            </div>
            <ProfileNamePlate
              displayName={props.displayName}
              username={props.user.username}
              effects={props.nameEffects}
              motionLevel={props.motionLevel}
              nameStyle={simplisticNameStyle(densityTokens)}
              usernameStyle={usernameStyle}
            />
            <div
              style={presenceChipStyle(
                presence.presenceBackground,
                presence.presenceBorder,
                cornerTokens,
              )}
            >
              {presence.statusLabel}
            </div>
            {props.user.bio ? <p style={simplisticBioStyle(densityTokens)}>{props.user.bio}</p> : null}
          </div>
        </div>

        <PillRow pills={props.heroPills} subtle />

        <div style={simplisticBannerWrapStyle(depth)}>
          <BannerSurface
            bannerUrl={props.user.bannerUrl}
            bannerKind={props.bannerKind}
            themeColor={props.themeColor}
            height={Math.round((props.preview ? 136 : 160) * densityTokens.bannerScale)}
            preview={props.preview}
            presenceOverlay={presence.auraOverlay}
            accentColor={presence.accent}
            bannerStyle={props.bannerStyle}
            cornerRadius={cornerTokens.panelRadius}
          />
        </div>

        {props.preview ? null : (
          <ProfileHeroClient
            username={props.user.username}
            initialViews={props.views}
            initialLikes={props.likes}
            initialDislikes={props.dislikes}
            themeColor={sceneAppearance.linkThemeColor}
            initialMyReaction={props.initialMyReaction}
            preview={props.preview}
          />
        )}

        <BadgeRail
          badges={props.featuredBadges}
          extraBadgeCount={props.extraBadgeCount}
          themeColor={sceneAppearance.linkThemeColor}
          minimal
        />
        <DetachedWidget depth={depth}>
          <ProfileRenderBoundary label="Music card" compact resetKey={props.user.username}>
            <ProfileMusicCard
              music={props.music}
              themeColor={sceneAppearance.linkThemeColor}
              accentColor={presence.accent}
              contrastColor={presence.contrast}
              softColor={presence.soft}
              compact
              motionLevel={props.motionLevel}
            />
          </ProfileRenderBoundary>
        </DetachedWidget>
        <DetachedWidget depth={depth} accent={presence.soft}>
          <ProfileRenderBoundary label="Social presence" compact resetKey={props.user.username}>
            <SocialPresenceSection
              blocks={props.socialBlocks}
              themeColor={sceneAppearance.socialThemeColor}
              compact
              preview={props.preview}
            />
          </ProfileRenderBoundary>
        </DetachedWidget>
        <LinksSection
          layout="simplistic"
          links={props.user.links}
          themeColor={sceneAppearance.linkThemeColor}
          surfaceBackground={sceneAppearance.surfaceBackground}
          surfaceBorder={sceneAppearance.surfaceBorder}
          density={densityTokens}
          cardStyle={props.cardStyle}
          cornerTokens={cornerTokens}
          motionTokens={getProfileMotionTokens(props.motionLevel)}
          depth={depth}
        />
      </div>
    </main>
  );
}

function PortfolioLayout(props: Props) {
  const sceneAppearance = getProfileSceneAppearance({
    scene: props.scene,
    mood: props.mood,
    aura: props.aura,
    themeColor: props.themeColor,
  });
  const { presence, depth } = sceneAppearance;
  const glassTokens = getProfileGlassTokens(props.glassIntensity);
  const densityTokens = getProfileDensityTokens(props.density);
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const motionTokens = getProfileMotionTokens(props.motionLevel);
  const resolvedBackdrop =
    props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter;
  const resolvedSurfaceBackground = getLayeredSurfaceBackground(
    sceneAppearance.surfaceBackground,
    glassTokens.backgroundLayer,
    cardStyleTokens.shellOverlay,
    props.cardStyle === "glass",
  );

  return (
    <main
      style={portfolioPageStyle(
        props.preview,
        presence.stageGlow,
        sceneAppearance.surfaceBackground,
        densityTokens,
        depth,
      )}
    >
      <LivingProfileBackground
        mood={props.mood}
        aura={props.aura}
        themeColor={props.themeColor}
        scene={props.scene}
        previewMode={props.preview}
        intensity={props.backgroundIntensity}
        motionLevel={props.motionLevel}
      />
      <div style={portfolioBannerWrapStyle(props.preview, densityTokens, depth)}>
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={Math.round((props.preview ? 188 : 220) * densityTokens.bannerScale)}
          preview={props.preview}
          presenceOverlay={presence.auraOverlay}
          accentColor={presence.accent}
          bannerStyle={props.bannerStyle}
          cornerRadius={cornerTokens.panelRadius}
        />
      </div>

      <div style={portfolioShellStyle(props.preview, densityTokens, depth)}>
        <aside
          style={portfolioSidebarStyle(
            props.preview,
            presence.panelGlow,
            sceneAppearance.surfaceBorder,
            resolvedSurfaceBackground,
            resolvedBackdrop,
            glassTokens.shadowBoost,
            cornerTokens,
            depth,
          )}
        >
          <div style={eyebrowStyle(sceneAppearance.linkThemeColor)}>
            {sceneAppearance.scene.name}
          </div>
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={108}
            frameInset={7}
            presenceAccent={presence.accent}
            presenceContrast={presence.contrast}
            presenceSoft={presence.soft}
            presencePulse={presence.pulse}
            presenceAura={presence.avatarAuraBackground}
            presenceRing={presence.avatarRing}
            presenceGlow={presence.avatarGlow}
          />

          <div style={{ display: "grid", gap: "8px" }}>
            <ProfileNamePlate
              displayName={props.displayName}
              username={props.user.username}
              effects={props.nameEffects}
              motionLevel={props.motionLevel}
              nameStyle={portfolioNameStyle(densityTokens)}
              usernameStyle={usernameStyle}
            />
            <div
              style={presenceChipStyle(
                presence.presenceBackground,
                presence.presenceBorder,
                cornerTokens,
              )}
            >
              {presence.statusLabel}
            </div>
            {props.user.bio ? <p style={portfolioBioStyle(densityTokens)}>{props.user.bio}</p> : null}
          </div>

          <PillRow pills={props.heroPills} subtle />

          {props.preview ? null : (
            <ProfileHeroClient
              username={props.user.username}
              initialViews={props.views}
              initialLikes={props.likes}
              initialDislikes={props.dislikes}
              themeColor={sceneAppearance.linkThemeColor}
              initialMyReaction={props.initialMyReaction}
              preview={props.preview}
            />
          )}

          <BadgeRail
            badges={props.featuredBadges}
            extraBadgeCount={props.extraBadgeCount}
            themeColor={sceneAppearance.linkThemeColor}
          />

          <DetachedWidget depth={depth}>
            <ProfileRenderBoundary label="Music card" compact resetKey={props.user.username}>
              <ProfileMusicCard
                music={props.music}
                themeColor={sceneAppearance.linkThemeColor}
                accentColor={presence.accent}
                contrastColor={presence.contrast}
                softColor={presence.soft}
                compact
                motionLevel={props.motionLevel}
              />
            </ProfileRenderBoundary>
          </DetachedWidget>
        </aside>

        <section
          style={portfolioMainStyle(
            props.preview,
            presence.panelGlow,
            sceneAppearance.surfaceBorder,
            resolvedSurfaceBackground,
            resolvedBackdrop,
            glassTokens.shadowBoost,
            cornerTokens,
            depth,
          )}
        >
          <DetachedWidget depth={depth} accent={presence.soft}>
            <ProfileRenderBoundary label="Social presence" compact resetKey={props.user.username}>
              <SocialPresenceSection
                blocks={props.socialBlocks}
                themeColor={sceneAppearance.socialThemeColor}
                preview={props.preview}
              />
            </ProfileRenderBoundary>
          </DetachedWidget>
          <LinksSection
            layout="portfolio"
            links={props.user.links}
            themeColor={sceneAppearance.linkThemeColor}
            surfaceBackground={sceneAppearance.surfaceBackground}
            surfaceBorder={sceneAppearance.surfaceBorder}
            density={densityTokens}
            cardStyle={props.cardStyle}
            cornerTokens={cornerTokens}
            motionTokens={motionTokens}
            depth={depth}
          />
        </section>
      </div>
    </main>
  );
}

function BannerSurface({
  bannerUrl,
  bannerKind,
  themeColor,
  height,
  roundedTop = false,
  preview = false,
  presenceOverlay,
  accentColor,
  bannerStyle,
  cornerRadius = 26,
}: {
  bannerUrl: string | null;
  bannerKind: "image" | "video" | "unknown";
  themeColor: string;
  height: number;
  roundedTop?: boolean;
  preview?: boolean;
  presenceOverlay: string;
  accentColor: string;
  bannerStyle: ProfileBannerStyle;
  cornerRadius?: number;
}) {
  const bannerStyleTokens = getProfileBannerStyleTokens(bannerStyle);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: `${height}px`,
        borderRadius: roundedTop
          ? `${cornerRadius}px ${cornerRadius}px 0 0`
          : `${cornerRadius}px`,
        background: `linear-gradient(135deg, ${themeColor}, ${withAlpha(accentColor, "c0")}, rgba(3,7,18,0.96))`,
        isolation: preview ? "isolate" : undefined,
      }}
    >
      <ProfileBannerMedia
        url={bannerUrl}
        kind={bannerKind}
        style={bannerMediaStyle(
          bannerStyleTokens.mediaScale,
          bannerStyleTokens.mediaFilter,
        )}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            `linear-gradient(
              180deg,
              rgba(6,8,12,${bannerStyleTokens.surfaceOverlayTop}) 0%,
              rgba(6,8,12,${bannerStyleTokens.surfaceOverlayMid}) 48%,
              rgba(6,8,12,${bannerStyleTokens.surfaceOverlayBottom}) 100%
            ), ${presenceOverlay}`,
        }}
      />
    </div>
  );
}

function DetachedWidget({
  children,
  depth,
  accent = "#ffffff",
}: {
  children: ReactNode;
  depth: ProfileSceneDepth;
  accent?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10px",
          borderRadius: "28px",
          background: `radial-gradient(circle at 18% 18%, ${withAlpha(accent, "10")} 0%, transparent 32%)`,
          opacity: Math.min(0.92, 0.42 + depth.lightingOpacity),
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

function AvatarVisual({
  avatarUrl,
  avatarInitials,
  themeColor,
  selectedDecoration,
  decorationScale,
  decorationOffsetX,
  decorationOffsetY,
  size,
  frameInset,
  minimal = false,
  presenceAccent,
  presenceContrast,
  presenceSoft,
  presencePulse,
  presenceAura,
  presenceRing,
  presenceGlow,
}: {
  avatarUrl: string | null;
  avatarInitials: string;
  themeColor: string;
  selectedDecoration: DecorationEntry | null;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  size: number;
  frameInset: number;
  minimal?: boolean;
  presenceAccent: string;
  presenceContrast: string;
  presenceSoft: string;
  presencePulse: string;
  presenceAura: string;
  presenceRing: string;
  presenceGlow: string;
}) {
  return (
    <LivingAvatar
      avatarUrl={avatarUrl}
      avatarInitials={avatarInitials}
      avatarAlt="Avatar"
      selectedDecoration={selectedDecoration}
      themeColor={themeColor}
      accentColor={presenceAccent}
      contrastColor={presenceContrast}
      softColor={presenceSoft}
      pulseColor={presencePulse}
      auraBackground={presenceAura}
      ringColor={presenceRing}
      glowColor={presenceGlow}
      size={size}
      frameInset={frameInset}
      decorationScale={decorationScale}
      decorationOffsetX={decorationOffsetX}
      decorationOffsetY={decorationOffsetY}
      minimal={minimal}
    />
  );
}

function PillRow({
  pills,
  compact = false,
  subtle = false,
}: {
  pills: HeroPill[];
  compact?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {pills.map((pill) => (
        <div
          key={pill.key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            minHeight: compact ? "32px" : "34px",
            padding: compact ? "0 11px" : "0 12px",
            borderRadius: "999px",
            color: pill.color,
            background: subtle ? "rgba(255,255,255,0.04)" : withAlpha(pill.color, "14"),
            border: `1px solid ${subtle ? "rgba(255,255,255,0.08)" : withAlpha(pill.color, "24")}`,
            fontSize: compact ? "11px" : "12px",
            fontWeight: 800,
            letterSpacing: "0.02em",
          }}
        >
          {pill.icon}
          {pill.text}
        </div>
      ))}
    </div>
  );
}

function BadgeRail({
  badges,
  extraBadgeCount,
  themeColor,
  minimal = false,
}: {
  badges: BadgeEntry[];
  extraBadgeCount: number;
  themeColor: string;
  minimal?: boolean;
}) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {badges.map((item) => {
        const visual = getBadgeVisual(item.badge, themeColor, minimal);

        return (
          <div
            key={item.id}
            title={item.badge.description || item.badge.name}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              minHeight: "38px",
              padding: "0 12px",
              borderRadius: "999px",
              border: `1px solid ${visual.pillBorder}`,
              background: visual.pillBackground,
              boxShadow: visual.pillShadow,
            }}
          >
          <div
            style={{
              width: "auto",
              minWidth: "26px",
              height: "26px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BadgeVisual
              slug={item.badge.slug}
              color={item.badge.color || themeColor}
              rarity={item.badge.rarity}
              category={item.badge.category}
              size={30}
              compact
            />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 800, color: visual.labelColor }}>
            {item.badge.name}
          </span>
        </div>
        );
      })}
      {extraBadgeCount > 0 ? (
        <div
          title={`${extraBadgeCount} more badge${extraBadgeCount === 1 ? "" : "s"}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            minHeight: "38px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: minimal ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.04)",
            color: "#f4f4f5",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              background: withAlpha(themeColor, "18"),
              boxShadow: `0 10px 18px ${withAlpha(themeColor, "14")}`,
              fontSize: "11px",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            +{extraBadgeCount}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#f4f4f5" }}>
            More
          </span>
        </div>
      ) : null}
    </div>
  );
}

function getBadgeVisual(
  badge: BadgeEntry["badge"],
  themeColor: string,
  minimal: boolean
) {
  const color = badge.color || themeColor;
  const isPriority =
    badge.slug === "owner" ||
    badge.slug === "admin" ||
    badge.slug === "premium" ||
    badge.category === "official";

  return {
    pillBackground: isPriority
      ? `linear-gradient(135deg, ${withAlpha(color, "16")}, rgba(255,255,255,0.05))`
      : minimal
        ? "rgba(255,255,255,0.03)"
        : "rgba(255,255,255,0.04)",
    pillBorder: isPriority ? withAlpha(color, "34") : "rgba(255,255,255,0.08)",
    pillShadow: isPriority ? `0 14px 28px ${withAlpha(color, "16")}` : "none",
    iconBackground: withAlpha(color, isPriority ? "22" : "18"),
    iconShadow: `0 10px 18px ${withAlpha(color, isPriority ? "20" : "14")}`,
    labelColor: isPriority ? "#ffffff" : "#f4f4f5",
  };
}

function LinksSection({
  layout,
  links,
  themeColor,
  surfaceBackground,
  surfaceBorder,
  density,
  cardStyle,
  cornerTokens,
  motionTokens,
  depth,
}: {
  layout: "default" | "simplistic" | "portfolio";
  links: LinkEntry[];
  themeColor: string;
  surfaceBackground: string;
  surfaceBorder: string;
  density: ReturnType<typeof getProfileDensityTokens>;
  cardStyle: ProfileCardStyle;
  cornerTokens: ReturnType<typeof getProfileCornerTokens>;
  motionTokens: ReturnType<typeof getProfileMotionTokens>;
  depth: ProfileSceneDepth;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: `${Math.round(12 * density.sectionGap)}px`,
      }}
    >
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={simpleKickerStyle(themeColor)}>
          <LuSparkles size={13} />
          Links
        </div>
      </div>

      <div style={{ display: "grid", gap: `${Math.round(14 * density.sectionGap * depth.spacingScale)}px` }}>
        {links.length > 0 ? (
          links.map((link, index) => {
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
                style={{
                  ...linkCardBaseStyle,
                  ...(layout === "simplistic"
                    ? simplisticLinkCardStyle
                    : layout === "portfolio"
                      ? portfolioLinkCardStyle
                      : defaultLinkCardStyle),
                  borderRadius: `${cornerTokens.cardRadius}px`,
                  background:
                    cardStyle === "solid"
                      ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(8,10,15,0.94))"
                      : cardStyle === "minimal"
                        ? "rgba(255,255,255,0.02)"
                        : surfaceBackground,
                  borderColor: withAlpha(color, layout === "simplistic" ? "14" : "22"),
                  boxShadow: `0 18px 34px ${withAlpha(
                    color,
                    motionTokens.hoverShadowBoost > 0.8 ? "12" : "0d",
                  )}, inset 0 1px 0 ${surfaceBorder}`,
                  transition: `transform ${motionTokens.transitionDurationMs}ms ease, box-shadow ${motionTokens.transitionDurationMs}ms ease`,
                  marginInlineStart:
                    layout === "portfolio"
                      ? "0"
                      : index % 2 === 0
                        ? "0"
                        : `${Math.round(16 * depth.spacingScale)}px`,
                  marginInlineEnd:
                    layout === "portfolio" || index % 2 === 1
                      ? "0"
                      : `${Math.round(12 * depth.spacingScale)}px`,
                }}
              >
                <div
                  style={{
                    ...linkIconStyle,
                    borderRadius: `${Math.max(cornerTokens.cardRadius - 4, 12)}px`,
                    background: withAlpha(color, layout === "simplistic" ? "12" : "16"),
                    color,
                  }}
                >
                  <PlatformIcon size={20} color={color} aria-hidden="true" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: "17px", color: "#ffffff" }}>
                      {link.title || platform.name}
                    </strong>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: "24px",
                        padding: "0 8px",
                        borderRadius: `${cornerTokens.chipRadius}px`,
                        border: "1px solid currentColor",
                        color,
                        background: withAlpha(color, "0f"),
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {platform.name}
                    </span>
                  </div>

                  <div style={{ color: "#a1a1aa", fontSize: "13px", marginTop: "6px" }}>
                    {hostname}
                  </div>
                  <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>
                    {link.url}
                  </div>
                </div>

                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: `${Math.max(cornerTokens.cardRadius - 8, 10)}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e4e4e7",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <LuArrowUpRight size={16} />
                </div>
              </a>
            );
          })
        ) : (
          <div style={emptyLinksStyle(cornerTokens)}>No links added yet.</div>
        )}
      </div>
    </section>
  );
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

function getLinkHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

function getLayeredSurfaceBackground(
  base: string,
  overlay: string,
  cardOverlay = "",
  includeGlass = true,
) {
  return [includeGlass ? overlay : "", cardOverlay, base].filter(Boolean).join(", ");
}

const bannerMediaStyle = (scale: number, filter: string): CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: `scale(${scale})`,
  filter,
});

const defaultPageStyle = (
  themeColor: string,
  preview = false,
  stageGlow = "",
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(24 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(32 * densityTokens.shellPadding * depth.spacingScale)}px 16px ${Math.round(40 * densityTokens.shellPadding * depth.spacingScale)}px`,
  color: "#ffffff",
  fontFamily: '"Space Grotesk", Inter, Arial, Helvetica, sans-serif',
  background: `${stageGlow}, linear-gradient(180deg, rgba(5,6,10,0.98), rgba(3,4,7,1)), radial-gradient(circle at top, ${withAlpha(themeColor, "16")} 0%, transparent 28%)`,
});

const defaultShellStyle = (
  _preview = false,
  panelGlow = "",
  surfaceBorder = "rgba(255,255,255,0.08)",
  surfaceBackground = "linear-gradient(180deg, rgba(10,11,16,0.98), rgba(7,8,12,0.98))",
  glassBackdrop = "blur(20px) saturate(128%)",
  shadowBoost = "0 24px 56px rgba(0,0,0,0.24)",
  cornerTokens = getProfileCornerTokens("rounded"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  width: `min(${depth.shellMaxWidth}px, 100%)`,
  maxWidth: `${depth.shellMaxWidth}px`,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  borderRadius: `${cornerTokens.shellRadius}px`,
  overflow: "hidden",
  border: `1px solid ${surfaceBorder}`,
  background: surfaceBackground,
  boxShadow: panelGlow
    ? `${panelGlow}, ${shadowBoost}, 0 ${Math.round(28 * depth.shadowDepth)}px ${Math.round(70 * depth.shadowDepth)}px rgba(0,0,0,0.24)`
    : `${shadowBoost}, 0 ${Math.round(28 * depth.shadowDepth)}px ${Math.round(70 * depth.shadowDepth)}px rgba(0,0,0,0.28)`,
  backdropFilter: glassBackdrop,
  WebkitBackdropFilter: glassBackdrop,
});

const defaultContentStyle = (
  preview = false,
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  gap: `${Math.round(24 * densityTokens.sectionGap * depth.spacingScale)}px`,
  padding: preview
    ? `0 ${Math.round(26 * densityTokens.contentPadding)}px ${Math.round(32 * densityTokens.contentPadding)}px`
    : `0 ${Math.round(26 * densityTokens.contentPadding)}px ${Math.round(28 * densityTokens.contentPadding)}px`,
  marginTop: "-54px",
  minWidth: 0,
});

const defaultIdentityStyle = (
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: `${Math.round(18 * depth.spacingScale)}px`,
  alignItems: "end",
  minWidth: 0,
});

const defaultNameStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  fontSize: `${Math.round(46 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
});

const usernameStyle: CSSProperties = {
  color: "#9ca3af",
  fontSize: "15px",
  fontWeight: 700,
};

const defaultBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#d4d4d8",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "15px",
  whiteSpace: "pre-wrap",
});

const simplisticPageStyle = (
  preview = false,
  stageGlow = "",
  surfaceBackground = "rgba(6,7,11,0.96)",
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(26 * densityTokens.shellPadding * depth.spacingScale)}px 24px`
    : `${Math.round(40 * densityTokens.shellPadding * depth.spacingScale)}px 16px`,
  color: "#ffffff",
  fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  background: `${stageGlow}, ${surfaceBackground}`,
});

const simplisticShellStyle = (
  _preview = false,
  glassBackdrop = "blur(20px) saturate(128%)",
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  width: `min(${Math.min(depth.shellMaxWidth, 860)}px, 100%)`,
  maxWidth: `${Math.min(depth.shellMaxWidth, 860)}px`,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: `${Math.round(20 * densityTokens.sectionGap * depth.spacingScale)}px`,
  minWidth: 0,
  backdropFilter: glassBackdrop,
  WebkitBackdropFilter: glassBackdrop,
});

const simplisticHeaderStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: `${Math.round(18 * densityTokens.sectionGap * depth.spacingScale)}px`,
  alignItems: "center",
  padding: `${Math.round(22 * densityTokens.contentPadding)}px 0 4px`,
  minWidth: 0,
});

const simplisticNameStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  fontSize: `${Math.round(44 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
});

const simplisticBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#c4c7cf",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "15px",
  whiteSpace: "pre-wrap",
});

const simplisticBannerWrapStyle = (
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  marginTop: `${Math.round(4 * depth.spacingScale)}px`,
});

const portfolioPageStyle = (
  preview = false,
  stageGlow = "",
  surfaceBackground = "linear-gradient(180deg, #071018 0%, #04070d 100%)",
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(24 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(24 * densityTokens.shellPadding * depth.spacingScale)}px 16px ${Math.round(38 * densityTokens.shellPadding * depth.spacingScale)}px`,
  color: "#ffffff",
  fontFamily: '"Space Grotesk", Inter, Arial, Helvetica, sans-serif',
  background: `${stageGlow}, ${surfaceBackground}`,
});

const portfolioBannerWrapStyle = (
  preview = false,
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  width: `min(${Math.min(depth.shellMaxWidth + 80, 1160)}px, 100%)`,
  maxWidth: `${Math.min(depth.shellMaxWidth + 80, 1160)}px`,
  position: "relative",
  zIndex: 1,
  margin: preview
    ? `0 auto ${Math.round(16 * densityTokens.sectionGap)}px`
    : `0 auto ${Math.round(18 * densityTokens.sectionGap)}px`,
});

const portfolioShellStyle = (
  _preview = false,
  densityTokens = getProfileDensityTokens("balanced"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  width: `min(${Math.min(depth.shellMaxWidth + 80, 1160)}px, 100%)`,
  maxWidth: `${Math.min(depth.shellMaxWidth + 80, 1160)}px`,
  position: "relative",
  zIndex: 1,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
  gap: `${Math.round(20 * densityTokens.sectionGap * depth.spacingScale)}px`,
  minWidth: 0,
});

const portfolioSidebarStyle = (
  _preview = false,
  panelGlow = "",
  surfaceBorder = "rgba(255,255,255,0.08)",
  surfaceBackground = "linear-gradient(180deg, rgba(10,14,22,0.98), rgba(8,10,16,0.98))",
  glassBackdrop = "blur(20px) saturate(128%)",
  shadowBoost = "0 24px 56px rgba(0,0,0,0.24)",
  cornerTokens = getProfileCornerTokens("rounded"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  alignContent: "start",
  gap: `${Math.round(18 * depth.spacingScale)}px`,
  padding: "22px",
  borderRadius: `${cornerTokens.panelRadius}px`,
  border: `1px solid ${surfaceBorder}`,
  background: surfaceBackground,
  boxShadow: panelGlow
    ? `${panelGlow}, ${shadowBoost}, 0 ${Math.round(24 * depth.shadowDepth)}px ${Math.round(56 * depth.shadowDepth)}px rgba(0,0,0,0.24)`
    : `${shadowBoost}, 0 ${Math.round(24 * depth.shadowDepth)}px ${Math.round(56 * depth.shadowDepth)}px rgba(0,0,0,0.24)`,
  minWidth: 0,
  overflow: "hidden",
  backdropFilter: glassBackdrop,
  WebkitBackdropFilter: glassBackdrop,
});

const portfolioMainStyle = (
  _preview = false,
  panelGlow = "",
  surfaceBorder = "rgba(255,255,255,0.08)",
  surfaceBackground = "linear-gradient(180deg, rgba(10,14,22,0.98), rgba(8,10,16,0.98))",
  glassBackdrop = "blur(20px) saturate(128%)",
  shadowBoost = "0 24px 56px rgba(0,0,0,0.24)",
  cornerTokens = getProfileCornerTokens("rounded"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  gap: `${Math.round(18 * depth.spacingScale)}px`,
  padding: "22px",
  borderRadius: `${cornerTokens.panelRadius}px`,
  border: `1px solid ${surfaceBorder}`,
  background: surfaceBackground,
  boxShadow: panelGlow
    ? `${panelGlow}, ${shadowBoost}, 0 ${Math.round(24 * depth.shadowDepth)}px ${Math.round(56 * depth.shadowDepth)}px rgba(0,0,0,0.24)`
    : `${shadowBoost}, 0 ${Math.round(24 * depth.shadowDepth)}px ${Math.round(56 * depth.shadowDepth)}px rgba(0,0,0,0.24)`,
  minWidth: 0,
  overflow: "hidden",
  backdropFilter: glassBackdrop,
  WebkitBackdropFilter: glassBackdrop,
});

const portfolioHeadingStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const portfolioNameStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  fontSize: `${Math.round(40 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
});

const portfolioBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#cbd5e1",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "14px",
  whiteSpace: "pre-wrap",
});

const portfolioSectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "36px",
  lineHeight: 0.98,
  letterSpacing: "-0.05em",
};

const portfolioSectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.75,
  fontSize: "14px",
  maxWidth: "62ch",
};

const simpleKickerStyle = (themeColor: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: `1px solid ${withAlpha(themeColor, "24")}`,
  background: withAlpha(themeColor, "12"),
  color: "#f1f5f9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.02em",
});

const eyebrowStyle = (themeColor: string): CSSProperties => ({
  display: "inline-flex",
  width: "fit-content",
  minHeight: "34px",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: "999px",
  color: "#f9a8d4",
  background: withAlpha(themeColor, "12"),
  border: `1px solid ${withAlpha(themeColor, "24")}`,
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const presenceChipStyle = (
  background: string,
  borderColor: string,
  cornerTokens = getProfileCornerTokens("rounded"),
): CSSProperties => ({
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  borderRadius: `${cornerTokens.chipRadius}px`,
  display: "inline-flex",
  alignItems: "center",
  color: "#f8fafc",
  background,
  border: `1px solid ${borderColor}`,
  boxShadow: "0 12px 22px rgba(0,0,0,0.16)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.02em",
});

const linkCardBaseStyle: CSSProperties = {
  textDecoration: "none",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "14px",
  borderRadius: "22px",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  boxSizing: "border-box",
};

const defaultLinkCardStyle: CSSProperties = {
  padding: "14px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const simplisticLinkCardStyle: CSSProperties = {
  padding: "14px",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const portfolioLinkCardStyle: CSSProperties = {
  padding: "16px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.018))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const linkIconStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  flexShrink: 0,
};

const emptyLinksStyle = (
  cornerTokens = getProfileCornerTokens("rounded"),
): CSSProperties => ({
  borderRadius: `${cornerTokens.cardRadius}px`,
  border: "1px dashed rgba(255,255,255,0.16)",
  padding: "26px 18px",
  textAlign: "center",
  color: "#a1a1aa",
  background: "rgba(255,255,255,0.02)",
});
