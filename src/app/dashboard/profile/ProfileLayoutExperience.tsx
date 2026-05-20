"use client";

import { startTransition, useDeferredValue, useState, type CSSProperties } from "react";
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
import ProfileMusicCard from "@/app/[username]/ProfileMusicCard";
import type { PublicProfileLayout } from "@/app/[username]/ProfileLayoutVariants";
import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
import {
  normalizeProfileMusic,
  PROFILE_MUSIC_PROVIDERS,
  type ProfileMusicData,
  type ProfileMusicProvider,
} from "@/app/lib/profile-music";
import {
  getProfilePresence,
  PROFILE_AURA_OPTIONS,
  PROFILE_MOOD_OPTIONS,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
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
};

export default function ProfileLayoutExperience({
  initialDisplayName,
  initialBio,
  initialThemeColor,
  savedLayout,
  savedMood,
  savedAura,
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
}: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [themeColor, setThemeColor] = useState(initialThemeColor);
  const [previewLayout, setPreviewLayout] = useState<PublicProfileLayout>(savedLayout);
  const [previewMood, setPreviewMood] = useState<ProfileMood>(savedMood);
  const [previewAura, setPreviewAura] = useState<ProfileAura>(savedAura);
  const [profileMusicEnabled, setProfileMusicEnabled] = useState(initialMusic.enabled);
  const [profileMusicTitle, setProfileMusicTitle] = useState(initialMusic.title || "");
  const [profileMusicArtist, setProfileMusicArtist] = useState(initialMusic.artist || "");
  const [profileMusicUrl, setProfileMusicUrl] = useState(initialMusic.url || "");
  const [profileMusicProvider, setProfileMusicProvider] = useState<ProfileMusicProvider>(
    initialMusic.provider,
  );

  const deferredDisplayName = useDeferredValue(displayName);
  const deferredBio = useDeferredValue(bio);
  const deferredThemeColor = useDeferredValue(themeColor);
  const deferredPreviewLayout = useDeferredValue(previewLayout);
  const deferredPreviewMood = useDeferredValue(previewMood);
  const deferredPreviewAura = useDeferredValue(previewAura);
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
  const previewPresence = getProfilePresence({
    mood: deferredPreviewMood,
    aura: deferredPreviewAura,
    themeColor: safeThemeColor,
  });
  const livePreviewMusic = normalizeProfileMusic({
    enabled: deferredProfileMusicEnabled,
    title: deferredProfileMusicTitle,
    artist: deferredProfileMusicArtist,
    url: deferredProfileMusicUrl,
    provider: deferredProfileMusicProvider,
  });
  const isDirty =
    previewLayout !== savedLayout ||
    previewMood !== savedMood ||
    previewAura !== savedAura ||
    profileMusicEnabled !== initialMusic.enabled ||
    profileMusicTitle !== (initialMusic.title || "") ||
    profileMusicArtist !== (initialMusic.artist || "") ||
    profileMusicUrl !== (initialMusic.url || "") ||
    profileMusicProvider !== initialMusic.provider ||
    displayName !== initialDisplayName ||
    bio !== initialBio ||
    themeColor !== initialThemeColor;

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

            <div style={previewViewportStyle}>
              <div
                key={deferredPreviewLayout}
                className="profile-preview-canvas"
                style={previewCanvasStyle}
              >
                <PublicProfileRenderer
                  layout={deferredPreviewLayout}
                  user={livePreviewUser}
                  displayName={resolvedDisplayName}
                  themeColor={safeThemeColor}
                  mood={deferredPreviewMood}
                  aura={deferredPreviewAura}
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

            <div style={previewFooterStyle}>
              <div style={previewFooterCopyStyle}>
                <LuSparkles size={13} />
                Saved vibe: {savedMood} with {savedAura} aura
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

        .layout-card:hover,
        .living-card:hover,
        .layout-card:focus-visible,
        .living-card:focus-visible {
          transform: translateY(-3px);
        }

        .layout-card:active,
        .living-card:active {
          transform: translateY(0) scale(0.988);
        }

        .profile-preview-canvas {
          animation: preview-swap 260ms ease;
          will-change: transform, opacity;
        }

        @keyframes preview-swap {
          0% {
            opacity: 0;
            transform: scale(0.972) translateY(10px);
          }

          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .layout-card,
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

const musicSectionStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

const musicFieldsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
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
  aspectRatio: "10 / 13",
  minHeight: 0,
};

const previewCanvasStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "312.5%",
  height: "312.5%",
  transform: "scale(0.32)",
  transformOrigin: "top left",
};

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
