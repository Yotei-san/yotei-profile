"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { LuCheck, LuLayoutTemplate, LuMusic4, LuSparkles } from "react-icons/lu";
import FormActionButton from "@/app/components/FormActionButton";
import { useI18n } from "@/app/components/I18nProvider";
import {
  DashboardSectionHeading,
  dashboardButtonStyle,
  dashboardFieldGridStyle,
  dashboardInputStyle,
  dashboardLabelStyle,
  dashboardMutedTextStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
  dashboardTextareaStyle,
} from "@/app/dashboard/components/DashboardUI";
import PublicProfileRenderer, {
  type PublicProfileBadgeEntry,
  type PublicProfileHeroPill,
  type PublicProfileRenderUser,
} from "@/app/[username]/PublicProfileRenderer";
import LivingProfileBackground from "@/app/[username]/LivingProfileBackground";
import ProfileMusicCard from "@/app/[username]/ProfileMusicCard";
import type { PublicProfileLayout } from "@/app/[username]/ProfileLayoutVariants";
import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
import {
  DEFAULT_PROFILE_COMPOSITION,
  PROFILE_BADGE_SEASONAL_THEME_OPTIONS,
  PROFILE_BADGE_SHOWCASE_MODE_OPTIONS,
  PROFILE_BADGE_STYLE_VARIANT_OPTIONS,
  PROFILE_COMPOSITION_ALIGNMENT_OPTIONS,
  PROFILE_COMPOSITION_DENSITY_OPTIONS,
  PROFILE_COMPOSITION_LINK_STYLE_OPTIONS,
  PROFILE_COMPOSITION_METADATA_PLACEMENT_OPTIONS,
  PROFILE_COMPOSITION_MODE_OPTIONS,
  PROFILE_NAME_TYPOGRAPHY_STYLE_OPTIONS,
  PROFILE_COMPOSITION_SOCIAL_STYLE_OPTIONS,
  type ProfileComposition,
  type ProfileCompositionBlock,
  type ProfileCompositionDensity,
  type ProfileCompositionLinksStyle,
  type ProfileCompositionMode,
  type ProfileCompositionSocialsStyle,
} from "@/app/lib/profile-composition";
import {
  MAX_PROFILE_CUSTOM_BLOCKS,
  PROFILE_CUSTOM_BLOCK_ALIGNMENT_OPTIONS,
  PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS,
  PROFILE_CUSTOM_BLOCK_WIDTH_OPTIONS,
  blockSupportsImage,
  blockSupportsLink,
  blockSupportsSecondaryText,
  createProfileCustomBlockDraft,
  getProfileCustomBlockTypeMeta,
  type ProfileCustomBlock,
  type ProfileCustomBlockType,
} from "@/app/lib/profile-custom-blocks";
import {
  PROFILE_DNA_OPTIONS,
  getProfileDnaTuning,
  type ProfileDnaType,
} from "@/app/lib/profile-dna";
import {
  PROFILE_PRESET_OPTIONS,
  applyProfilePresetToState,
  getProfilePresetDefinition,
  type ProfilePresetId,
} from "@/app/lib/profile-presets";
import {
  MAX_PROFILE_NAME_EFFECTS,
  PROFILE_BACKGROUND_INTENSITY_OPTIONS,
  PROFILE_BANNER_STYLE_OPTIONS,
  PROFILE_CARD_STYLE_OPTIONS,
  PROFILE_CORNER_STYLE_OPTIONS,
  PROFILE_DENSITY_OPTIONS,
  PROFILE_GLASS_INTENSITY_OPTIONS,
  PROFILE_INTRO_MODE_OPTIONS,
  PROFILE_MOTION_LEVEL_OPTIONS,
  PROFILE_NAME_EFFECT_OPTIONS,
  isNameEffectAvailable,
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
  normalizeProfileMusic,
  PROFILE_MUSIC_PROVIDERS,
  type ProfileMusicData,
  type ProfileMusicProvider,
} from "@/app/lib/profile-music";
import {
  PROFILE_AURA_OPTIONS,
  PROFILE_MOOD_OPTIONS,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import {
  getProfileSceneAppearance,
  getProfileSceneOptions,
  type ProfileScene,
} from "@/app/lib/profile-scenes";
import {
  getAuraDescription,
  getAuraName,
  getCompositionBlockDescription,
  getCompositionBlockLabel,
  getCustomBlockSecondaryPlaceholder,
  getCustomBlockTextPlaceholder,
  getDnaAlignmentLabel,
  getDnaDescription,
  getDnaName,
  getHeroPillText,
  getMoodDescription,
  getMoodName,
  getNameEffectDescription,
  getNameEffectName,
  getNamedOption,
  getPresetDescription,
  getPresetName,
  getProfileLayoutDescription,
  getProfileLayoutName,
  getSceneDescription,
  getSceneName,
  getScenePreviewLabel,
  getStatusText,
} from "./profileEditorI18n";
import { saveProfileSettings } from "./actions";

const PROFILE_LAYOUT_OPTIONS = [
  {
    key: "default",
    name: "Default",
    description: "Top banner, featured avatar, and a clean premium list of links.",
  },
  {
    key: "modern",
    name: "Modern",
    description: "Cinematic premium styling with stronger contrast and presence.",
  },
  {
    key: "simplistic",
    name: "Simplistic",
    description: "Minimal structure focused on reading and quick scanning.",
  },
  {
    key: "portfolio",
    name: "Portfolio",
    description: "A more professional presentation for creators, devs, and projects.",
  },
] as const satisfies ReadonlyArray<{
  key: PublicProfileLayout;
  name: string;
  description: string;
}>;

type Props = {
  initialDisplayName: string;
  initialBio: string;
  initialThemeColor: string;
  savedLayout: PublicProfileLayout;
  savedMood: ProfileMood;
  savedAura: ProfileAura;
  savedScene: ProfileScene;
  savedNameEffects: ProfileNameEffect[];
  savedBackgroundIntensity: ProfileBackgroundIntensity;
  savedGlassIntensity: ProfileGlassIntensity;
  savedBannerStyle: ProfileBannerStyle;
  savedIntroMode: ProfileIntroMode;
  savedDensity: ProfileDensity;
  savedCardStyle: ProfileCardStyle;
  savedCornerStyle: ProfileCornerStyle;
  savedMotionLevel: ProfileMotionLevel;
  savedComposition: ProfileComposition;
  initialMusic: ProfileMusicData;
  previewUser: PublicProfileRenderUser;
  bannerKind: "image" | "video" | "unknown";
  avatarInitials: string;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  featuredBadges: PublicProfileBadgeEntry[];
  extraBadgeCount: number;
  allBadges: PublicProfileBadgeEntry[];
  heroPills: PublicProfileHeroPill[];
  likes: number;
  dislikes: number;
  views: number;
  initialCommentCount: number;
  canComment: boolean;
  isOwnProfile: boolean;
  socialBlocks: PublicSocialBlock[];
  hasPremiumAccess: boolean;
};

export default function ProfileLayoutExperience({
  initialDisplayName,
  initialBio,
  initialThemeColor,
  savedLayout,
  savedMood,
  savedAura,
  savedScene,
  savedNameEffects,
  savedBackgroundIntensity,
  savedGlassIntensity,
  savedBannerStyle,
  savedIntroMode,
  savedDensity,
  savedCardStyle,
  savedCornerStyle,
  savedMotionLevel,
  savedComposition,
  initialMusic,
  previewUser,
  bannerKind,
  avatarInitials,
  decorationScale,
  decorationOffsetX,
  decorationOffsetY,
  featuredBadges,
  extraBadgeCount,
  allBadges,
  heroPills,
  likes,
  dislikes,
  views,
  initialCommentCount,
  canComment,
  isOwnProfile,
  socialBlocks,
  hasPremiumAccess,
}: Props) {
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [themeColor, setThemeColor] = useState(initialThemeColor);
  const [previewLayout, setPreviewLayout] = useState<PublicProfileLayout>(savedLayout);
  const [previewMood, setPreviewMood] = useState<ProfileMood>(savedMood);
  const [previewAura, setPreviewAura] = useState<ProfileAura>(savedAura);
  const [previewScene, setPreviewScene] = useState<ProfileScene>(savedScene);
  const [previewNameEffects, setPreviewNameEffects] = useState<ProfileNameEffect[]>(
    savedNameEffects,
  );
  const [previewBackgroundIntensity, setPreviewBackgroundIntensity] =
    useState<ProfileBackgroundIntensity>(savedBackgroundIntensity);
  const [previewGlassIntensity, setPreviewGlassIntensity] =
    useState<ProfileGlassIntensity>(savedGlassIntensity);
  const [previewBannerStyle, setPreviewBannerStyle] =
    useState<ProfileBannerStyle>(savedBannerStyle);
  const [previewIntroMode, setPreviewIntroMode] =
    useState<ProfileIntroMode>(savedIntroMode);
  const [previewDensity, setPreviewDensity] = useState<ProfileDensity>(savedDensity);
  const [previewCardStyle, setPreviewCardStyle] = useState<ProfileCardStyle>(savedCardStyle);
  const [previewCornerStyle, setPreviewCornerStyle] =
    useState<ProfileCornerStyle>(savedCornerStyle);
  const [previewMotionLevel, setPreviewMotionLevel] =
    useState<ProfileMotionLevel>(savedMotionLevel);
  const [previewComposition, setPreviewComposition] =
    useState<ProfileComposition>(savedComposition || DEFAULT_PROFILE_COMPOSITION);
  const [profileMusicEnabled, setProfileMusicEnabled] = useState(initialMusic.enabled);
  const [profileMusicTitle, setProfileMusicTitle] = useState(initialMusic.title || "");
  const [profileMusicArtist, setProfileMusicArtist] = useState(initialMusic.artist || "");
  const [profileMusicUrl, setProfileMusicUrl] = useState(initialMusic.url || "");
  const [profileMusicProvider, setProfileMusicProvider] = useState<ProfileMusicProvider>(
    initialMusic.provider,
  );
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [previewViewportWidth, setPreviewViewportWidth] = useState(0);
  const sceneOptions = getProfileSceneOptions();
  const savedSceneName = getSceneName(
    t,
    savedScene,
    sceneOptions.find((option) => option.value === savedScene)?.name || "Default",
  );
  const savedPreset = savedComposition?.preset ?? null;
  const savedDna = savedComposition?.dna ?? null;

  const deferredDisplayName = useDeferredValue(displayName);
  const deferredBio = useDeferredValue(bio);
  const deferredThemeColor = useDeferredValue(themeColor);
  const deferredPreviewLayout = useDeferredValue(previewLayout);
  const deferredPreviewMood = useDeferredValue(previewMood);
  const deferredPreviewAura = useDeferredValue(previewAura);
  const deferredPreviewScene = useDeferredValue(previewScene);
  const deferredPreviewNameEffects = useDeferredValue(previewNameEffects);
  const deferredPreviewBackgroundIntensity = useDeferredValue(previewBackgroundIntensity);
  const deferredPreviewGlassIntensity = useDeferredValue(previewGlassIntensity);
  const deferredPreviewBannerStyle = useDeferredValue(previewBannerStyle);
  const deferredPreviewIntroMode = useDeferredValue(previewIntroMode);
  const deferredPreviewDensity = useDeferredValue(previewDensity);
  const deferredPreviewCardStyle = useDeferredValue(previewCardStyle);
  const deferredPreviewCornerStyle = useDeferredValue(previewCornerStyle);
  const deferredPreviewMotionLevel = useDeferredValue(previewMotionLevel);
  const deferredPreviewComposition = useDeferredValue(previewComposition);
  const deferredProfileMusicEnabled = useDeferredValue(profileMusicEnabled);
  const deferredProfileMusicTitle = useDeferredValue(profileMusicTitle);
  const deferredProfileMusicArtist = useDeferredValue(profileMusicArtist);
  const deferredProfileMusicUrl = useDeferredValue(profileMusicUrl);
  const deferredProfileMusicProvider = useDeferredValue(profileMusicProvider);
  const safeThemeColor = normalizeThemeColor(deferredThemeColor);
  const resolvedDisplayName =
    deferredDisplayName.trim() || previewUser.username;
  const resolvedBio = deferredBio.trim();
  const livePreviewUser = {
    ...previewUser,
    bio: resolvedBio || null,
  };
  const previewSceneAppearance = getProfileSceneAppearance({
    scene: deferredPreviewScene,
    mood: deferredPreviewMood,
    aura: deferredPreviewAura,
    themeColor: safeThemeColor,
  });
  const previewPresence = previewSceneAppearance.presence;
  const livePreviewMusic = normalizeProfileMusic({
    enabled: deferredProfileMusicEnabled,
    title: deferredProfileMusicTitle,
    artist: deferredProfileMusicArtist,
    url: deferredProfileMusicUrl,
    provider: deferredProfileMusicProvider,
  });
  const localizedHeroPills = heroPills.map((pill) => ({
    ...pill,
    text:
      pill.key === "status"
        ? getStatusText(t, pill.text.toLowerCase(), pill.text)
        : getHeroPillText(t, pill.key, pill.text),
  }));
  const previewCanvasWidth = getPreviewCanvasWidth(deferredPreviewLayout);
  const previewScale = getPreviewScale(previewViewportWidth, previewCanvasWidth);
  const isDirty =
    previewLayout !== savedLayout ||
    previewMood !== savedMood ||
    previewAura !== savedAura ||
    previewScene !== savedScene ||
    !areNameEffectsEqual(previewNameEffects, savedNameEffects) ||
    previewBackgroundIntensity !== savedBackgroundIntensity ||
    previewGlassIntensity !== savedGlassIntensity ||
    previewBannerStyle !== savedBannerStyle ||
    previewIntroMode !== savedIntroMode ||
    previewDensity !== savedDensity ||
    previewCardStyle !== savedCardStyle ||
    previewCornerStyle !== savedCornerStyle ||
    previewMotionLevel !== savedMotionLevel ||
    JSON.stringify(previewComposition) !== JSON.stringify(savedComposition) ||
    profileMusicEnabled !== initialMusic.enabled ||
    profileMusicTitle !== (initialMusic.title || "") ||
    profileMusicArtist !== (initialMusic.artist || "") ||
    profileMusicUrl !== (initialMusic.url || "") ||
    profileMusicProvider !== initialMusic.provider ||
    displayName !== initialDisplayName ||
    bio !== initialBio ||
    themeColor !== initialThemeColor;

  useEffect(() => {
    const viewportElement = previewViewportRef.current;

    if (!viewportElement) {
      return;
    }

    const updateWidth = () => {
      setPreviewViewportWidth(viewportElement.clientWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(viewportElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function toggleNameEffect(effect: ProfileNameEffect) {
    if (effect === "none") {
      setPreviewNameEffects([]);
      return;
    }

    if (!isNameEffectAvailable(effect, hasPremiumAccess)) {
      return;
    }

    setPreviewNameEffects((current) => {
      if (current.includes(effect)) {
        return current.filter((value) => value !== effect);
      }

      if (current.length >= MAX_PROFILE_NAME_EFFECTS) {
        return current;
      }

      return [...current, effect];
    });
  }

  function toggleCompositionVisibility(block: ProfileCompositionBlock) {
    const visibilityKey = getVisibilityKeyForBlock(block);

    if (!visibilityKey) {
      return;
    }

    setPreviewComposition((current) => ({
      ...current,
      visible: {
        ...current.visible,
        [visibilityKey]: !current.visible[visibilityKey],
      },
    }));
  }

  function moveCompositionBlock(
    block: ProfileCompositionBlock,
    direction: "up" | "down",
  ) {
    setPreviewComposition((current) => {
      if (block === "identity") {
        return current;
      }

      const currentIndex = current.order.indexOf(block);

      if (currentIndex === -1) {
        return current;
      }

      if (direction === "up" && currentIndex <= 1) {
        return current;
      }

      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= current.order.length) {
        return current;
      }

      const nextOrder = [...current.order];
      [nextOrder[currentIndex], nextOrder[nextIndex]] = [
        nextOrder[nextIndex],
        nextOrder[currentIndex],
      ];

      return {
        ...current,
        order: nextOrder,
      };
    });
  }

  function applyPreset(preset: ProfilePresetId | null) {
    if (!preset) {
      startTransition(() => {
        setPreviewComposition((current) => ({
          ...current,
          preset: null,
        }));
      });
      return;
    }

    const nextState = applyProfilePresetToState(preset, previewComposition);

    startTransition(() => {
      setPreviewMood(nextState.mood);
      setPreviewAura(nextState.aura);
      setPreviewScene(nextState.scene);
      setPreviewBackgroundIntensity(nextState.backgroundIntensity);
      setPreviewGlassIntensity(nextState.glassIntensity);
      setPreviewBannerStyle(nextState.bannerStyle);
      setPreviewIntroMode(nextState.introMode);
      setPreviewDensity(nextState.density);
      setPreviewCardStyle(nextState.cardStyle);
      setPreviewCornerStyle(nextState.cornerStyle);
      setPreviewMotionLevel(nextState.motionLevel);
      setPreviewComposition(nextState.composition);
    });
  }

  function applyDna(dna: ProfileDnaType | null) {
    startTransition(() => {
      setPreviewComposition((current) => ({
        ...current,
        dna,
      }));
    });
  }

  function addCustomBlock(type: ProfileCustomBlockType) {
    setPreviewComposition((current) => {
      if (current.customBlocks.length >= MAX_PROFILE_CUSTOM_BLOCKS) {
        return current;
      }

      return {
        ...current,
        customBlocks: [
          ...current.customBlocks,
          createProfileCustomBlockDraft(type, createCustomBlockId()),
        ],
      };
    });
  }

  function updateCustomBlock(
    blockId: string,
    updater: (block: ProfileCustomBlock) => ProfileCustomBlock,
  ) {
    setPreviewComposition((current) => ({
      ...current,
      customBlocks: current.customBlocks.map((block) =>
        block.id === blockId ? updater(block) : block,
      ),
    }));
  }

  function removeCustomBlock(blockId: string) {
    setPreviewComposition((current) => ({
      ...current,
      customBlocks: current.customBlocks.filter((block) => block.id !== blockId),
    }));
  }

  function moveCustomBlock(blockId: string, direction: "up" | "down") {
    setPreviewComposition((current) => {
      const index = current.customBlocks.findIndex((block) => block.id === blockId);

      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.customBlocks.length) {
        return current;
      }

      const nextBlocks = [...current.customBlocks];
      [nextBlocks[index], nextBlocks[targetIndex]] = [
        nextBlocks[targetIndex],
        nextBlocks[index],
      ];

      return {
        ...current,
        customBlocks: nextBlocks,
      };
    });
  }

  function toggleFavoriteBadge(badgeSlug: string) {
    setPreviewComposition((current) => {
      const favoriteBadgeSlugs = current.metadata.favoriteBadgeSlugs.includes(badgeSlug)
        ? current.metadata.favoriteBadgeSlugs.filter((slug) => slug !== badgeSlug)
        : [...current.metadata.favoriteBadgeSlugs, badgeSlug].slice(0, 4);

      return {
        ...current,
        metadata: {
          ...current.metadata,
          favoriteBadgeSlugs,
        },
      };
    });
  }

  return (
    <>
      <section className="profile-editor-grid" style={editorGridBaseStyle}>
        <form action={saveProfileSettings} style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow={t("dashboard.profile.editor.core.eyebrow")}
            title={t("dashboard.profile.editor.core.title")}
            description={t("dashboard.profile.editor.core.description")}
          />

          <div style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              {t("dashboard.profile.editor.fields.displayName.label")}
              <input
                type="text"
                name="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={t("dashboard.profile.editor.fields.displayName.placeholder")}
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              {t("dashboard.profile.editor.fields.bio.label")}
              <textarea
                name="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder={t("dashboard.profile.editor.fields.bio.placeholder")}
                rows={5}
                style={dashboardTextareaStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              {t("dashboard.profile.editor.fields.location.label")}
              <input
                type="text"
                value={previewComposition.metadata.locationText}
                onChange={(event) =>
                  setPreviewComposition((current) => ({
                    ...current,
                    metadata: {
                      ...current.metadata,
                      locationText: event.target.value.slice(0, 80),
                    },
                  }))
                }
                placeholder={t("dashboard.profile.editor.fields.location.placeholder")}
                style={dashboardInputStyle}
              />
              <span style={dashboardMutedTextStyle}>
                {t("dashboard.profile.editor.fields.location.helper")}
              </span>
            </label>

            <label style={dashboardLabelStyle}>
              {t("dashboard.profile.editor.fields.themeColor.label")}
              <input
                type="text"
                name="themeColor"
                value={themeColor}
                onChange={(event) => setThemeColor(event.target.value)}
                placeholder="#f472b6"
                style={dashboardInputStyle}
              />
              <span style={dashboardMutedTextStyle}>
                {t("dashboard.profile.editor.fields.themeColor.helper")}
              </span>
            </label>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.identityEffects.eyebrow")}
                title={t("dashboard.profile.editor.identityEffects.title")}
                description={t("dashboard.profile.editor.identityEffects.description")}
              />

              {previewNameEffects.length === 0 ? (
                <input type="hidden" name="profileNameEffects" value="none" readOnly />
              ) : (
                previewNameEffects.map((effect) => (
                  <input
                    key={effect}
                    type="hidden"
                    name="profileNameEffects"
                    value={effect}
                    readOnly
                  />
                ))
              )}

              <div style={effectsGridStyle}>
                {PROFILE_NAME_EFFECT_OPTIONS.map((effectOption) => {
                  const isSelected =
                    effectOption.value === "none"
                      ? previewNameEffects.length === 0
                      : previewNameEffects.includes(effectOption.value);
                  const isSaved =
                    effectOption.value === "none"
                      ? savedNameEffects.length === 0
                      : savedNameEffects.includes(effectOption.value);
                  const isLocked =
                    effectOption.premium &&
                    !isNameEffectAvailable(effectOption.value, hasPremiumAccess);
                  const selectionCapReached =
                    !isSelected &&
                    effectOption.value !== "none" &&
                    previewNameEffects.length >= MAX_PROFILE_NAME_EFFECTS;

                  return (
                    <button
                      key={effectOption.value}
                      type="button"
                      className="living-card"
                      aria-pressed={isSelected}
                      onClick={() => toggleNameEffect(effectOption.value)}
                      disabled={isLocked}
                      style={effectCardStyle(
                        isSelected,
                        isSaved,
                        isLocked,
                        selectionCapReached,
                        safeThemeColor,
                      )}
                    >
                      <div style={effectCardTopStyle}>
                        <span style={effectEffectTagStyle(effectOption.premium, safeThemeColor)}>
                          {effectOption.premium
                            ? t("dashboard.profile.badges.premium")
                            : t("dashboard.profile.badges.free")}
                        </span>
                        {isSelected ? (
                          <span style={selectedIndicatorStyle(safeThemeColor)}>
                            {t("dashboard.profile.state.active")}
                          </span>
                        ) : isSaved ? (
                          <span style={savedIndicatorStyle}>
                            {t("dashboard.profile.state.saved")}
                          </span>
                        ) : null}
                      </div>

                      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                        <div style={livingCardHeaderStyle}>
                          <span>
                            {getNameEffectName(t, effectOption.value, effectOption.name)}
                          </span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>
                          {getNameEffectDescription(
                            t,
                            effectOption.value,
                            effectOption.description,
                          )}
                        </div>
                        {selectionCapReached && !isLocked ? (
                          <div style={dashboardMutedTextStyle}>
                            {t("dashboard.profile.editor.identityEffects.selectionCap")}
                          </div>
                        ) : isLocked ? (
                          <div style={dashboardMutedTextStyle}>
                            {t("dashboard.profile.editor.identityEffects.requiresPremium")}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={dashboardMutedTextStyle}>
                {hasPremiumAccess
                  ? t("dashboard.profile.editor.identityEffects.premiumHelper")
                  : t("dashboard.profile.editor.identityEffects.freeHelper")}
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.layout.eyebrow")}
                title={t("dashboard.profile.editor.layout.title")}
                description={t("dashboard.profile.editor.layout.description")}
              />

              <input type="hidden" name="profileLayout" value={previewLayout} readOnly />

              <div style={layoutGridStyle}>
                {PROFILE_LAYOUT_OPTIONS.map((layout) => {
                  const isSelected = previewLayout === layout.key;
                  const isSaved = savedLayout === layout.key;
                  const indicatorLabel = isSelected
                    ? isSaved
                      ? t("dashboard.profile.state.current")
                      : t("dashboard.profile.state.previewing")
                    : isSaved
                      ? t("dashboard.profile.state.saved")
                      : null;

                  return (
                    <button
                      key={layout.key}
                      type="button"
                      className="layout-card"
                      aria-pressed={isSelected}
                      onClick={() => {
                        startTransition(() => setPreviewLayout(layout.key));
                      }}
                      style={layoutCardStyle(isSelected, isSaved, safeThemeColor)}
                    >
                      <div style={layoutCardTopStyle}>
                        <div style={layoutSwatchStyle(layout.key, safeThemeColor)} />
                        <div style={layoutIndicatorRowStyle}>
                          {indicatorLabel ? (
                            <span
                              style={
                                isSelected
                                  ? selectedIndicatorStyle(safeThemeColor)
                                  : savedIndicatorStyle
                              }
                            >
                              {indicatorLabel}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                        <div style={layoutCardHeaderStyle}>
                          <span>{getProfileLayoutName(t, layout.key, layout.name)}</span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>
                          {getProfileLayoutDescription(t, layout.key, layout.description)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.livingProfile.eyebrow")}
                title={t("dashboard.profile.editor.livingProfile.title")}
                description={t("dashboard.profile.editor.livingProfile.description")}
              />

              <input type="hidden" name="profileMood" value={previewMood} readOnly />
              <input type="hidden" name="profileAura" value={previewAura} readOnly />
              <input type="hidden" name="profileScene" value={previewScene} readOnly />

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.livingProfile.mood")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_MOOD_OPTIONS.map((option) => {
                    const isSelected = previewMood === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => {
                          startTransition(() => setPreviewMood(option.value));
                        }}
                        style={livingCardStyle(isSelected, option.primary)}
                      >
                        <div style={livingPreviewStyle(option.primary, option.secondary, option.pulse)}>
                          <div style={livingPreviewPulseStyle(option.pulse)} />
                          <div style={livingPreviewLineStyle(option.tertiary, "68%")} />
                          <div style={livingPreviewLineStyle(option.secondary, "48%")} />
                        </div>
                        <div style={{ display: "grid", gap: "6px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>{getMoodName(t, option.value, option.name)}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getMoodDescription(t, option.value, option.description)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.livingProfile.aura")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_AURA_OPTIONS.map((option) => {
                    const isSelected = previewAura === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => {
                          startTransition(() => setPreviewAura(option.value));
                        }}
                        style={livingCardStyle(isSelected, option.accent)}
                      >
                        <div style={auraPreviewStyle(option.overlay, option.glow, option.ring)} />
                        <div style={{ display: "grid", gap: "6px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>{getAuraName(t, option.value, option.name)}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getAuraDescription(t, option.value, option.description)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.livingProfile.scene")}
                </div>
                <div style={sceneGridStyle}>
                  {sceneOptions.map((sceneOption) => {
                    const isSelected = previewScene === sceneOption.value;
                    const isSaved = savedScene === sceneOption.value;
                    const indicatorLabel = isSelected
                      ? isSaved
                        ? t("dashboard.profile.state.current")
                        : t("dashboard.profile.state.previewing")
                      : isSaved
                        ? t("dashboard.profile.state.saved")
                        : t("dashboard.profile.editor.livingProfile.sceneTag");

                    return (
                      <button
                        key={sceneOption.value}
                        type="button"
                        className="scene-card"
                        aria-pressed={isSelected}
                        onClick={() => {
                          startTransition(() => setPreviewScene(sceneOption.value));
                        }}
                        style={sceneCardStyle(
                          isSelected,
                          isSaved,
                          sceneOption.accent,
                          sceneOption.contrast,
                        )}
                      >
                        <div style={scenePreviewStyle(sceneOption.accent, sceneOption.contrast)}>
                          <LivingProfileBackground
                            mood={previewMood}
                            aura={previewAura}
                            themeColor={safeThemeColor}
                            scene={sceneOption.value}
                            previewMode
                          />
                          <div style={scenePreviewChromeStyle(sceneOption.accent)}>
                            <span style={scenePreviewBadgeStyle(sceneOption.accent)}>
                              {getScenePreviewLabel(
                                t,
                                sceneOption.value,
                                sceneOption.previewLabel,
                              )}
                            </span>
                            <div style={scenePreviewFrameStyle(sceneOption.accent)} />
                          </div>
                        </div>

                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={layoutIndicatorRowStyle}>
                            <span
                              style={
                                isSelected
                                  ? selectedIndicatorStyle(sceneOption.accent)
                                  : savedIndicatorStyle
                              }
                            >
                              {indicatorLabel}
                            </span>
                          </div>
                          <div style={livingCardHeaderStyle}>
                            <span>{getSceneName(t, sceneOption.value, sceneOption.name)}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getSceneDescription(
                              t,
                              sceneOption.value,
                              sceneOption.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.preset.eyebrow")}
                title={t("dashboard.profile.editor.preset.title")}
                description={t("dashboard.profile.editor.preset.description")}
              />

              <div style={livingGridStyle}>
                <button
                  type="button"
                  className="living-card"
                  aria-pressed={previewComposition.preset == null}
                  onClick={() => applyPreset(null)}
                  style={atmosphereCardStyle(
                    previewComposition.preset == null,
                    savedPreset == null,
                    safeThemeColor,
                  )}
                >
                  <div style={presetPreviewStyle("custom", safeThemeColor)} />
                  <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                    <div style={livingCardHeaderStyle}>
                      <span>{t("dashboard.profile.editor.shared.custom")}</span>
                      {previewComposition.preset == null ? <LuCheck size={16} /> : null}
                    </div>
                    <div style={layoutCardDescriptionStyle}>
                      {t("dashboard.profile.editor.preset.customDescription")}
                    </div>
                    <div style={presetMetaRowStyle}>
                      <span style={presetMetaBadgeStyle("rgba(255,255,255,0.08)")}>
                        {t("dashboard.profile.editor.shared.manual")}
                      </span>
                    </div>
                  </div>
                </button>

                {PROFILE_PRESET_OPTIONS.map((preset) => {
                  const isSelected = previewComposition.preset === preset.value;
                  const isSaved = savedPreset === preset.value;

                  return (
                    <button
                      key={preset.value}
                      type="button"
                      className="living-card"
                      aria-pressed={isSelected}
                      onClick={() => applyPreset(preset.value)}
                      style={atmosphereCardStyle(isSelected, isSaved, preset.accent)}
                    >
                      <div style={presetPreviewStyle(preset.value, preset.accent)} />
                      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                        <div style={livingCardHeaderStyle}>
                          <span>{getPresetName(t, preset.value, preset.name)}</span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>
                          {getPresetDescription(t, preset.value, preset.description)}
                        </div>
                        <div style={presetMetaRowStyle}>
                          <span style={presetMetaBadgeStyle(withAlpha(preset.accent, "1a"))}>
                            {getNamedOption(
                              t,
                              "compositionMode",
                              preset.mode,
                              "name",
                              preset.mode,
                            )}
                          </span>
                          <span style={presetMetaBadgeStyle("rgba(255,255,255,0.08)")}>
                            {t("dashboard.profile.editor.preset.introBadge", {
                              intro: getNamedOption(
                                t,
                                "introMode",
                                preset.introMode,
                                "name",
                                preset.introMode,
                              ),
                            })}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.dna.eyebrow")}
                title={t("dashboard.profile.editor.dna.title")}
                description={t("dashboard.profile.editor.dna.description")}
              />

              <div style={livingGridStyle}>
                <button
                  type="button"
                  className="living-card"
                  aria-pressed={previewComposition.dna == null}
                  onClick={() => applyDna(null)}
                  style={atmosphereCardStyle(
                    previewComposition.dna == null,
                    savedDna == null,
                    safeThemeColor,
                  )}
                >
                  <div style={presetPreviewStyle("custom", safeThemeColor)} />
                  <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                    <div style={livingCardHeaderStyle}>
                      <span>{t("dashboard.profile.editor.shared.custom")}</span>
                      {previewComposition.dna == null ? <LuCheck size={16} /> : null}
                    </div>
                    <div style={layoutCardDescriptionStyle}>
                      {t("dashboard.profile.editor.dna.customDescription")}
                    </div>
                    <div style={presetMetaRowStyle}>
                      <span style={presetMetaBadgeStyle("rgba(255,255,255,0.08)")}>
                        {t("dashboard.profile.editor.shared.manual")}
                      </span>
                    </div>
                  </div>
                </button>

                {PROFILE_DNA_OPTIONS.map((dna) => {
                  const isSelected = previewComposition.dna === dna.value;
                  const isSaved = savedDna === dna.value;
                  const tuning = getProfileDnaTuning(dna.value);

                  return (
                    <button
                      key={dna.value}
                      type="button"
                      className="living-card"
                      aria-pressed={isSelected}
                      onClick={() => applyDna(dna.value)}
                      style={atmosphereCardStyle(isSelected, isSaved, dna.accent)}
                    >
                      <div style={presetPreviewStyle(dna.value ?? "custom", dna.accent)} />
                      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                        <div style={livingCardHeaderStyle}>
                          <span>{getDnaName(t, dna.value, dna.name)}</span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>
                          {getDnaDescription(t, dna.value, dna.description)}
                        </div>
                        <div style={presetMetaRowStyle}>
                          <span style={presetMetaBadgeStyle(withAlpha(dna.accent, "1a"))}>
                            {getDnaAlignmentLabel(t, tuning.alignment, tuning.alignment)}
                          </span>
                          <span style={presetMetaBadgeStyle("rgba(255,255,255,0.08)")}>
                            {t("dashboard.profile.editor.dna.floatBadge", {
                              amount: Math.round(tuning.floatingIntensity * 100),
                            })}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.atmosphere.eyebrow")}
                title={t("dashboard.profile.editor.atmosphere.title")}
                description={t("dashboard.profile.editor.atmosphere.description")}
              />

              <input
                type="hidden"
                name="profileBackgroundIntensity"
                value={previewBackgroundIntensity}
                readOnly
              />
              <input
                type="hidden"
                name="profileGlassIntensity"
                value={previewGlassIntensity}
                readOnly
              />
              <input
                type="hidden"
                name="profileBannerStyle"
                value={previewBannerStyle}
                readOnly
              />
              <input type="hidden" name="profileIntroMode" value={previewIntroMode} readOnly />
              <input type="hidden" name="profileDensity" value={previewDensity} readOnly />
              <input type="hidden" name="profileCardStyle" value={previewCardStyle} readOnly />
              <input type="hidden" name="profileCornerStyle" value={previewCornerStyle} readOnly />
              <input type="hidden" name="profileMotionLevel" value={previewMotionLevel} readOnly />
              <input
                type="hidden"
                name="profileComposition"
                value={JSON.stringify(previewComposition)}
                readOnly
              />

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.atmosphere.introMode")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_INTRO_MODE_OPTIONS.map((option) => {
                    const isSelected = previewIntroMode === option.value;
                    const isSaved = savedIntroMode === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => setPreviewIntroMode(option.value)}
                        style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                      >
                        <div style={introModePreviewStyle(option.value, safeThemeColor)} />
                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>
                              {getNamedOption(
                                t,
                                "introMode",
                                option.value,
                                "name",
                                option.name,
                              )}
                            </span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getNamedOption(
                              t,
                              "introMode",
                              option.value,
                              "description",
                              option.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.atmosphere.backgroundIntensity")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_BACKGROUND_INTENSITY_OPTIONS.map((option) => {
                    const isSelected = previewBackgroundIntensity === option.value;
                    const isSaved = savedBackgroundIntensity === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => setPreviewBackgroundIntensity(option.value)}
                        style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                      >
                        <div style={atmospherePreviewStyle(option.value, safeThemeColor)} />
                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>
                              {getNamedOption(
                                t,
                                "backgroundIntensity",
                                option.value,
                                "name",
                                option.name,
                              )}
                            </span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getNamedOption(
                              t,
                              "backgroundIntensity",
                              option.value,
                              "description",
                              option.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.atmosphere.glassIntensity")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_GLASS_INTENSITY_OPTIONS.map((option) => {
                    const isSelected = previewGlassIntensity === option.value;
                    const isSaved = savedGlassIntensity === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => setPreviewGlassIntensity(option.value)}
                        style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                      >
                        <div style={glassPreviewStyle(option.value, safeThemeColor)} />
                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>
                              {getNamedOption(
                                t,
                                "glassIntensity",
                                option.value,
                                "name",
                                option.name,
                              )}
                            </span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getNamedOption(
                              t,
                              "glassIntensity",
                              option.value,
                              "description",
                              option.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.atmosphere.bannerStyle")}
                </div>
                <div style={livingGridStyle}>
                  {PROFILE_BANNER_STYLE_OPTIONS.map((option) => {
                    const isSelected = previewBannerStyle === option.value;
                    const isSaved = savedBannerStyle === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        aria-pressed={isSelected}
                        onClick={() => setPreviewBannerStyle(option.value)}
                        style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                      >
                        <div style={bannerPreviewStyle(option.value, safeThemeColor)} />
                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>
                              {getNamedOption(
                                t,
                                "bannerStyle",
                                option.value,
                                "name",
                                option.name,
                              )}
                            </span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getNamedOption(
                              t,
                              "bannerStyle",
                              option.value,
                              "description",
                              option.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                <DashboardSectionHeading
                  eyebrow={t("dashboard.profile.editor.creator.eyebrow")}
                  title={t("dashboard.profile.editor.creator.title")}
                  description={t("dashboard.profile.editor.creator.description")}
                />

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={livingSectionTitleStyle}>
                    {t("dashboard.profile.editor.creator.density")}
                  </div>
                  <div style={livingGridStyle}>
                    {PROFILE_DENSITY_OPTIONS.map((option) => {
                      const isSelected = previewDensity === option.value;
                      const isSaved = savedDensity === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="living-card"
                          aria-pressed={isSelected}
                          onClick={() => setPreviewDensity(option.value)}
                          style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                        >
                          <div style={densityPreviewStyle(option.value, safeThemeColor)} />
                          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                            <div style={livingCardHeaderStyle}>
                              <span>
                                {getNamedOption(t, "density", option.value, "name", option.name)}
                              </span>
                              {isSelected ? <LuCheck size={16} /> : null}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "density",
                                option.value,
                                "description",
                                option.description,
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={livingSectionTitleStyle}>
                    {t("dashboard.profile.editor.creator.cardStyle")}
                  </div>
                  <div style={livingGridStyle}>
                    {PROFILE_CARD_STYLE_OPTIONS.map((option) => {
                      const isSelected = previewCardStyle === option.value;
                      const isSaved = savedCardStyle === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="living-card"
                          aria-pressed={isSelected}
                          onClick={() => setPreviewCardStyle(option.value)}
                          style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                        >
                          <div style={cardStylePreviewStyle(option.value, safeThemeColor)} />
                          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                            <div style={livingCardHeaderStyle}>
                              <span>
                                {getNamedOption(t, "cardStyle", option.value, "name", option.name)}
                              </span>
                              {isSelected ? <LuCheck size={16} /> : null}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "cardStyle",
                                option.value,
                                "description",
                                option.description,
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={livingSectionTitleStyle}>
                    {t("dashboard.profile.editor.creator.cornerStyle")}
                  </div>
                  <div style={livingGridStyle}>
                    {PROFILE_CORNER_STYLE_OPTIONS.map((option) => {
                      const isSelected = previewCornerStyle === option.value;
                      const isSaved = savedCornerStyle === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="living-card"
                          aria-pressed={isSelected}
                          onClick={() => setPreviewCornerStyle(option.value)}
                          style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                        >
                          <div style={cornerPreviewStyle(option.value, safeThemeColor)} />
                          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                            <div style={livingCardHeaderStyle}>
                              <span>
                                {getNamedOption(
                                  t,
                                  "cornerStyle",
                                  option.value,
                                  "name",
                                  option.name,
                                )}
                              </span>
                              {isSelected ? <LuCheck size={16} /> : null}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "cornerStyle",
                                option.value,
                                "description",
                                option.description,
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={livingSectionTitleStyle}>
                    {t("dashboard.profile.editor.creator.motionLevel")}
                  </div>
                  <div style={livingGridStyle}>
                    {PROFILE_MOTION_LEVEL_OPTIONS.map((option) => {
                      const isSelected = previewMotionLevel === option.value;
                      const isSaved = savedMotionLevel === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="living-card"
                          aria-pressed={isSelected}
                          onClick={() => setPreviewMotionLevel(option.value)}
                          style={atmosphereCardStyle(isSelected, isSaved, safeThemeColor)}
                        >
                          <div style={motionPreviewStyle(option.value, safeThemeColor)} />
                          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                            <div style={livingCardHeaderStyle}>
                              <span>
                                {getNamedOption(
                                  t,
                                  "motionLevel",
                                  option.value,
                                  "name",
                                  option.name,
                                )}
                              </span>
                              {isSelected ? <LuCheck size={16} /> : null}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "motionLevel",
                                option.value,
                                "description",
                                option.description,
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={comingSoonCardStyle}>
                <div style={comingSoonBadgeStyle}>
                  <LuSparkles size={13} />
                  {t("dashboard.profile.editor.props.badge")}
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={comingSoonTitleStyle}>
                    {t("dashboard.profile.editor.props.title")}
                  </div>
                  <div style={layoutCardDescriptionStyle}>
                    {t("dashboard.profile.editor.props.description")}
                  </div>
                </div>
                <div style={comingSoonTagsStyle}>
                  {[
                    t("dashboard.profile.editor.props.tags.polaroids"),
                    t("dashboard.profile.editor.props.tags.stickers"),
                    t("dashboard.profile.editor.props.tags.floatingIcons"),
                    t("dashboard.profile.editor.props.tags.roomObjects"),
                  ].map((item) => (
                    <span key={item} style={savedIndicatorStyle}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={compositionSectionStyle}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.composition.eyebrow")}
                title={t("dashboard.profile.editor.composition.title")}
                description={t("dashboard.profile.editor.composition.description")}
              />

              <div style={compositionControlsGridStyle}>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={livingSectionTitleStyle}>
                    {t("dashboard.profile.editor.composition.mode")}
                  </div>
                  <div style={compositionChoiceGridStyle}>
                    {PROFILE_COMPOSITION_MODE_OPTIONS.map((option) => {
                      const isSelected = previewComposition.mode === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="living-card"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setPreviewComposition((current) => ({
                              ...current,
                              mode: option.value,
                            }))
                          }
                          style={livingCardStyle(isSelected, previewPresence.accent)}
                        >
                          <div style={compositionModePreviewStyle(option.value, previewPresence.accent)} />
                          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                            <div style={livingCardHeaderStyle}>
                              <span>
                                {getNamedOption(
                                  t,
                                  "compositionMode",
                                  option.value,
                                  "name",
                                  option.name,
                                )}
                              </span>
                              {isSelected ? <LuCheck size={16} /> : null}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "compositionMode",
                                option.value,
                                "description",
                                option.description,
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={compositionRowsStyle}>
                    {previewComposition.order.map((block, index) => {
                      const isIdentity = block === "identity";
                      const visibilityKey = getVisibilityKeyForBlock(block);
                      const canMoveUp = !isIdentity && index > 1;
                      const canMoveDown =
                        !isIdentity && index < previewComposition.order.length - 1;
                      const isVisible =
                        visibilityKey == null
                          ? true
                          : previewComposition.visible[visibilityKey];

                      return (
                        <div
                          key={block}
                          style={compositionRowStyle(
                            isVisible,
                            previewPresence.accent,
                            isIdentity,
                          )}
                        >
                          <div style={compositionRowCopyStyle}>
                            <div style={compositionRowTitleStyle}>
                              {getCompositionBlockLabel(
                                t,
                                block,
                                getDefaultCompositionBlockLabel(block),
                              )}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getCompositionBlockDescription(
                                t,
                                block,
                                getDefaultCompositionBlockDescription(block),
                              )}
                            </div>
                          </div>

                          <div style={compositionRowActionsStyle}>
                            <button
                              type="button"
                              onClick={() => moveCompositionBlock(block, "up")}
                              disabled={!canMoveUp}
                              style={compositionMoveButtonStyle(canMoveUp)}
                            >
                              {t("dashboard.profile.editor.shared.up")}
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCompositionBlock(block, "down")}
                              disabled={!canMoveDown}
                              style={compositionMoveButtonStyle(canMoveDown)}
                            >
                              {t("dashboard.profile.editor.shared.down")}
                            </button>
                            <label
                              style={compositionToggleStyle(
                                isVisible,
                                previewPresence.accent,
                                isIdentity,
                              )}
                            >
                              <span>
                                {isIdentity
                                  ? t("dashboard.profile.editor.composition.alwaysOn")
                                  : isVisible
                                    ? t("dashboard.profile.editor.shared.visible")
                                    : t("dashboard.profile.editor.shared.hidden")}
                              </span>
                              <input
                                type="checkbox"
                                checked={isVisible}
                                disabled={isIdentity}
                                onChange={() => toggleCompositionVisibility(block)}
                                style={musicCheckboxStyle}
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                <div style={compositionOptionGridStyle}>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.widgetDensity")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_COMPOSITION_DENSITY_OPTIONS.map((option) => {
                          const isSelected = previewComposition.density === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  density: option.value,
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "compositionDensity",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "compositionDensity",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.sectionAlignment")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_COMPOSITION_ALIGNMENT_OPTIONS.map((option) => {
                          const isSelected = previewComposition.alignment === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  alignment: option.value,
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "compositionAlignment",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "compositionAlignment",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.nameTypography")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_NAME_TYPOGRAPHY_STYLE_OPTIONS.map((option) => {
                          const isSelected =
                            previewComposition.metadata.nameTypography === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  metadata: {
                                    ...current.metadata,
                                    nameTypography: option.value,
                                  },
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "nameTypography",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "nameTypography",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.linkDisplay")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_COMPOSITION_LINK_STYLE_OPTIONS.map((option) => {
                          const isSelected = previewComposition.linksStyle === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  linksStyle: option.value,
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "compositionLinkStyle",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "compositionLinkStyle",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.socialDisplay")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_COMPOSITION_SOCIAL_STYLE_OPTIONS.map((option) => {
                          const isSelected = previewComposition.socialsStyle === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  socialsStyle: option.value,
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "compositionSocialStyle",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "compositionSocialStyle",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.metadataPlacement")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_COMPOSITION_METADATA_PLACEMENT_OPTIONS.map((option) => {
                          const isSelected =
                            previewComposition.metadata.placement === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  metadata: {
                                    ...current.metadata,
                                    placement: option.value,
                                  },
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "metadataPlacement",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "metadataPlacement",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.identityBadges")}
                      </div>
                      <label
                        style={compositionToggleStyle(
                          previewComposition.metadata.showBadges,
                          previewPresence.accent,
                          false,
                        )}
                      >
                        <span>
                          {previewComposition.metadata.showBadges
                            ? t("dashboard.profile.editor.composition.visibleNearName")
                            : t("dashboard.profile.editor.shared.hidden")}
                        </span>
                        <input
                          type="checkbox"
                          checked={previewComposition.metadata.showBadges}
                          onChange={() =>
                            setPreviewComposition((current) => ({
                              ...current,
                              metadata: {
                                ...current.metadata,
                                showBadges: !current.metadata.showBadges,
                              },
                            }))
                          }
                          style={musicCheckboxStyle}
                        />
                      </label>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.badgeShowcaseMode")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_BADGE_SHOWCASE_MODE_OPTIONS.map((option) => {
                          const isSelected = previewComposition.metadata.badgeMode === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  metadata: {
                                    ...current.metadata,
                                    badgeMode: option.value,
                                  },
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "badgeShowcaseMode",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "badgeShowcaseMode",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.badgeGlow")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_BADGE_STYLE_VARIANT_OPTIONS.map((option) => {
                          const isSelected =
                            previewComposition.metadata.badgeStyle === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  metadata: {
                                    ...current.metadata,
                                    badgeStyle: option.value,
                                  },
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "badgeStyle",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "badgeStyle",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.seasonalBadgeHook")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {PROFILE_BADGE_SEASONAL_THEME_OPTIONS.map((option) => {
                          const isSelected =
                            previewComposition.metadata.badgeSeason === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className="living-card"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setPreviewComposition((current) => ({
                                  ...current,
                                  metadata: {
                                    ...current.metadata,
                                    badgeSeason: option.value,
                                  },
                                }))
                              }
                              style={livingCardStyle(isSelected, previewPresence.accent)}
                            >
                              <div style={livingCardHeaderStyle}>
                                <span>
                                  {getNamedOption(
                                    t,
                                    "badgeSeason",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </span>
                                {isSelected ? <LuCheck size={16} /> : null}
                              </div>
                              <div style={layoutCardDescriptionStyle}>
                                {getNamedOption(
                                  t,
                                  "badgeSeason",
                                  option.value,
                                  "description",
                                  option.description,
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={livingSectionTitleStyle}>
                        {t("dashboard.profile.editor.composition.favoriteBadges")}
                      </div>
                      <div style={compositionChoiceGridStyle}>
                        {allBadges.length === 0 ? (
                          <div style={emptyCustomBlocksStyle}>
                            {t("dashboard.profile.editor.composition.noBadges")}
                          </div>
                        ) : (
                          allBadges.map((badgeEntry) => {
                            const isSelected =
                              previewComposition.metadata.favoriteBadgeSlugs.includes(
                                badgeEntry.badge.slug,
                              );

                            return (
                              <button
                                key={badgeEntry.id}
                                type="button"
                                className="living-card"
                                aria-pressed={isSelected}
                                onClick={() => toggleFavoriteBadge(badgeEntry.badge.slug)}
                                style={livingCardStyle(isSelected, badgeEntry.badge.color || previewPresence.accent)}
                              >
                                <div style={livingCardHeaderStyle}>
                                  <span>{badgeEntry.badge.name}</span>
                                  {isSelected ? <LuCheck size={16} /> : null}
                                </div>
                                <div style={layoutCardDescriptionStyle}>
                                  {t("dashboard.profile.editor.composition.badgeRarity", {
                                    rarity: badgeEntry.badge.rarity || "common",
                                  })}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                      <div style={dashboardMutedTextStyle}>
                        {t("dashboard.profile.editor.composition.favoriteBadgesHelper")}
                      </div>
                    </div>
                </div>
              </div>
            </div>

            <div style={compositionSectionStyle}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.customBlocks.eyebrow")}
                title={t("dashboard.profile.editor.customBlocks.title")}
                description={t("dashboard.profile.editor.customBlocks.description")}
              />

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>
                  {t("dashboard.profile.editor.customBlocks.addBlock")}
                </div>
                <div style={compositionChoiceGridStyle}>
                  {PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS.map((option) => {
                    const limitReached =
                      previewComposition.customBlocks.length >= MAX_PROFILE_CUSTOM_BLOCKS;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="living-card"
                        disabled={limitReached}
                        onClick={() => addCustomBlock(option.value)}
                        style={livingCardStyle(false, safeThemeColor)}
                      >
                        <div style={presetPreviewStyle("custom", safeThemeColor)} />
                        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                          <div style={livingCardHeaderStyle}>
                            <span>
                              {getNamedOption(
                                t,
                                "customBlockType",
                                option.value,
                                "name",
                                option.name,
                              )}
                            </span>
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {getNamedOption(
                              t,
                              "customBlockType",
                              option.value,
                              "description",
                              option.description,
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div style={dashboardMutedTextStyle}>
                  {t("dashboard.profile.editor.customBlocks.blocksUsed", {
                    used: previewComposition.customBlocks.length,
                    total: MAX_PROFILE_CUSTOM_BLOCKS,
                  })}
                </div>
              </div>

              <div style={compositionRowsStyle}>
                {previewComposition.customBlocks.length === 0 ? (
                  <div style={emptyCustomBlocksStyle}>
                    {t("dashboard.profile.editor.customBlocks.empty")}
                  </div>
                ) : (
                  previewComposition.customBlocks.map((block, index) => {
                    const meta = getProfileCustomBlockTypeMeta(block.type);
                    const canMoveUp = index > 0;
                    const canMoveDown =
                      index < previewComposition.customBlocks.length - 1;

                    return (
                      <div key={block.id} style={customBlockEditorCardStyle(block, safeThemeColor)}>
                        <div style={customBlockEditorHeaderStyle}>
                          <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
                            <div style={compositionRowTitleStyle}>
                              {getNamedOption(
                                t,
                                "customBlockType",
                                meta.value,
                                "name",
                                meta.name,
                              )}
                            </div>
                            <div style={layoutCardDescriptionStyle}>
                              {getNamedOption(
                                t,
                                "customBlockType",
                                meta.value,
                                "description",
                                meta.description,
                              )}
                            </div>
                          </div>
                          <div style={compositionRowActionsStyle}>
                            <button
                              type="button"
                              onClick={() => moveCustomBlock(block.id, "up")}
                              disabled={!canMoveUp}
                              style={compositionMoveButtonStyle(canMoveUp)}
                            >
                              {t("dashboard.profile.editor.shared.up")}
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCustomBlock(block.id, "down")}
                              disabled={!canMoveDown}
                              style={compositionMoveButtonStyle(canMoveDown)}
                            >
                              {t("dashboard.profile.editor.shared.down")}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeCustomBlock(block.id)}
                              style={dashboardButtonStyle("secondary")}
                            >
                              {t("dashboard.profile.state.remove")}
                            </button>
                          </div>
                        </div>

                        <div style={customBlockEditorFieldsStyle}>
                          <label style={dashboardLabelStyle}>
                            {t("dashboard.profile.editor.customBlocks.fields.blockType")}
                            <select
                              value={block.type}
                              onChange={(event) =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...createProfileCustomBlockDraft(
                                    event.target.value as ProfileCustomBlockType,
                                    current.id,
                                  ),
                                  visible: current.visible,
                                  glow: current.glow,
                                  transparency: current.transparency,
                                  alignment: current.alignment,
                                  width: current.width,
                                  accentColor: current.accentColor,
                                  text: current.text,
                                  secondaryText: current.secondaryText,
                                  imageUrl: current.imageUrl,
                                }))
                              }
                              style={dashboardInputStyle}
                            >
                              {PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {getNamedOption(
                                    t,
                                    "customBlockType",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label style={dashboardLabelStyle}>
                            {t("dashboard.profile.editor.customBlocks.fields.alignment")}
                            <select
                              value={block.alignment}
                              onChange={(event) =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  alignment: event.target.value as ProfileCustomBlock["alignment"],
                                }))
                              }
                              style={dashboardInputStyle}
                            >
                              {PROFILE_CUSTOM_BLOCK_ALIGNMENT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {getNamedOption(
                                    t,
                                    "customBlockAlignment",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label style={dashboardLabelStyle}>
                            {t("dashboard.profile.editor.customBlocks.fields.width")}
                            <select
                              value={block.width}
                              onChange={(event) =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  width: event.target.value as ProfileCustomBlock["width"],
                                }))
                              }
                              style={dashboardInputStyle}
                            >
                              {PROFILE_CUSTOM_BLOCK_WIDTH_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {getNamedOption(
                                    t,
                                    "customBlockWidth",
                                    option.value,
                                    "name",
                                    option.name,
                                  )}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label style={dashboardLabelStyle}>
                            {t("dashboard.profile.editor.customBlocks.fields.accentColor")}
                            <input
                              type="text"
                              value={block.accentColor || ""}
                              onChange={(event) =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  accentColor: event.target.value.trim() || null,
                                }))
                              }
                              placeholder="#f472b6"
                              style={dashboardInputStyle}
                            />
                          </label>

                          <label style={dashboardLabelStyle}>
                            {t("dashboard.profile.editor.customBlocks.fields.mainText")}
                            <input
                              type="text"
                              value={block.text || ""}
                              onChange={(event) =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  text: event.target.value,
                                }))
                              }
                              placeholder={getCustomBlockTextPlaceholder(
                                t,
                                block.type,
                                getDefaultCustomBlockTextPlaceholder(block),
                              )}
                              style={dashboardInputStyle}
                            />
                          </label>

                          {blockSupportsSecondaryText(block.type) ? (
                            <label style={dashboardLabelStyle}>
                              {t("dashboard.profile.editor.customBlocks.fields.secondaryText")}
                              <input
                                type="text"
                                value={block.secondaryText || ""}
                                onChange={(event) =>
                                  updateCustomBlock(block.id, (current) => ({
                                    ...current,
                                    secondaryText: event.target.value,
                                  }))
                                }
                                placeholder={getCustomBlockSecondaryPlaceholder(
                                  t,
                                  block.type,
                                  block.type === "image-card"
                                    ? "Caption"
                                    : "Short supporting line",
                                )}
                                style={dashboardInputStyle}
                              />
                            </label>
                          ) : null}

                          {blockSupportsImage(block.type) ? (
                            <label style={dashboardLabelStyle}>
                              {t("dashboard.profile.editor.customBlocks.fields.imageUrl")}
                              <input
                                type="text"
                                value={block.imageUrl || ""}
                                onChange={(event) =>
                                  updateCustomBlock(block.id, (current) => ({
                                    ...current,
                                    imageUrl: event.target.value,
                                  }))
                                }
                                placeholder="https://..."
                                style={dashboardInputStyle}
                              />
                            </label>
                          ) : null}

                          {blockSupportsLink(block.type) ? (
                            <label style={dashboardLabelStyle}>
                              {t("dashboard.profile.editor.customBlocks.fields.linkUrl")}
                              <input
                                type="text"
                                value={block.linkUrl || ""}
                                onChange={(event) =>
                                  updateCustomBlock(block.id, (current) => ({
                                    ...current,
                                    linkUrl: event.target.value,
                                  }))
                                }
                                placeholder="https://..."
                                style={dashboardInputStyle}
                              />
                            </label>
                          ) : null}
                        </div>

                        <div style={customBlockEditorToggleRowStyle}>
                          <label style={compositionToggleStyle(block.visible, safeThemeColor, false)}>
                            <span>
                              {block.visible
                                ? t("dashboard.profile.editor.shared.visible")
                                : t("dashboard.profile.editor.shared.hidden")}
                            </span>
                            <input
                              type="checkbox"
                              checked={block.visible}
                              onChange={() =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  visible: !current.visible,
                                }))
                              }
                              style={musicCheckboxStyle}
                            />
                          </label>

                          <label style={compositionToggleStyle(block.glow, safeThemeColor, false)}>
                            <span>
                              {block.glow
                                ? t("dashboard.profile.editor.customBlocks.glowOn")
                                : t("dashboard.profile.editor.customBlocks.glowOff")}
                            </span>
                            <input
                              type="checkbox"
                              checked={block.glow}
                              onChange={() =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  glow: !current.glow,
                                }))
                              }
                              style={musicCheckboxStyle}
                            />
                          </label>

                          <label
                            style={compositionToggleStyle(
                              block.transparency,
                              safeThemeColor,
                              false,
                            )}
                          >
                            <span>
                              {block.transparency
                                ? t("dashboard.profile.editor.customBlocks.transparent")
                                : t("dashboard.profile.editor.customBlocks.solid")}
                            </span>
                            <input
                              type="checkbox"
                              checked={block.transparency}
                              onChange={() =>
                                updateCustomBlock(block.id, (current) => ({
                                  ...current,
                                  transparency: !current.transparency,
                                }))
                              }
                              style={musicCheckboxStyle}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div style={musicSectionStyle}>
              <DashboardSectionHeading
                eyebrow={t("dashboard.profile.editor.music.eyebrow")}
                title={t("dashboard.profile.editor.music.title")}
                description={t("dashboard.profile.editor.music.description")}
              />

              <input
                type="hidden"
                name="profileMusicEnabled"
                value={profileMusicEnabled ? "true" : "false"}
                readOnly
              />

              <label style={musicToggleStyle(profileMusicEnabled, previewPresence.accent)}>
                <span style={musicToggleCopyStyle}>
                  <span style={musicToggleTitleStyle}>
                    {t("dashboard.profile.editor.music.enableLabel")}
                  </span>
                  <span style={dashboardMutedTextStyle}>
                    {t("dashboard.profile.editor.music.enableHelper")}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={profileMusicEnabled}
                  onChange={(event) => setProfileMusicEnabled(event.target.checked)}
                  style={musicCheckboxStyle}
                />
              </label>

              <div style={musicFieldsGridStyle}>
                <label style={dashboardLabelStyle}>
                  {t("dashboard.profile.editor.music.fields.title.label")}
                  <input
                    type="text"
                    name="profileMusicTitle"
                    value={profileMusicTitle}
                    onChange={(event) => setProfileMusicTitle(event.target.value)}
                    placeholder={t("dashboard.profile.editor.music.fields.title.placeholder")}
                    style={dashboardInputStyle}
                  />
                </label>

                <label style={dashboardLabelStyle}>
                  {t("dashboard.profile.editor.music.fields.artist.label")}
                  <input
                    type="text"
                    name="profileMusicArtist"
                    value={profileMusicArtist}
                    onChange={(event) => setProfileMusicArtist(event.target.value)}
                    placeholder={t("dashboard.profile.editor.music.fields.artist.placeholder")}
                    style={dashboardInputStyle}
                  />
                </label>

                <label style={dashboardLabelStyle}>
                  URL
                  <input
                    type="text"
                    name="profileMusicUrl"
                    value={profileMusicUrl}
                    onChange={(event) => setProfileMusicUrl(event.target.value)}
                    placeholder="https://open.spotify.com/..."
                    style={dashboardInputStyle}
                  />
                </label>

                <label style={dashboardLabelStyle}>
                  {t("dashboard.profile.editor.music.fields.provider.label")}
                  <select
                    name="profileMusicProvider"
                    value={profileMusicProvider}
                    onChange={(event) =>
                      setProfileMusicProvider(event.target.value as ProfileMusicProvider)
                    }
                    style={dashboardInputStyle}
                  >
                    {PROFILE_MUSIC_PROVIDERS.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider.charAt(0).toUpperCase()}
                        {provider.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={musicPreviewWrapStyle}>
                <div style={musicPreviewHeaderStyle}>
                  <div style={dashboardTagStyle(profileMusicEnabled ? "pink" : "violet")}>
                    <LuMusic4 size={13} />
                    {t("dashboard.profile.editor.music.previewPlayer")}
                  </div>
                  <span style={dashboardMutedTextStyle}>
                    {t("dashboard.profile.editor.music.previewHelper")}
                  </span>
                </div>

                <ProfileMusicCard
                  music={livePreviewMusic}
                  themeColor={safeThemeColor}
                  accentColor={previewPresence.accent}
                  contrastColor={previewPresence.contrast}
                  softColor={previewPresence.soft}
                  compact
                  showPlaceholder
                  motionLevel={deferredPreviewMotionLevel}
                />
              </div>
            </div>

            <FormActionButton
              idleLabel={
                isDirty
                  ? t("dashboard.profile.editor.actions.save")
                  : t("dashboard.profile.editor.actions.savedState")
              }
              pendingLabel={t("dashboard.profile.editor.actions.saving")}
              disabled={!isDirty}
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </div>
        </form>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow={t("dashboard.profile.preview.eyebrow")}
            title={t("dashboard.profile.preview.title")}
            description={t("dashboard.profile.preview.description")}
            actions={
              <>
                <span style={dashboardTagStyle("pink")}>
                  {t("dashboard.profile.preview.layoutTag", {
                    layout: getProfileLayoutName(
                      t,
                      deferredPreviewLayout,
                      deferredPreviewLayout,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewComposition.preset
                    ? getPresetName(
                        t,
                        deferredPreviewComposition.preset,
                        getProfilePresetDefinition(deferredPreviewComposition.preset)?.name ??
                          deferredPreviewComposition.preset,
                      )
                    : t("dashboard.profile.editor.shared.custom")}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.dnaTag", {
                    dna: getDnaName(
                      t,
                      deferredPreviewComposition.dna,
                      getProfileDnaTuning(deferredPreviewComposition.dna).name,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {getMoodName(t, deferredPreviewMood, deferredPreviewMood)}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.auraTag", {
                    aura: getAuraName(t, deferredPreviewAura, deferredPreviewAura),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {getSceneName(
                    t,
                    previewSceneAppearance.scene.value,
                    previewSceneAppearance.scene.name,
                  )}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewNameEffects.length > 0
                    ? deferredPreviewNameEffects
                        .map((effect) => getNameEffectName(t, effect, effect))
                        .join(" + ")
                    : t("dashboard.profile.preview.noNameEffect")}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.backgroundTag", {
                    value: getNamedOption(
                      t,
                      "backgroundIntensity",
                      deferredPreviewBackgroundIntensity,
                      "name",
                      deferredPreviewBackgroundIntensity,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.glassTag", {
                    value: getNamedOption(
                      t,
                      "glassIntensity",
                      deferredPreviewGlassIntensity,
                      "name",
                      deferredPreviewGlassIntensity,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.bannerTag", {
                    value: getNamedOption(
                      t,
                      "bannerStyle",
                      deferredPreviewBannerStyle,
                      "name",
                      deferredPreviewBannerStyle,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.densityTag", {
                    value: getNamedOption(
                      t,
                      "density",
                      deferredPreviewDensity,
                      "name",
                      deferredPreviewDensity,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.cardsTag", {
                    value: getNamedOption(
                      t,
                      "cardStyle",
                      deferredPreviewCardStyle,
                      "name",
                      deferredPreviewCardStyle,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.cornersTag", {
                    value: getNamedOption(
                      t,
                      "cornerStyle",
                      deferredPreviewCornerStyle,
                      "name",
                      deferredPreviewCornerStyle,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.motionTag", {
                    value: getNamedOption(
                      t,
                      "motionLevel",
                      deferredPreviewMotionLevel,
                      "name",
                      deferredPreviewMotionLevel,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.modeTag", {
                    value: getNamedOption(
                      t,
                      "compositionMode",
                      deferredPreviewComposition.mode,
                      "name",
                      deferredPreviewComposition.mode,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.compositionDensityTag", {
                    value: getNamedOption(
                      t,
                      "compositionDensity",
                      deferredPreviewComposition.density,
                      "name",
                      deferredPreviewComposition.density,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.linksTag", {
                    value: getNamedOption(
                      t,
                      "compositionLinkStyle",
                      deferredPreviewComposition.linksStyle,
                      "name",
                      deferredPreviewComposition.linksStyle,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.socialsTag", {
                    value: getNamedOption(
                      t,
                      "compositionSocialStyle",
                      deferredPreviewComposition.socialsStyle,
                      "name",
                      deferredPreviewComposition.socialsStyle,
                    ),
                  })}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {t("dashboard.profile.preview.customBlocksTag", {
                    count: deferredPreviewComposition.customBlocks.length,
                  })}
                </span>
                <span style={dashboardTagStyle(isDirty ? "violet" : "green")}>
                  {isDirty
                    ? t("dashboard.profile.preview.unsaved")
                    : t("dashboard.profile.state.saved")}
                </span>
              </>
            }
          />

            <div style={previewFrameStyle}>
              <div style={previewChromeStyle(previewPresence.accent, previewPresence.contrast)}>
                <div style={previewChromeBadgeStyle}>
                  <LuLayoutTemplate size={13} />
                  {t("dashboard.profile.preview.rendererBadge")}
                </div>
                <div style={previewChromeTextStyle}>
                  {t("dashboard.profile.preview.rendererDescription")}
                </div>
              </div>

            <div
              ref={previewViewportRef}
              className="profile-preview-viewport yotei-scrollbar-hidden"
              style={previewViewportStyle}
            >
              <div
                style={previewCanvasScaleStyle(previewCanvasWidth, previewScale)}
              >
                <div key={deferredPreviewLayout} className="profile-preview-canvas">
                  <PublicProfileRenderer
                    layout={deferredPreviewLayout}
                    user={livePreviewUser}
                    displayName={resolvedDisplayName}
                    themeColor={safeThemeColor}
                    mood={deferredPreviewMood}
                    aura={deferredPreviewAura}
                    scene={deferredPreviewScene}
                    nameEffects={deferredPreviewNameEffects}
                    backgroundIntensity={deferredPreviewBackgroundIntensity}
                    glassIntensity={deferredPreviewGlassIntensity}
                    bannerStyle={deferredPreviewBannerStyle}
                    introMode={deferredPreviewIntroMode}
                    density={deferredPreviewDensity}
                    cardStyle={deferredPreviewCardStyle}
                    cornerStyle={deferredPreviewCornerStyle}
                    motionLevel={deferredPreviewMotionLevel}
                    music={livePreviewMusic}
                    bannerKind={bannerKind}
                    avatarInitials={avatarInitials}
                    decorationScale={decorationScale}
                    decorationOffsetX={decorationOffsetX}
                    decorationOffsetY={decorationOffsetY}
                    featuredBadges={featuredBadges}
                    extraBadgeCount={extraBadgeCount}
                    heroPills={localizedHeroPills}
                    likes={likes}
                    dislikes={dislikes}
                    views={views}
                    initialCommentCount={initialCommentCount}
                    canComment={canComment}
                    isOwnProfile={isOwnProfile}
                    socialBlocks={socialBlocks}
                    composition={deferredPreviewComposition}
                    initialMyReaction={null}
                    preview
                    previewMessage={t("dashboard.profile.preview.liveMessage")}
                  />
                </div>
              </div>
            </div>

            <div style={previewFooterStyle}>
              <div style={previewFooterCopyStyle}>
                <LuSparkles size={13} />
                {t("dashboard.profile.preview.savedVibe", {
                  mood: getMoodName(t, savedMood, savedMood),
                  aura: getAuraName(t, savedAura, savedAura),
                  scene: savedSceneName,
                })}
              </div>
              <div style={dashboardMutedTextStyle}>
                {t("dashboard.profile.preview.footerDescription")}
              </div>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        .layout-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .scene-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .layout-card:hover,
        .scene-card:hover,
        .living-card:hover,
        .layout-card:focus-visible,
        .scene-card:focus-visible,
        .living-card:focus-visible {
          transform: translateY(-3px);
        }

        .layout-card:active,
        .scene-card:active,
        .living-card:active {
          transform: translateY(0) scale(0.988);
        }

        .profile-preview-canvas {
          animation: preview-swap 260ms ease;
          width: 100%;
          will-change: opacity;
        }

        .profile-preview-viewport {
          height: min(680px, 70vh);
          max-height: 680px;
        }

        @keyframes preview-swap {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .layout-card,
          .scene-card,
          .living-card,
          .profile-preview-canvas {
            transition: none;
            animation: none;
          }
        }

        @media (max-width: 1120px) {
          .profile-editor-grid {
            grid-template-columns: 1fr;
          }

          .profile-preview-viewport {
            height: min(600px, 64vh);
            max-height: 600px;
          }
        }

        @media (max-width: 760px) {
          .profile-preview-viewport {
            height: min(460px, 54vh);
            max-height: 460px;
          }
        }
      `}</style>
    </>
  );
}

const editorGridBaseStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  alignItems: "start",
};

const layoutGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
  gap: "12px",
};

const livingGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
  gap: "12px",
};

const sceneGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
};

const effectsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
};

const musicSectionStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

const musicFieldsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
};

function effectCardStyle(
  isSelected: boolean,
  isSaved: boolean,
  isLocked: boolean,
  selectionCapReached: boolean,
  accentColor: string,
): CSSProperties {
  return {
    display: "grid",
    gap: "14px",
    minWidth: 0,
    padding: "14px",
    borderRadius: "20px",
    textAlign: "left",
    color: "#ffffff",
    opacity: isLocked ? 0.6 : 1,
    border: `1px solid ${
      isSelected
        ? `${accentColor}55`
        : isSaved
          ? "rgba(255,255,255,0.14)"
          : "rgba(255,255,255,0.08)"
    }`,
    background: isSelected
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "1f")}, rgba(11,11,16,0.96))`
      : isLocked
        ? "linear-gradient(180deg, rgba(18,18,24,0.88), rgba(11,11,15,0.92))"
        : "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(12,12,16,0.96))",
    boxShadow: isSelected
      ? `0 18px 36px ${withAlpha(accentColor, "18")}`
      : isSaved
        ? "0 14px 28px rgba(0,0,0,0.18)"
        : "inset 0 1px 0 rgba(255,255,255,0.03)",
    cursor: isLocked || selectionCapReached ? "not-allowed" : "pointer",
  };
}

const effectCardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
};

function effectEffectTagStyle(isPremium: boolean, accentColor: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    border: `1px solid ${
      isPremium ? withAlpha(accentColor, "2f") : "rgba(255,255,255,0.10)"
    }`,
    background: isPremium ? withAlpha(accentColor, "14") : "rgba(255,255,255,0.04)",
    color: isPremium ? "#ffe6f2" : "#d4dbe7",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

function atmosphereCardStyle(
  isSelected: boolean,
  isSaved: boolean,
  accentColor: string,
): CSSProperties {
  return {
    display: "grid",
    gap: "12px",
    minWidth: 0,
    padding: "14px",
    borderRadius: "18px",
    textAlign: "left",
    color: "#ffffff",
    border: `1px solid ${
      isSelected ? `${accentColor}55` : isSaved ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"
    }`,
    background: isSelected
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "18")}, rgba(11,11,16,0.96))`
      : "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
    boxShadow: isSelected
      ? `0 18px 34px ${withAlpha(accentColor, "18")}`
      : isSaved
        ? "0 14px 26px rgba(0,0,0,0.16)"
        : "inset 0 1px 0 rgba(255,255,255,0.03)",
    cursor: "pointer",
  };
}

function atmospherePreviewStyle(
  value: ProfileBackgroundIntensity,
  accentColor: string,
): CSSProperties {
  const opacity = value === "low" ? "10" : value === "high" ? "32" : "1c";

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `radial-gradient(circle at 28% 26%, ${withAlpha(accentColor, opacity)}, transparent 42%), radial-gradient(circle at 76% 30%, rgba(125,211,252,0.18), transparent 32%), linear-gradient(180deg, rgba(12,12,18,0.98), rgba(6,7,12,0.98))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "12")}`,
  };
}

function glassPreviewStyle(
  value: ProfileGlassIntensity,
  accentColor: string,
): CSSProperties {
  const overlay =
    value === "low" ? "rgba(255,255,255,0.03)" : value === "high" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)";
  const blur = value === "low" ? "6px" : value === "high" ? "20px" : "12px";

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: `linear-gradient(180deg, ${overlay}, rgba(255,255,255,0.01)), linear-gradient(135deg, ${withAlpha(accentColor, "18")}, rgba(8,9,14,0.96))`,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}, inset 0 1px 0 rgba(255,255,255,0.06)`,
  };
}

function bannerPreviewStyle(
  value: ProfileBannerStyle,
  accentColor: string,
): CSSProperties {
  const overlay =
    value === "clean"
      ? "linear-gradient(180deg, rgba(7,10,18,0.08), rgba(7,10,18,0.18) 48%, rgba(7,10,18,0.42) 100%)"
      : value === "dark"
        ? "linear-gradient(180deg, rgba(7,10,18,0.22), rgba(7,10,18,0.46) 48%, rgba(7,10,18,0.82) 100%)"
        : "linear-gradient(180deg, rgba(7,10,18,0.14), rgba(7,10,18,0.30) 48%, rgba(7,10,18,0.62) 100%)";

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `${overlay}, linear-gradient(135deg, ${withAlpha(accentColor, "54")}, rgba(125,211,252,0.28), rgba(10,10,16,0.92))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function introModePreviewStyle(
  value: ProfileIntroMode,
  accentColor: string,
): CSSProperties {
  const overlay =
    value === "off"
      ? "linear-gradient(180deg, rgba(8,10,16,0.16), rgba(8,10,16,0.78))"
      : value === "cinematic"
        ? `radial-gradient(circle at 50% 18%, ${withAlpha(accentColor, "36")}, transparent 42%), linear-gradient(180deg, rgba(8,10,16,0.04), rgba(8,10,16,0.78))`
        : `radial-gradient(circle at 50% 22%, ${withAlpha(accentColor, "20")}, transparent 34%), linear-gradient(180deg, rgba(8,10,16,0.08), rgba(8,10,16,0.74))`;

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `${overlay}, linear-gradient(135deg, ${withAlpha(accentColor, value === "off" ? "14" : "24")}, rgba(9,10,15,0.98))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function compositionModePreviewStyle(
  value: ProfileCompositionMode,
  accentColor: string,
): CSSProperties {
  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      value === "floating"
        ? `radial-gradient(circle at 26% 30%, ${withAlpha(accentColor, "28")}, transparent 26%), radial-gradient(circle at 76% 62%, rgba(255,255,255,0.12), transparent 20%), linear-gradient(180deg, rgba(12,12,18,0.96), rgba(6,7,12,0.98))`
        : `linear-gradient(180deg, ${withAlpha(accentColor, "12")}, rgba(9,10,15,0.98))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function densityPreviewStyle(
  value: ProfileDensity,
  accentColor: string,
): CSSProperties {
  const gap =
    value === "compact" ? "8px" : value === "spacious" ? "16px" : "12px";

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `linear-gradient(180deg, ${withAlpha(accentColor, "10")}, rgba(8,9,14,0.94))`,
    padding: "14px",
    display: "grid",
    alignContent: "center",
    gap,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function cardStylePreviewStyle(
  value: ProfileCardStyle,
  accentColor: string,
): CSSProperties {
  const background =
    value === "solid"
      ? "linear-gradient(180deg, rgba(18,18,24,0.98), rgba(9,9,14,0.98))"
      : value === "minimal"
        ? "linear-gradient(180deg, rgba(15,15,20,0.78), rgba(9,9,14,0.72))"
        : `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), linear-gradient(135deg, ${withAlpha(accentColor, "12")}, rgba(8,9,14,0.92))`;

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    background,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}, inset 0 1px 0 rgba(255,255,255,0.05)`,
  };
}

function cornerPreviewStyle(
  value: ProfileCornerStyle,
  accentColor: string,
): CSSProperties {
  const radius = value === "soft" ? "24px" : value === "sharp" ? "10px" : "18px";

  return {
    minHeight: "78px",
    borderRadius: radius,
    border: "1px solid rgba(255,255,255,0.10)",
    background: `linear-gradient(135deg, ${withAlpha(accentColor, "18")}, rgba(8,9,14,0.96))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function motionPreviewStyle(
  value: ProfileMotionLevel,
  accentColor: string,
): CSSProperties {
  const opacity = value === "off" ? "10" : value === "alive" ? "34" : "1e";

  return {
    minHeight: "78px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `radial-gradient(circle at 26% 32%, ${withAlpha(accentColor, opacity)}, transparent 38%), linear-gradient(135deg, rgba(13,13,19,0.98), rgba(7,8,12,0.98))`,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

function presetPreviewStyle(
  value: ProfilePresetId | ProfileDnaType | "custom",
  accentColor: string,
): CSSProperties {
  const background =
    value === "luxury"
      ? `radial-gradient(circle at 50% 24%, ${withAlpha(accentColor, "48")}, transparent 36%), linear-gradient(180deg, rgba(10,10,16,0.18), rgba(10,10,16,0.9))`
      : value === "neon"
        ? `radial-gradient(circle at 24% 34%, ${withAlpha(accentColor, "32")}, transparent 28%), radial-gradient(circle at 76% 62%, rgba(255,255,255,0.12), transparent 22%), linear-gradient(180deg, rgba(11,11,16,0.96), rgba(7,8,12,0.98))`
      : value === "ghost"
        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(11,11,16,0.76))"
        : value === "cyber"
          ? `repeating-linear-gradient(180deg, rgba(34,211,238,0.08) 0 1px, transparent 1px 7px), linear-gradient(135deg, ${withAlpha(accentColor, "22")}, rgba(8,9,14,0.96))`
          : value === "minimal"
            ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(10,10,14,0.92))"
            : value === "orbit"
              ? `radial-gradient(circle at top left, ${withAlpha(accentColor, "30")}, transparent 42%), linear-gradient(180deg, rgba(12,12,20,0.96), rgba(8,8,12,0.96))`
              : value === "void"
                ? `radial-gradient(circle at 60% 20%, ${withAlpha(accentColor, "18")}, transparent 24%), linear-gradient(180deg, rgba(7,8,14,0.94), rgba(3,4,8,0.98))`
                : value === "mono"
                  ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(9,10,14,0.96))"
                  : value === "pulse"
                    ? `radial-gradient(circle at 32% 34%, ${withAlpha(accentColor, "36")}, transparent 26%), linear-gradient(135deg, rgba(12,12,18,0.96), rgba(8,8,12,0.98))`
                    : value === "softglass"
                      ? `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), linear-gradient(135deg, ${withAlpha(accentColor, "18")}, rgba(9,12,18,0.94))`
                      : `linear-gradient(135deg, ${withAlpha(accentColor, "14")}, rgba(9,10,15,0.96))`;

  return {
    minHeight: "78px",
    borderRadius:
      value === "minimal" || value === "mono"
        ? "12px"
        : "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background,
    boxShadow: `0 12px 24px ${withAlpha(accentColor, "10")}`,
  };
}

const presetMetaRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

function presetMetaBadgeStyle(background: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "24px",
    padding: "0 9px",
    borderRadius: "999px",
    background,
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#eef2ff",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };
}

const comingSoonCardStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  padding: "16px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(244,114,182,0.12), transparent 28%), linear-gradient(180deg, rgba(16,16,22,0.96), rgba(10,10,14,0.96))",
  overflow: "hidden",
};

const comingSoonBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  minHeight: "30px",
  padding: "0 11px",
  borderRadius: "999px",
  border: "1px solid rgba(244,114,182,0.18)",
  background: "rgba(244,114,182,0.10)",
  color: "#f9a8d4",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const comingSoonTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 900,
};

const comingSoonTagsStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

function musicToggleStyle(isEnabled: boolean, accentColor: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    padding: "16px",
    borderRadius: "20px",
    border: `1px solid ${
      isEnabled ? withAlpha(accentColor, "30") : "rgba(255,255,255,0.08)"
    }`,
    background: isEnabled
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "14")}, rgba(12,12,18,0.98))`
      : "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
    boxShadow: isEnabled ? `0 16px 32px ${withAlpha(accentColor, "14")}` : "none",
    cursor: "pointer",
  };
}

const musicToggleCopyStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  minWidth: 0,
};

const musicToggleTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 800,
};

const musicCheckboxStyle: CSSProperties = {
  width: "18px",
  height: "18px",
  accentColor: "#f472b6",
  flexShrink: 0,
};

const musicPreviewWrapStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const musicPreviewHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

function layoutCardStyle(
  isSelected: boolean,
  isSaved: boolean,
  themeColor: string,
): CSSProperties {
  return {
    display: "grid",
    gap: "16px",
    minWidth: 0,
    padding: "16px",
    borderRadius: "20px",
    textAlign: "left",
    color: "#ffffff",
    border: `1px solid ${
      isSelected ? `${themeColor}55` : isSaved ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"
    }`,
    background: isSelected
      ? `linear-gradient(180deg, ${withAlpha(themeColor, "1f")}, rgba(11,11,16,0.96))`
      : "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(12,12,16,0.96))",
    boxShadow: isSelected
      ? `0 22px 42px ${withAlpha(themeColor, "18")}, 0 0 0 1px ${withAlpha(themeColor, "1f")}`
      : isSaved
        ? "0 16px 30px rgba(0,0,0,0.18)"
        : "inset 0 1px 0 rgba(255,255,255,0.03)",
    cursor: "pointer",
  };
}

const layoutCardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const livingSectionTitleStyle: CSSProperties = {
  color: "#e8eefc",
  fontSize: "13px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

function livingCardStyle(isSelected: boolean, accentColor: string): CSSProperties {
  return {
    display: "grid",
    gap: "12px",
    minWidth: 0,
    padding: "14px",
    borderRadius: "18px",
    textAlign: "left",
    color: "#ffffff",
    border: `1px solid ${isSelected ? `${accentColor}55` : "rgba(255,255,255,0.08)"}`,
    background: isSelected
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "18")}, rgba(11,11,16,0.96))`
      : "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
    boxShadow: isSelected
      ? `0 18px 36px ${withAlpha(accentColor, "18")}`
      : "inset 0 1px 0 rgba(255,255,255,0.03)",
    cursor: "pointer",
  };
}

function sceneCardStyle(
  isSelected: boolean,
  isSaved: boolean,
  accentColor: string,
  contrastColor: string,
): CSSProperties {
  return {
    display: "grid",
    gap: "14px",
    minWidth: 0,
    padding: "14px",
    borderRadius: "20px",
    textAlign: "left",
    color: "#ffffff",
    border: `1px solid ${
      isSelected ? `${accentColor}55` : isSaved ? `${contrastColor}2f` : "rgba(255,255,255,0.08)"
    }`,
    background: isSelected
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "1a")}, rgba(11,11,16,0.96))`
      : `linear-gradient(180deg, ${withAlpha(contrastColor, "0d")}, rgba(12,12,18,0.96))`,
    boxShadow: isSelected
      ? `0 20px 38px ${withAlpha(accentColor, "18")}`
      : isSaved
        ? `0 16px 30px ${withAlpha(contrastColor, "12")}`
        : "inset 0 1px 0 rgba(255,255,255,0.03)",
    cursor: "pointer",
    overflow: "hidden",
  };
}

const livingCardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  fontWeight: 800,
};

function livingPreviewStyle(primary: string, secondary: string, pulse: string): CSSProperties {
  return {
    minHeight: "72px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `radial-gradient(circle at 24% 30%, ${withAlpha(primary, "44")}, transparent 48%), linear-gradient(135deg, ${withAlpha(primary, "24")}, ${withAlpha(secondary, "16")}, rgba(8,8,12,0.98))`,
    padding: "12px",
    display: "grid",
    alignContent: "space-between",
    overflow: "hidden",
    position: "relative",
    boxShadow: `0 12px 24px ${withAlpha(pulse, "12")}`,
  };
}

function livingPreviewPulseStyle(pulse: string): CSSProperties {
  return {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: pulse,
    boxShadow: `0 0 0 5px ${withAlpha(pulse, "14")}`,
  };
}

function livingPreviewLineStyle(color: string, width: string): CSSProperties {
  return {
    width,
    height: "8px",
    borderRadius: "999px",
    background: withAlpha(color, "66"),
  };
}

function auraPreviewStyle(
  overlay: string,
  glow: string,
  ring: string,
): CSSProperties {
  return {
    minHeight: "72px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: `${overlay}, linear-gradient(135deg, rgba(12,12,18,0.98), rgba(5,5,9,0.98))`,
    position: "relative",
    overflow: "hidden",
    boxShadow: glow === "rgba(255,255,255,0.00)" ? "none" : `0 12px 24px ${glow}`,
    outline: `1px solid ${withAlpha(ring, "38")}`,
    outlineOffset: "-1px",
  };
}

function scenePreviewStyle(accentColor: string, contrastColor: string): CSSProperties {
  return {
    minHeight: "96px",
    borderRadius: "18px",
    border: `1px solid ${withAlpha(accentColor, "2c")}`,
    background: `linear-gradient(135deg, ${withAlpha(accentColor, "16")}, ${withAlpha(contrastColor, "10")}, rgba(5,5,9,0.98))`,
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    boxShadow: `0 18px 30px ${withAlpha(accentColor, "14")}`,
  };
}

function scenePreviewChromeStyle(accentColor: string): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    display: "grid",
    alignContent: "space-between",
    padding: "10px",
    background:
      "linear-gradient(180deg, rgba(6,7,12,0.14), rgba(6,7,12,0.12) 48%, rgba(6,7,12,0.44) 100%)",
    pointerEvents: "none",
    boxShadow: `inset 0 0 0 1px ${withAlpha(accentColor, "16")}`,
  };
}

function scenePreviewBadgeStyle(accentColor: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    minHeight: "24px",
    padding: "0 9px",
    borderRadius: "999px",
    color: "#ffffff",
    background: withAlpha(accentColor, "18"),
    border: `1px solid ${withAlpha(accentColor, "30")}`,
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    backdropFilter: "blur(6px)",
  };
}

function scenePreviewFrameStyle(accentColor: string): CSSProperties {
  return {
    width: "72px",
    height: "28px",
    justifySelf: "end",
    borderRadius: "999px",
    border: `1px solid ${withAlpha(accentColor, "30")}`,
    background: `linear-gradient(90deg, transparent, ${withAlpha(accentColor, "18")}, transparent)`,
    boxShadow: `0 0 0 1px ${withAlpha(accentColor, "12")}`,
  };
}

function layoutSwatchStyle(
  layout: PublicProfileLayout,
  themeColor: string,
): CSSProperties {
  const background =
    layout === "modern"
      ? `radial-gradient(circle at top left, ${withAlpha(themeColor, "60")}, transparent 56%), linear-gradient(135deg, rgba(16,18,28,0.98), rgba(5,6,10,0.98))`
      : layout === "portfolio"
        ? "linear-gradient(135deg, rgba(12,20,34,0.98), rgba(5,9,15,0.98))"
        : layout === "simplistic"
          ? "linear-gradient(135deg, rgba(17,17,20,0.98), rgba(7,7,10,0.98))"
          : `linear-gradient(135deg, ${withAlpha(themeColor, "72")}, rgba(12,12,18,0.98))`;

  return {
    width: "56px",
    height: "42px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background,
    boxShadow: `0 14px 28px ${withAlpha(themeColor, "12")}`,
    flexShrink: 0,
  };
}

const layoutIndicatorRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "8px",
  flexWrap: "wrap",
};

function selectedIndicatorStyle(themeColor: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    border: `1px solid ${withAlpha(themeColor, "36")}`,
    background: withAlpha(themeColor, "18"),
    color: "#ffe6f2",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

const savedIndicatorStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#d4dbe7",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const layoutCardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  fontWeight: 900,
  color: "#ffffff",
};

const layoutCardDescriptionStyle: CSSProperties = {
  color: "#a3acc2",
  fontSize: "13px",
  lineHeight: 1.6,
};

const previewFrameStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  padding: "14px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(14,12,22,0.96), rgba(7,8,13,0.98)), radial-gradient(circle at top left, rgba(244,114,182,0.12), transparent 28%)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
};

function previewChromeStyle(accent: string, contrast: string): CSSProperties {
  return {
    display: "grid",
    gap: "8px",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      `radial-gradient(circle at top left, ${withAlpha(accent, "24")}, transparent 24%), radial-gradient(circle at 86% 18%, ${withAlpha(contrast, "18")}, transparent 18%), linear-gradient(180deg, rgba(17,15,24,0.96), rgba(9,9,13,0.96))`,
    boxShadow: `0 18px 34px ${withAlpha(accent, "14")}`,
  };
}

const previewChromeBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f8d4e7",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const previewChromeTextStyle: CSSProperties = {
  color: "#b9c4dc",
  fontSize: "14px",
  lineHeight: 1.7,
};

const previewViewportStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(5,6,10,1), rgba(3,4,8,1)), radial-gradient(circle at top, rgba(129,140,248,0.12), transparent 24%)",
  width: "100%",
  minHeight: 0,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

function previewCanvasScaleStyle(
  canvasWidth: number,
  scale: number,
): CSSProperties {
  return {
  position: "absolute",
    top: 0,
    left: "50%",
    width: `${canvasWidth}px`,
    transform: `translateX(-50%) scale(${scale})`,
    transformOrigin: "top center",
  };
}

const previewFooterStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
};

const previewFooterCopyStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  color: "#e8eefc",
  fontSize: "13px",
  fontWeight: 800,
};

function getVisibilityKeyForBlock(block: ProfileCompositionBlock) {
  if (block === "identity") {
    return null;
  }

  if (block === "about") {
    return "about" as const;
  }

  if (block === "presence") {
    return "presence" as const;
  }

  if (block === "music") {
    return "music" as const;
  }

  if (block === "socials") {
    return "socials" as const;
  }

  if (block === "showcase") {
    return "showcase" as const;
  }

  if (block === "projects") {
    return "projects" as const;
  }

  if (block === "gallery") {
    return "gallery" as const;
  }

  return "extras" as const;
}

function getDefaultCompositionBlockLabel(block: ProfileCompositionBlock) {
  if (block === "identity") {
    return "Identity";
  }

  if (block === "about") {
    return "About";
  }

  if (block === "presence") {
    return "Presence";
  }

  if (block === "music") {
    return "Music";
  }

  if (block === "socials") {
    return "Socials";
  }

  if (block === "showcase") {
    return "Showcase";
  }

  if (block === "projects") {
    return "Projects";
  }

  if (block === "gallery") {
    return "Gallery";
  }

  return "Extras";
}

function getDefaultCompositionBlockDescription(block: ProfileCompositionBlock) {
  if (block === "identity") {
    return "Avatar, name, badges, and the anchor point of the full public identity scene.";
  }

  if (block === "about") {
    return "Bio copy and quote-style personal notes.";
  }

  if (block === "presence") {
    return "Public pulse, links, and live presence signals.";
  }

  if (block === "music") {
    return "Profile soundtrack card with title, artist, and outbound CTA.";
  }

  if (block === "socials") {
    return "Non-live social integrations like Discord, GitHub, Spotify, and creator cards.";
  }

  if (block === "showcase") {
    return "Collectible taste signals like favorite songs, games, anime, and playlists.";
  }

  if (block === "projects") {
    return "Current project cards and GitHub repo highlights.";
  }

  if (block === "gallery") {
    return "Visual scene inserts like desk shots and image-driven cards.";
  }

  return "Mood strips, dividers, status banners, and smaller ambient inserts.";
}

const compositionSectionStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
};

const compositionControlsGridStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
};

const compositionRowsStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

function compositionRowStyle(
  isVisible: boolean,
  accentColor: string,
  isHero: boolean,
): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "14px",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "18px",
    border: `1px solid ${
      isHero
        ? withAlpha(accentColor, "28")
        : isVisible
          ? withAlpha(accentColor, "1c")
          : "rgba(255,255,255,0.08)"
    }`,
    background: isHero
      ? `linear-gradient(180deg, ${withAlpha(accentColor, "12")}, rgba(12,12,18,0.96))`
      : isVisible
        ? `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(12,12,18,0.96))`
        : "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
    boxShadow: isVisible ? `0 16px 28px ${withAlpha(accentColor, "10")}` : "none",
  };
}

const compositionRowCopyStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  minWidth: 0,
};

const compositionRowTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 900,
};

const compositionRowActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

function compositionMoveButtonStyle(enabled: boolean): CSSProperties {
  return {
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: enabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
    color: enabled ? "#eef2ff" : "#7f8ca7",
    fontSize: "12px",
    fontWeight: 800,
    cursor: enabled ? "pointer" : "not-allowed",
  };
}

function compositionToggleStyle(
  isVisible: boolean,
  accentColor: string,
  isHero: boolean,
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "36px",
    padding: "0 12px",
    borderRadius: "999px",
    border: `1px solid ${isVisible || isHero ? withAlpha(accentColor, "24") : "rgba(255,255,255,0.08)"}`,
    background: isVisible || isHero ? withAlpha(accentColor, "12") : "rgba(255,255,255,0.03)",
    color: "#eef2ff",
    fontSize: "12px",
    fontWeight: 800,
  };
}

const compositionOptionGridStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
};

const emptyCustomBlocksStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
  color: "#aeb7cb",
  fontSize: "13px",
  lineHeight: 1.65,
};

function customBlockEditorCardStyle(
  block: ProfileCustomBlock,
  accentColor: string,
): CSSProperties {
  return {
    display: "grid",
    gap: "14px",
    padding: "16px",
    borderRadius: "20px",
    border: `1px solid ${
      block.visible ? withAlpha(block.accentColor || accentColor, "24") : "rgba(255,255,255,0.08)"
    }`,
    background: block.visible
      ? `linear-gradient(180deg, ${withAlpha(block.accentColor || accentColor, "12")}, rgba(12,12,18,0.96))`
      : "linear-gradient(180deg, rgba(18,18,24,0.96), rgba(11,11,15,0.96))",
  };
}

const customBlockEditorHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
};

const customBlockEditorFieldsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: "12px",
};

const customBlockEditorToggleRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const compositionChoiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: "12px",
};

function normalizeThemeColor(value: string) {
  const trimmed = value.trim();
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

function getDefaultCustomBlockTextPlaceholder(block: ProfileCustomBlock) {
  if (block.type === "quote") {
    return "Short atmospheric quote";
  }

  if (block.type === "text-strip") {
    return "Single-line strip text";
  }

  if (block.type === "divider") {
    return "Optional divider label";
  }

  if (block.type === "mood") {
    return "Main mood phrase";
  }

  if (block.type === "image-card") {
    return "Image title";
  }

  return "Status message";
}

function createCustomBlockId() {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

function getPreviewCanvasWidth(layout: PublicProfileLayout) {
  if (layout === "modern") {
    return 1140;
  }

  if (layout === "portfolio") {
    return 1080;
  }

  if (layout === "simplistic") {
    return 860;
  }

  return 980;
}

function getPreviewScale(viewportWidth: number, canvasWidth: number) {
  if (!viewportWidth) {
    return 0.5;
  }

  return Math.min(Math.max((viewportWidth - 28) / canvasWidth, 0), 1);
}

function areNameEffectsEqual(
  left: ProfileNameEffect[],
  right: ProfileNameEffect[],
) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((effect, index) => effect === right[index]);
}
