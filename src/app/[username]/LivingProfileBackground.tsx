import type { CSSProperties } from "react";
import {
  getProfileBackgroundSaturation,
  getProfileBackgroundVisibility,
  getProfileMotionTokens,
  normalizeProfileBackgroundIntensity,
  normalizeProfileMotionLevel,
  type ProfileBackgroundIntensity,
  type ProfileMotionLevel,
} from "@/app/lib/profile-customization";
import {
  getProfileSceneDefinition,
  type ProfileScene,
} from "@/app/lib/profile-scenes";
import {
  getProfilePresence,
  normalizeProfileAura,
  normalizeProfileMood,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";

type Props = {
  mood: ProfileMood;
  aura: ProfileAura;
  themeColor: string;
  scene?: ProfileScene;
  previewMode?: boolean;
  intensity?: ProfileBackgroundIntensity;
  motionLevel?: ProfileMotionLevel;
};

type LivingBackgroundVariant =
  | "neon"
  | "void"
  | "galaxy"
  | "fire"
  | "frost"
  | "cyber";

export default function LivingProfileBackground({
  mood,
  aura,
  themeColor,
  scene = "default",
  previewMode = false,
  intensity = "medium",
  motionLevel = "alive",
}: Props) {
  const resolvedMood = normalizeProfileMood(mood);
  const resolvedAura = normalizeProfileAura(aura);
  const presence = getProfilePresence({
    mood: resolvedMood,
    aura: resolvedAura,
    themeColor,
  });
  const resolvedIntensity = normalizeProfileBackgroundIntensity(intensity);
  const resolvedMotionLevel = normalizeProfileMotionLevel(motionLevel);
  const motionTokens = getProfileMotionTokens(resolvedMotionLevel);
  const variant = resolveLivingBackgroundVariant(scene, resolvedMood, resolvedAura);
  const config = getLivingBackgroundConfig(variant, presence, themeColor);

  return (
    <div
      className={`living-profile-background variant-${variant} motion-${resolvedMotionLevel}${previewMode ? " is-preview" : ""}`}
      style={{
        "--living-bg-accent": presence.accent,
        "--living-bg-contrast": presence.contrast,
        "--living-bg-soft": presence.soft,
        "--living-bg-pulse": presence.pulse,
        "--living-bg-theme": themeColor,
        "--living-bg-opacity": getProfileBackgroundVisibility(
          resolvedIntensity,
          previewMode,
        ),
        "--living-bg-saturate": getProfileBackgroundSaturation(resolvedIntensity),
        "--living-bg-ambient-opacity":
          resolvedMotionLevel === "off"
            ? 0.62
            : resolvedMotionLevel === "subtle"
              ? 0.78
              : 0.88,
        "--living-bg-pattern-opacity":
          resolvedMotionLevel === "off"
            ? 0.18
            : resolvedMotionLevel === "subtle"
              ? 0.38
              : 0.5,
        "--living-bg-particle-opacity":
          resolvedMotionLevel === "off"
            ? 0.12
            : resolvedMotionLevel === "subtle"
              ? 0.28
              : 0.42,
        "--living-bg-motion-scale":
          motionTokens.allowAmbientMotion ? (resolvedMotionLevel === "subtle" ? 0.82 : 1) : 0,
      } as CSSProperties}
      aria-hidden
    >
      <style>{livingBackgroundStyles}</style>

      <div className="living-profile-layer living-profile-layer-base" style={{ background: config.base }} />
      <div className="living-profile-layer living-profile-layer-ambient ambient-one" style={{ background: config.ambientOne }} />
      <div className="living-profile-layer living-profile-layer-ambient ambient-two" style={{ background: config.ambientTwo }} />
      <div className="living-profile-layer living-profile-layer-pattern" style={{ backgroundImage: config.pattern }} />
      <div className="living-profile-layer living-profile-layer-particles" style={{ backgroundImage: config.particles }} />
      <div className="living-profile-layer living-profile-layer-vignette" style={{ background: config.vignette }} />
    </div>
  );
}

function resolveLivingBackgroundVariant(
  scene: ProfileScene,
  mood: ProfileMood,
  aura: ProfileAura,
): LivingBackgroundVariant {
  const sceneDefinition = getProfileSceneDefinition(scene);

  if (sceneDefinition.backgroundVariant !== "mood-driven") {
    return sceneDefinition.backgroundVariant;
  }

  if (aura === "galaxy") {
    return "galaxy";
  }

  if (aura === "fire" || mood === "streaming") {
    return "fire";
  }

  if (aura === "frost" || mood === "chilling") {
    return "frost";
  }

  if (aura === "cyber" || mood === "coding") {
    return "cyber";
  }

  if (aura === "void" || mood === "night" || mood === "afk") {
    return "void";
  }

  return "neon";
}

function getLivingBackgroundConfig(
  variant: LivingBackgroundVariant,
  presence: ReturnType<typeof getProfilePresence>,
  themeColor: string,
) {
  if (variant === "void") {
    return {
      base: `
        radial-gradient(circle at 18% 18%, ${withAlpha(presence.contrast, "14")} 0%, transparent 32%),
        radial-gradient(circle at 82% 16%, ${withAlpha("#0f172a", "4a")} 0%, transparent 28%),
        linear-gradient(180deg, #04050a 0%, #03040a 52%, #020308 100%)
      `,
      ambientOne: `radial-gradient(circle at 50% 38%, ${withAlpha("#312e81", "16")} 0%, transparent 48%)`,
      ambientTwo: `linear-gradient(140deg, transparent 14%, ${withAlpha("#0f172a", "34")} 42%, transparent 72%)`,
      pattern:
        "radial-gradient(circle at 14% 22%, rgba(255,255,255,0.16) 0 1px, transparent 1.4px), radial-gradient(circle at 82% 30%, rgba(255,255,255,0.10) 0 1px, transparent 1.3px), radial-gradient(circle at 64% 74%, rgba(196,181,253,0.12) 0 1.2px, transparent 1.6px)",
      particles:
        "radial-gradient(circle at 22% 36%, rgba(255,255,255,0.14) 0 0.9px, transparent 1.4px), radial-gradient(circle at 74% 66%, rgba(148,163,184,0.12) 0 1px, transparent 1.5px)",
      vignette:
        "radial-gradient(circle at center, rgba(4,5,10,0) 44%, rgba(2,3,8,0.48) 100%), linear-gradient(180deg, rgba(2,3,8,0.06), rgba(2,3,8,0.24) 44%, rgba(2,3,8,0.56) 100%)",
    };
  }

  if (variant === "galaxy") {
    return {
      base: `
        radial-gradient(circle at 22% 16%, ${withAlpha(themeColor, "14")} 0%, transparent 26%),
        radial-gradient(circle at 78% 18%, ${withAlpha("#818cf8", "18")} 0%, transparent 28%),
        linear-gradient(180deg, #05060d 0%, #060717 48%, #050711 100%)
      `,
      ambientOne: `radial-gradient(circle at 28% 24%, ${withAlpha("#c084fc", "16")} 0%, transparent 44%)`,
      ambientTwo: `radial-gradient(circle at 76% 58%, ${withAlpha("#818cf8", "14")} 0%, transparent 36%)`,
      pattern:
        "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.18) 0 1px, transparent 1.5px), radial-gradient(circle at 34% 72%, rgba(255,255,255,0.12) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 24%, rgba(196,181,253,0.18) 0 1.2px, transparent 1.7px), radial-gradient(circle at 84% 76%, rgba(255,255,255,0.10) 0 1px, transparent 1.6px)",
      particles:
        "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.12) 0 0.9px, transparent 1.4px), radial-gradient(circle at 58% 12%, rgba(224,231,255,0.14) 0 1px, transparent 1.5px), radial-gradient(circle at 76% 62%, rgba(255,255,255,0.10) 0 0.9px, transparent 1.4px)",
      vignette:
        "radial-gradient(circle at center, rgba(3,4,8,0) 46%, rgba(3,4,8,0.42) 100%), linear-gradient(180deg, rgba(4,5,10,0.08), rgba(4,5,10,0.24) 48%, rgba(4,5,10,0.52) 100%)",
    };
  }

  if (variant === "fire") {
    return {
      base: `
        radial-gradient(circle at 18% 18%, ${withAlpha("#fb7185", "16")} 0%, transparent 28%),
        radial-gradient(circle at 78% 16%, ${withAlpha("#f97316", "18")} 0%, transparent 30%),
        linear-gradient(180deg, #090508 0%, #0a0608 48%, #070507 100%)
      `,
      ambientOne: `radial-gradient(circle at 32% 26%, ${withAlpha("#f97316", "18")} 0%, transparent 44%)`,
      ambientTwo: `linear-gradient(130deg, transparent 18%, ${withAlpha("#fb7185", "20")} 48%, transparent 78%)`,
      pattern:
        "radial-gradient(circle at 16% 82%, rgba(249,115,22,0.26) 0 2px, transparent 2.8px), radial-gradient(circle at 38% 70%, rgba(251,113,133,0.22) 0 1.8px, transparent 2.6px), radial-gradient(circle at 74% 86%, rgba(254,202,202,0.18) 0 1.6px, transparent 2.3px)",
      particles:
        "radial-gradient(circle at 22% 78%, rgba(249,115,22,0.18) 0 1.2px, transparent 1.8px), radial-gradient(circle at 52% 84%, rgba(251,113,133,0.16) 0 1.2px, transparent 1.8px), radial-gradient(circle at 82% 72%, rgba(254,202,202,0.12) 0 1px, transparent 1.7px)",
      vignette:
        "radial-gradient(circle at center, rgba(6,4,5,0) 44%, rgba(5,3,4,0.44) 100%), linear-gradient(180deg, rgba(8,5,6,0.08), rgba(8,5,6,0.28) 48%, rgba(8,5,6,0.56) 100%)",
    };
  }

  if (variant === "frost") {
    return {
      base: `
        radial-gradient(circle at 20% 18%, ${withAlpha("#67e8f9", "16")} 0%, transparent 28%),
        radial-gradient(circle at 80% 22%, ${withAlpha("#60a5fa", "14")} 0%, transparent 24%),
        linear-gradient(180deg, #04080c 0%, #050b12 52%, #04070d 100%)
      `,
      ambientOne: `radial-gradient(circle at 28% 24%, ${withAlpha("#67e8f9", "18")} 0%, transparent 44%)`,
      ambientTwo: `linear-gradient(120deg, transparent 22%, ${withAlpha("#93c5fd", "16")} 48%, transparent 78%)`,
      pattern:
        "radial-gradient(circle at 18% 24%, rgba(223,247,255,0.18) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 32%, rgba(103,232,249,0.18) 0 1.2px, transparent 1.7px), radial-gradient(circle at 62% 78%, rgba(191,219,254,0.16) 0 1px, transparent 1.6px)",
      particles:
        "radial-gradient(circle at 24% 74%, rgba(223,247,255,0.16) 0 1px, transparent 1.5px), radial-gradient(circle at 82% 64%, rgba(186,230,253,0.12) 0 0.9px, transparent 1.4px)",
      vignette:
        "radial-gradient(circle at center, rgba(4,7,13,0) 46%, rgba(4,7,13,0.40) 100%), linear-gradient(180deg, rgba(4,7,13,0.08), rgba(4,7,13,0.22) 48%, rgba(4,7,13,0.50) 100%)",
    };
  }

  if (variant === "cyber") {
    return {
      base: `
        radial-gradient(circle at 20% 18%, ${withAlpha("#22d3ee", "16")} 0%, transparent 28%),
        radial-gradient(circle at 82% 20%, ${withAlpha("#2563eb", "14")} 0%, transparent 24%),
        linear-gradient(180deg, #03070b 0%, #04090f 52%, #03050a 100%)
      `,
      ambientOne: `radial-gradient(circle at 34% 22%, ${withAlpha("#22d3ee", "18")} 0%, transparent 38%)`,
      ambientTwo: `linear-gradient(180deg, transparent 12%, ${withAlpha("#38bdf8", "14")} 44%, transparent 78%)`,
      pattern:
        "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      particles:
        "repeating-linear-gradient(180deg, rgba(34,211,238,0.04) 0 1px, transparent 1px 10px)",
      vignette:
        "radial-gradient(circle at center, rgba(3,5,10,0) 44%, rgba(3,5,10,0.42) 100%), linear-gradient(180deg, rgba(3,5,10,0.08), rgba(3,5,10,0.24) 46%, rgba(3,5,10,0.52) 100%)",
    };
  }

  return {
    base: `
      radial-gradient(circle at 18% 18%, ${withAlpha("#f472b6", "16")} 0%, transparent 28%),
      radial-gradient(circle at 82% 18%, ${withAlpha("#8b5cf6", "16")} 0%, transparent 24%),
      linear-gradient(180deg, #07050a 0%, #080511 48%, #05040a 100%)
    `,
    ambientOne: `radial-gradient(circle at 32% 22%, ${withAlpha("#f472b6", "18")} 0%, transparent 42%)`,
    ambientTwo: `linear-gradient(120deg, transparent 12%, ${withAlpha("#8b5cf6", "18")} 42%, transparent 68%)`,
    pattern:
      "linear-gradient(118deg, transparent 16%, rgba(255,255,255,0.05) 38%, transparent 62%), linear-gradient(136deg, transparent 28%, rgba(244,114,182,0.08) 52%, transparent 76%)",
    particles:
      "radial-gradient(circle at 16% 76%, rgba(255,255,255,0.08) 0 1px, transparent 1.6px), radial-gradient(circle at 78% 68%, rgba(196,181,253,0.10) 0 1px, transparent 1.6px)",
    vignette:
      "radial-gradient(circle at center, rgba(4,4,9,0) 44%, rgba(4,4,9,0.42) 100%), linear-gradient(180deg, rgba(4,4,9,0.08), rgba(4,4,9,0.24) 48%, rgba(4,4,9,0.54) 100%)",
  };
}

const livingBackgroundStyles = `
  .living-profile-background,
  .living-profile-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .living-profile-background {
    z-index: 0;
    overflow: hidden;
    opacity: var(--living-bg-opacity, 1);
    isolation: isolate;
    filter: saturate(var(--living-bg-saturate, 1));
  }

  .living-profile-layer {
    will-change: transform, opacity;
  }

  .living-profile-layer-base {
    z-index: 0;
  }

  .living-profile-layer-ambient {
    z-index: 1;
    opacity: var(--living-bg-ambient-opacity, 0.88);
    mix-blend-mode: screen;
  }

  .living-profile-layer-pattern {
    z-index: 2;
    opacity: var(--living-bg-pattern-opacity, 0.5);
    background-repeat: repeat;
    background-size: 160px 160px;
  }

  .living-profile-layer-particles {
    z-index: 3;
    opacity: var(--living-bg-particle-opacity, 0.42);
    background-repeat: repeat;
    background-size: 220px 220px;
  }

  .living-profile-layer-vignette {
    z-index: 4;
  }

  .variant-neon .ambient-one {
    animation: living-bg-breathe 8s ease-in-out infinite;
  }

  .variant-neon .ambient-two {
    animation: living-bg-drift-diagonal 15s ease-in-out infinite;
    opacity: 0.58;
  }

  .variant-neon .living-profile-layer-pattern {
    animation: living-bg-beam-float 18s ease-in-out infinite;
  }

  .variant-void .ambient-one {
    animation: living-bg-shadow-wave 18s ease-in-out infinite;
    opacity: 0.72;
  }

  .variant-void .ambient-two {
    animation: living-bg-slow-float 16s ease-in-out infinite;
    opacity: 0.46;
  }

  .variant-void .living-profile-layer-particles {
    animation: living-bg-twinkle 12s ease-in-out infinite;
  }

  .variant-galaxy .ambient-one {
    animation: living-bg-breathe 10s ease-in-out infinite;
  }

  .variant-galaxy .ambient-two {
    animation: living-bg-orbit-glow 20s linear infinite;
  }

  .variant-galaxy .living-profile-layer-pattern,
  .variant-galaxy .living-profile-layer-particles {
    animation: living-bg-twinkle 14s ease-in-out infinite;
  }

  .variant-fire .ambient-one {
    animation: living-bg-breathe 6.5s ease-in-out infinite;
  }

  .variant-fire .ambient-two {
    animation: living-bg-drift-diagonal 11s ease-in-out infinite;
    opacity: 0.52;
  }

  .variant-fire .living-profile-layer-pattern,
  .variant-fire .living-profile-layer-particles {
    animation: living-bg-ember-rise 9s ease-in-out infinite;
  }

  .variant-frost .ambient-one {
    animation: living-bg-breathe 11s ease-in-out infinite;
    opacity: 0.8;
  }

  .variant-frost .ambient-two {
    animation: living-bg-calm-wave 16s ease-in-out infinite;
    opacity: 0.48;
  }

  .variant-frost .living-profile-layer-pattern,
  .variant-frost .living-profile-layer-particles {
    animation: living-bg-twinkle 16s ease-in-out infinite;
  }

  .variant-cyber .ambient-one {
    animation: living-bg-breathe 8s ease-in-out infinite;
  }

  .variant-cyber .ambient-two {
    animation: living-bg-scan-sweep 6.2s linear infinite;
    opacity: 0.52;
  }

  .variant-cyber .living-profile-layer-pattern {
    animation: living-bg-grid-drift 14s linear infinite;
    background-size: 96px 96px;
  }

  .variant-cyber .living-profile-layer-particles {
    animation: living-bg-soft-pulse 7s ease-in-out infinite;
    background-size: 100% 100%;
  }

  .living-profile-background.is-preview .living-profile-layer-pattern {
    opacity: 0.42;
  }

  .living-profile-background.is-preview .living-profile-layer-particles {
    opacity: 0.34;
  }

  .living-profile-background.motion-off .living-profile-layer-ambient,
  .living-profile-background.motion-off .living-profile-layer-pattern,
  .living-profile-background.motion-off .living-profile-layer-particles {
    animation: none !important;
    transform: none !important;
  }

  .living-profile-background.motion-off .living-profile-layer-pattern {
    background-size: 200px 200px;
  }

  .living-profile-background.motion-subtle .living-profile-layer-pattern {
    background-size: 176px 176px;
  }

  .living-profile-background.motion-subtle .living-profile-layer-particles {
    background-size: 240px 240px;
  }

  @keyframes living-bg-breathe {
    0%, 100% {
      opacity: 0.42;
      transform: scale(0.98);
    }

    50% {
      opacity: 0.92;
      transform: scale(1.04);
    }
  }

  @keyframes living-bg-soft-pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }

    50% {
      opacity: 0.56;
      transform: scale(1.02);
    }
  }

  @keyframes living-bg-drift-diagonal {
    0%, 100% {
      opacity: 0.36;
      transform: translate3d(-2%, -2%, 0) scale(1);
    }

    50% {
      opacity: 0.62;
      transform: translate3d(2%, 2%, 0) scale(1.04);
    }
  }

  @keyframes living-bg-slow-float {
    0%, 100% {
      opacity: 0.28;
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      opacity: 0.54;
      transform: translate3d(0, 2.5%, 0) scale(1.03);
    }
  }

  @keyframes living-bg-shadow-wave {
    0%, 100% {
      opacity: 0.32;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.68;
      transform: translate3d(1.5%, 2%, 0) scale(1.05);
    }
  }

  @keyframes living-bg-orbit-glow {
    from {
      transform: rotate(0deg) scale(1);
    }

    to {
      transform: rotate(360deg) scale(1.04);
    }
  }

  @keyframes living-bg-ember-rise {
    0%, 100% {
      opacity: 0.24;
      transform: translate3d(0, 1.5%, 0) scale(0.98);
    }

    50% {
      opacity: 0.56;
      transform: translate3d(0, -2.5%, 0) scale(1.04);
    }
  }

  @keyframes living-bg-calm-wave {
    0%, 100% {
      opacity: 0.24;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.5;
      transform: translate3d(1.5%, 1.5%, 0) scale(1.03);
    }
  }

  @keyframes living-bg-beam-float {
    0%, 100% {
      opacity: 0.3;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.54;
      transform: translate3d(1.5%, 0, 0) scale(1.04);
    }
  }

  @keyframes living-bg-scan-sweep {
    0% {
      opacity: 0.18;
      transform: translate3d(0, -8%, 0);
    }

    50% {
      opacity: 0.58;
      transform: translate3d(0, 8%, 0);
    }

    100% {
      opacity: 0.18;
      transform: translate3d(0, -8%, 0);
    }
  }

  @keyframes living-bg-grid-drift {
    0% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(1.5%, 1.5%, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes living-bg-twinkle {
    0%, 100% {
      opacity: 0.22;
      transform: scale(1);
    }

    50% {
      opacity: 0.46;
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    .living-profile-layer-pattern {
      opacity: 0.34;
    }

    .living-profile-layer-particles {
      opacity: 0.26;
    }

    .variant-fire .living-profile-layer-pattern,
    .variant-fire .living-profile-layer-particles,
    .variant-galaxy .living-profile-layer-particles {
      opacity: 0.22;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .living-profile-layer-ambient,
    .living-profile-layer-pattern,
    .living-profile-layer-particles {
      animation: none !important;
      transform: none !important;
    }

    .living-profile-layer-pattern {
      opacity: 0.32;
    }

    .living-profile-layer-particles {
      opacity: 0.2;
    }
  }
`;

function withAlpha(hex: string, alpha: string) {
  return /^#([0-9a-fA-F]{6})$/.test(hex.trim()) ? `${hex}${alpha}` : hex;
}
