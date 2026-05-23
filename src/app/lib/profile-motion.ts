import type { ProfileMotionLevel } from "@/app/lib/profile-customization";

export const PROFILE_MOTION_PERSONALITIES = [
  "soft",
  "cinematic",
  "cyber",
  "mono",
  "ghost",
  "pulse",
] as const;

export type ProfileMotionPersonality =
  (typeof PROFILE_MOTION_PERSONALITIES)[number];

export type ProfileMotionPersonalityTokens = {
  personality: ProfileMotionPersonality;
  name: string;
  transitionEasing: string;
  emphasisEasing: string;
  transitionDurationMs: number;
  revealDurationMs: number;
  revealDistancePx: number;
  revealScale: number;
  staggerDelayMs: number;
  hoverEnergy: number;
  hoverLiftPx: number;
  hoverScale: number;
  hoverShadowBoost: number;
  floatingIntensity: number;
  ambientDriftDistancePx: number;
  ambientDriftDurationS: number;
  blurBreathingPx: number;
  blurBreathingDurationS: number;
  glowPulseOpacity: number;
  glowPulseDurationS: number;
  auraBreathScale: number;
  heroSpillOpacity: number;
  heroDepthOpacity: number;
  scrollSettleDistancePx: number;
  scrollBlurShiftPx: number;
  scrollFocusStrength: number;
  labelLetterSpacingEm: number;
  labelOpacity: number;
};

type MotionPersonalityDefinition = Omit<
  ProfileMotionPersonalityTokens,
  "transitionDurationMs" | "revealDurationMs" | "staggerDelayMs"
> & {
  transitionDurationMs: number;
  revealDurationMs: number;
  staggerDelayMs: number;
};

const DEFAULT_MOTION_PERSONALITY: ProfileMotionPersonality = "soft";

const PROFILE_MOTION_PERSONALITY_DEFINITIONS: Record<
  ProfileMotionPersonality,
  MotionPersonalityDefinition
> = {
  soft: {
    personality: "soft",
    name: "Soft",
    transitionEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    emphasisEasing: "cubic-bezier(0.19, 1, 0.22, 1)",
    transitionDurationMs: 300,
    revealDurationMs: 720,
    revealDistancePx: 20,
    revealScale: 0.988,
    staggerDelayMs: 68,
    hoverEnergy: 0.88,
    hoverLiftPx: 1.2,
    hoverScale: 1.004,
    hoverShadowBoost: 0.3,
    floatingIntensity: 0.9,
    ambientDriftDistancePx: 5,
    ambientDriftDurationS: 24,
    blurBreathingPx: 2,
    blurBreathingDurationS: 18,
    glowPulseOpacity: 0.06,
    glowPulseDurationS: 15,
    auraBreathScale: 0.018,
    heroSpillOpacity: 0.14,
    heroDepthOpacity: 0.1,
    scrollSettleDistancePx: 8,
    scrollBlurShiftPx: 2,
    scrollFocusStrength: 0.22,
    labelLetterSpacingEm: 0.07,
    labelOpacity: 0.9,
  },
  cinematic: {
    personality: "cinematic",
    name: "Cinematic",
    transitionEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    emphasisEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDurationMs: 360,
    revealDurationMs: 860,
    revealDistancePx: 24,
    revealScale: 0.986,
    staggerDelayMs: 88,
    hoverEnergy: 0.92,
    hoverLiftPx: 1.5,
    hoverScale: 1.005,
    hoverShadowBoost: 0.45,
    floatingIntensity: 1.04,
    ambientDriftDistancePx: 6,
    ambientDriftDurationS: 28,
    blurBreathingPx: 3,
    blurBreathingDurationS: 20,
    glowPulseOpacity: 0.08,
    glowPulseDurationS: 18,
    auraBreathScale: 0.022,
    heroSpillOpacity: 0.2,
    heroDepthOpacity: 0.14,
    scrollSettleDistancePx: 12,
    scrollBlurShiftPx: 3,
    scrollFocusStrength: 0.28,
    labelLetterSpacingEm: 0.09,
    labelOpacity: 0.94,
  },
  cyber: {
    personality: "cyber",
    name: "Cyber",
    transitionEasing: "cubic-bezier(0.24, 1, 0.32, 1)",
    emphasisEasing: "cubic-bezier(0.2, 0.95, 0.25, 1)",
    transitionDurationMs: 250,
    revealDurationMs: 620,
    revealDistancePx: 16,
    revealScale: 0.992,
    staggerDelayMs: 48,
    hoverEnergy: 1.12,
    hoverLiftPx: 1.8,
    hoverScale: 1.007,
    hoverShadowBoost: 0.72,
    floatingIntensity: 1.08,
    ambientDriftDistancePx: 4,
    ambientDriftDurationS: 18,
    blurBreathingPx: 1.5,
    blurBreathingDurationS: 14,
    glowPulseOpacity: 0.1,
    glowPulseDurationS: 11,
    auraBreathScale: 0.016,
    heroSpillOpacity: 0.18,
    heroDepthOpacity: 0.11,
    scrollSettleDistancePx: 9,
    scrollBlurShiftPx: 2.5,
    scrollFocusStrength: 0.3,
    labelLetterSpacingEm: 0.08,
    labelOpacity: 0.96,
  },
  mono: {
    personality: "mono",
    name: "Mono",
    transitionEasing: "cubic-bezier(0.25, 1, 0.5, 1)",
    emphasisEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDurationMs: 220,
    revealDurationMs: 540,
    revealDistancePx: 12,
    revealScale: 0.995,
    staggerDelayMs: 40,
    hoverEnergy: 0.72,
    hoverLiftPx: 0.8,
    hoverScale: 1.002,
    hoverShadowBoost: 0.18,
    floatingIntensity: 0.82,
    ambientDriftDistancePx: 2,
    ambientDriftDurationS: 20,
    blurBreathingPx: 1,
    blurBreathingDurationS: 16,
    glowPulseOpacity: 0.03,
    glowPulseDurationS: 18,
    auraBreathScale: 0.01,
    heroSpillOpacity: 0.08,
    heroDepthOpacity: 0.08,
    scrollSettleDistancePx: 6,
    scrollBlurShiftPx: 1,
    scrollFocusStrength: 0.16,
    labelLetterSpacingEm: 0.06,
    labelOpacity: 0.84,
  },
  ghost: {
    personality: "ghost",
    name: "Ghost",
    transitionEasing: "cubic-bezier(0.18, 1, 0.32, 1)",
    emphasisEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDurationMs: 340,
    revealDurationMs: 800,
    revealDistancePx: 22,
    revealScale: 0.985,
    staggerDelayMs: 76,
    hoverEnergy: 0.8,
    hoverLiftPx: 1,
    hoverScale: 1.003,
    hoverShadowBoost: 0.22,
    floatingIntensity: 0.86,
    ambientDriftDistancePx: 4,
    ambientDriftDurationS: 26,
    blurBreathingPx: 2.5,
    blurBreathingDurationS: 22,
    glowPulseOpacity: 0.05,
    glowPulseDurationS: 19,
    auraBreathScale: 0.02,
    heroSpillOpacity: 0.12,
    heroDepthOpacity: 0.12,
    scrollSettleDistancePx: 10,
    scrollBlurShiftPx: 2,
    scrollFocusStrength: 0.2,
    labelLetterSpacingEm: 0.085,
    labelOpacity: 0.88,
  },
  pulse: {
    personality: "pulse",
    name: "Pulse",
    transitionEasing: "cubic-bezier(0.2, 1, 0.22, 1)",
    emphasisEasing: "cubic-bezier(0.19, 1, 0.22, 1)",
    transitionDurationMs: 280,
    revealDurationMs: 660,
    revealDistancePx: 18,
    revealScale: 0.99,
    staggerDelayMs: 54,
    hoverEnergy: 1.08,
    hoverLiftPx: 1.6,
    hoverScale: 1.006,
    hoverShadowBoost: 0.64,
    floatingIntensity: 1.02,
    ambientDriftDistancePx: 4,
    ambientDriftDurationS: 17,
    blurBreathingPx: 2,
    blurBreathingDurationS: 13,
    glowPulseOpacity: 0.12,
    glowPulseDurationS: 10,
    auraBreathScale: 0.018,
    heroSpillOpacity: 0.18,
    heroDepthOpacity: 0.12,
    scrollSettleDistancePx: 8,
    scrollBlurShiftPx: 2,
    scrollFocusStrength: 0.26,
    labelLetterSpacingEm: 0.075,
    labelOpacity: 0.95,
  },
};

export function normalizeProfileMotionPersonality(
  value: unknown,
): ProfileMotionPersonality | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  return PROFILE_MOTION_PERSONALITIES.includes(trimmed as ProfileMotionPersonality)
    ? (trimmed as ProfileMotionPersonality)
    : null;
}

export function getProfileMotionPersonalityTokens(input: {
  personality?: ProfileMotionPersonality | null;
  motionLevel?: ProfileMotionLevel;
  reducedMotion?: boolean;
} = {}): ProfileMotionPersonalityTokens {
  const personality =
    normalizeProfileMotionPersonality(input.personality) ??
    DEFAULT_MOTION_PERSONALITY;
  const definition = PROFILE_MOTION_PERSONALITY_DEFINITIONS[personality];
  const motionLevel = input.motionLevel ?? "subtle";

  if (input.reducedMotion || motionLevel === "off") {
    return {
      ...definition,
      transitionDurationMs: 160,
      revealDurationMs: 220,
      revealDistancePx: 0,
      revealScale: 1,
      staggerDelayMs: 0,
      hoverEnergy: 0,
      hoverLiftPx: 0,
      hoverScale: 1,
      hoverShadowBoost: 0,
      floatingIntensity: 0,
      ambientDriftDistancePx: 0,
      blurBreathingPx: 0,
      glowPulseOpacity: 0,
      auraBreathScale: 0,
      heroSpillOpacity: definition.heroSpillOpacity * 0.55,
      heroDepthOpacity: definition.heroDepthOpacity * 0.55,
      scrollSettleDistancePx: 0,
      scrollBlurShiftPx: 0,
      scrollFocusStrength: 0.08,
    };
  }

  const intensityScale = motionLevel === "alive" ? 1 : 0.76;
  const durationScale = motionLevel === "alive" ? 1 : 1.08;

  return {
    ...definition,
    transitionDurationMs: Math.round(definition.transitionDurationMs * durationScale),
    revealDurationMs: Math.round(definition.revealDurationMs * durationScale),
    revealDistancePx: Number(
      (definition.revealDistancePx * intensityScale).toFixed(2),
    ),
    revealScale: Number(
      (1 - (1 - definition.revealScale) * intensityScale).toFixed(4),
    ),
    staggerDelayMs: Math.round(definition.staggerDelayMs * durationScale),
    hoverEnergy: Number((definition.hoverEnergy * intensityScale).toFixed(3)),
    hoverLiftPx: Number((definition.hoverLiftPx * intensityScale).toFixed(2)),
    hoverScale: Number(
      (1 + (definition.hoverScale - 1) * intensityScale).toFixed(4),
    ),
    hoverShadowBoost: Number(
      (definition.hoverShadowBoost * intensityScale).toFixed(3),
    ),
    floatingIntensity: Number(
      (definition.floatingIntensity * intensityScale).toFixed(3),
    ),
    ambientDriftDistancePx: Number(
      (definition.ambientDriftDistancePx * intensityScale).toFixed(2),
    ),
    ambientDriftDurationS: Number(
      (definition.ambientDriftDurationS * durationScale).toFixed(2),
    ),
    blurBreathingPx: Number(
      (definition.blurBreathingPx * intensityScale).toFixed(2),
    ),
    blurBreathingDurationS: Number(
      (definition.blurBreathingDurationS * durationScale).toFixed(2),
    ),
    glowPulseOpacity: Number(
      (definition.glowPulseOpacity * intensityScale).toFixed(3),
    ),
    glowPulseDurationS: Number(
      (definition.glowPulseDurationS * durationScale).toFixed(2),
    ),
    auraBreathScale: Number(
      (definition.auraBreathScale * intensityScale).toFixed(4),
    ),
    heroSpillOpacity: Number(
      (definition.heroSpillOpacity * (0.78 + intensityScale * 0.22)).toFixed(3),
    ),
    heroDepthOpacity: Number(
      (definition.heroDepthOpacity * (0.8 + intensityScale * 0.2)).toFixed(3),
    ),
    scrollSettleDistancePx: Number(
      (definition.scrollSettleDistancePx * intensityScale).toFixed(2),
    ),
    scrollBlurShiftPx: Number(
      (definition.scrollBlurShiftPx * intensityScale).toFixed(2),
    ),
    scrollFocusStrength: Number(
      (definition.scrollFocusStrength * (0.72 + intensityScale * 0.28)).toFixed(3),
    ),
  };
}
