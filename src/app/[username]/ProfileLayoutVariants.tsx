import type { CSSProperties, ReactNode } from "react";
import { LuArrowUpRight, LuSparkles } from "react-icons/lu";
import LivingAvatar from "@/app/components/LivingAvatar";
import { getLinkPlatform } from "@/app/lib/link-icons";
import type { ProfileCustomBlock } from "@/app/lib/profile-custom-blocks";
import {
  getProfileCompositionSpacingScale,
  getRenderableCompositionOrder,
  partitionSocialBlocks,
  type ProfileComposition,
  type ProfileCompositionBlock,
} from "@/app/lib/profile-composition";
import {
  getProfileDnaTuning,
  type ProfileDnaTuning,
} from "@/app/lib/profile-dna";
import { getProfilePresetRenderTuning } from "@/app/lib/profile-presets";
import {
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import {
  shouldRenderProfileMusic,
  type ProfileMusicData,
} from "@/app/lib/profile-music";
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
import ProfileIdentityBadges from "./ProfileIdentityBadges";
import ProfileNamePlate from "./ProfileNamePlate";
import ProfileHeroClient from "./ProfileHeroClient";
import ProfileMusicCard from "./ProfileMusicCard";
import ProfileCustomBlockCard from "./ProfileCustomBlock";
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
  composition: ProfileComposition;
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
  const presetRenderTuning = getProfilePresetRenderTuning(props.composition.preset);
  const dnaTuning = getProfileDnaTuning(props.composition.dna);
  const compositionSpacingScale = getProfileCompositionSpacingScale(
    props.composition.density,
  ) * presetRenderTuning.moduleGapScale * dnaTuning.spacingScale * dnaTuning.separationScale;
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const motionTokens = getProfileMotionTokens(props.motionLevel);
  const socialGroups = partitionSocialBlocks(props.socialBlocks);
  const orderedBlocks = getRenderableCompositionOrder(props.composition, {
    hero: true,
    music: props.preview ? true : shouldRenderProfileMusic(props.music),
    socials: socialGroups.socials.length > 0,
    live: socialGroups.live.length > 0,
    links: true,
  }).filter((block) => block !== "hero");
  const customBlocks = props.composition.customBlocks.filter((block) => block.visible);
  const resolvedBackdrop =
    scaleBlurInFilter(
      props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter,
      dnaTuning.blurScale,
    );
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
        dnaTuning,
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
          densityTokens,
          cornerTokens,
          depth,
          presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
          dnaTuning,
        )}
      >
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={Math.round((props.preview ? 182 : 208) * densityTokens.bannerScale)}
          roundedTop
          preview={props.preview}
          presenceOverlay={presence.auraOverlay}
          accentColor={presence.accent}
          bannerStyle={props.bannerStyle}
          cornerRadius={cornerTokens.shellRadius}
        />

        <div
          style={defaultContentStyle(
            props.preview,
            densityTokens,
            depth,
            compositionSpacingScale,
          )}
        >
          <div style={defaultIdentityStyle(depth)}>
            <AvatarVisual
              avatarUrl={props.user.avatarUrl}
              avatarInitials={props.avatarInitials}
              themeColor={props.themeColor}
              selectedDecoration={props.user.selectedDecoration}
              decorationScale={props.decorationScale}
              decorationOffsetX={props.decorationOffsetX}
              decorationOffsetY={props.decorationOffsetY}
              size={Math.max(90, Math.round(108 * densityTokens.avatarScale))}
              frameInset={6}
              presenceAccent={presence.accent}
              presenceContrast={presence.contrast}
              presenceSoft={presence.soft}
              presencePulse={presence.pulse}
              presenceAura={presence.avatarAuraBackground}
              presenceRing={presence.avatarRing}
              presenceGlow={presence.avatarGlow}
            />

            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <ProfileNamePlate
                displayName={props.displayName}
                username={props.user.username}
                effects={props.nameEffects}
                motionLevel={props.motionLevel}
                nameStyle={defaultNameStyle(densityTokens)}
                usernameStyle={usernameStyle}
              />
              {props.composition.metadata.showBadges ? (
                <ProfileIdentityBadges
                  badges={props.featuredBadges}
                  extraBadgeCount={props.extraBadgeCount}
                  themeColor={sceneAppearance.linkThemeColor}
                />
              ) : null}
              {renderIdentityMetadataSlot("under-username", {
                composition: props.composition,
                username: props.user.username,
                views: props.views,
                likes: props.likes,
                dislikes: props.dislikes,
                themeColor: sceneAppearance.linkThemeColor,
                initialMyReaction: props.initialMyReaction,
                preview: props.preview,
              })}
              <PillRow pills={props.heroPills} compact dnaTuning={dnaTuning} />
              {props.user.bio ? <p style={defaultBioStyle(densityTokens)}>{props.user.bio}</p> : null}
              {renderIdentityMetadataSlot("bio", {
                composition: props.composition,
                username: props.user.username,
                views: props.views,
                likes: props.likes,
                dislikes: props.dislikes,
                themeColor: sceneAppearance.linkThemeColor,
                initialMyReaction: props.initialMyReaction,
                preview: props.preview,
              })}
              {renderIdentityMetadataSlot("hero-footer", {
                composition: props.composition,
                username: props.user.username,
                views: props.views,
                likes: props.likes,
                dislikes: props.dislikes,
                themeColor: sceneAppearance.linkThemeColor,
                initialMyReaction: props.initialMyReaction,
                preview: props.preview,
              })}
            </div>
          </div>

          {orderedBlocks.map((block) =>
            renderVariantBlock(block, {
              layout: "default",
              preview: props.preview,
              username: props.user.username,
              music: props.music,
              motionLevel: props.motionLevel,
              themeColor: sceneAppearance.linkThemeColor,
              socialThemeColor: sceneAppearance.socialThemeColor,
              accentColor: presence.accent,
              contrastColor: presence.contrast,
              softColor: presence.soft,
              featuredBadges: props.featuredBadges,
              extraBadgeCount: props.extraBadgeCount,
              likes: props.likes,
              dislikes: props.dislikes,
              views: props.views,
              initialMyReaction: props.initialMyReaction,
              socialGroups,
              links: props.user.links,
              density: densityTokens,
              cardStyle: props.cardStyle,
              cornerTokens,
              motionTokens,
              depth,
              composition: props.composition,
              dnaTuning,
            }),
          )}
          {customBlocks.map((block, index) =>
            renderVariantCustomBlock(block, {
              key: `custom-${block.id}`,
              accentColor: sceneAppearance.linkThemeColor,
              contrastColor: presence.contrast,
              softColor: presence.soft,
              depth,
              index,
              dnaTuning,
              preview: props.preview,
            }),
          )}
          {renderIdentityMetadataSlot("screen-bottom-left", {
            composition: props.composition,
            username: props.user.username,
            views: props.views,
            likes: props.likes,
            dislikes: props.dislikes,
            themeColor: sceneAppearance.linkThemeColor,
            initialMyReaction: props.initialMyReaction,
            preview: props.preview,
          })}
          {renderIdentityMetadataSlot("screen-bottom-right", {
            composition: props.composition,
            username: props.user.username,
            views: props.views,
            likes: props.likes,
            dislikes: props.dislikes,
            themeColor: sceneAppearance.linkThemeColor,
            initialMyReaction: props.initialMyReaction,
            preview: props.preview,
          })}
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
  const presetRenderTuning = getProfilePresetRenderTuning(props.composition.preset);
  const dnaTuning = getProfileDnaTuning(props.composition.dna);
  const compositionSpacingScale = getProfileCompositionSpacingScale(
    props.composition.density,
  ) * presetRenderTuning.moduleGapScale * dnaTuning.spacingScale * dnaTuning.separationScale;
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const resolvedBackdrop =
    scaleBlurInFilter(
      props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter,
      dnaTuning.blurScale,
    );
  const socialGroups = partitionSocialBlocks(props.socialBlocks);
  const orderedBlocks = getRenderableCompositionOrder(props.composition, {
    hero: true,
    music: props.preview ? true : shouldRenderProfileMusic(props.music),
    socials: socialGroups.socials.length > 0,
    live: socialGroups.live.length > 0,
    links: true,
  }).filter((block) => block !== "hero");
  const customBlocks = props.composition.customBlocks.filter((block) => block.visible);

  return (
    <main
      style={simplisticPageStyle(
        props.preview,
        presence.stageGlow,
        sceneAppearance.surfaceBackground,
        densityTokens,
        depth,
        dnaTuning,
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
      <div
        style={simplisticShellStyle(
          props.preview,
          resolvedBackdrop,
          densityTokens,
          depth,
          compositionSpacingScale,
          presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
        )}
      >
        <div style={simplisticHeaderStyle(densityTokens, depth, compositionSpacingScale)}>
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={Math.max(74, Math.round(90 * densityTokens.avatarScale))}
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
            <ProfileNamePlate
              displayName={props.displayName}
              username={props.user.username}
              effects={props.nameEffects}
              motionLevel={props.motionLevel}
              nameStyle={simplisticNameStyle(densityTokens)}
              usernameStyle={usernameStyle}
            />
            {props.composition.metadata.showBadges ? (
              <ProfileIdentityBadges
                badges={props.featuredBadges}
                extraBadgeCount={props.extraBadgeCount}
                themeColor={sceneAppearance.linkThemeColor}
              />
            ) : null}
            {renderIdentityMetadataSlot("under-username", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
            {props.user.bio ? <p style={simplisticBioStyle(densityTokens)}>{props.user.bio}</p> : null}
            {renderIdentityMetadataSlot("bio", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
            {renderIdentityMetadataSlot("hero-footer", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
          </div>
        </div>

        <PillRow pills={props.heroPills} subtle dnaTuning={dnaTuning} />

        <div style={simplisticBannerWrapStyle(depth)}>
          <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={Math.round((props.preview ? 112 : 132) * densityTokens.bannerScale)}
            preview={props.preview}
            presenceOverlay={presence.auraOverlay}
            accentColor={presence.accent}
            bannerStyle={props.bannerStyle}
            cornerRadius={cornerTokens.panelRadius}
          />
        </div>

        {orderedBlocks.map((block) =>
          renderVariantBlock(block, {
            layout: "simplistic",
            preview: props.preview,
            username: props.user.username,
            music: props.music,
            motionLevel: props.motionLevel,
            themeColor: sceneAppearance.linkThemeColor,
            socialThemeColor: sceneAppearance.socialThemeColor,
            accentColor: presence.accent,
            contrastColor: presence.contrast,
            softColor: presence.soft,
            featuredBadges: props.featuredBadges,
            extraBadgeCount: props.extraBadgeCount,
            likes: props.likes,
            dislikes: props.dislikes,
            views: props.views,
            initialMyReaction: props.initialMyReaction,
            socialGroups,
            links: props.user.links,
            density: densityTokens,
            cardStyle: props.cardStyle,
            cornerTokens,
            motionTokens: getProfileMotionTokens(props.motionLevel),
            depth,
            composition: props.composition,
            dnaTuning,
          }),
        )}
        {customBlocks.map((block, index) =>
          renderVariantCustomBlock(block, {
            key: `custom-${block.id}`,
            accentColor: sceneAppearance.linkThemeColor,
            contrastColor: presence.contrast,
            softColor: presence.soft,
            depth,
            index,
            dnaTuning,
            preview: props.preview,
          }),
        )}
        {renderIdentityMetadataSlot("screen-bottom-left", {
          composition: props.composition,
          username: props.user.username,
          views: props.views,
          likes: props.likes,
          dislikes: props.dislikes,
          themeColor: sceneAppearance.linkThemeColor,
          initialMyReaction: props.initialMyReaction,
          preview: props.preview,
        })}
        {renderIdentityMetadataSlot("screen-bottom-right", {
          composition: props.composition,
          username: props.user.username,
          views: props.views,
          likes: props.likes,
          dislikes: props.dislikes,
          themeColor: sceneAppearance.linkThemeColor,
          initialMyReaction: props.initialMyReaction,
          preview: props.preview,
        })}
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
  const presetRenderTuning = getProfilePresetRenderTuning(props.composition.preset);
  const dnaTuning = getProfileDnaTuning(props.composition.dna);
  const compositionSpacingScale = getProfileCompositionSpacingScale(
    props.composition.density,
  ) * presetRenderTuning.moduleGapScale * dnaTuning.spacingScale * dnaTuning.separationScale;
  const cardStyleTokens = getProfileCardStyleTokens(props.cardStyle);
  const cornerTokens = getProfileCornerTokens(props.cornerStyle);
  const motionTokens = getProfileMotionTokens(props.motionLevel);
  const resolvedBackdrop =
    scaleBlurInFilter(
      props.cardStyle === "glass" ? glassTokens.backdropFilter : cardStyleTokens.backdropFilter,
      dnaTuning.blurScale,
    );
  const resolvedSurfaceBackground = getLayeredSurfaceBackground(
    sceneAppearance.surfaceBackground,
    glassTokens.backgroundLayer,
    cardStyleTokens.shellOverlay,
    props.cardStyle === "glass",
  );
  const socialGroups = partitionSocialBlocks(props.socialBlocks);
  const orderedBlocks = getRenderableCompositionOrder(props.composition, {
    hero: true,
    music: props.preview ? true : shouldRenderProfileMusic(props.music),
    socials: socialGroups.socials.length > 0,
    live: socialGroups.live.length > 0,
    links: true,
  }).filter((block) => block !== "hero");
  const customBlocks = props.composition.customBlocks.filter((block) => block.visible);

  return (
    <main
      style={portfolioPageStyle(
        props.preview,
        presence.stageGlow,
        sceneAppearance.surfaceBackground,
        densityTokens,
        depth,
        dnaTuning,
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
      <div
        style={portfolioBannerWrapStyle(
          props.preview,
          densityTokens,
          depth,
          presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
        )}
      >
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={Math.round((props.preview ? 156 : 186) * densityTokens.bannerScale)}
          preview={props.preview}
          presenceOverlay={presence.auraOverlay}
          accentColor={presence.accent}
          bannerStyle={props.bannerStyle}
          cornerRadius={cornerTokens.panelRadius}
        />
      </div>

      <div
        style={portfolioShellStyle(
          props.preview,
          densityTokens,
          depth,
          compositionSpacingScale,
          presetRenderTuning.stageWidthScale * dnaTuning.compactnessScale,
        )}
      >
        <aside
          style={portfolioSidebarStyle(
            props.preview,
            presence.panelGlow,
            sceneAppearance.surfaceBorder,
            resolvedSurfaceBackground,
            resolvedBackdrop,
            glassTokens.shadowBoost,
            densityTokens,
            cornerTokens,
            depth,
          )}
        >
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={Math.max(82, Math.round(96 * densityTokens.avatarScale))}
            frameInset={6}
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
            {props.composition.metadata.showBadges ? (
              <ProfileIdentityBadges
                badges={props.featuredBadges}
                extraBadgeCount={props.extraBadgeCount}
                themeColor={sceneAppearance.linkThemeColor}
              />
            ) : null}
            {renderIdentityMetadataSlot("under-username", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
            {props.user.bio ? <p style={portfolioBioStyle(densityTokens)}>{props.user.bio}</p> : null}
            {renderIdentityMetadataSlot("bio", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
            {renderIdentityMetadataSlot("hero-footer", {
              composition: props.composition,
              username: props.user.username,
              views: props.views,
              likes: props.likes,
              dislikes: props.dislikes,
              themeColor: sceneAppearance.linkThemeColor,
              initialMyReaction: props.initialMyReaction,
              preview: props.preview,
            })}
          </div>

          <PillRow pills={props.heroPills} subtle dnaTuning={dnaTuning} />
        </aside>

        <section
          style={portfolioMainStyle(
            props.preview,
            presence.panelGlow,
            sceneAppearance.surfaceBorder,
            resolvedSurfaceBackground,
            resolvedBackdrop,
            glassTokens.shadowBoost,
            densityTokens,
            cornerTokens,
            depth,
          )}
        >
          {orderedBlocks.map((block) =>
            renderVariantBlock(block, {
              layout: "portfolio",
              preview: props.preview,
              username: props.user.username,
              music: props.music,
              motionLevel: props.motionLevel,
              themeColor: sceneAppearance.linkThemeColor,
              socialThemeColor: sceneAppearance.socialThemeColor,
              accentColor: presence.accent,
              contrastColor: presence.contrast,
              softColor: presence.soft,
              featuredBadges: props.featuredBadges,
              extraBadgeCount: props.extraBadgeCount,
              likes: props.likes,
              dislikes: props.dislikes,
              views: props.views,
              initialMyReaction: props.initialMyReaction,
              socialGroups,
              links: props.user.links,
              density: densityTokens,
              cardStyle: props.cardStyle,
              cornerTokens,
              motionTokens,
              depth,
              composition: props.composition,
              dnaTuning,
            }),
          )}
          {customBlocks.map((block, index) =>
            renderVariantCustomBlock(block, {
              key: `custom-${block.id}`,
              accentColor: sceneAppearance.linkThemeColor,
              contrastColor: presence.contrast,
              softColor: presence.soft,
              depth,
              index,
              dnaTuning,
              preview: props.preview,
            }),
          )}
          {renderIdentityMetadataSlot("screen-bottom-left", {
            composition: props.composition,
            username: props.user.username,
            views: props.views,
            likes: props.likes,
            dislikes: props.dislikes,
            themeColor: sceneAppearance.linkThemeColor,
            initialMyReaction: props.initialMyReaction,
            preview: props.preview,
          })}
          {renderIdentityMetadataSlot("screen-bottom-right", {
            composition: props.composition,
            username: props.user.username,
            views: props.views,
            likes: props.likes,
            dislikes: props.dislikes,
            themeColor: sceneAppearance.linkThemeColor,
            initialMyReaction: props.initialMyReaction,
            preview: props.preview,
          })}
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
  dnaTuning = getProfileDnaTuning(null),
  style,
}: {
  children: ReactNode;
  depth: ProfileSceneDepth;
  accent?: string;
  dnaTuning?: ProfileDnaTuning;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "24px",
          background: `radial-gradient(circle at 18% 18%, ${withAlpha(accent, "10")} 0%, transparent 32%)`,
          opacity: Math.min(0.88, (0.3 + depth.lightingOpacity * 0.72) * dnaTuning.glowScale),
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

function renderVariantBlock(
  block: ProfileCompositionBlock,
  input: {
    layout: "default" | "simplistic" | "portfolio";
    preview?: boolean;
    username: string;
    music: ProfileMusicData;
    motionLevel: ProfileMotionLevel;
    themeColor: string;
    socialThemeColor: string;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    featuredBadges: BadgeEntry[];
    extraBadgeCount: number;
    likes: number;
    dislikes: number;
    views: number;
    initialMyReaction: "like" | "dislike" | null;
    socialGroups: {
      socials: PublicSocialBlock[];
      live: PublicSocialBlock[];
    };
    links: LinkEntry[];
    density: ReturnType<typeof getProfileDensityTokens>;
    cardStyle: ProfileCardStyle;
    cornerTokens: ReturnType<typeof getProfileCornerTokens>;
    motionTokens: ReturnType<typeof getProfileMotionTokens>;
    depth: ProfileSceneDepth;
    composition: ProfileComposition;
    dnaTuning: ProfileDnaTuning;
  },
) {
  if (block === "music") {
    return (
      <DetachedWidget key={block} depth={input.depth} dnaTuning={input.dnaTuning}>
        <ProfileRenderBoundary label="Music card" compact resetKey={`${input.username}-${block}`}>
          <ProfileMusicCard
            music={input.music}
            themeColor={input.themeColor}
            accentColor={input.accentColor}
            contrastColor={input.contrastColor}
            softColor={input.softColor}
            compact
            showPlaceholder={Boolean(input.preview)}
            motionLevel={input.motionLevel}
          />
        </ProfileRenderBoundary>
      </DetachedWidget>
    );
  }

  if (block === "socials") {
    return (
      <DetachedWidget
        key={block}
        depth={input.depth}
        accent={input.softColor}
        dnaTuning={input.dnaTuning}
      >
        <ProfileRenderBoundary label="Social presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.socialGroups.socials}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="socials"
            displayStyle={input.composition.socialsStyle}
          />
        </ProfileRenderBoundary>
      </DetachedWidget>
    );
  }

  if (block === "live") {
    return (
      <DetachedWidget
        key={block}
        depth={input.depth}
        accent={input.accentColor}
        dnaTuning={input.dnaTuning}
      >
        <ProfileRenderBoundary label="Live presence" compact resetKey={`${input.username}-${block}`}>
          <SocialPresenceSection
            blocks={input.socialGroups.live}
            themeColor={input.socialThemeColor}
            compact
            preview={input.preview}
            mode="live"
            displayStyle={input.composition.socialsStyle}
          />
        </ProfileRenderBoundary>
      </DetachedWidget>
    );
  }

  if (block === "links") {
    return (
      <LinksSection
        key={block}
        layout={input.layout}
        links={input.links}
        themeColor={input.themeColor}
        surfaceBackground="rgba(255,255,255,0.02)"
        surfaceBorder="rgba(255,255,255,0.08)"
        density={input.density}
        cardStyle={input.cardStyle}
        cornerTokens={input.cornerTokens}
        motionTokens={input.motionTokens}
        depth={input.depth}
        linksStyle={input.composition.linksStyle}
        dnaTuning={input.dnaTuning}
      />
    );
  }

  return null;
}

function renderVariantCustomBlock(
  block: ProfileCustomBlock,
  input: {
    key: string;
    accentColor: string;
    contrastColor: string;
    softColor: string;
    depth: ProfileSceneDepth;
    index: number;
    dnaTuning: ProfileDnaTuning;
    preview?: boolean;
  },
) {
  return (
    <DetachedWidget
      key={input.key}
      depth={input.depth}
      accent={block.accentColor || input.accentColor}
      dnaTuning={input.dnaTuning}
      style={{
        justifySelf:
          block.alignment === "start"
            ? "start"
            : block.alignment === "end"
              ? "end"
              : "center",
        width: "100%",
        maxWidth: block.width === "compact" ? "340px" : "520px",
        marginTop: input.index % 2 === 0 ? "0" : "4px",
      }}
    >
      <ProfileCustomBlockCard
        block={block}
        accentColor={input.accentColor}
        contrastColor={input.contrastColor}
        softColor={input.softColor}
        dnaTuning={input.dnaTuning}
        preview={Boolean(input.preview)}
        compact
      />
    </DetachedWidget>
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
  dnaTuning = getProfileDnaTuning(null),
}: {
  pills: HeroPill[];
  compact?: boolean;
  subtle?: boolean;
  dnaTuning?: ProfileDnaTuning;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: `${Math.max(6, Math.round(8 * dnaTuning.chipScale))}px`,
        flexWrap: "wrap",
      }}
    >
      {pills.map((pill) => (
        <div
          key={pill.key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: `${Math.max(5, Math.round(6 * dnaTuning.chipScale))}px`,
            minHeight: `${Math.max(24, Math.round((compact ? 26 : 28) * dnaTuning.chipScale))}px`,
            padding: compact
              ? `0 ${Math.max(8, Math.round(9 * dnaTuning.chipScale))}px`
              : `0 ${Math.max(9, Math.round(10 * dnaTuning.chipScale))}px`,
            borderRadius: "999px",
            color: pill.color,
            background: subtle
              ? "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(8,10,16,0.44))"
              : withAlpha(pill.color, "12"),
            border: `1px solid ${subtle ? "rgba(255,255,255,0.07)" : withAlpha(pill.color, "20")}`,
            fontSize: `${Math.max(9, Math.round(10 * dnaTuning.chipScale))}px`,
            fontWeight: 800,
            letterSpacing: "0.02em",
            boxShadow: subtle ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
          }}
        >
          {pill.icon}
          {pill.text}
        </div>
      ))}
    </div>
  );
}

function renderIdentityMetadataSlot(
  slot:
    | "under-username"
    | "bio"
    | "hero-footer"
    | "screen-bottom-left"
    | "screen-bottom-right",
  input: {
    composition: ProfileComposition;
    username: string;
    views: number;
    likes: number;
    dislikes: number;
    themeColor: string;
    initialMyReaction: "like" | "dislike" | null;
    preview?: boolean;
  },
) {
  if (input.composition.metadata.placement !== slot) {
    return null;
  }

  const isScreenCorner =
    slot === "screen-bottom-left" || slot === "screen-bottom-right";

  return (
    <div
      style={
        isScreenCorner
          ? screenMetadataStyle(slot === "screen-bottom-left" ? "left" : "right", input.preview)
          : undefined
      }
    >
      <ProfileHeroClient
        username={input.username}
        initialViews={input.views}
        initialLikes={input.likes}
        initialDislikes={input.dislikes}
        themeColor={input.themeColor}
        initialMyReaction={input.initialMyReaction}
        locationText={input.composition.metadata.locationText}
        preview={input.preview}
        variant={isScreenCorner ? "corner" : "inline"}
      />
    </div>
  );
}

function screenMetadataStyle(
  side: "left" | "right",
  preview = false,
): CSSProperties {
  return {
    position: preview ? "absolute" : "fixed",
    bottom: preview ? "14px" : "18px",
    left: side === "left" ? (preview ? "14px" : "18px") : undefined,
    right: side === "right" ? (preview ? "14px" : "18px") : undefined,
    zIndex: 3,
    pointerEvents: "auto",
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
  linksStyle,
  dnaTuning,
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
  linksStyle: ProfileComposition["linksStyle"];
  dnaTuning: ProfileDnaTuning;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: `${Math.round(8 * density.sectionGap * dnaTuning.spacingScale)}px`,
      }}
    >
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={simpleKickerStyle(themeColor)}>
          <LuSparkles size={13} />
          Links
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: `${Math.round(8 * density.sectionGap * depth.spacingScale * dnaTuning.spacingScale)}px`,
        }}
      >
        {links.length > 0 ? (
          links.map((link, index) => {
            const platform = getLinkPlatform(link.url, link.title);
            const color = platform.color || themeColor;
            const PlatformIcon = platform.icon;
            const hostname = getLinkHostname(link.url);
            const isPill = linksStyle === "pills";
            const isMinimal = linksStyle === "minimal";
            const isStacked = linksStyle === "stacked";

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
                    isMinimal
                      ? "rgba(255,255,255,0.02)"
                      : cardStyle === "solid"
                      ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(8,10,15,0.94))"
                      : cardStyle === "minimal"
                        ? "rgba(255,255,255,0.02)"
                        : surfaceBackground,
                  borderColor: withAlpha(color, layout === "simplistic" ? "14" : "22"),
                  boxShadow: `0 18px 34px ${withAlpha(
                    color,
                    dnaTuning.glowScale >= 1.08
                      ? "14"
                      : motionTokens.hoverShadowBoost > 0.8
                        ? "12"
                        : "0d",
                  )}, inset 0 1px 0 ${surfaceBorder}`,
                  transition: `transform ${motionTokens.transitionDurationMs}ms ease, box-shadow ${motionTokens.transitionDurationMs}ms ease`,
                  padding: isPill
                    ? `${Math.max(8, Math.round(9 * dnaTuning.compactnessScale))}px ${Math.max(10, Math.round(11 * dnaTuning.compactnessScale))}px`
                    : isStacked
                      ? `${Math.max(11, Math.round(12 * dnaTuning.compactnessScale))}px`
                      : `${Math.max(10, Math.round(11 * dnaTuning.compactnessScale))}px`,
                  marginInlineStart:
                    layout === "portfolio"
                      ? "0"
                      : isStacked || isPill
                        ? "0"
                        : index % 2 === 0
                        ? "0"
                        : `${Math.round(6 * depth.spacingScale)}px`,
                  marginInlineEnd:
                    layout === "portfolio" || isStacked || isPill || index % 2 === 1
                      ? "0"
                      : `${Math.round(5 * depth.spacingScale)}px`,
                }}
              >
                <div
                  style={{
                    ...linkIconStyle,
                    borderRadius: `${Math.max(cornerTokens.cardRadius - 4, 12)}px`,
                    background: withAlpha(color, layout === "simplistic" ? "12" : "16"),
                    color,
                    width: isPill ? "36px" : "40px",
                    height: isPill ? "36px" : "40px",
                  }}
                >
                  <PlatformIcon size={isPill ? 15 : 17} color={color} aria-hidden="true" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: "14px", color: "#ffffff" }}>
                      {link.title || platform.name}
                    </strong>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: "20px",
                        padding: "0 6px",
                        borderRadius: `${cornerTokens.chipRadius}px`,
                        border: "1px solid currentColor",
                        color,
                        background: withAlpha(color, "0f"),
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {platform.name}
                    </span>
                  </div>

                  <div style={{ color: "#a1a1aa", fontSize: "11px", marginTop: "4px" }}>
                    {hostname}
                  </div>
                  {isPill ? null : (
                    <div style={{ color: "#71717a", fontSize: "10px", marginTop: "3px" }}>
                      {link.url}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    width: "28px",
                    height: "28px",
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
                    <LuArrowUpRight size={13} />
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

function getStageMaxWidth(
  depth: ProfileSceneDepth,
  densityTokens: ReturnType<typeof getProfileDensityTokens>,
  cap: number,
  stageWidthScale = 1,
) {
  return Math.min(
    Math.round(depth.shellMaxWidth * densityTokens.stageWidthScale * stageWidthScale),
    Math.round(cap * stageWidthScale),
  );
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
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(18 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(24 * densityTokens.shellPadding * depth.spacingScale)}px 12px ${Math.round(28 * densityTokens.shellPadding * depth.spacingScale)}px`,
  color: "#ffffff",
  fontFamily: '"Space Grotesk", Inter, Arial, Helvetica, sans-serif',
  background: `${stageGlow}, linear-gradient(180deg, rgba(5,6,10,${clampNumber(0.98 / dnaTuning.transparencyScale, 0.76, 1)}), rgba(3,4,7,1)), radial-gradient(circle at top, ${withAlpha(themeColor, dnaTuning.glowScale >= 1.08 ? "20" : "16")} 0%, transparent 28%)`,
});

const defaultShellStyle = (
  _preview = false,
  panelGlow = "",
  surfaceBorder = "rgba(255,255,255,0.08)",
  surfaceBackground = "linear-gradient(180deg, rgba(10,11,16,0.98), rgba(7,8,12,0.98))",
  glassBackdrop = "blur(20px) saturate(128%)",
  shadowBoost = "0 24px 56px rgba(0,0,0,0.24)",
  densityTokens = getProfileDensityTokens("balanced"),
  cornerTokens = getProfileCornerTokens("rounded"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
  stageWidthScale = 1,
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties => ({
  width: `min(${getStageMaxWidth(depth, densityTokens, 840, stageWidthScale)}px, 100%)`,
  maxWidth: `${getStageMaxWidth(depth, densityTokens, 840, stageWidthScale)}px`,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  borderRadius: `${cornerTokens.shellRadius}px`,
  overflow: "hidden",
  border: `1px solid ${surfaceBorder}`,
  background: surfaceBackground,
  boxShadow: panelGlow
    ? `${panelGlow}, ${shadowBoost}, 0 ${Math.round(28 * depth.shadowDepth * dnaTuning.shadowScale)}px ${Math.round(70 * depth.shadowDepth * dnaTuning.shadowScale)}px rgba(0,0,0,${clampNumber(0.24 * dnaTuning.shadowScale, 0.14, 0.34)})`
    : `${shadowBoost}, 0 ${Math.round(28 * depth.shadowDepth * dnaTuning.shadowScale)}px ${Math.round(70 * depth.shadowDepth * dnaTuning.shadowScale)}px rgba(0,0,0,${clampNumber(0.28 * dnaTuning.shadowScale, 0.16, 0.36)})`,
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
  compositionSpacingScale = 1,
): CSSProperties => ({
  display: "grid",
  gap: `${Math.round(15 * densityTokens.sectionGap * depth.spacingScale * compositionSpacingScale)}px`,
  padding: preview
    ? `0 ${Math.round(18 * densityTokens.contentPadding)}px ${Math.round(20 * densityTokens.contentPadding)}px`
    : `0 ${Math.round(18 * densityTokens.contentPadding)}px ${Math.round(18 * densityTokens.contentPadding)}px`,
  marginTop: "-32px",
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
  gap: `${Math.round(11 * depth.spacingScale)}px`,
  alignItems: "end",
  minWidth: 0,
});

const defaultNameStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  fontSize: `${Math.round(34 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
});

const usernameStyle: CSSProperties = {
  color: "#9ca3af",
  fontSize: "13px",
  fontWeight: 700,
};

const defaultBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#d4d4d8",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "13px",
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
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(18 * densityTokens.shellPadding * depth.spacingScale)}px 20px`
    : `${Math.round(26 * densityTokens.shellPadding * depth.spacingScale)}px 12px`,
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
  compositionSpacingScale = 1,
  stageWidthScale = 1,
): CSSProperties => ({
  width: `min(${getStageMaxWidth(depth, densityTokens, 560, stageWidthScale)}px, 100%)`,
  maxWidth: `${getStageMaxWidth(depth, densityTokens, 560, stageWidthScale)}px`,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: `${Math.round(13 * densityTokens.sectionGap * depth.spacingScale * compositionSpacingScale)}px`,
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
  compositionSpacingScale = 1,
): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: `${Math.round(11 * densityTokens.sectionGap * depth.spacingScale * compositionSpacingScale)}px`,
  alignItems: "center",
  padding: `${Math.round(14 * densityTokens.contentPadding)}px 0 2px`,
  minWidth: 0,
});

const simplisticNameStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  fontSize: `${Math.round(32 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
});

const simplisticBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#c4c7cf",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "13px",
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
  marginTop: `${Math.round(2 * depth.spacingScale)}px`,
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
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties => ({
  minHeight: preview ? "auto" : "100vh",
  minWidth: 0,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  padding: preview
    ? `${Math.round(18 * densityTokens.shellPadding * depth.spacingScale)}px`
    : `${Math.round(18 * densityTokens.shellPadding * depth.spacingScale)}px 12px ${Math.round(24 * densityTokens.shellPadding * depth.spacingScale)}px`,
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
  stageWidthScale = 1,
): CSSProperties => ({
  width: `min(${Math.min(getStageMaxWidth(depth, densityTokens, 860, stageWidthScale) + 12, Math.round(872 * stageWidthScale))}px, 100%)`,
  maxWidth: `${Math.min(getStageMaxWidth(depth, densityTokens, 860, stageWidthScale) + 12, Math.round(872 * stageWidthScale))}px`,
  position: "relative",
  zIndex: 1,
  margin: preview
    ? `0 auto ${Math.round(12 * densityTokens.sectionGap)}px`
    : `0 auto ${Math.round(14 * densityTokens.sectionGap)}px`,
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
  compositionSpacingScale = 1,
  stageWidthScale = 1,
): CSSProperties => ({
  width: `min(${Math.min(getStageMaxWidth(depth, densityTokens, 860, stageWidthScale) + 12, Math.round(872 * stageWidthScale))}px, 100%)`,
  maxWidth: `${Math.min(getStageMaxWidth(depth, densityTokens, 860, stageWidthScale) + 12, Math.round(872 * stageWidthScale))}px`,
  position: "relative",
  zIndex: 1,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: `${Math.round(12 * densityTokens.sectionGap * depth.spacingScale * compositionSpacingScale)}px`,
  minWidth: 0,
});

const portfolioSidebarStyle = (
  _preview = false,
  panelGlow = "",
  surfaceBorder = "rgba(255,255,255,0.08)",
  surfaceBackground = "linear-gradient(180deg, rgba(10,14,22,0.98), rgba(8,10,16,0.98))",
  glassBackdrop = "blur(20px) saturate(128%)",
  shadowBoost = "0 24px 56px rgba(0,0,0,0.24)",
  densityTokens = getProfileDensityTokens("balanced"),
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
  gap: `${Math.round(11 * densityTokens.sectionGap * depth.spacingScale)}px`,
  padding: `${Math.round(15 * densityTokens.contentPadding)}px`,
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
  densityTokens = getProfileDensityTokens("balanced"),
  cornerTokens = getProfileCornerTokens("rounded"),
  depth = getProfileSceneAppearance({
    scene: "default",
    mood: "locked-in",
    aura: "none",
    themeColor: "#f472b6",
  }).depth,
): CSSProperties => ({
  display: "grid",
  gap: `${Math.round(11 * densityTokens.sectionGap * depth.spacingScale)}px`,
  padding: `${Math.round(15 * densityTokens.contentPadding)}px`,
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
  fontSize: `${Math.round(30 * densityTokens.bannerScale)}px`,
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
});

const portfolioBioStyle = (
  densityTokens = getProfileDensityTokens("balanced"),
): CSSProperties => ({
  margin: 0,
  color: "#cbd5e1",
  lineHeight: densityTokens.bioLineHeight,
  fontSize: "12px",
  whiteSpace: "pre-wrap",
});

const portfolioSectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "24px",
  lineHeight: 0.98,
  letterSpacing: "-0.05em",
};

const portfolioSectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.58,
  fontSize: "12px",
  maxWidth: "62ch",
};

const simpleKickerStyle = (themeColor: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  width: "fit-content",
  minHeight: "26px",
  padding: "0 9px",
  borderRadius: "999px",
  border: `1px solid ${withAlpha(themeColor, "24")}`,
  background: withAlpha(themeColor, "12"),
  color: "#f1f5f9",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.02em",
});

const eyebrowStyle = (themeColor: string): CSSProperties => ({
  display: "inline-flex",
  width: "fit-content",
  minHeight: "26px",
  alignItems: "center",
  padding: "0 9px",
  borderRadius: "999px",
  color: "#f9a8d4",
  background: withAlpha(themeColor, "12"),
  border: `1px solid ${withAlpha(themeColor, "24")}`,
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const presenceChipStyle = (
  background: string,
  borderColor: string,
  cornerTokens = getProfileCornerTokens("rounded"),
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties => ({
  width: "fit-content",
  minHeight: `${Math.max(24, Math.round(26 * dnaTuning.chipScale))}px`,
  padding: `0 ${Math.max(8, Math.round(9 * dnaTuning.chipScale))}px`,
  borderRadius: `${cornerTokens.chipRadius}px`,
  display: "inline-flex",
  alignItems: "center",
  color: "#f8fafc",
  background,
  border: `1px solid ${borderColor}`,
  boxShadow: `0 ${Math.round(10 * dnaTuning.shadowScale)}px ${Math.round(18 * dnaTuning.shadowScale)}px rgba(0,0,0,${clampNumber(0.14 * dnaTuning.shadowScale, 0.08, 0.24)})`,
  fontSize: `${Math.max(9, Math.round(10 * dnaTuning.chipScale))}px`,
  fontWeight: 800,
  letterSpacing: "0.02em",
});

const linkCardBaseStyle: CSSProperties = {
  textDecoration: "none",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "10px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  boxSizing: "border-box",
};

const defaultLinkCardStyle: CSSProperties = {
  padding: "11px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const simplisticLinkCardStyle: CSSProperties = {
  padding: "10px",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const portfolioLinkCardStyle: CSSProperties = {
  padding: "11px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.018))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const linkIconStyle: CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
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
  padding: "16px 14px",
  textAlign: "center",
  color: "#a1a1aa",
  background: "rgba(255,255,255,0.02)",
});
