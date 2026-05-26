import type { CSSProperties } from "react";
import {
  getProfileBackgroundVisibility,
  normalizeProfileBackgroundIntensity,
  normalizeProfileMotionLevel,
  type ProfileBackgroundIntensity,
  type ProfileMotionLevel,
} from "@/app/lib/profile-customization";
import {
  getProfileSceneAppearance,
  type ProfileScene,
} from "@/app/lib/profile-scenes";
import {
  normalizeProfileAura,
  normalizeProfileMood,
  type ProfileAura,
  type ProfileMood,
} from "@/app/lib/profile-presence";
import EnvironmentParticles from "./EnvironmentParticles";

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
  const resolvedIntensity = normalizeProfileBackgroundIntensity(intensity);
  const resolvedMotionLevel = normalizeProfileMotionLevel(motionLevel);
  const sceneAppearance = getProfileSceneAppearance({
    scene,
    mood: resolvedMood,
    aura: resolvedAura,
    themeColor,
  });
  const { presence, depth } = sceneAppearance;
  const variant = resolveLivingBackgroundVariant(
    sceneAppearance.backgroundVariant,
    resolvedMood,
    resolvedAura,
  );
  const config = getLivingBackgroundConfig(variant, presence, themeColor);
  const backgroundOpacity = getProfileBackgroundVisibility(
    resolvedIntensity,
    previewMode,
  );
  const particleDensity = (
    (previewMode ? depth.mobileAmbientDensity : depth.ambientDensity) *
    (resolvedMotionLevel === "alive" ? 0.82 : 0.72)
  );

  return (
    <div
      className={`living-profile-background variant-${variant} motion-${resolvedMotionLevel}${previewMode ? " is-preview" : ""}`}
      style={
        {
          "--living-bg-opacity": backgroundOpacity,
          "--living-bg-pattern-opacity":
            resolvedMotionLevel === "off"
              ? 0.08
              : resolvedMotionLevel === "subtle"
                ? 0.16
                : 0.24,
          "--living-bg-particle-opacity":
            resolvedMotionLevel === "off"
              ? 0.06
              : resolvedMotionLevel === "subtle"
                ? 0.12
                : 0.18,
          "--living-bg-depth-opacity": depth.overlayStrength * 0.84,
          "--living-bg-vignette-opacity": depth.vignetteStrength * 0.88,
          "--living-bg-foreground-opacity": depth.foregroundHazeOpacity * 0.76,
          "--living-bg-lighting-opacity": depth.lightingOpacity * 0.74,
          "--living-bg-fog-opacity": depth.fogOpacity * 0.62,
          "--living-bg-grain-opacity": depth.grainOpacity * 0.54,
          "--living-bg-bloom-opacity": depth.bloomOpacity * 0.62,
          "--living-bg-aura-opacity": depth.heroAuraOpacity * 0.72,
          "--living-bg-tint-strength": depth.fogTintStrength,
          "--living-bg-theme-bloom": withAlpha(themeColor, "18"),
          "--living-bg-theme-fog": withAlpha(themeColor, "14"),
          "--living-bg-theme-foreground": withAlpha(themeColor, "16"),
        } as CSSProperties
      }
      aria-hidden
    >
      <style>{livingBackgroundStyles}</style>

      <div
        className="living-profile-layer living-profile-layer-base"
        style={{ background: config.base }}
      />
      <div
        className="living-profile-layer living-profile-layer-lighting lighting-one"
        style={{ background: config.lighting }}
      />
      <div
        className="living-profile-layer living-profile-layer-ambient ambient-one"
        style={{ background: config.ambientOne }}
      />
      <div
        className="living-profile-layer living-profile-layer-ambient ambient-two"
        style={{ background: config.ambientTwo }}
      />
      <div
        className="living-profile-layer living-profile-layer-pattern"
        style={{ backgroundImage: config.pattern }}
      />
      <EnvironmentParticles
        type={depth.ambientType}
        motionLevel={resolvedMotionLevel}
        density={particleDensity}
        preview={previewMode}
      />
      <div
        className="living-profile-layer living-profile-layer-depth"
        style={{ background: config.depthOverlay }}
      />
      <div
        className="living-profile-layer living-profile-layer-vignette"
        style={{ background: config.vignette }}
      />
      <div
        className="living-profile-layer living-profile-layer-foreground"
        style={{ background: config.foregroundHaze }}
      />
    </div>
  );
}

function resolveLivingBackgroundVariant(
  backgroundVariant: ReturnType<typeof getProfileSceneAppearance>["backgroundVariant"],
  mood: ProfileMood,
  aura: ProfileAura,
): LivingBackgroundVariant {
  if (backgroundVariant !== "mood-driven") {
    return backgroundVariant;
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
  presence: ReturnType<typeof getProfileSceneAppearance>["presence"],
  themeColor: string,
) {
  if (variant === "void") {
    return {
      base: `
        radial-gradient(circle at 18% 18%, ${withAlpha(presence.contrast, "14")} 0%, transparent 32%),
        radial-gradient(circle at 82% 16%, ${withAlpha("#0f172a", "50")} 0%, transparent 28%),
        linear-gradient(180deg, #04050a 0%, #03040a 52%, #020308 100%)
      `,
      lighting: `radial-gradient(circle at 50% 18%, ${withAlpha("#a78bfa", "10")} 0%, transparent 26%)`,
      ambientOne: `radial-gradient(circle at 50% 40%, ${withAlpha("#312e81", "18")} 0%, transparent 50%)`,
      ambientTwo: `linear-gradient(145deg, transparent 16%, ${withAlpha("#020617", "52")} 46%, transparent 76%)`,
      pattern:
        "radial-gradient(circle at 14% 22%, rgba(255,255,255,0.14) 0 1px, transparent 1.4px), radial-gradient(circle at 82% 30%, rgba(255,255,255,0.10) 0 1px, transparent 1.3px), radial-gradient(circle at 64% 74%, rgba(196,181,253,0.12) 0 1.2px, transparent 1.6px)",
      depthOverlay:
        "linear-gradient(180deg, rgba(2,3,8,0.08), rgba(2,3,8,0.34) 58%, rgba(2,3,8,0.72) 100%)",
      vignette:
        "radial-gradient(circle at center, rgba(4,5,10,0) 42%, rgba(2,3,8,0.52) 100%), linear-gradient(180deg, rgba(2,3,8,0.08), rgba(2,3,8,0.22) 44%, rgba(2,3,8,0.54) 100%)",
      foregroundHaze:
        "linear-gradient(180deg, transparent 56%, rgba(1,2,7,0.18) 100%), radial-gradient(circle at 48% 88%, rgba(196,181,253,0.08), transparent 34%)",
    };
  }

  if (variant === "galaxy") {
    return {
      base: `
        radial-gradient(circle at 22% 16%, ${withAlpha(themeColor, "16")} 0%, transparent 28%),
        radial-gradient(circle at 78% 18%, ${withAlpha("#818cf8", "1c")} 0%, transparent 30%),
        linear-gradient(180deg, #05060d 0%, #060717 48%, #050711 100%)
      `,
      lighting: `radial-gradient(circle at 52% 18%, ${withAlpha("#e0e7ff", "1a")} 0%, transparent 30%)`,
      ambientOne: `radial-gradient(circle at 28% 24%, ${withAlpha("#c084fc", "18")} 0%, transparent 46%)`,
      ambientTwo: `radial-gradient(circle at 76% 58%, ${withAlpha("#818cf8", "18")} 0%, transparent 42%)`,
      pattern:
        "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.18) 0 1px, transparent 1.5px), radial-gradient(circle at 34% 72%, rgba(255,255,255,0.12) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 24%, rgba(196,181,253,0.18) 0 1.2px, transparent 1.7px), radial-gradient(circle at 84% 76%, rgba(255,255,255,0.10) 0 1px, transparent 1.6px)",
      depthOverlay:
        "linear-gradient(180deg, rgba(4,5,10,0.04), rgba(4,5,10,0.2) 54%, rgba(4,5,10,0.46) 100%)",
      vignette:
        "radial-gradient(circle at center, rgba(3,4,8,0) 46%, rgba(3,4,8,0.42) 100%), linear-gradient(180deg, rgba(4,5,10,0.06), rgba(4,5,10,0.18) 48%, rgba(4,5,10,0.46) 100%)",
      foregroundHaze:
        "linear-gradient(180deg, transparent 54%, rgba(6,7,18,0.1) 100%), radial-gradient(circle at 50% 80%, rgba(224,231,255,0.08), transparent 32%)",
    };
  }

  if (variant === "fire") {
    return {
      base: `
        radial-gradient(circle at 18% 18%, ${withAlpha("#fb7185", "18")} 0%, transparent 28%),
        radial-gradient(circle at 78% 16%, ${withAlpha("#f97316", "1e")} 0%, transparent 32%),
        linear-gradient(180deg, #090508 0%, #0a0608 48%, #070507 100%)
      `,
      lighting: `radial-gradient(circle at 50% 14%, ${withAlpha("#fdba74", "18")} 0%, transparent 26%)`,
      ambientOne: `radial-gradient(circle at 32% 26%, ${withAlpha("#f97316", "1e")} 0%, transparent 46%)`,
      ambientTwo: `linear-gradient(132deg, transparent 18%, ${withAlpha("#fb7185", "24")} 48%, transparent 78%)`,
      pattern:
        "radial-gradient(circle at 16% 82%, rgba(249,115,22,0.2) 0 2px, transparent 2.8px), radial-gradient(circle at 38% 70%, rgba(251,113,133,0.18) 0 1.8px, transparent 2.6px), radial-gradient(circle at 74% 86%, rgba(254,202,202,0.16) 0 1.6px, transparent 2.3px)",
      depthOverlay:
        "linear-gradient(180deg, rgba(8,5,6,0.04), rgba(8,5,6,0.18) 44%, rgba(8,5,6,0.54) 100%)",
      vignette:
        "radial-gradient(circle at center, rgba(6,4,5,0) 44%, rgba(5,3,4,0.42) 100%), linear-gradient(180deg, rgba(8,5,6,0.08), rgba(8,5,6,0.22) 48%, rgba(8,5,6,0.5) 100%)",
      foregroundHaze:
        "linear-gradient(180deg, transparent 52%, rgba(17,6,6,0.14) 100%), radial-gradient(circle at 50% 84%, rgba(251,146,60,0.1), transparent 34%)",
    };
  }

  if (variant === "frost") {
    return {
      base: `
        radial-gradient(circle at 20% 18%, ${withAlpha("#67e8f9", "18")} 0%, transparent 28%),
        radial-gradient(circle at 80% 22%, ${withAlpha("#60a5fa", "16")} 0%, transparent 24%),
        linear-gradient(180deg, #04080c 0%, #050b12 52%, #04070d 100%)
      `,
      lighting: `radial-gradient(circle at 52% 16%, ${withAlpha("#dff7ff", "14")} 0%, transparent 28%)`,
      ambientOne: `radial-gradient(circle at 28% 24%, ${withAlpha("#67e8f9", "18")} 0%, transparent 44%)`,
      ambientTwo: `linear-gradient(122deg, transparent 22%, ${withAlpha("#93c5fd", "18")} 48%, transparent 78%)`,
      pattern:
        "radial-gradient(circle at 18% 24%, rgba(223,247,255,0.18) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 32%, rgba(103,232,249,0.18) 0 1.2px, transparent 1.7px), radial-gradient(circle at 62% 78%, rgba(191,219,254,0.16) 0 1px, transparent 1.6px)",
      depthOverlay:
        "linear-gradient(180deg, rgba(4,7,13,0.04), rgba(4,7,13,0.14) 46%, rgba(4,7,13,0.36) 100%)",
      vignette:
        "radial-gradient(circle at center, rgba(4,7,13,0) 46%, rgba(4,7,13,0.38) 100%), linear-gradient(180deg, rgba(4,7,13,0.04), rgba(4,7,13,0.14) 48%, rgba(4,7,13,0.42) 100%)",
      foregroundHaze:
        "linear-gradient(180deg, transparent 54%, rgba(6,18,28,0.08) 100%), radial-gradient(circle at 50% 82%, rgba(223,247,255,0.08), transparent 34%)",
    };
  }

  if (variant === "cyber") {
    return {
      base: `
        radial-gradient(circle at 20% 18%, ${withAlpha("#22d3ee", "18")} 0%, transparent 28%),
        radial-gradient(circle at 82% 20%, ${withAlpha("#2563eb", "16")} 0%, transparent 24%),
        linear-gradient(180deg, #03070b 0%, #04090f 52%, #03050a 100%)
      `,
      lighting: `linear-gradient(180deg, transparent 8%, ${withAlpha("#22d3ee", "10")} 56%, transparent 92%)`,
      ambientOne: `radial-gradient(circle at 34% 22%, ${withAlpha("#22d3ee", "18")} 0%, transparent 38%)`,
      ambientTwo: `linear-gradient(180deg, transparent 12%, ${withAlpha("#38bdf8", "16")} 44%, transparent 78%)`,
      pattern:
        "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      depthOverlay:
        "repeating-linear-gradient(180deg, rgba(34,211,238,0.02) 0 1px, transparent 1px 8px), linear-gradient(180deg, rgba(3,7,11,0.02), rgba(3,7,11,0.36) 100%)",
      vignette:
        "radial-gradient(circle at center, rgba(3,5,10,0) 44%, rgba(3,5,10,0.38) 100%), linear-gradient(180deg, rgba(3,5,10,0.06), rgba(3,5,10,0.18) 46%, rgba(3,5,10,0.46) 100%)",
      foregroundHaze:
        "linear-gradient(180deg, transparent 58%, rgba(3,10,16,0.08) 100%), linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.04) 48%, transparent 100%)",
    };
  }

  return {
    base: `
      radial-gradient(circle at 18% 18%, ${withAlpha("#f472b6", "16")} 0%, transparent 28%),
      radial-gradient(circle at 82% 18%, ${withAlpha("#8b5cf6", "16")} 0%, transparent 24%),
      linear-gradient(180deg, #07050a 0%, #080511 48%, #05040a 100%)
    `,
    lighting: `radial-gradient(circle at 50% 16%, ${withAlpha(themeColor, "14")} 0%, transparent 28%)`,
    ambientOne: `radial-gradient(circle at 32% 22%, ${withAlpha("#f472b6", "18")} 0%, transparent 42%)`,
    ambientTwo: `linear-gradient(120deg, transparent 12%, ${withAlpha("#8b5cf6", "18")} 42%, transparent 68%)`,
    pattern:
      "linear-gradient(118deg, transparent 16%, rgba(255,255,255,0.05) 38%, transparent 62%), linear-gradient(136deg, transparent 28%, rgba(244,114,182,0.08) 52%, transparent 76%)",
    depthOverlay:
      "linear-gradient(180deg, rgba(4,4,9,0.04), rgba(4,4,9,0.16) 50%, rgba(4,4,9,0.42) 100%)",
    vignette:
      "radial-gradient(circle at center, rgba(4,4,9,0) 44%, rgba(4,4,9,0.42) 100%), linear-gradient(180deg, rgba(4,4,9,0.08), rgba(4,4,9,0.18) 48%, rgba(4,4,9,0.46) 100%)",
    foregroundHaze:
      "linear-gradient(180deg, transparent 56%, rgba(7,4,10,0.08) 100%), radial-gradient(circle at 50% 82%, rgba(255,255,255,0.04), transparent 34%)",
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
  }

  .living-profile-background::before,
  .living-profile-background::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .living-profile-background::before {
    z-index: 3;
    background:
      radial-gradient(circle at 50% 18%, rgba(255,255,255,0.08) 0%, transparent 24%),
      radial-gradient(circle at 50% 30%, var(--living-bg-theme-bloom, rgba(255,255,255,0.12)) 0%, transparent 52%),
      radial-gradient(circle at 50% 72%, rgba(255,255,255,0.04) 0%, transparent 44%);
    opacity: calc(var(--living-bg-bloom-opacity, 0.32) * 0.74);
    mix-blend-mode: screen;
    filter: blur(14px);
    animation: living-bg-cinema-breathe 18s ease-in-out infinite;
  }

  .living-profile-background::after {
    z-index: 8;
    inset: -12%;
    background:
      radial-gradient(circle at 20% 18%, rgba(255,255,255,0.2) 0 0.8px, transparent 1px),
      radial-gradient(circle at 76% 30%, rgba(255,255,255,0.14) 0 0.8px, transparent 1px),
      radial-gradient(circle at 42% 72%, rgba(255,255,255,0.12) 0 0.9px, transparent 1.1px),
      repeating-linear-gradient(
        0deg,
        rgba(255,255,255,0.028) 0 1px,
        transparent 1px 3px
      );
    background-size: 180px 180px, 220px 220px, 260px 260px, 100% 100%;
    opacity: var(--living-bg-grain-opacity, 0.03);
    mix-blend-mode: soft-light;
    animation: living-bg-grain-drift 24s linear infinite;
  }

  .living-profile-layer-base,
  .living-profile-layer-vignette,
  .living-profile-layer-depth,
  .living-profile-layer-foreground {
    will-change: opacity;
  }

  .living-profile-layer-base {
    z-index: 0;
  }

  .living-profile-layer-lighting,
  .living-profile-layer-ambient {
    z-index: 1;
    mix-blend-mode: screen;
  }

  .living-profile-layer-lighting {
    opacity: var(--living-bg-lighting-opacity, 0.3);
  }

  .living-profile-layer-ambient {
    opacity: 0.58;
  }

  .living-profile-layer-pattern {
    z-index: 2;
    opacity: var(--living-bg-pattern-opacity, 0.34);
    background-repeat: repeat;
    background-size: 152px 152px;
  }

  .living-profile-layer-depth {
    z-index: 5;
    opacity: var(--living-bg-depth-opacity, 0.72);
  }

  .living-profile-layer-vignette {
    z-index: 6;
    opacity: var(--living-bg-vignette-opacity, 0.46);
  }

  .living-profile-layer-foreground {
    z-index: 7;
    opacity: var(--living-bg-foreground-opacity, 0.22);
  }

  .living-profile-layer-depth::before,
  .living-profile-layer-foreground::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .living-profile-layer-depth::before {
    background:
      radial-gradient(circle at 50% 48%, rgba(255,255,255,0.03) 0%, transparent 42%),
      linear-gradient(
        180deg,
        transparent 8%,
        var(--living-bg-theme-fog, rgba(255,255,255,0.08)) 56%,
        transparent 100%
      );
    opacity: calc(var(--living-bg-fog-opacity, 0.2) * 0.72);
    filter: blur(16px);
    mix-blend-mode: screen;
    animation: living-bg-fog-drift 20s ease-in-out infinite;
  }

  .living-profile-layer-foreground::before {
    background:
      radial-gradient(circle at 50% 100%, rgba(255,255,255,0.08) 0%, transparent 44%),
      linear-gradient(
        180deg,
        transparent 18%,
        var(--living-bg-theme-foreground, rgba(255,255,255,0.1)) 78%,
        rgba(3,5,10,0.22) 100%
      );
    opacity: calc(var(--living-bg-fog-opacity, 0.2) * 0.86);
    filter: blur(12px);
    animation: living-bg-fog-drift 26s ease-in-out infinite reverse;
  }

  .variant-neon .ambient-one {
    animation: living-bg-breathe 12s ease-in-out infinite;
  }

  .variant-neon .ambient-two {
    animation: living-bg-drift-diagonal 22s ease-in-out infinite;
    opacity: 0.46;
  }

  .variant-neon .living-profile-layer-pattern {
    animation: living-bg-beam-float 22s ease-in-out infinite;
  }

  .variant-void .ambient-one {
    animation: living-bg-shadow-wave 22s ease-in-out infinite;
    opacity: 0.68;
  }

  .variant-void .ambient-two {
    animation: living-bg-slow-float 18s ease-in-out infinite;
    opacity: 0.42;
  }

  .variant-galaxy .ambient-one {
    animation: living-bg-breathe 14s ease-in-out infinite;
  }

  .variant-galaxy .ambient-two {
    animation: living-bg-orbit-glow 24s linear infinite;
  }

  .variant-galaxy .living-profile-layer-pattern {
    animation: living-bg-twinkle 18s ease-in-out infinite;
  }

  .variant-fire .ambient-one {
    animation: living-bg-breathe 9s ease-in-out infinite;
  }

  .variant-fire .ambient-two {
    animation: living-bg-drift-diagonal 14s ease-in-out infinite;
    opacity: 0.48;
  }

  .variant-fire .living-profile-layer-pattern {
    animation: living-bg-ember-rise 12s ease-in-out infinite;
  }

  .variant-frost .ambient-one {
    animation: living-bg-breathe 16s ease-in-out infinite;
    opacity: 0.78;
  }

  .variant-frost .ambient-two {
    animation: living-bg-calm-wave 20s ease-in-out infinite;
    opacity: 0.44;
  }

  .variant-frost .living-profile-layer-pattern {
    animation: living-bg-twinkle 18s ease-in-out infinite;
  }

  .variant-cyber .ambient-one {
    animation: living-bg-breathe 10s ease-in-out infinite;
  }

  .variant-cyber .ambient-two {
    animation: living-bg-scan-sweep 8s linear infinite;
    opacity: 0.46;
  }

  .variant-cyber .living-profile-layer-pattern {
    animation: living-bg-grid-drift 18s linear infinite;
    background-size: 96px 96px;
  }

  .living-profile-background.is-preview .living-profile-layer-pattern {
    opacity: calc(var(--living-bg-pattern-opacity, 0.34) * 0.68);
  }

  .living-profile-background.is-preview .living-profile-layer-depth,
  .living-profile-background.is-preview .living-profile-layer-foreground {
    opacity: calc(var(--living-bg-foreground-opacity, 0.22) * 0.72);
  }

  .living-profile-background.motion-off .living-profile-layer-lighting,
  .living-profile-background.motion-off .living-profile-layer-ambient,
  .living-profile-background.motion-off .living-profile-layer-pattern,
  .living-profile-background.motion-off::before,
  .living-profile-background.motion-off::after,
  .living-profile-background.motion-off .living-profile-layer-depth::before,
  .living-profile-background.motion-off .living-profile-layer-foreground::before {
    animation: none !important;
    transform: none !important;
  }

  .living-profile-background.motion-off .living-profile-layer-pattern {
    background-size: 180px 180px;
  }

  .living-profile-background.motion-subtle .living-profile-layer-pattern {
    background-size: 164px 164px;
  }

  @keyframes living-bg-breathe {
    0%,
    100% {
      opacity: 0.34;
      transform: scale(0.98);
    }

    50% {
      opacity: 0.86;
      transform: scale(1.03);
    }
  }

  @keyframes living-bg-cinema-breathe {
    0%,
    100% {
      opacity: calc(var(--living-bg-bloom-opacity, 0.32) * 0.82);
      transform: scale(0.985) translate3d(0, 0, 0);
    }

    50% {
      opacity: calc(var(--living-bg-bloom-opacity, 0.32) * 1.06);
      transform: scale(1.02) translate3d(0, -1%, 0);
    }
  }

  @keyframes living-bg-fog-drift {
    0%,
    100% {
      transform: translate3d(-1.4%, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(1.6%, -1.6%, 0) scale(1.03);
    }
  }

  @keyframes living-bg-grain-drift {
    0% {
      transform: translate3d(0, 0, 0);
    }

    25% {
      transform: translate3d(-1.2%, 0.6%, 0);
    }

    50% {
      transform: translate3d(0.8%, -0.8%, 0);
    }

    75% {
      transform: translate3d(-0.5%, 1%, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes living-bg-drift-diagonal {
    0%,
    100% {
      opacity: 0.3;
      transform: translate3d(-2%, -2%, 0) scale(1);
    }

    50% {
      opacity: 0.54;
      transform: translate3d(2%, 2%, 0) scale(1.02);
    }
  }

  @keyframes living-bg-slow-float {
    0%,
    100% {
      opacity: 0.24;
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      opacity: 0.5;
      transform: translate3d(0, 2%, 0) scale(1.02);
    }
  }

  @keyframes living-bg-shadow-wave {
    0%,
    100% {
      opacity: 0.3;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.62;
      transform: translate3d(1.5%, 2%, 0) scale(1.04);
    }
  }

  @keyframes living-bg-orbit-glow {
    from {
      transform: rotate(0deg) scale(1);
    }

    to {
      transform: rotate(360deg) scale(1.03);
    }
  }

  @keyframes living-bg-ember-rise {
    0%,
    100% {
      opacity: 0.22;
      transform: translate3d(0, 1.5%, 0) scale(0.98);
    }

    50% {
      opacity: 0.5;
      transform: translate3d(0, -2.2%, 0) scale(1.03);
    }
  }

  @keyframes living-bg-calm-wave {
    0%,
    100% {
      opacity: 0.22;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.46;
      transform: translate3d(1.5%, 1.5%, 0) scale(1.02);
    }
  }

  @keyframes living-bg-beam-float {
    0%,
    100% {
      opacity: 0.26;
      transform: translate3d(-1.5%, 0, 0) scale(1);
    }

    50% {
      opacity: 0.48;
      transform: translate3d(1.5%, 0, 0) scale(1.03);
    }
  }

  @keyframes living-bg-scan-sweep {
    0% {
      opacity: 0.16;
      transform: translate3d(0, -8%, 0);
    }

    50% {
      opacity: 0.44;
      transform: translate3d(0, 8%, 0);
    }

    100% {
      opacity: 0.16;
      transform: translate3d(0, -8%, 0);
    }
  }

  @keyframes living-bg-grid-drift {
    0% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(1.2%, 1.2%, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes living-bg-twinkle {
    0%,
    100% {
      opacity: 0.18;
      transform: scale(1);
    }

    50% {
      opacity: 0.34;
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    .living-profile-layer-pattern {
      opacity: calc(var(--living-bg-pattern-opacity, 0.34) * 0.58);
    }

    .living-profile-layer-foreground {
      opacity: calc(var(--living-bg-foreground-opacity, 0.22) * 0.62);
    }

    .living-profile-background::before,
    .living-profile-background::after {
      opacity: calc(var(--living-bg-bloom-opacity, 0.32) * 0.5);
    }
  }

  @media (hover: none) and (pointer: coarse), (update: slow) {
    .living-profile-layer-pattern {
      animation-duration: 22s !important;
    }

    .living-profile-layer-ambient {
      opacity: 0.46;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .living-profile-layer-lighting,
    .living-profile-layer-ambient,
    .living-profile-layer-pattern {
      animation: none !important;
      transform: none !important;
    }

    .living-profile-layer-pattern {
      opacity: calc(var(--living-bg-pattern-opacity, 0.34) * 0.54);
    }

    .living-profile-layer-foreground {
      opacity: calc(var(--living-bg-foreground-opacity, 0.22) * 0.58);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .living-profile-background::before,
    .living-profile-background::after,
    .living-profile-layer-depth::before,
    .living-profile-layer-foreground::before,
    .living-profile-layer-lighting,
    .living-profile-layer-ambient,
    .living-profile-layer-pattern {
      animation: none !important;
      transform: none !important;
    }
  }
`;

function withAlpha(hex: string, alpha: string) {
  return /^#([0-9a-fA-F]{6})$/.test(hex.trim()) ? `${hex}${alpha}` : hex;
}
