"use client";

import type { CSSProperties } from "react";
import {
  LuGalleryHorizontal,
  LuMinus,
  LuMessageSquareQuote,
  LuPanelTop,
  LuSparkles,
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
                ? `0 0 18px ${withAlpha(resolvedAccent, "40")}`
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
        <div style={{ display: "grid", gap: "10px", textAlign }}>
          <span style={customLabelStyle(resolvedAccent, textAlign, dnaTuning)}>
            <LuMessageSquareQuote size={12} />
            Quote
          </span>
          <div
            style={{
              color: softColor,
              fontSize: `${Math.max(13, Math.round((compact ? 14 : 15) * dnaTuning.typographyScale))}px`,
              fontWeight: 600,
              lineHeight: 1.68,
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {block.text || "quiet signal"}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "text-strip") {
    return (
      <div style={frameStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: justifyContentForAlignment(block.alignment),
          }}
        >
          <div
            style={{
              color: softColor,
              fontSize: `${Math.max(10, Math.round((compact ? 11 : 12) * dnaTuning.typographyScale))}px`,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              textAlign,
            }}
          >
            {block.text || "ambient note"}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "mood") {
    return (
      <div style={frameStyle}>
        <div style={{ display: "grid", gap: "8px", textAlign }}>
            <span style={customLabelStyle(resolvedAccent, textAlign, dnaTuning)}>
            <LuSparkles size={12} />
            Mood
          </span>
          <div
            style={{
              color: "#f8fbff",
              fontSize: `${Math.max(13, Math.round((compact ? 14 : 15) * dnaTuning.typographyScale))}px`,
              fontWeight: 800,
            }}
          >
            {block.text || "soft atmosphere"}
          </div>
          {block.secondaryText ? (
            <div
              style={{
                color: "#b8c2d6",
                fontSize: `${Math.max(11, Math.round(12 * dnaTuning.typographyScale))}px`,
                lineHeight: 1.55,
              }}
            >
              {block.secondaryText}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (block.type === "image-card") {
    return (
      <div style={frameStyle}>
        <div style={{ display: "grid", gap: "10px" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: compact ? "14px" : "16px",
              minHeight: `${Math.max(118, Math.round((compact ? 132 : 156) * dnaTuning.compactnessScale))}px`,
              border: `1px solid ${withAlpha(resolvedAccent, dnaTuning.borderScale > 1 ? "28" : "1c")}`,
              background:
                block.imageUrl || !preview
                  ? "rgba(255,255,255,0.03)"
                  : `linear-gradient(135deg, ${withAlpha(resolvedAccent, "16")}, rgba(10,12,18,0.94))`,
            }}
          >
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.text || block.secondaryText || "Profile image card"}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : preview ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "#d9e2f2",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                  <span style={customLabelStyle(resolvedAccent, "center", dnaTuning)}>
                  <LuGalleryHorizontal size={12} />
                  Image card
                </span>
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(4,6,10,0.08), rgba(4,6,10,0.18) 42%, rgba(4,6,10,0.7) 100%)",
              }}
            />
          </div>
          {block.text || block.secondaryText ? (
            <div style={{ display: "grid", gap: "4px", textAlign }}>
              {block.text ? (
                <div
                  style={{
                    color: "#f4f7ff",
                    fontSize: `${Math.max(12, Math.round(13 * dnaTuning.typographyScale))}px`,
                    fontWeight: 700,
                  }}
                >
                  {block.text}
                </div>
              ) : null}
              {block.secondaryText ? (
                <div
                  style={{
                    color: "#b8c2d6",
                    fontSize: `${Math.max(11, Math.round(12 * dnaTuning.typographyScale))}px`,
                    lineHeight: 1.55,
                  }}
                >
                  {block.secondaryText}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      <div style={{ display: "grid", gap: "8px", textAlign }}>
        <span style={customLabelStyle(resolvedAccent, textAlign, dnaTuning)}>
          <LuPanelTop size={12} />
          Status
        </span>
        <div
          style={{
            color: "#f8fbff",
            fontSize: `${Math.max(12, Math.round((compact ? 13 : 14) * dnaTuning.typographyScale))}px`,
            fontWeight: 800,
          }}
        >
          {block.text || "status banner"}
        </div>
        {block.secondaryText ? (
          <div
            style={{
              color: "#bfd1e8",
              fontSize: `${Math.max(11, Math.round(12 * dnaTuning.typographyScale))}px`,
              lineHeight: 1.55,
            }}
          >
            {block.secondaryText}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function customBlockFrameStyle(
  block: ProfileCustomBlock,
  accentColor: string,
  contrastColor: string,
  dnaTuning: ProfileDnaTuning,
  compact: boolean,
): CSSProperties {
  const borderAlpha = block.transparency ? "16" : "28";
  const backgroundAlphaTop = block.transparency ? "12" : "20";
  const backgroundAlphaBottom = block.transparency ? "80" : "94";
  const compactnessScale = compact ? dnaTuning.compactnessScale : 1;
  const borderTone =
    dnaTuning.borderScale >= 1.12 ? "38" : dnaTuning.borderScale <= 0.82 ? "18" : borderAlpha;
  const backgroundTop =
    dnaTuning.transparencyScale >= 1.12
      ? "10"
      : dnaTuning.transparencyScale <= 0.94
        ? "24"
        : backgroundAlphaTop;
  const backgroundBottom =
    dnaTuning.transparencyScale >= 1.12
      ? "76"
      : dnaTuning.transparencyScale <= 0.94
        ? "98"
        : backgroundAlphaBottom;
  const blurFilter = block.transparency
    ? `blur(${Math.max(6, Math.round(8 * dnaTuning.blurScale))}px) saturate(${Math.round(
        104 + (dnaTuning.glowScale - 1) * 22,
      )}%)`
    : "none";
  const baseShadow = block.glow
    ? `0 ${Math.round(14 * dnaTuning.shadowScale)}px ${Math.round(32 * dnaTuning.shadowScale)}px ${withAlpha(
        accentColor,
        dnaTuning.glowScale >= 1.1 ? "22" : "18",
      )}, inset 0 1px 0 rgba(255,255,255,0.04)`
    : block.type === "divider"
      ? "none"
      : `0 ${Math.round(12 * dnaTuning.shadowScale)}px ${Math.round(26 * dnaTuning.shadowScale)}px ${withAlpha(
          contrastColor,
          dnaTuning.shadowScale <= 0.86 ? "0d" : "12",
        )}, inset 0 1px 0 rgba(255,255,255,0.03)`;

  return {
    width: "100%",
    minWidth: 0,
    padding:
      block.type === "divider"
        ? compact
          ? `${Math.max(7, Math.round(8 * compactnessScale))}px ${Math.max(9, Math.round(10 * compactnessScale))}px`
          : `${Math.max(9, Math.round(10 * compactnessScale))}px ${Math.max(11, Math.round(12 * compactnessScale))}px`
        : compact
          ? `${Math.max(10, Math.round(11 * compactnessScale))}px ${Math.max(11, Math.round(12 * compactnessScale))}px`
          : `${Math.max(12, Math.round(13 * compactnessScale))}px ${Math.max(13, Math.round(14 * compactnessScale))}px`,
    borderRadius:
      block.type === "text-strip" || block.type === "status-banner"
        ? "999px"
        : block.type === "divider"
          ? "18px"
          : "18px",
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

function justifyContentForAlignment(alignment: ProfileCustomBlockAlignment) {
  return alignment === "start"
    ? "flex-start"
    : alignment === "end"
      ? "flex-end"
      : "center";
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}
