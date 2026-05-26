"use client";

import type { CSSProperties } from "react";
import {
  LuArrowUpRight,
  LuGamepad2,
  LuGalleryHorizontal,
  LuGithub,
  LuMinus,
  LuMessageSquareQuote,
  LuMonitorSmartphone,
  LuMusic4,
  LuPanelTop,
  LuSparkles,
  LuTv,
} from "react-icons/lu";
import {
  type ProfileCustomBlock,
  type ProfileCustomBlockAlignment,
} from "@/app/lib/profile-custom-blocks";
import { getProfileDnaTuning, type ProfileDnaTuning } from "@/app/lib/profile-dna";

type Props = {
  block: ProfileCustomBlock;
  accentColor: string;
  contrastColor?: string;
  softColor?: string;
  dnaTuning?: ProfileDnaTuning;
  preview?: boolean;
  compact?: boolean;
};

type CardMeta = {
  badge: string;
  title: string;
  description: string | null;
  icon: typeof LuSparkles;
};

export default function ProfileCustomBlock({
  block,
  accentColor,
  contrastColor = accentColor,
  softColor = "#f5f7ff",
  dnaTuning = getProfileDnaTuning(null),
  preview = false,
  compact = false,
}: Props) {
  const resolvedAccent = block.accentColor || accentColor;
  const textAlign = resolveTextAlign(block.alignment);
  const lineAlign = resolveLineAlign(block.alignment);
  const frameStyle = customBlockFrameStyle(
    block,
    resolvedAccent,
    contrastColor,
    dnaTuning,
    compact,
  );

  if (block.type === "divider") {
    return (
      <div style={frameStyle}>
        <div
          style={{
            display: "grid",
            gap: "8px",
            justifyItems: lineAlign,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: block.width === "compact" ? "260px" : "420px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${withAlpha(resolvedAccent, block.glow ? "b8" : "72")}, transparent)`,
              boxShadow: block.glow
                ? `0 0 12px ${withAlpha(resolvedAccent, "28")}`
                : "none",
            }}
          />
          {block.text ? (
            <span style={customLabelStyle(resolvedAccent, textAlign, dnaTuning)}>
              <LuMinus size={11} />
              {block.text}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div style={frameStyle}>
        <style>{sharedStyles}</style>
        <div className="profile-custom-card-shell quote" style={{ textAlign }}>
          <div className="profile-custom-card-glow" style={cardGlowStyle(resolvedAccent)} />
          <div className="profile-custom-card-content quote">
            <span style={customLabelStyle(resolvedAccent, textAlign, dnaTuning)}>
              <LuMessageSquareQuote size={12} />
              About
            </span>
            <div
              style={{
                color: softColor,
                fontSize: `${Math.max(13, Math.round((compact ? 14 : 15) * dnaTuning.typographyScale))}px`,
                fontWeight: 600,
                lineHeight: 1.72,
                fontStyle: "italic",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {block.text || "quiet signal"}
            </div>
            {block.secondaryText ? (
              <div style={descriptionStyle(dnaTuning, compact)}>{block.secondaryText}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const meta = getInfoCardMeta(block);
  const hasLink = Boolean(block.linkUrl && !preview);

  return (
    <div style={frameStyle}>
      <style>{sharedStyles}</style>
      <div
        className={[
          "profile-custom-card-shell",
          "info",
          `type-${block.type}`,
          block.imageUrl ? "has-image" : "",
          hasLink ? "has-link" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          minHeight:
            block.type === "image-card"
              ? `${Math.max(180, Math.round((compact ? 196 : 224) * dnaTuning.compactnessScale))}px`
              : `${Math.max(126, Math.round((compact ? 138 : 154) * dnaTuning.compactnessScale))}px`,
        }}
      >
        <div className="profile-custom-card-glow" style={cardGlowStyle(resolvedAccent)} />
        {block.imageUrl ? (
          <div className="profile-custom-card-media">
            <img
              src={block.imageUrl}
              alt={meta.title}
              className="profile-custom-card-media-image"
            />
            <div
              className="profile-custom-card-media-overlay"
              style={cardMediaOverlayStyle(resolvedAccent, block.type)}
            />
          </div>
        ) : null}

        <div className="profile-custom-card-content">
          <div className="profile-custom-card-head">
            <span style={customLabelStyle(resolvedAccent, "left", dnaTuning)}>
              <meta.icon size={12} />
              {meta.badge}
            </span>

            {hasLink ? (
              <a
                href={block.linkUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="profile-custom-card-link"
                style={linkButtonStyle(resolvedAccent)}
              >
                Open
                <LuArrowUpRight size={13} />
              </a>
            ) : null}
          </div>

          <div className="profile-custom-card-copy" style={{ textAlign }}>
            <div style={titleStyle(dnaTuning, compact, block.type, softColor)}>{meta.title}</div>
            {meta.description ? (
              <div style={descriptionStyle(dnaTuning, compact)}>{meta.description}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function getInfoCardMeta(block: ProfileCustomBlock): CardMeta {
  if (block.type === "image-card") {
    return {
      badge: "Gallery",
      title: block.text || "Featured project",
      description: block.secondaryText || "Visual card",
      icon: LuGalleryHorizontal,
    };
  }

  if (block.type === "status-banner") {
    return {
      badge: "Update",
      title: block.text || "Current status",
      description: block.secondaryText || "Small timeline update",
      icon: LuPanelTop,
    };
  }

  if (block.type === "mood") {
    return {
      badge: "Interest",
      title: block.text || "Current mood",
      description: block.secondaryText || "Ambient profile detail",
      icon: LuSparkles,
    };
  }

  if (block.type === "favorite-song") {
    return {
      badge: "Favorite song",
      title: block.text || "Defining track",
      description: block.secondaryText || "The song that colors the scene",
      icon: LuMusic4,
    };
  }

  if (block.type === "favorite-game") {
    return {
      badge: "Favorite game",
      title: block.text || "Current all-time favorite",
      description: block.secondaryText || "A world worth revisiting",
      icon: LuGamepad2,
    };
  }

  if (block.type === "github-repo") {
    return {
      badge: "GitHub repo",
      title: block.text || "Featured repository",
      description: block.secondaryText || "Build log, source code, or experiment",
      icon: LuGithub,
    };
  }

  if (block.type === "current-project") {
    return {
      badge: "Current project",
      title: block.text || "Shipping now",
      description: block.secondaryText || "What is actively in motion",
      icon: LuSparkles,
    };
  }

  if (block.type === "favorite-anime") {
    return {
      badge: "Favorite anime",
      title: block.text || "Story world",
      description: block.secondaryText || "A series that left a mark",
      icon: LuTv,
    };
  }

  if (block.type === "setup-desk") {
    return {
      badge: "Setup",
      title: block.text || "Desk scene",
      description: block.secondaryText || "Tools, lighting, and atmosphere",
      icon: LuMonitorSmartphone,
    };
  }

  if (block.type === "playlist") {
    return {
      badge: "Playlist",
      title: block.text || "Curated rotation",
      description: block.secondaryText || "A public listening portal",
      icon: LuMusic4,
    };
  }

  return {
    badge: "Detail",
    title: block.text || "Profile note",
    description: block.secondaryText || "Small profile detail",
    icon: LuMessageSquareQuote,
  };
}

function customBlockFrameStyle(
  block: ProfileCustomBlock,
  accentColor: string,
  contrastColor: string,
  dnaTuning: ProfileDnaTuning,
  compact: boolean,
): CSSProperties {
  const borderAlpha = block.transparency ? "10" : "1c";
  const backgroundAlphaTop = block.transparency ? "0a" : "12";
  const backgroundAlphaBottom = block.transparency ? "46" : "68";
  const compactnessScale = compact ? dnaTuning.compactnessScale : 1;
  const borderTone =
    dnaTuning.borderScale >= 1.12 ? "30" : dnaTuning.borderScale <= 0.82 ? "16" : borderAlpha;
  const backgroundTop =
    dnaTuning.transparencyScale >= 1.12
      ? "0c"
      : dnaTuning.transparencyScale <= 0.94
        ? "1a"
        : backgroundAlphaTop;
  const backgroundBottom =
    dnaTuning.transparencyScale >= 1.12
      ? "48"
      : dnaTuning.transparencyScale <= 0.94
        ? "84"
        : backgroundAlphaBottom;
  const blurFilter = block.transparency
    ? `blur(${Math.max(6, Math.round(8 * dnaTuning.blurScale))}px) saturate(${Math.round(
        106 + (dnaTuning.glowScale - 1) * 14,
      )}%)`
    : "none";
  const baseShadow = block.glow
    ? `0 ${Math.round(12 * dnaTuning.shadowScale)}px ${Math.round(24 * dnaTuning.shadowScale)}px ${withAlpha(
        accentColor,
        dnaTuning.glowScale >= 1.1 ? "18" : "14",
      )}, inset 0 1px 0 rgba(255,255,255,0.04)`
    : block.type === "divider"
      ? "none"
      : `0 ${Math.round(10 * dnaTuning.shadowScale)}px ${Math.round(20 * dnaTuning.shadowScale)}px ${withAlpha(
          contrastColor,
          dnaTuning.shadowScale <= 0.86 ? "08" : "0e",
        )}, inset 0 1px 0 rgba(255,255,255,0.03)`;

  return {
    width: "100%",
    minWidth: 0,
    overflow: "visible",
    padding:
      block.type === "divider"
        ? compact
          ? `${Math.max(7, Math.round(8 * compactnessScale))}px ${Math.max(9, Math.round(10 * compactnessScale))}px`
          : `${Math.max(9, Math.round(10 * compactnessScale))}px ${Math.max(11, Math.round(12 * compactnessScale))}px`
        : compact
          ? `${Math.max(10, Math.round(11 * compactnessScale))}px ${Math.max(11, Math.round(12 * compactnessScale))}px`
          : `${Math.max(13, Math.round(14 * compactnessScale))}px ${Math.max(13, Math.round(14 * compactnessScale))}px`,
    borderRadius:
      block.type === "divider"
        ? "18px"
        : block.type === "text-strip" || block.type === "status-banner"
          ? "24px"
          : block.type === "image-card"
            ? "26px"
            : "24px",
    border: `1px solid ${withAlpha(accentColor, borderTone)}`,
    background:
      block.type === "divider"
        ? "transparent"
        : `linear-gradient(180deg, ${withAlpha(accentColor, backgroundTop)}, rgba(8,10,16,${backgroundBottom}))`,
    boxShadow: baseShadow,
    backdropFilter: blurFilter,
    WebkitBackdropFilter: blurFilter,
  };
}

function titleStyle(
  dnaTuning: ProfileDnaTuning,
  compact: boolean,
  type: ProfileCustomBlock["type"],
  softColor: string,
): CSSProperties {
  return {
    color: softColor,
    fontSize: `${Math.max(
      type === "image-card" ? 15 : 13,
      Math.round((compact ? (type === "image-card" ? 16 : 14) : type === "image-card" ? 18 : 15) * dnaTuning.typographyScale),
    )}px`,
    lineHeight: type === "image-card" ? 1.28 : 1.38,
    fontWeight: type === "image-card" ? 800 : 750,
    letterSpacing: "-0.015em",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  };
}

function descriptionStyle(
  dnaTuning: ProfileDnaTuning,
  compact: boolean,
): CSSProperties {
  return {
    color: "#c4d0e4",
    fontSize: `${Math.max(11, Math.round((compact ? 12 : 13) * dnaTuning.typographyScale))}px`,
    lineHeight: 1.62,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  };
}

function linkButtonStyle(accentColor: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    color: "#f5f8ff",
    background: `linear-gradient(180deg, ${withAlpha(accentColor, "18")}, rgba(8,10,16,0.48))`,
    border: `1px solid ${withAlpha(accentColor, "34")}`,
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.03em",
    boxShadow: `0 8px 18px ${withAlpha(accentColor, "10")}`,
  };
}

function cardGlowStyle(accentColor: string): CSSProperties {
  return {
    background: `
      radial-gradient(circle at 14% 18%, ${withAlpha(accentColor, "18")} 0%, transparent 32%),
      radial-gradient(circle at 84% 14%, ${withAlpha(accentColor, "0c")} 0%, transparent 22%),
      linear-gradient(120deg, rgba(255,255,255,0.035), transparent 18%)
    `,
  };
}

function cardMediaOverlayStyle(
  accentColor: string,
  type: ProfileCustomBlock["type"],
): CSSProperties {
  return {
    background:
      type === "image-card"
        ? `linear-gradient(180deg, rgba(4,6,10,0.08), rgba(4,6,10,0.18) 34%, rgba(4,6,10,0.82) 100%), radial-gradient(circle at top, ${withAlpha(accentColor, "18")} 0%, transparent 38%)`
        : `linear-gradient(180deg, rgba(4,6,10,0.22), rgba(4,6,10,0.66) 100%), radial-gradient(circle at top, ${withAlpha(accentColor, "14")} 0%, transparent 40%)`,
  };
}

function customLabelStyle(
  accentColor: string,
  textAlign: CSSProperties["textAlign"],
  dnaTuning = getProfileDnaTuning(null),
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: `${Math.max(5, Math.round(6 * dnaTuning.chipScale))}px`,
    justifySelf:
      textAlign === "left"
        ? "start"
        : textAlign === "right"
          ? "end"
          : "center",
    width: "fit-content",
    minHeight: `${Math.max(20, Math.round(22 * dnaTuning.chipScale))}px`,
    padding: `0 ${Math.max(7, Math.round(8 * dnaTuning.chipScale))}px`,
    borderRadius: "999px",
    border: `1px solid ${withAlpha(accentColor, dnaTuning.borderScale >= 1.08 ? "2c" : "24")}`,
    background: withAlpha(accentColor, dnaTuning.transparencyScale >= 1.08 ? "12" : "14"),
    color: "#eef4ff",
    fontSize: `${Math.max(9, Math.round(10 * dnaTuning.chipScale))}px`,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

function resolveTextAlign(alignment: ProfileCustomBlockAlignment) {
  return alignment === "start"
    ? "left"
    : alignment === "end"
      ? "right"
      : "center";
}

function resolveLineAlign(alignment: ProfileCustomBlockAlignment) {
  return alignment === "start"
    ? "start"
    : alignment === "end"
      ? "end"
      : "center";
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

const sharedStyles = `
  .profile-custom-card-shell {
    position: relative;
    overflow: hidden;
    min-width: 0;
    border-radius: inherit;
    isolation: isolate;
  }

  .profile-custom-card-shell.info {
    transition:
      transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .profile-custom-card-shell.info.has-link:hover,
  .profile-custom-card-shell.info.has-link:focus-within,
  .profile-custom-card-shell.info:hover {
    transform: translateY(-1px);
  }

  .profile-custom-card-glow,
  .profile-custom-card-media,
  .profile-custom-card-media-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .profile-custom-card-glow {
    opacity: 0.7;
  }

  .profile-custom-card-media-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }

  .profile-custom-card-content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 12px;
    min-height: inherit;
  }

  .profile-custom-card-content.quote {
    gap: 10px;
  }

  .profile-custom-card-head {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .profile-custom-card-copy {
    display: grid;
    gap: 8px;
    margin-top: auto;
    min-width: 0;
  }

  .profile-custom-card-link {
    transition:
      transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .profile-custom-card-link:hover,
  .profile-custom-card-link:focus-visible {
    transform: translateY(-1px);
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .profile-custom-card-shell.info,
    .profile-custom-card-link {
      transition: none !important;
      transform: none !important;
    }
  }
`;
