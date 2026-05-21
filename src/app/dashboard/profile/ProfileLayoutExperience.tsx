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
  MAX_PROFILE_NAME_EFFECTS,
  PROFILE_BACKGROUND_INTENSITY_OPTIONS,
  PROFILE_BANNER_STYLE_OPTIONS,
  PROFILE_GLASS_INTENSITY_OPTIONS,
  PROFILE_NAME_EFFECT_OPTIONS,
  isNameEffectAvailable,
  type ProfileBackgroundIntensity,
  type ProfileBannerStyle,
  type ProfileGlassIntensity,
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
  initialMusic: ProfileMusicData;
  previewUser: PublicProfileRenderUser;
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
  initialMusic,
  previewUser,
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
  hasPremiumAccess,
}: Props) {
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
  const savedSceneName =
    sceneOptions.find((option) => option.value === savedScene)?.name || "Default";

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

  return (
    <>
      <section className="profile-editor-grid" style={editorGridBaseStyle}>
        <form action={saveProfileSettings} style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Core content"
            title="Profile content and layout"
            description="Update your public identity and preview the real profile renderer before you save."
          />

          <div style={dashboardFieldGridStyle}>
            <label style={dashboardLabelStyle}>
              Display name
              <input
                type="text"
                name="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your visible name"
                style={dashboardInputStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Bio
              <textarea
                name="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell visitors what you do."
                rows={5}
                style={dashboardTextareaStyle}
              />
            </label>

            <label style={dashboardLabelStyle}>
              Theme color
              <input
                type="text"
                name="themeColor"
                value={themeColor}
                onChange={(event) => setThemeColor(event.target.value)}
                placeholder="#f472b6"
                style={dashboardInputStyle}
              />
              <span style={dashboardMutedTextStyle}>
                Hex colors keep the preview and the live profile consistent.
              </span>
            </label>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow="Username Effects"
                title="Identity effects"
                description="Layer up to two lightweight effects on the display name area."
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
                          {effectOption.premium ? "Premium" : "Free"}
                        </span>
                        {isSelected ? (
                          <span style={selectedIndicatorStyle(safeThemeColor)}>
                            Active
                          </span>
                        ) : isSaved ? (
                          <span style={savedIndicatorStyle}>Saved</span>
                        ) : null}
                      </div>

                      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                        <div style={livingCardHeaderStyle}>
                          <span>{effectOption.name}</span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>
                          {effectOption.description}
                        </div>
                        {selectionCapReached && !isLocked ? (
                          <div style={dashboardMutedTextStyle}>
                            Remove one active effect to add another.
                          </div>
                        ) : isLocked ? (
                          <div style={dashboardMutedTextStyle}>
                            Requires Premium.
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={dashboardMutedTextStyle}>
                {hasPremiumAccess
                  ? "Pick up to two effects. Choosing None clears every active effect."
                  : "Free users can use None and Glow. Premium unlocks Rainbow, Typewriter, Particles, Glitch, and Shimmer."}
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <DashboardSectionHeading
                eyebrow="Layout"
                title="Choose profile layout"
                description="Previewing updates instantly, while the saved state stays visible until you publish changes."
              />

              <input type="hidden" name="profileLayout" value={previewLayout} readOnly />

              <div style={layoutGridStyle}>
                {PROFILE_LAYOUT_OPTIONS.map((layout) => {
                  const isSelected = previewLayout === layout.key;
                  const isSaved = savedLayout === layout.key;
                  const indicatorLabel = isSelected
                    ? isSaved
                      ? "Current"
                      : "Previewing"
                    : isSaved
                      ? "Saved"
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
                          <span>{layout.name}</span>
                          {isSelected ? <LuCheck size={16} /> : null}
                        </div>
                        <div style={layoutCardDescriptionStyle}>{layout.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DashboardSectionHeading
                eyebrow="Living Profile"
                title="Mood and aura"
                description="Shape the vibe of the live profile with lightweight atmosphere, pulse, and aura treatments."
              />

              <input type="hidden" name="profileMood" value={previewMood} readOnly />
              <input type="hidden" name="profileAura" value={previewAura} readOnly />
              <input type="hidden" name="profileScene" value={previewScene} readOnly />

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Mood</div>
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
                            <span>{option.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Aura</div>
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
                            <span>{option.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Profile Scene</div>
                <div style={sceneGridStyle}>
                  {sceneOptions.map((sceneOption) => {
                    const isSelected = previewScene === sceneOption.value;
                    const isSaved = savedScene === sceneOption.value;
                    const indicatorLabel = isSelected
                      ? isSaved
                        ? "Current"
                        : "Previewing"
                      : isSaved
                        ? "Saved"
                        : "Scene";

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
                              {sceneOption.previewLabel}
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
                            <span>{sceneOption.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>
                            {sceneOption.description}
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
                eyebrow="Profile Atmosphere"
                title="Background and banner tuning"
                description="Control how visible the scene feels, how strong the glass reads, and how much the banner pushes through."
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

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Background intensity</div>
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
                            <span>{option.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Glass intensity</div>
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
                            <span>{option.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={livingSectionTitleStyle}>Banner visibility</div>
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
                            <span>{option.name}</span>
                            {isSelected ? <LuCheck size={16} /> : null}
                          </div>
                          <div style={layoutCardDescriptionStyle}>{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={comingSoonCardStyle}>
                <div style={comingSoonBadgeStyle}>
                  <LuSparkles size={13} />
                  Profile Props coming soon
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={comingSoonTitleStyle}>
                    Future room objects and stickers are already on the roadmap.
                  </div>
                  <div style={layoutCardDescriptionStyle}>
                    We&apos;re preparing a lightweight props layer for polaroids, stickers,
                    floating icons, and room objects without dropping performance.
                  </div>
                </div>
                <div style={comingSoonTagsStyle}>
                  {["Polaroids", "Stickers", "Floating icons", "Room objects"].map((item) => (
                    <span key={item} style={savedIndicatorStyle}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={musicSectionStyle}>
              <DashboardSectionHeading
                eyebrow="Profile Music"
                title="Sound atmosphere"
                description="Add a track or atmosphere that represents your profile."
              />

              <input
                type="hidden"
                name="profileMusicEnabled"
                value={profileMusicEnabled ? "true" : "false"}
                readOnly
              />

              <label style={musicToggleStyle(profileMusicEnabled, previewPresence.accent)}>
                <span style={musicToggleCopyStyle}>
                  <span style={musicToggleTitleStyle}>Enable profile music</span>
                  <span style={dashboardMutedTextStyle}>
                    Show a lightweight music presence card on your public profile.
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
                  Song/title
                  <input
                    type="text"
                    name="profileMusicTitle"
                    value={profileMusicTitle}
                    onChange={(event) => setProfileMusicTitle(event.target.value)}
                    placeholder="Night drive loop"
                    style={dashboardInputStyle}
                  />
                </label>

                <label style={dashboardLabelStyle}>
                  Artist
                  <input
                    type="text"
                    name="profileMusicArtist"
                    value={profileMusicArtist}
                    onChange={(event) => setProfileMusicArtist(event.target.value)}
                    placeholder="Your artist or vibe source"
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
                  Provider
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
                    Preview player
                  </div>
                  <span style={dashboardMutedTextStyle}>
                    No autoplay, embeds, or background audio.
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
                />
              </div>
            </div>

            <FormActionButton
              idleLabel={isDirty ? "Save profile settings" : "Saved state is up to date"}
              pendingLabel="Saving profile..."
              disabled={!isDirty}
              style={dashboardButtonStyle("primary", { fullWidth: true })}
            />
          </div>
        </form>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Preview"
            title="Live profile preview"
            description="This preview uses the same renderer as your public profile, so layout, spacing, and premium polish match the live page."
            actions={
              <>
                <span style={dashboardTagStyle("pink")}>Previewing {deferredPreviewLayout}</span>
                <span style={dashboardTagStyle("violet")}>{deferredPreviewMood}</span>
                <span style={dashboardTagStyle("violet")}>{deferredPreviewAura} aura</span>
                <span style={dashboardTagStyle("violet")}>
                  {previewSceneAppearance.scene.name}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewNameEffects.length > 0
                    ? deferredPreviewNameEffects.join(" + ")
                    : "No name effect"}
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewBackgroundIntensity} bg
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewGlassIntensity} glass
                </span>
                <span style={dashboardTagStyle("violet")}>
                  {deferredPreviewBannerStyle} banner
                </span>
                <span style={dashboardTagStyle(isDirty ? "violet" : "green")}>
                  {isDirty ? "Unsaved changes" : "Saved state"}
                </span>
              </>
            }
          />

          <div style={previewFrameStyle}>
            <div style={previewChromeStyle(previewPresence.accent, previewPresence.contrast)}>
              <div style={previewChromeBadgeStyle}>
                <LuLayoutTemplate size={13} />
                Real public renderer
              </div>
              <div style={previewChromeTextStyle}>
                Instant layout switching, live copy updates, and a shared mood/aura atmosphere.
              </div>
            </div>

            <div ref={previewViewportRef} className="profile-preview-viewport" style={previewViewportStyle}>
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
                    music={livePreviewMusic}
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
                    initialMyReaction={null}
                    preview
                    previewMessage="This is exactly how your live profile will look."
                  />
                </div>
              </div>
            </div>

            <div style={previewFooterStyle}>
              <div style={previewFooterCopyStyle}>
                <LuSparkles size={13} />
                Saved vibe: {savedMood} with {savedAura} aura in {savedSceneName}
              </div>
              <div style={dashboardMutedTextStyle}>
                The preview updates from your unsaved editor values first, then the public profile changes after save.
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
          height: min(700px, 72vh);
          max-height: 700px;
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
            height: min(640px, 68vh);
            max-height: 640px;
          }
        }

        @media (max-width: 760px) {
          .profile-preview-viewport {
            height: min(500px, 58vh);
            max-height: 500px;
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
};

function previewChromeStyle(accent: string, contrast: string): CSSProperties {
  return {
    display: "grid",
    gap: "8px",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      `radial-gradient(circle at top left, ${withAlpha(accent, "24")}, transparent 24%), radial-gradient(circle at 86% 18%, ${withAlpha(contrast, "18")}, transparent 18%), linear-gradient(180deg, rgba(17,15,24,0.96), rgba(9,9,13,0.96))`,
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
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#040508",
  width: "100%",
  minHeight: 0,
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
