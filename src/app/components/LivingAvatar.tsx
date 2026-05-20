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
  interactive?: boolean;
  emphasized?: boolean;
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
  interactive = false,
  emphasized = false,
}: Props) {
  const starter = getStarterDecorationDefinition(selectedDecoration?.slug);
  const rootClassName = [
    "living-avatar-root",
    interactive ? "is-interactive" : "",
    emphasized ? "is-emphasized" : "",
    minimal ? "is-minimal" : "",
    starter ? `has-${starter.slug}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClassName}
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
            filter: "blur(14px)",
            transform: "scale(1.1)",
            opacity: emphasized ? 0.92 : 0.78,
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
  const innerInset = Math.max(8, Math.round(size * 0.11));
  const coreInset = Math.max(14, Math.round(size * 0.17));

  if (slug === "neon-pulse") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-neon-core"
          style={fillHaloStyle(innerInset, accentColor, 0.26)}
        />
        <div
          className="living-ring living-neon-rotate"
          style={ringStyle(ringInset, accentColor, `0 0 22px ${withAlpha(accentColor, "24")}`)}
        />
        <div
          className="living-ring living-neon-pulse"
          style={ringStyle(outerInset, pulseColor, `0 0 18px ${withAlpha(pulseColor, "20")}`)}
        />
        <div
          className="living-inner-shine"
          style={innerRingStyle(coreInset, softColor, 0.52)}
        />
      </div>
    );
  }

  if (slug === "galaxy-orbit") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-galaxy-halo"
          style={fillHaloStyle(innerInset, contrastColor, 0.18)}
        />
        <div
          className="living-ring"
          style={ringStyle(ringInset, softColor, `0 0 20px ${withAlpha(contrastColor, "20")}`)}
        />
        <div className="living-orbit-track orbit-alpha" style={orbitTrackStyle(outerInset)}>
          <i style={orbitDotStyle(accentColor, "8%", "50%", 10)} />
          <i style={orbitDotStyle(softColor, "50%", "8%", 8)} />
          <i style={orbitDotStyle(contrastColor, "84%", "54%", 9)} />
        </div>
        <div
          className="living-orbit-track orbit-beta"
          style={orbitTrackStyle(Math.max(-14, outerInset - 6))}
        >
          <i style={orbitDotStyle(softColor, "18%", "18%", 6)} />
          <i style={orbitDotStyle(accentColor, "66%", "86%", 7)} />
        </div>
        <i className="living-sparkle star-a" style={sparkleStyle("14%", "22%", softColor)} />
        <i className="living-sparkle star-b" style={sparkleStyle("82%", "24%", accentColor)} />
        <i className="living-sparkle star-c" style={sparkleStyle("76%", "78%", contrastColor)} />
      </div>
    );
  }

  if (slug === "void-ring") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-void-shadow"
          style={fillHaloStyle(innerInset, contrastColor, 0.16)}
        />
        <div
          className="living-ring living-void-breathe"
          style={{
            ...ringStyle(ringInset, contrastColor, `0 0 22px ${withOpacity(glowColor, 0.22)}`),
            background:
              `radial-gradient(circle, transparent 63%, ${withAlpha(contrastColor, "14")} 73%, transparent 80%)`,
          }}
        />
        <div
          className="living-void-distortion"
          style={{
            position: "absolute",
            inset: `${Math.round(size * 0.07)}px`,
            borderRadius: "999px",
            border: `1px solid ${withAlpha(softColor, "12")}`,
            background:
              `conic-gradient(from 90deg, transparent 0deg, ${withAlpha(contrastColor, "16")} 44deg, transparent 108deg, ${withAlpha(accentColor, "10")} 170deg, transparent 230deg, ${withAlpha(softColor, "12")} 290deg, transparent 360deg)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (slug === "cyber-scanline") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-cyber-core"
          style={fillHaloStyle(innerInset, accentColor, 0.18)}
        />
        <div
          className="living-ring living-cyber-dash"
          style={{
            ...ringStyle(ringInset, accentColor, `0 0 18px ${withAlpha(accentColor, "20")}`),
            borderStyle: "dashed",
            borderWidth: "2px",
          }}
        />
        <div className="living-scan-arc" style={scanArcStyle(outerInset, accentColor)} />
        <div
          className="living-scanline-sweep"
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
      </div>
    );
  }

  if (slug === "fire-ember") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-fire-breathe"
          style={fillHaloStyle(innerInset, pulseColor, 0.22)}
        />
        <div
          className="living-ring"
          style={ringStyle(ringInset, pulseColor, `0 0 20px ${withAlpha(pulseColor, "22")}`)}
        />
        <i className="living-ember ember-a" style={emberStyle(accentColor, "14%", "68%", 8)} />
        <i className="living-ember ember-b" style={emberStyle(pulseColor, "80%", "22%", 7)} />
        <i className="living-ember ember-c" style={emberStyle(softColor, "68%", "82%", 6)} />
        <i className="living-ember ember-d" style={emberStyle(accentColor, "48%", "86%", 5)} />
      </div>
    );
  }

  if (slug === "frost-halo") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-frost-breathe"
          style={fillHaloStyle(innerInset, softColor, 0.18)}
        />
        <div
          className="living-ring"
          style={{
            ...ringStyle(ringInset, softColor, `0 0 20px ${withAlpha(softColor, "22")}`),
            borderStyle: "solid",
          }}
        />
        <div
          className="living-frost-outer"
          style={{
            ...ringStyle(outerInset, accentColor, "none"),
            borderStyle: "dashed",
            opacity: 0.72,
          }}
        />
        <i className="living-sparkle frost-a" style={sparkleStyle("16%", "28%", softColor)} />
        <i className="living-sparkle frost-b" style={sparkleStyle("82%", "32%", accentColor)} />
        <i className="living-sparkle frost-c" style={sparkleStyle("68%", "76%", "#dff7ff")} />
      </div>
    );
  }

  if (slug === "owner-crown") {
    return (
      <div className="living-decoration-shell">
        <div
          className="living-owner-halo"
          style={fillHaloStyle(innerInset, "#f4cf7c", 0.2)}
        />
        <div
          className="living-ring"
          style={ringStyle(ringInset, "#f4cf7c", `0 0 22px ${withAlpha("#f4cf7c", "24")}`)}
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
        <div className="living-owner-shine" style={shineSweepStyle(innerInset)} />
      </div>
    );
  }

  return (
    <div className="living-decoration-shell">
      <div
        className="living-minimal-core"
        style={fillHaloStyle(innerInset, accentColor, 0.14)}
      />
      <div
        className="living-ring"
        style={ringStyle(ringInset, accentColor, `0 0 16px ${withAlpha(accentColor, "1a")}`)}
      />
      <div
        className="living-minimal-outer"
        style={innerRingStyle(Math.max(1, outerInset + 9), softColor, 0.38)}
      />
    </div>
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
    zIndex: 1,
    pointerEvents: "none",
  };
}

function orbitDotStyle(color: string, left: string, top: string, size: number): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "999px",
    background: color,
    boxShadow: `0 0 10px ${withAlpha(color, "24")}`,
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
    zIndex: 1,
    pointerEvents: "none",
  };
}

function emberStyle(color: string, left: string, top: string, size: number): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "999px",
    background: color,
    boxShadow: `0 0 10px ${withAlpha(color, "22")}`,
    zIndex: 1,
    pointerEvents: "none",
  };
}

function sparkleStyle(left: string, top: string, color: string): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: "7px",
    height: "7px",
    borderRadius: "999px",
    background: color,
    boxShadow: `0 0 10px ${withAlpha(color, "22")}`,
    zIndex: 1,
    pointerEvents: "none",
  };
}

function fillHaloStyle(inset: number, color: string, opacity: number): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    background: `radial-gradient(circle, ${withAlpha(color, toAlphaHex(opacity))} 0%, transparent 72%)`,
    zIndex: 0,
    pointerEvents: "none",
  };
}

function innerRingStyle(inset: number, color: string, opacity: number): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    border: `1px solid ${withAlpha(color, toAlphaHex(opacity))}`,
    zIndex: 1,
    pointerEvents: "none",
  };
}

function shineSweepStyle(inset: number): CSSProperties {
  return {
    position: "absolute",
    inset: `${inset}px`,
    borderRadius: "999px",
    overflow: "hidden",
    zIndex: 1,
    pointerEvents: "none",
  };
}

const crownWrapStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "-8px",
  transform: "translateX(-50%)",
  filter: "drop-shadow(0 5px 12px rgba(244, 207, 124, 0.18))",
  zIndex: 1,
  pointerEvents: "none",
};

const livingAvatarStyles = `
  .living-avatar-root {
    --living-hover-boost: 1;
    --living-opacity-boost: 1;
  }

  .living-avatar-root.is-interactive:hover {
    --living-hover-boost: 1.08;
    --living-opacity-boost: 1.14;
  }

  .living-avatar-root.is-emphasized {
    --living-hover-boost: 1.1;
    --living-opacity-boost: 1.18;
  }

  .living-decoration-shell {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .living-ring,
  .living-neon-core,
  .living-galaxy-halo,
  .living-void-shadow,
  .living-cyber-core,
  .living-fire-breathe,
  .living-frost-breathe,
  .living-owner-halo,
  .living-minimal-core,
  .living-minimal-outer,
  .living-void-distortion,
  .living-frost-outer,
  .living-inner-shine,
  .living-owner-shine,
  .living-sparkle,
  .living-ember,
  .living-orbit-track,
  .living-scan-arc,
  .living-scanline-sweep,
  .living-owner-crown {
    transform-origin: center;
    will-change: transform, opacity;
    transition:
      transform 220ms ease,
      opacity 220ms ease,
      filter 220ms ease;
  }

  .living-avatar-root.is-interactive:hover .living-ring,
  .living-avatar-root.is-interactive:hover .living-neon-core,
  .living-avatar-root.is-interactive:hover .living-galaxy-halo,
  .living-avatar-root.is-interactive:hover .living-void-shadow,
  .living-avatar-root.is-interactive:hover .living-cyber-core,
  .living-avatar-root.is-interactive:hover .living-fire-breathe,
  .living-avatar-root.is-interactive:hover .living-frost-breathe,
  .living-avatar-root.is-interactive:hover .living-owner-halo,
  .living-avatar-root.is-interactive:hover .living-minimal-core,
  .living-avatar-root.is-interactive:hover .living-sparkle,
  .living-avatar-root.is-interactive:hover .living-ember,
  .living-avatar-root.is-interactive:hover .living-owner-crown {
    transform: scale(var(--living-hover-boost));
  }

  .living-neon-rotate {
    animation: living-orbit 7.6s linear infinite;
  }

  .living-neon-pulse,
  .living-neon-core {
    animation: living-breathe 2.8s ease-in-out infinite;
  }

  .living-inner-shine {
    animation: living-soft-pulse 2.2s ease-in-out infinite;
  }

  .living-galaxy-halo {
    animation: living-breathe 4.8s ease-in-out infinite;
  }

  .living-orbit-track.orbit-alpha {
    animation: living-orbit 10s linear infinite;
  }

  .living-orbit-track.orbit-beta {
    animation: living-orbit-reverse 16s linear infinite;
  }

  .living-sparkle {
    animation: living-twinkle 3.2s ease-in-out infinite;
  }

  .living-sparkle.star-b,
  .living-sparkle.frost-b {
    animation-delay: 0.8s;
  }

  .living-sparkle.star-c,
  .living-sparkle.frost-c {
    animation-delay: 1.6s;
  }

  .living-void-shadow,
  .living-void-breathe,
  .living-void-distortion {
    animation: living-void-pulse 5.2s ease-in-out infinite;
  }

  .living-cyber-core {
    animation: living-soft-pulse 2.8s ease-in-out infinite;
  }

  .living-cyber-dash {
    animation: living-orbit 9s linear infinite;
  }

  .living-scan-arc {
    animation: living-orbit 6.6s linear infinite;
  }

  .living-scanline-sweep {
    animation: living-scan-sweep 3s linear infinite;
  }

  .living-fire-breathe {
    animation: living-breathe 3.1s ease-in-out infinite;
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

  .living-ember.ember-d {
    animation-delay: 2.1s;
  }

  .living-frost-breathe,
  .living-frost-outer {
    animation: living-frost-halo 4.6s ease-in-out infinite;
  }

  .living-owner-crown {
    animation: living-crown-float 3.8s ease-in-out infinite;
  }

  .living-owner-halo {
    animation: living-breathe 4.2s ease-in-out infinite;
  }

  .living-owner-shine::before {
    content: "";
    position: absolute;
    inset: -12% 24%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent);
    opacity: 0.18;
    transform: translateX(-180%) skewX(-22deg);
    animation: living-owner-shine 4.8s ease-in-out infinite;
  }

  .living-avatar-root.is-minimal .living-sparkle,
  .living-avatar-root.is-minimal .living-ember {
    opacity: 0.82;
  }

  @keyframes living-breathe {
    0%, 100% {
      opacity: 0.52;
      transform: scale(0.97);
    }

    50% {
      opacity: calc(0.86 * var(--living-opacity-boost));
      transform: scale(calc(1.03 * var(--living-hover-boost)));
    }
  }

  @keyframes living-soft-pulse {
    0%, 100% {
      opacity: 0.34;
      transform: scale(0.985);
    }

    50% {
      opacity: 0.64;
      transform: scale(1.015);
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

  @keyframes living-orbit-reverse {
    from {
      transform: rotate(360deg);
    }

    to {
      transform: rotate(0deg);
    }
  }

  @keyframes living-twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.72);
    }

    45% {
      opacity: 0.95;
      transform: scale(1.08);
    }

    70% {
      opacity: 0.42;
      transform: scale(0.88);
    }
  }

  @keyframes living-void-pulse {
    0%, 100% {
      opacity: 0.34;
      transform: scale(0.98);
    }

    50% {
      opacity: 0.72;
      transform: scale(1.025);
    }
  }

  @keyframes living-scan-sweep {
    0% {
      opacity: 0.18;
      transform: rotate(0deg) translateY(-8%);
    }

    50% {
      opacity: 0.72;
      transform: rotate(180deg) translateY(8%);
    }

    100% {
      opacity: 0.18;
      transform: rotate(360deg) translateY(-8%);
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

  @keyframes living-frost-halo {
    0%, 100% {
      opacity: 0.42;
      transform: scale(0.985);
    }

    50% {
      opacity: 0.82;
      transform: scale(1.02);
    }
  }

  @keyframes living-owner-shine {
    0%, 100% {
      opacity: 0.04;
      transform: translateX(-180%) skewX(-22deg);
    }

    45% {
      opacity: 0.28;
      transform: translateX(28%) skewX(-22deg);
    }

    60% {
      opacity: 0.1;
      transform: translateX(70%) skewX(-22deg);
    }
  }

  @media (max-width: 640px) {
    .living-sparkle,
    .living-ember,
    .living-owner-shine::before {
      opacity: 0.72;
    }

    .living-orbit-track.orbit-beta {
      opacity: 0.74;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .living-neon-rotate,
    .living-neon-pulse,
    .living-neon-core,
    .living-inner-shine,
    .living-galaxy-halo,
    .living-orbit-track,
    .living-sparkle,
    .living-void-shadow,
    .living-void-breathe,
    .living-void-distortion,
    .living-cyber-core,
    .living-cyber-dash,
    .living-scan-arc,
    .living-scanline-sweep,
    .living-fire-breathe,
    .living-frost-breathe,
    .living-frost-outer,
    .living-owner-halo,
    .living-owner-shine::before,
    .living-owner-crown,
    .living-ember {
      animation: none !important;
    }

    .living-sparkle,
    .living-ember {
      opacity: 0.66;
      transform: none !important;
    }
  }
`;

function withAlpha(color: string, alpha: string) {
  if (color.startsWith("#")) {
    return `${color}${alpha}`;
  }

  return withOpacity(color, parseInt(alpha, 16) / 255);
}

function toAlphaHex(value: number) {
  return Math.max(0, Math.min(255, Math.round(value * 255)))
    .toString(16)
    .padStart(2, "0");
}

function withOpacity(color: string, opacity: number) {
  const normalizedOpacity = Math.max(0, Math.min(1, opacity));

  if (color.startsWith("#")) {
    return `${color}${toAlphaHex(normalizedOpacity)}`;
  }

  const rgbaMatch =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/i.exec(
      color.trim(),
    );

  if (rgbaMatch) {
    const [, red, green, blue] = rgbaMatch;
    return `rgba(${red}, ${green}, ${blue}, ${normalizedOpacity})`;
  }

  return color;
}
