"use client";

import type { CSSProperties, ElementType } from "react";
import type { ProfileNameEffect } from "@/app/lib/profile-customization";

type Props = {
  displayName: string;
  username: string;
  effects: ProfileNameEffect[];
  headingAs?: ElementType;
  align?: "left" | "center";
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

  return (
    <div
      className={[
        "profile-name-plate",
        hasGlow ? "effect-glow" : "",
        hasRainbow ? "effect-rainbow" : "",
        hasTypewriter ? "effect-typewriter" : "",
        hasParticles ? "effect-particles" : "",
        hasGlitch ? "effect-glitch" : "",
        hasShimmer ? "effect-shimmer" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={align ? { textAlign: align } : undefined}
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
          <span className="profile-name-plate-heading-text">{displayName}</span>
          {hasTypewriter ? <span className="profile-name-cursor" aria-hidden /> : null}
        </HeadingTag>

        <div
          className={["profile-name-plate-username", usernameClassName]
            .filter(Boolean)
            .join(" ")}
          style={usernameStyle}
        >
          @{username}
        </div>
      </div>
    </div>
  );
}

const namePlateStyles = `
  .profile-name-plate {
    position: relative;
    min-width: 0;
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

  .profile-name-plate-heading-text {
    min-width: 0;
  }

  .profile-name-plate-username {
    width: fit-content;
    max-width: 100%;
  }

  .profile-name-cursor {
    width: 0.11em;
    min-width: 0.11em;
    height: 0.92em;
    border-radius: 999px;
    background: currentColor;
    transform: translateY(-0.08em);
    animation: profile-name-cursor-blink 1.08s steps(1) infinite;
    opacity: 0.9;
  }

  .profile-name-plate.effect-glow .profile-name-plate-heading,
  .profile-name-plate.effect-glow .profile-name-plate-username {
    text-shadow:
      0 0 10px rgba(244, 114, 182, 0.18),
      0 0 24px rgba(125, 211, 252, 0.14);
  }

  .profile-name-plate.effect-rainbow .profile-name-plate-heading,
  .profile-name-plate.effect-rainbow .profile-name-plate-username {
    background-image: linear-gradient(
      110deg,
      #ffffff 0%,
      #f9a8d4 18%,
      #c084fc 40%,
      #7dd3fc 62%,
      #fef08a 82%,
      #ffffff 100%
    );
    background-size: 220% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: profile-name-rainbow 8s linear infinite;
  }

  .profile-name-plate.effect-glitch .profile-name-plate-heading,
  .profile-name-plate.effect-glitch .profile-name-plate-username {
    animation: profile-name-glitch 5.6s steps(1) infinite;
  }

  .profile-name-plate.effect-shimmer .profile-name-plate-inner::after {
    content: "";
    position: absolute;
    inset: -12% -18%;
    background:
      linear-gradient(
        115deg,
        transparent 22%,
        rgba(255, 255, 255, 0.16) 44%,
        rgba(255, 255, 255, 0.34) 50%,
        rgba(255, 255, 255, 0.16) 56%,
        transparent 76%
      );
    transform: translateX(-135%);
    mix-blend-mode: screen;
    pointer-events: none;
    animation: profile-name-shimmer 4.8s ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .profile-name-spark {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(244,114,182,0.7) 56%, transparent 72%);
    box-shadow:
      0 0 12px rgba(244, 114, 182, 0.28),
      0 0 24px rgba(125, 211, 252, 0.16);
    opacity: 0.8;
    pointer-events: none;
  }

  .profile-name-plate.effect-particles .spark-one {
    top: -6px;
    left: 6%;
    animation: profile-name-float 4.4s ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-two {
    top: 10%;
    right: 8%;
    width: 6px;
    height: 6px;
    animation: profile-name-float 5.1s ease-in-out infinite reverse;
  }

  .profile-name-plate.effect-particles .spark-three {
    bottom: 14%;
    left: -4px;
    width: 5px;
    height: 5px;
    animation: profile-name-float 4.8s ease-in-out infinite;
  }

  .profile-name-plate.effect-particles .spark-four {
    bottom: -2px;
    right: 14%;
    width: 7px;
    height: 7px;
    animation: profile-name-float 5.4s ease-in-out infinite reverse;
  }

  @keyframes profile-name-cursor-blink {
    0%, 45% {
      opacity: 0.92;
    }

    46%, 100% {
      opacity: 0;
    }
  }

  @keyframes profile-name-rainbow {
    0% {
      background-position: 0% 50%;
    }

    100% {
      background-position: 220% 50%;
    }
  }

  @keyframes profile-name-glitch {
    0%, 94%, 100% {
      transform: translate3d(0, 0, 0);
      text-shadow: none;
    }

    95% {
      transform: translate3d(-0.014em, 0, 0);
      text-shadow:
        -0.02em 0 rgba(244, 114, 182, 0.52),
        0.018em 0 rgba(125, 211, 252, 0.44);
    }

    96% {
      transform: translate3d(0.016em, -0.01em, 0);
      text-shadow:
        -0.024em 0 rgba(244, 114, 182, 0.42),
        0.024em 0 rgba(125, 211, 252, 0.4);
    }
  }

  @keyframes profile-name-shimmer {
    0%, 18% {
      transform: translateX(-135%);
      opacity: 0;
    }

    28%, 76% {
      opacity: 1;
    }

    100% {
      transform: translateX(135%);
      opacity: 0;
    }
  }

  @keyframes profile-name-float {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(0.96);
      opacity: 0.46;
    }

    50% {
      transform: translate3d(0, -8px, 0) scale(1.08);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .profile-name-plate.effect-rainbow .profile-name-plate-heading,
    .profile-name-plate.effect-rainbow .profile-name-plate-username,
    .profile-name-plate.effect-glitch .profile-name-plate-heading,
    .profile-name-plate.effect-glitch .profile-name-plate-username,
    .profile-name-plate.effect-shimmer .profile-name-plate-inner::after,
    .profile-name-plate.effect-particles .profile-name-spark,
    .profile-name-cursor {
      animation: none !important;
      transform: none !important;
    }

    .profile-name-plate.effect-shimmer .profile-name-plate-inner::after {
      display: none;
    }
  }
`;
