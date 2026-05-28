"use client";

import type { CSSProperties, ElementType } from "react";
import type {
  ProfileMotionLevel,
  ProfileNameEffect,
} from "@/app/lib/profile-customization";

type Props = {
  displayName: string;
  username: string;
  effects: ProfileNameEffect[];
  typographyStyle?: "signature" | "editorial" | "mono" | "luxe";
  headingAs?: ElementType;
  align?: "left" | "center";
  motionLevel?: ProfileMotionLevel;
  nameStyle?: CSSProperties;
  usernameStyle?: CSSProperties;
  nameClassName?: string;
  usernameClassName?: string;
};

export default function ProfileNamePlate({
  displayName,
  username,
  effects,
  typographyStyle = "signature",
  headingAs: HeadingTag = "h1",
  align,
  motionLevel = "alive",
  nameStyle,
  usernameStyle,
  nameClassName,
  usernameClassName,
}: Props) {
  const hasGlow = effects.includes("glow");
  const hasRainbow = effects.includes("rainbow");
  const hasTypewriter = effects.includes("typewriter");
  const hasParticles = effects.includes("particles");
  const hasGlitch = effects.includes("glitch");
  const hasShimmer = effects.includes("shimmer");
  const allowMotion = motionLevel !== "off";
  const showAnimatedTypewriter = hasTypewriter && allowMotion;
  const alignmentClass = align === "center" ? "align-center" : "align-left";

  const renderTextLayers = (text: string, typewriter = false) => (
    <span
      className={[
        "profile-name-text-stack",
        typewriter ? "typewriter-enabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasGlow ? (
        <span className="profile-name-aura-layer" aria-hidden data-text={text}>
          {text}
        </span>
      ) : null}

      {hasGlitch ? (
        <>
          <span
            className="profile-name-glitch-layer glitch-primary"
            aria-hidden
            data-text={text}
          >
            {text}
          </span>
          <span
            className="profile-name-glitch-layer glitch-secondary"
            aria-hidden
            data-text={text}
          >
            {text}
          </span>
        </>
      ) : null}

      <span className="profile-name-main-layer profile-name-visible-layer" data-text={text}>
        {text}
      </span>

      {typewriter ? (
        <span className="profile-name-typewriter-shell" aria-hidden>
          <span className="profile-name-typewriter-window">
            <span
              className="profile-name-typewriter-layer profile-name-visible-layer"
              data-text={text}
            >
              {text}
            </span>

            {hasShimmer ? (
              <span
                className="profile-name-shimmer-layer profile-name-typewriter-shimmer"
                data-text={text}
              >
                {text}
              </span>
            ) : null}
          </span>
          <span className="profile-name-cursor-track">
            <span className="profile-name-cursor" />
          </span>
        </span>
      ) : null}

      {hasShimmer && !typewriter ? (
        <span className="profile-name-shimmer-layer" aria-hidden data-text={text}>
          {text}
        </span>
      ) : null}
    </span>
  );

  return (
    <div
      className={[
        "profile-name-plate",
        alignmentClass,
        `typography-${typographyStyle}`,
        `motion-${motionLevel}`,
        hasGlow ? "effect-glow" : "",
        hasRainbow ? "effect-rainbow" : "",
        hasTypewriter ? "effect-typewriter" : "",
        showAnimatedTypewriter ? "effect-typewriter-active" : "",
        hasParticles ? "effect-particles" : "",
        hasGlitch ? "effect-glitch" : "",
        hasShimmer ? "effect-shimmer" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ...(align ? { textAlign: align } : {}),
          "--profile-typewriter-characters": Math.max(displayName.length, 1),
        } as CSSProperties
      }
      data-motion-level={motionLevel}
    >
      <style>{namePlateStyles}</style>

      <div className="profile-name-plate-inner">
        {hasParticles ? (
          <>
            <span className="profile-name-spark spark-one" aria-hidden />
            <span className="profile-name-spark spark-two" aria-hidden />
            <span className="profile-name-spark spark-three" aria-hidden />
            <span className="profile-name-spark spark-four" aria-hidden />
          </>
        ) : null}

        <HeadingTag
          className={["profile-name-plate-heading", nameClassName].filter(Boolean).join(" ")}
          style={nameStyle}
        >
          {renderTextLayers(displayName, showAnimatedTypewriter)}
        </HeadingTag>

        <div
          className={["profile-name-plate-username", usernameClassName]
            .filter(Boolean)
            .join(" ")}
          style={usernameStyle}
        >
          {renderTextLayers(`@${username}`)}
        </div>
      </div>
    </div>
  );
}

const namePlateStyles = `
  .profile-name-plate {
    position: relative;
    min-width: 0;
    isolation: isolate;
    --profile-name-shimmer-duration: 5.2s;
    --profile-name-rainbow-duration: 5.8s;
    --profile-name-glitch-duration: 6.2s;
    --profile-name-particle-duration: 7.4s;
    --profile-name-typewriter-duration: 6.8s;
    --profile-name-aura-blur: 8px;
    --profile-name-aura-opacity: 0.58;
    --profile-name-rgb-split: 0.012em;
    --profile-name-halo-opacity: 0;
    --profile-name-glow-shadow:
      0 0 8px rgba(244, 114, 182, 0.18),
      0 0 18px rgba(192, 132, 252, 0.1),
      0 0 28px rgba(125, 211, 252, 0.08);
  }

  .profile-name-plate::before,
  .profile-name-plate::after {
    content: "";
    position: absolute;
    pointer-events: none;
  }

  .profile-name-plate::before {
    inset: -0.18em -0.28em -0.14em;
    z-index: 0;
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 22%),
      radial-gradient(circle at 26% 40%, rgba(244,114,182,0.16) 0%, transparent 32%),
      radial-gradient(circle at 74% 52%, rgba(125,211,252,0.14) 0%, transparent 34%);
    opacity: var(--profile-name-halo-opacity);
    filter: blur(8px);
    mix-blend-mode: screen;
  }

  .profile-name-plate::after {
    inset: -0.1em -0.2em;
    z-index: 1;
    border-radius: 999px;
    background:
      linear-gradient(
        112deg,
        transparent 0%,
        transparent 40%,
        rgba(255,255,255,0.06) 46%,
        rgba(255,255,255,0.14) 50%,
        rgba(255,255,255,0.06) 54%,
        transparent 60%,
        transparent 100%
      );
    background-size: 220% 100%;
    background-position: -180% 50%;
    opacity: 0;
    mix-blend-mode: screen;
  }

  .profile-name-plate-inner {
    position: relative;
    display: grid;
    gap: 0.14em;
    min-width: 0;
    width: fit-content;
    max-width: 100%;
    overflow: visible;
  }

  .profile-name-plate.align-center .profile-name-plate-inner {
    justify-items: center;
    margin-inline: auto;
  }

  .profile-name-plate-heading,
  .profile-name-plate-username {
    position: relative;
    z-index: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .profile-name-plate-heading {
    display: inline-flex;
    align-items: flex-end;
    width: fit-content;
    max-width: 100%;
  }

  .profile-name-plate.typography-editorial .profile-name-plate-heading {
    letter-spacing: -0.045em;
    text-transform: none;
  }

  .profile-name-plate.typography-editorial .profile-name-plate-username {
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .profile-name-plate.typography-mono .profile-name-plate-heading,
  .profile-name-plate.typography-mono .profile-name-plate-username {
    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      "Liberation Mono",
      "Courier New",
      monospace;
  }

  .profile-name-plate.typography-mono .profile-name-plate-heading {
    letter-spacing: -0.04em;
  }

  .profile-name-plate.typography-mono .profile-name-plate-username {
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .profile-name-plate.typography-luxe .profile-name-plate-heading {
    font-family: Georgia, "Times New Roman", Times, serif;
    letter-spacing: -0.05em;
    text-shadow:
      0 1px 0 rgba(255,255,255,0.08),
      0 10px 26px rgba(0,0,0,0.22);
  }

  .profile-name-plate.typography-luxe .profile-name-plate-username {
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .profile-name-text-stack {
    position: relative;
    display: inline-grid;
    place-items: start;
    width: fit-content;
    max-width: 100%;
    min-width: 0;
    isolation: isolate;
  }

  .profile-name-text-stack > * {
    grid-area: 1 / 1;
    min-width: 0;
  }

  .profile-name-text-stack.typewriter-enabled {
    display: inline-block;
  }

  .profile-name-main-layer,
  .profile-name-visible-layer,
  .profile-name-typewriter-layer,
  .profile-name-shimmer-layer,
  .profile-name-aura-layer {
    position: relative;
    z-index: 2;
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .profile-name-plate-username {
    width: fit-content;
    max-width: 100%;
  }

  .profile-name-main-layer {
    color: inherit;
    text-shadow:
      0 1px 0 rgba(255,255,255,0.06),
      0 10px 22px rgba(0,0,0,0.2);
  }

  .profile-name-plate-heading .profile-name-main-layer,
  .profile-name-plate-heading .profile-name-typewriter-layer {
    background-image: linear-gradient(
      180deg,
      rgba(255,255,255,0.99) 0%,
      rgba(244,247,252,0.98) 38%,
      rgba(214,226,244,0.92) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .profile-name-aura-layer {
    z-index: 0;
    opacity: var(--profile-name-aura-opacity);
    color: rgba(255, 208, 232, 0.88);
    filter: blur(var(--profile-name-aura-blur)) saturate(1.15);
    transform: translate3d(0, 0, 0) scale(1.012);
    text-shadow:
      0 0 10px rgba(244, 114, 182, 0.22),
      0 0 18px rgba(125, 211, 252, 0.12),
      0 0 28px rgba(192, 132, 252, 0.08);
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .profile-name-glitch-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
    filter: blur(0.1px) saturate(1.04);
    will-change: transform, opacity, clip-path;
  }

  .profile-name-glitch-layer.glitch-primary {
    color: rgba(255, 118, 198, 0.82);
    text-shadow: calc(var(--profile-name-rgb-split) * -1) 0 rgba(255,118,198,0.28);
  }

  .profile-name-glitch-layer.glitch-secondary {
    color: rgba(92, 216, 255, 0.8);
    text-shadow: var(--profile-name-rgb-split) 0 rgba(92,216,255,0.26);
  }

  .profile-name-text-stack.typewriter-enabled .profile-name-main-layer,
  .profile-name-text-stack.typewriter-enabled .profile-name-aura-layer,
  .profile-name-text-stack.typewriter-enabled .profile-name-glitch-layer {
    white-space: nowrap;
    overflow-wrap: normal;
  }

  .profile-name-typewriter-shell {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }

  .profile-name-typewriter-window,
  .profile-name-cursor-track {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    max-width: 100%;
    inline-size: 0%;
    animation:
      profile-name-typewriter-reveal var(--profile-name-typewriter-duration)
        steps(var(--profile-typewriter-characters), end) infinite;
  }

  .profile-name-typewriter-window {
    overflow: hidden;
    will-change: inline-size;
  }

  .profile-name-typewriter-layer {
    display: inline-block;
    min-width: max-content;
    white-space: nowrap;
    overflow-wrap: normal;
    white-space: nowrap;
    color: inherit;
  }

  .profile-name-cursor-track {
    overflow: visible;
  }

  .profile-name-cursor {
    position: absolute;
    right: 0;
    bottom: 0.05em;
    z-index: 5;
    width: 0.12em;
    min-width: 0.11em;
    height: 0.9em;
    border-radius: 999px;
    background:
      linear-gradient(180deg, #fff8fe 0%, rgba(244, 114, 182, 0.96) 52%, rgba(125, 211, 252, 0.92) 100%);
    box-shadow:
      0 0 10px rgba(255, 196, 228, 0.44),
      0 0 18px rgba(125, 211, 252, 0.24);
    transform: translate3d(50%, 0, 0);
    animation: profile-name-cursor-blink 0.92s steps(1) infinite;
    opacity: 0.94;
  }

  .profile-name-shimmer-layer {
    z-index: 4;
    opacity: 0;
    color: transparent;
    background-image:
      linear-gradient(
        108deg,
        transparent 0%,
        rgba(255,255,255,0.02) 28%,
        rgba(255, 255, 255, 0.1) 40%,
        rgba(255, 244, 252, 0.78) 48%,
        rgba(125, 211, 252, 0.28) 54%,
        rgba(255, 255, 255, 0.14) 60%,
        transparent 70%,
        transparent 100%
      );
    background-size: 240% 100%;
    background-position: -180% 50%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .profile-name-plate.effect-typewriter-active
    .profile-name-text-stack.typewriter-enabled
    .profile-name-main-layer {
    opacity: 0;
  }

  .profile-name-plate.effect-glow .profile-name-main-layer,
  .profile-name-plate.effect-glow .profile-name-typewriter-layer {
    text-shadow:
      var(--profile-name-glow-shadow),
      0 0 42px rgba(244,114,182,0.06);
    filter: drop-shadow(0 0 5px rgba(255,196,228,0.06));
  }

  .profile-name-plate.effect-rainbow .profile-name-main-layer,
  .profile-name-plate.effect-rainbow .profile-name-typewriter-layer {
    background-image: linear-gradient(
      94deg,
      #ffffff 0%,
      #ffd5ef 10%,
      #ff7eb6 26%,
      #c084fc 44%,
      #7dd3fc 66%,
      #fde68a 84%,
      #ffffff 100%
    );
    background-size: 240% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: profile-name-rainbow var(--profile-name-rainbow-duration) linear infinite;
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.06));
  }

  .profile-name-plate.effect-glitch .profile-name-main-layer {
    animation: profile-name-glitch-main var(--profile-name-glitch-duration) steps(1) infinite;
  }

  .profile-name-plate.effect-glitch .profile-name-glitch-layer.glitch-primary {
    animation: profile-name-glitch-layer-one var(--profile-name-glitch-duration) steps(1) infinite;
  }

  .profile-name-plate.effect-glitch .profile-name-glitch-layer.glitch-secondary {
    animation: profile-name-glitch-layer-two calc(var(--profile-name-glitch-duration) * 1.03) steps(1) infinite;
  }

  .profile-name-plate.effect-shimmer .profile-name-plate-inner::after {
    content: none;
  }

  .profile-name-plate.effect-shimmer .profile-name-shimmer-layer {
    opacity: 0.76;
    animation: profile-name-shimmer-text var(--profile-name-shimmer-duration)
      cubic-bezier(0.19, 1, 0.22, 1) infinite;
  }

  .profile-name-plate.effect-shimmer
    .profile-name-text-stack.typewriter-enabled
    .profile-name-shimmer-layer {
    inset: 0 auto 0 0;
    min-width: max-content;
    white-space: nowrap;
    overflow-wrap: normal;
  }

  .profile-name-plate.effect-particles .profile-name-spark {
    position: absolute;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 35%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.44) 32%, transparent 54%),
      linear-gradient(135deg, rgba(255, 160, 216, 0.92), rgba(125, 211, 252, 0.88));
    box-shadow:
      0 0 10px rgba(244, 114, 182, 0.26),
      0 0 14px rgba(125, 211, 252, 0.1);
    opacity: 0.58;
    pointer-events: none;
    transform-origin: center;
    mix-blend-mode: screen;
  }

  .profile-name-plate.effect-glow,
  .profile-name-plate.effect-rainbow,
  .profile-name-plate.effect-shimmer,
  .profile-name-plate.effect-particles {
    --profile-name-halo-opacity: 0.72;
  }

  .profile-name-plate.effect-shimmer::after,
  .profile-name-plate.effect-rainbow::after {
    opacity: 0.76;
    animation: profile-name-sheen-drift calc(var(--profile-name-shimmer-duration) * 1.08)
      cubic-bezier(0.19, 1, 0.22, 1) infinite;
  }

  .profile-name-plate.effect-glow::before,
  .profile-name-plate.effect-rainbow::before,
  .profile-name-plate.effect-shimmer::before,
  .profile-name-plate.effect-particles::before {
    animation: profile-name-halo-breathe calc(var(--profile-name-shimmer-duration) * 1.2)
      ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-one {
    top: -8px;
    left: 4%;
    width: 6px;
    height: 6px;
    animation: profile-name-orbit-a calc(var(--profile-name-particle-duration) * 0.95) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-two {
    top: 12%;
    right: 5%;
    width: 5px;
    height: 5px;
    animation: profile-name-orbit-b calc(var(--profile-name-particle-duration) * 1.08) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-three {
    bottom: 16%;
    left: -6px;
    width: 4px;
    height: 4px;
    animation: profile-name-orbit-c calc(var(--profile-name-particle-duration) * 0.9) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-four {
    bottom: 0;
    right: 16%;
    width: 6px;
    height: 6px;
    animation: profile-name-orbit-a calc(var(--profile-name-particle-duration) * 1.12) ease-in-out infinite reverse;
  }

  .profile-name-plate.effect-particles .spark-five {
    top: -6px;
    right: 28%;
    width: 4px;
    height: 4px;
    animation: profile-name-orbit-c calc(var(--profile-name-particle-duration) * 1.2) ease-in-out infinite reverse;
  }

  .profile-name-plate.effect-particles .spark-six {
    bottom: -5px;
    left: 22%;
    width: 5px;
    height: 5px;
    animation: profile-name-orbit-b calc(var(--profile-name-particle-duration) * 1.16) ease-in-out infinite reverse;
  }

  .profile-name-plate.motion-subtle {
    --profile-name-shimmer-duration: 5.8s;
    --profile-name-rainbow-duration: 6.4s;
    --profile-name-glitch-duration: 6.8s;
    --profile-name-particle-duration: 8s;
    --profile-name-typewriter-duration: 7.2s;
    --profile-name-aura-blur: 7px;
    --profile-name-aura-opacity: 0.48;
    --profile-name-rgb-split: 0.01em;
  }

  .profile-name-plate.motion-off .profile-name-spark,
  .profile-name-plate.motion-off .profile-name-glitch-layer,
  .profile-name-plate.motion-off .profile-name-shimmer-layer,
  .profile-name-plate.motion-off .profile-name-typewriter-layer,
  .profile-name-plate.motion-off .profile-name-cursor {
    display: none;
  }

  .profile-name-plate.motion-off::before,
  .profile-name-plate.motion-off::after {
    animation: none !important;
  }

  .profile-name-plate.motion-off .profile-name-main-layer {
    opacity: 1 !important;
  }

  @keyframes profile-name-cursor-blink {
    0%, 46% {
      opacity: 0.95;
    }

    47%, 100% {
      opacity: 0;
    }
  }

  @keyframes profile-name-typewriter-reveal {
    0%, 10% {
      inline-size: 0%;
    }

    34%, 72% {
      inline-size: 100%;
    }

    92%, 100% {
      inline-size: 0%;
    }
  }

  @keyframes profile-name-rainbow {
    0% {
      background-position: 0% 50%;
    }

    100% {
      background-position: 240% 50%;
    }
  }

  @keyframes profile-name-glitch-main {
    0%, 74%, 100% {
      transform: translate3d(0, 0, 0);
      text-shadow: none;
    }

    77% {
      transform: translate3d(-0.006em, 0, 0);
      text-shadow:
        -0.01em 0 rgba(244, 114, 182, 0.22),
        0.012em 0 rgba(125, 211, 252, 0.18);
    }

    80% {
      transform: translate3d(0.008em, -0.006em, 0);
      text-shadow:
        -0.012em 0 rgba(244, 114, 182, 0.18),
        0.014em 0 rgba(125, 211, 252, 0.16);
    }

    83% {
      transform: translate3d(-0.005em, 0.004em, 0);
      text-shadow:
        -0.008em 0 rgba(244, 114, 182, 0.12),
        0.01em 0 rgba(125, 211, 252, 0.12);
    }
  }

  @keyframes profile-name-glitch-layer-one {
    0%, 72%, 100% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }

    76% {
      opacity: 0.4;
      transform: translate3d(-0.012em, -0.006em, 0);
      clip-path: inset(10% 0 58% 0);
    }

    79% {
      opacity: 0.32;
      transform: translate3d(0.012em, 0.006em, 0);
      clip-path: inset(46% 0 16% 0);
    }

    82% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes profile-name-glitch-layer-two {
    0%, 70%, 100% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }

    74% {
      opacity: 0.38;
      transform: translate3d(0.012em, 0.006em, 0);
      clip-path: inset(18% 0 44% 0);
    }

    78% {
      opacity: 0.3;
      transform: translate3d(-0.012em, -0.006em, 0);
      clip-path: inset(54% 0 10% 0);
    }

    81% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes profile-name-shimmer-text {
    0%, 12% {
      background-position: -180% 50%;
      opacity: 0;
    }

    18%, 78% {
      opacity: 0.76;
    }

    100% {
      background-position: 180% 50%;
      opacity: 0;
    }
  }

  @keyframes profile-name-halo-breathe {
    0%, 100% {
      opacity: calc(var(--profile-name-halo-opacity) * 0.8);
      transform: scale(0.994);
    }

    50% {
      opacity: var(--profile-name-halo-opacity);
      transform: scale(1.008);
    }
  }

  @keyframes profile-name-sheen-drift {
    0%, 12% {
      background-position: -180% 50%;
      opacity: 0;
    }

    24%, 78% {
      opacity: 0.72;
    }

    100% {
      background-position: 180% 50%;
      opacity: 0;
    }
  }

  @keyframes profile-name-orbit-a {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.94) rotate(0deg);
      opacity: 0.34;
    }

    50% {
      transform: translate3d(2px, -3px, 0) scale(1.02) rotate(16deg);
      opacity: 0.62;
    }
  }

  @keyframes profile-name-orbit-b {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.92);
      opacity: 0.3;
    }

    50% {
      transform: translate3d(-2px, 3px, 0) scale(1);
      opacity: 0.56;
    }
  }

  @keyframes profile-name-orbit-c {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.9) rotate(45deg);
      opacity: 0.28;
    }

    50% {
      transform: translate3d(1px, -3px, 0) scale(1) rotate(60deg);
      opacity: 0.5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .profile-name-plate.effect-rainbow .profile-name-main-layer,
    .profile-name-plate.effect-rainbow .profile-name-typewriter-layer,
    .profile-name-plate.effect-glitch .profile-name-main-layer,
    .profile-name-plate.effect-glitch .profile-name-glitch-layer,
    .profile-name-plate.effect-shimmer .profile-name-shimmer-layer,
    .profile-name-plate.effect-particles .profile-name-spark,
    .profile-name-plate::before,
    .profile-name-plate::after,
    .profile-name-typewriter-layer,
    .profile-name-cursor {
      animation: none !important;
      transform: none !important;
    }

    .profile-name-plate.effect-glitch .profile-name-glitch-layer,
    .profile-name-plate.effect-shimmer .profile-name-shimmer-layer,
    .profile-name-typewriter-layer,
    .profile-name-cursor {
      display: none !important;
    }

    .profile-name-plate.effect-typewriter-active
      .profile-name-text-stack.typewriter-enabled
      .profile-name-main-layer {
      opacity: 1;
    }

    .profile-name-plate.effect-rainbow .profile-name-main-layer {
      background-position: 50% 50%;
    }
  }
`;
