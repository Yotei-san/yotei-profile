"use client";

import { startTransition, useDeferredValue, useState, type CSSProperties } from "react";
import { LuCheck, LuLayoutTemplate, LuSparkles } from "react-icons/lu";
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
import type { PublicProfileLayout } from "@/app/[username]/ProfileLayoutVariants";
import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
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

  const deferredDisplayName = useDeferredValue(displayName);
  const deferredBio = useDeferredValue(bio);
  const deferredThemeColor = useDeferredValue(themeColor);
  const deferredPreviewLayout = useDeferredValue(previewLayout);
  const safeThemeColor = normalizeThemeColor(deferredThemeColor);
  const resolvedDisplayName =
    deferredDisplayName.trim() || previewUser.username;
  const isDirty =
    previewLayout !== savedLayout ||
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
                <span style={dashboardTagStyle(isDirty ? "violet" : "green")}>
                  {isDirty ? "Unsaved changes" : "Saved state"}
                </span>
              </>
            }
          />

          <div style={previewFrameStyle}>
            <div style={previewChromeStyle}>
              <div style={previewChromeBadgeStyle}>
                <LuLayoutTemplate size={13} />
                Real public renderer
              </div>
              <div style={previewChromeTextStyle}>
                Instant layout switching, live copy updates, lightweight ambient motion.
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
                  user={previewUser}
                  displayName={resolvedDisplayName}
                  themeColor={safeThemeColor}
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
                Saved layout: {savedLayout}
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
        .layout-card:focus-visible {
          transform: translateY(-3px);
        }

        .layout-card:active {
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

const previewChromeStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(255,110,168,0.10), transparent 24%), linear-gradient(180deg, rgba(17,15,24,0.96), rgba(9,9,13,0.96))",
};

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
