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

  return (
    <div
      className={[
        "profile-name-plate",
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
    >
      <style>{namePlateStyles}</style>

      <div className="profile-name-plate-inner">
        {hasParticles ? (
          <>
            <span className="profile-name-spark spark-one" aria-hidden />
            <span className="profile-name-spark spark-two" aria-hidden />
            <span className="profile-name-spark spark-three" aria-hidden />
            <span className="profile-name-spark spark-four" aria-hidden />
            <span className="profile-name-spark spark-five" aria-hidden />
          </>
        ) : null}

        <HeadingTag
          className={["profile-name-plate-heading", nameClassName].filter(Boolean).join(" ")}
          style={nameStyle}
        >
          <span className="profile-name-text-stack">
            {hasGlitch ? (
              <>
                <span className="profile-name-glitch-layer glitch-primary" aria-hidden>
                  {displayName}
                </span>
                <span className="profile-name-glitch-layer glitch-secondary" aria-hidden>
                  {displayName}
                </span>
              </>
            ) : null}

            <span className="profile-name-plate-heading-text profile-name-main-layer">
              {displayName}
            </span>

            {showAnimatedTypewriter ? (
              <span className="profile-name-typewriter-layer" aria-hidden>
                {displayName}
              </span>
            ) : null}
          </span>

          {showAnimatedTypewriter ? (
            <span className="profile-name-cursor" aria-hidden />
          ) : null}
        </HeadingTag>

        <div
          className={["profile-name-plate-username", usernameClassName]
            .filter(Boolean)
            .join(" ")}
          style={usernameStyle}
        >
          <span className="profile-name-text-stack">
            {hasGlitch ? (
              <>
                <span className="profile-name-glitch-layer glitch-primary" aria-hidden>
                  @{username}
                </span>
                <span className="profile-name-glitch-layer glitch-secondary" aria-hidden>
                  @{username}
                </span>
              </>
            ) : null}
            <span className="profile-name-main-layer">@{username}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const namePlateStyles = `
  .profile-name-plate {
    position: relative;
    min-width: 0;
    --profile-name-shimmer-duration: 4.3s;
    --profile-name-rainbow-duration: 5.4s;
    --profile-name-glitch-duration: 4.9s;
    --profile-name-particle-duration: 4.8s;
    --profile-name-typewriter-duration: 6.2s;
  }

  .profile-name-plate-inner {
    position: relative;
    display: inline-grid;
    gap: 0;
    min-width: 0;
    width: fit-content;
    max-width: 100%;
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
    gap: 0.16em;
    width: fit-content;
    max-width: 100%;
  }

  .profile-name-text-stack {
    position: relative;
    display: inline-grid;
    width: fit-content;
    max-width: 100%;
    min-width: 0;
  }

  .profile-name-text-stack > * {
    grid-area: 1 / 1;
    min-width: 0;
  }

  .profile-name-plate-heading-text,
  .profile-name-main-layer {
    position: relative;
    z-index: 2;
    min-width: 0;
  }

  .profile-name-plate-username {
    width: fit-content;
    max-width: 100%;
  }

  .profile-name-glitch-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .profile-name-glitch-layer.glitch-primary {
    color: rgba(244, 114, 182, 0.9);
  }

  .profile-name-glitch-layer.glitch-secondary {
    color: rgba(125, 211, 252, 0.9);
  }

  .profile-name-typewriter-layer {
    position: relative;
    z-index: 3;
    overflow: hidden;
    white-space: nowrap;
    width: 0ch;
    max-width: 100%;
    color: inherit;
    animation: profile-name-typewriter var(--profile-name-typewriter-duration) steps(var(--profile-typewriter-characters), end) infinite;
  }

  .profile-name-cursor {
    width: 0.11em;
    min-width: 0.11em;
    height: 0.92em;
    border-radius: 999px;
    background: currentColor;
    transform: translateY(-0.08em);
    animation:
      profile-name-cursor-blink 0.92s steps(1) infinite,
      profile-name-cursor-drift var(--profile-name-typewriter-duration) steps(var(--profile-typewriter-characters), end) infinite;
    opacity: 0.95;
  }

  .profile-name-plate.effect-typewriter-active .profile-name-plate-heading-text.profile-name-main-layer {
    opacity: 0;
  }

  .profile-name-plate.effect-glow .profile-name-plate-heading,
  .profile-name-plate.effect-glow .profile-name-plate-username {
    text-shadow:
      0 0 10px rgba(244, 114, 182, 0.18),
      0 0 26px rgba(125, 211, 252, 0.18);
  }

  .profile-name-plate.effect-rainbow .profile-name-plate-heading,
  .profile-name-plate.effect-rainbow .profile-name-plate-username {
    background-image: linear-gradient(
      110deg,
      #ffffff 0%,
      #f9a8d4 14%,
      #c084fc 34%,
      #7dd3fc 58%,
      #fef08a 82%,
      #ffffff 100%
    );
    background-size: 260% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: profile-name-rainbow var(--profile-name-rainbow-duration) linear infinite;
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
    content: "";
    position: absolute;
    inset: -14% -20%;
    background:
      linear-gradient(
        112deg,
        transparent 18%,
        rgba(255, 255, 255, 0.08) 34%,
        rgba(255, 255, 255, 0.38) 48%,
        rgba(255, 255, 255, 0.08) 62%,
        transparent 78%
      );
    transform: translateX(-132%);
    mix-blend-mode: screen;
    pointer-events: none;
    animation: profile-name-shimmer var(--profile-name-shimmer-duration) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .profile-name-spark {
    position: absolute;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(244,114,182,0.72) 56%, transparent 72%);
    box-shadow:
      0 0 10px rgba(244, 114, 182, 0.24),
      0 0 20px rgba(125, 211, 252, 0.14);
    opacity: 0.86;
    pointer-events: none;
  }

  .profile-name-plate.effect-particles .spark-one {
    top: -7px;
    left: 6%;
    width: 8px;
    height: 8px;
    animation: profile-name-float calc(var(--profile-name-particle-duration) * 0.95) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-two {
    top: 12%;
    right: 8%;
    width: 6px;
    height: 6px;
    animation: profile-name-float calc(var(--profile-name-particle-duration) * 1.08) ease-in-out infinite reverse;
  }

  .profile-name-plate.effect-particles .spark-three {
    bottom: 18%;
    left: -4px;
    width: 5px;
    height: 5px;
    animation: profile-name-float calc(var(--profile-name-particle-duration) * 0.9) ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-four {
    bottom: 2px;
    right: 14%;
    width: 7px;
    height: 7px;
    animation: profile-name-float calc(var(--profile-name-particle-duration) * 1.12) ease-in-out infinite reverse;
  }

  .profile-name-plate.effect-particles .spark-five {
    top: -4px;
    right: 24%;
    width: 4px;
    height: 4px;
    animation: profile-name-float calc(var(--profile-name-particle-duration) * 1.2) ease-in-out infinite;
  }

  .profile-name-plate.motion-subtle {
    --profile-name-shimmer-duration: 5.2s;
    --profile-name-rainbow-duration: 6.8s;
    --profile-name-glitch-duration: 6.4s;
    --profile-name-particle-duration: 5.6s;
    --profile-name-typewriter-duration: 7.2s;
  }

  @keyframes profile-name-cursor-blink {
    0%, 46% {
      opacity: 0.95;
    }

    47%, 100% {
      opacity: 0;
    }
  }

  @keyframes profile-name-cursor-drift {
    0%, 8% {
      transform: translateY(-0.08em) translateX(0);
    }

    38%, 52% {
      transform: translateY(-0.08em) translateX(0.6ch);
    }

    100% {
      transform: translateY(-0.08em) translateX(0);
    }
  }

  @keyframes profile-name-typewriter {
    0%, 8% {
      width: 0ch;
    }

    36%, 48% {
      width: calc(var(--profile-typewriter-characters, 1) * 1ch);
    }

    72% {
      width: calc(var(--profile-typewriter-characters, 1) * 1ch);
    }

    100% {
      width: 0ch;
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
    0%, 88%, 100% {
      transform: translate3d(0, 0, 0);
      text-shadow: none;
    }

    90% {
      transform: translate3d(-0.012em, 0, 0);
      text-shadow:
        -0.016em 0 rgba(244, 114, 182, 0.3),
        0.018em 0 rgba(125, 211, 252, 0.28);
    }

    92% {
      transform: translate3d(0.016em, -0.01em, 0);
      text-shadow:
        -0.02em 0 rgba(244, 114, 182, 0.28),
        0.022em 0 rgba(125, 211, 252, 0.26);
    }
  }

  @keyframes profile-name-glitch-layer-one {
    0%, 86%, 100% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }

    88% {
      opacity: 0.65;
      transform: translate3d(-0.03em, -0.01em, 0);
      clip-path: inset(8% 0 58% 0);
    }

    90% {
      opacity: 0.56;
      transform: translate3d(0.028em, 0.01em, 0);
      clip-path: inset(46% 0 16% 0);
    }

    93% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes profile-name-glitch-layer-two {
    0%, 84%, 100% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }

    87% {
      opacity: 0.58;
      transform: translate3d(0.028em, 0.01em, 0);
      clip-path: inset(18% 0 44% 0);
    }

    89% {
      opacity: 0.5;
      transform: translate3d(-0.032em, -0.01em, 0);
      clip-path: inset(56% 0 8% 0);
    }

    92% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes profile-name-shimmer {
    0%, 12% {
      transform: translateX(-132%);
      opacity: 0;
    }

    20%, 72% {
      opacity: 1;
    }

    100% {
      transform: translateX(132%);
      opacity: 0;
    }
  }

  @keyframes profile-name-float {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.94);
      opacity: 0.42;
    }

    50% {
      transform: translate3d(0, -7px, 0) scale(1.08);
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    .profile-name-plate.effect-particles .spark-five {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .profile-name-plate.effect-rainbow .profile-name-plate-heading,
    .profile-name-plate.effect-rainbow .profile-name-plate-username,
    .profile-name-plate.effect-glitch .profile-name-main-layer,
    .profile-name-plate.effect-glitch .profile-name-glitch-layer,
    .profile-name-plate.effect-shimmer .profile-name-plate-inner::after,
    .profile-name-plate.effect-particles .profile-name-spark,
    .profile-name-typewriter-layer,
    .profile-name-cursor {
      animation: none !important;
      transform: none !important;
    }

    .profile-name-plate.effect-glitch .profile-name-glitch-layer,
    .profile-name-plate.effect-shimmer .profile-name-plate-inner::after,
    .profile-name-typewriter-layer,
    .profile-name-cursor {
      display: none !important;
    }

    .profile-name-plate.effect-typewriter-active .profile-name-plate-heading-text.profile-name-main-layer {
      opacity: 1;
    }
  }
`;
