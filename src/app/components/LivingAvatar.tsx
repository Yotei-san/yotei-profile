import type { CSSProperties } from "react";
import { getStarterDecorationDefinition } from "@/app/lib/decorations";

type DecorationData = {
  id?: string;
  name?: string;
  slug: string;
  imageUrl: string;
  previewUrl?: string | null;
  posterUrl?: string | null;
  mediaType?: string | null;
  overlayScale?: number | null;
  overlayOffsetY?: number | null;
};

type Props = {
  avatarUrl: string | null;
  avatarInitials: string;
  avatarAlt: string;
  selectedDecoration?: DecorationData | null;
  themeColor: string;
  accentColor: string;
  contrastColor: string;
  softColor: string;
  pulseColor: string;
  auraBackground: string;
  ringColor: string;
  glowColor: string;
  size: number;
  frameInset: number;
  decorationScale?: number;
  decorationOffsetX?: number;
  decorationOffsetY?: number;
  minimal?: boolean;
};

export default function LivingAvatar({
  avatarUrl,
  avatarInitials,
  avatarAlt,
  selectedDecoration,
  themeColor,
  accentColor,
  contrastColor,
  softColor,
  pulseColor,
  auraBackground,
  ringColor,
  glowColor,
  size,
  frameInset,
  decorationScale = 165,
  decorationOffsetX = 0,
  decorationOffsetY = 0,
  minimal = false,
}: Props) {
  const starter = getStarterDecorationDefinition(selectedDecoration?.slug);

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <style>{livingAvatarStyles}</style>

      {minimal ? null : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            background: auraBackground,
            filter: "blur(16px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {selectedDecoration ? (
        starter ? (
          <StarterDecorationLayer
            slug={selectedDecoration.slug}
            size={size}
            accentColor={accentColor}
            contrastColor={contrastColor}
            softColor={softColor}
            pulseColor={pulseColor}
            glowColor={glowColor}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(${decorationOffsetX}px, ${decorationOffsetY}px)`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            {selectedDecoration.mediaType === "webm" ? (
              <video
                src={selectedDecoration.imageUrl}
                poster={selectedDecoration.posterUrl || selectedDecoration.previewUrl || undefined}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: `${decorationScale}%`,
                  height: `${decorationScale}%`,
                  objectFit: "contain",
                  filter: `drop-shadow(0 0 18px ${glowColor})`,
                }}
              />
            ) : (
              <img
                src={selectedDecoration.previewUrl || selectedDecoration.imageUrl}
                alt={selectedDecoration.name || "Avatar decoration"}
                style={{
                  width: `${decorationScale}%`,
                  height: `${decorationScale}%`,
                  objectFit: "contain",
                  filter: `drop-shadow(0 0 18px ${glowColor})`,
                }}
              />
            )}
          </div>
        )
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: `${frameInset}px`,
          borderRadius: "999px",
          overflow: "hidden",
          border: minimal
            ? "1px solid rgba(255,255,255,0.10)"
            : `1px solid ${ringColor}`,
          background: "linear-gradient(180deg, rgba(8, 9, 16, 0.96), rgba(11, 12, 20, 0.98))",
          boxShadow: minimal
            ? "0 12px 24px rgba(0,0,0,0.18)"
            : `0 18px 36px ${glowColor}`,
          zIndex: 3,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={avatarAlt}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(145deg, ${withAlpha(themeColor, "f0")} 0%, rgba(255, 110, 168, 0.9) 56%, rgba(90, 169, 255, 0.84) 100%)`,
              color: "#ffffff",
              fontSize: `${Math.round(size * 0.28)}px`,
              fontWeight: 900,
              letterSpacing: "-0.06em",
            }}
          >
            {avatarInitials}
          </div>
        )}
      </div>
    </div>
  );
}

function StarterDecorationLayer({
  slug,
  size,
  accentColor,
  contrastColor,
  softColor,
  pulseColor,
  glowColor,
}: {
  slug: string;
  size: number;
  accentColor: string;
  contrastColor: string;
  softColor: string;
  pulseColor: string;
  glowColor: string;
}) {
  const ringInset = Math.max(2, Math.round(size * 0.04));
  const outerInset = Math.max(-8, Math.round(size * -0.03));

  if (slug === "neon-pulse") {
    return (
      <>
        <div
          className="living-pulse-ring"
          style={ringStyle(ringInset, accentColor, `0 0 26px ${withAlpha(accentColor, "2c")}`)}
        />
        <div
          className="living-pulse-wave"
          style={ringStyle(outerInset, pulseColor, `0 0 20px ${withAlpha(pulseColor, "24")}`)}
        />
      </>
    );
  }

  if (slug === "galaxy-orbit") {
    return (
      <>
        <div
          style={ringStyle(ringInset, softColor, `0 0 24px ${withAlpha(contrastColor, "24")}`)}
        />
        <div className="living-orbit-track" style={orbitTrackStyle(outerInset)}>
          <i style={orbitDotStyle(accentColor, "8%", "50%")} />
          <i style={orbitDotStyle(softColor, "50%", "8%")} />
          <i style={orbitDotStyle(contrastColor, "84%", "54%")} />
        </div>
      </>
    );
  }

  if (slug === "void-ring") {
    return (
      <>
        <div
          style={{
            ...ringStyle(ringInset, contrastColor, `0 0 22px ${withAlpha(glowColor, "22")}`),
            background:
              `radial-gradient(circle, transparent 64%, ${withAlpha(contrastColor, "1a")} 74%, transparent 80%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: `${Math.round(size * 0.08)}px`,
            borderRadius: "999px",
            boxShadow: `0 0 0 1px ${withAlpha(softColor, "16")}, inset 0 0 24px ${withAlpha(contrastColor, "20")}`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

  if (slug === "cyber-scanline") {
    return (
      <>
        <div
          style={{
            ...ringStyle(ringInset, accentColor, `0 0 18px ${withAlpha(accentColor, "20")}`),
            borderStyle: "dashed",
          }}
        />
        <div className="living-scan-arc" style={scanArcStyle(outerInset, accentColor)} />
        <div
          style={{
            position: "absolute",
            inset: `${Math.round(size * 0.14)}px`,
            borderRadius: "999px",
            background:
              `repeating-linear-gradient(180deg, ${withAlpha(softColor, "08")} 0 2px, transparent 2px 8px)`,
            maskImage:
              "radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

  if (slug === "fire-ember") {
    return (
      <>
        <div
          style={ringStyle(ringInset, pulseColor, `0 0 22px ${withAlpha(pulseColor, "24")}`)}
        />
        <i className="living-ember ember-a" style={emberStyle(accentColor, "14%", "68%")} />
        <i className="living-ember ember-b" style={emberStyle(pulseColor, "80%", "22%")} />
        <i className="living-ember ember-c" style={emberStyle(softColor, "68%", "82%")} />
      </>
    );
  }

  if (slug === "frost-halo") {
    return (
      <>
        <div
          style={{
            ...ringStyle(ringInset, softColor, `0 0 20px ${withAlpha(softColor, "22")}`),
            borderStyle: "solid",
          }}
        />
        <div
          style={{
            ...ringStyle(outerInset, accentColor, "none"),
            borderStyle: "dashed",
            opacity: 0.72,
          }}
        />
      </>
    );
  }

  if (slug === "owner-crown") {
    return (
      <>
        <div
          style={ringStyle(ringInset, "#f4cf7c", `0 0 24px ${withAlpha("#f4cf7c", "28")}`)}
        />
        <div className="living-owner-crown" style={crownWrapStyle}>
          <svg viewBox="0 0 120 48" fill="none" width="92" height="40" aria-hidden>
            <path
              d="M10 38 L20 14 L44 30 L60 8 L76 30 L100 14 L110 38"
              stroke="#f4cf7c"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 38 H102"
              stroke="#f4cf7c"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </>
    );
  }

  return (
    <div
      style={ringStyle(ringInset, accentColor, `0 0 18px ${withAlpha(accentColor, "20")}`)}
    />
  );
}

function ringStyle(inset: number, color: string, boxShadow: string): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    border: `2px solid ${withAlpha(color, "ba")}`,
    boxShadow,
    zIndex: 1,
    pointerEvents: "none",
  };
}

function orbitTrackStyle(inset: number): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    animation: "living-orbit 12s linear infinite",
    zIndex: 1,
    pointerEvents: "none",
  };
}

function orbitDotStyle(color: string, left: string, top: string): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: color,
    boxShadow: `0 0 14px ${withAlpha(color, "28")}`,
  };
}

function scanArcStyle(inset: number, color: string): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    borderTop: `3px solid ${withAlpha(color, "e2")}`,
    borderRight: `3px solid ${withAlpha(color, "32")}`,
    borderBottom: "3px solid transparent",
    borderLeft: "3px solid transparent",
    animation: "living-orbit 7.5s linear infinite",
    zIndex: 1,
    pointerEvents: "none",
  };
}

function emberStyle(color: string, left: string, top: string): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: color,
    boxShadow: `0 0 12px ${withAlpha(color, "26")}`,
    zIndex: 1,
    pointerEvents: "none",
  };
}

const crownWrapStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "-6px",
  transform: "translateX(-50%)",
  filter: "drop-shadow(0 6px 14px rgba(244, 207, 124, 0.22))",
  zIndex: 1,
  pointerEvents: "none",
};

const livingAvatarStyles = `
  .living-pulse-wave {
    animation: living-pulse-wave 2.6s ease-in-out infinite;
  }

  .living-orbit-track {
    animation: living-orbit 12s linear infinite;
  }

  .living-scan-arc {
    animation: living-orbit 7.5s linear infinite;
  }

  .living-owner-crown {
    animation: living-crown-float 3.8s ease-in-out infinite;
  }

  .living-ember {
    animation: living-ember-rise 4.4s ease-in-out infinite;
  }

  .living-ember.ember-b {
    animation-delay: 0.9s;
  }

  .living-ember.ember-c {
    animation-delay: 1.6s;
  }

  @keyframes living-pulse-wave {
    0%, 100% {
      opacity: 0.4;
      transform: scale(0.96);
    }

    50% {
      opacity: 0.95;
      transform: scale(1.02);
    }
  }

  @keyframes living-orbit {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @keyframes living-crown-float {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }

    50% {
      transform: translateX(-50%) translateY(-3px);
    }
  }

  @keyframes living-ember-rise {
    0%, 100% {
      opacity: 0.45;
      transform: translateY(0) scale(0.9);
    }

    50% {
      opacity: 0.95;
      transform: translateY(-6px) scale(1.08);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .living-pulse-wave,
    .living-orbit-track,
    .living-scan-arc,
    .living-owner-crown,
    .living-ember {
      animation: none !important;
    }
  }
`;

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}
