import type { ProfileMotionPersonality } from "@/app/lib/profile-motion";

export const PROFILE_DNA_TYPES = [
  "ghost",
  "cyber",
  "ambient",
  "void",
  "softglass",
  "mono",
  "pulse",
  "clean",
  "cinematic",
] as const;

export type ProfileDnaType = (typeof PROFILE_DNA_TYPES)[number];
export type ProfileDnaAlignmentBehavior = "centered" | "balanced" | "offset";

export type ProfileDnaTuning = {
  value: ProfileDnaType | null;
  name: string;
  description: string;
  accent: string;
  spacingScale: number;
  transparencyScale: number;
  blurScale: number;
  borderScale: number;
  shadowScale: number;
  hoverEnergy: number;
  separationScale: number;
  typographyScale: number;
  compactnessScale: number;
  ambientScale: number;
  floatingIntensity: number;
  introStageScale: number;
  alignment: ProfileDnaAlignmentBehavior;
  chipScale: number;
  glowScale: number;
  motionScale: number;
  motionPersonality: ProfileMotionPersonality;
};

type ProfileDnaDefinition = ProfileDnaTuning;

const DEFAULT_PROFILE_DNA_TUNING: ProfileDnaTuning = {
  value: null,
  name: "Custom",
  description: "Keep your current atmosphere and manual tweaks.",
  accent: "#f5f7ff",
  spacingScale: 1,
  transparencyScale: 1,
  blurScale: 1,
  borderScale: 1,
  shadowScale: 1,
  hoverEnergy: 1,
  separationScale: 1,
  typographyScale: 1,
  compactnessScale: 1,
  ambientScale: 1,
  floatingIntensity: 1,
  introStageScale: 1,
  alignment: "balanced",
  chipScale: 1,
  glowScale: 1,
  motionScale: 1,
  motionPersonality: "soft",
};

const PROFILE_DNA_DEFINITIONS: Record<ProfileDnaType, ProfileDnaDefinition> = {
  ghost: {
    value: "ghost",
    name: "Ghost",
    description: "Faded surfaces, quiet spacing, and soft spectral restraint.",
    accent: "#d8c7ff",
    spacingScale: 0.96,
    transparencyScale: 1.18,
    blurScale: 1.08,
    borderScale: 0.76,
    shadowScale: 0.82,
    hoverEnergy: 0.84,
    separationScale: 1.02,
    typographyScale: 0.98,
    compactnessScale: 0.94,
    ambientScale: 0.9,
    floatingIntensity: 0.9,
    introStageScale: 0.96,
    alignment: "centered",
    chipScale: 0.96,
    glowScale: 0.84,
    motionScale: 0.88,
    motionPersonality: "ghost",
  },
  cyber: {
    value: "cyber",
    name: "Cyber",
    description: "Sharper edges, brighter contrast, and active tech-noir energy.",
    accent: "#22d3ee",
    spacingScale: 0.92,
    transparencyScale: 0.92,
    blurScale: 0.84,
    borderScale: 1.18,
    shadowScale: 1.02,
    hoverEnergy: 1.16,
    separationScale: 0.94,
    typographyScale: 0.99,
    compactnessScale: 0.94,
    ambientScale: 1.16,
    floatingIntensity: 1.14,
    introStageScale: 0.98,
    alignment: "offset",
    chipScale: 0.94,
    glowScale: 1.22,
    motionScale: 1.12,
    motionPersonality: "cyber",
  },
  ambient: {
    value: "ambient",
    name: "Ambient",
    description: "Large breathing room, soft depth, and calm room-like presence.",
    accent: "#b8a9ff",
    spacingScale: 1.08,
    transparencyScale: 1.08,
    blurScale: 1.14,
    borderScale: 0.88,
    shadowScale: 1.06,
    hoverEnergy: 0.92,
    separationScale: 1.12,
    typographyScale: 1.02,
    compactnessScale: 1.02,
    ambientScale: 1.14,
    floatingIntensity: 1.06,
    introStageScale: 1.04,
    alignment: "balanced",
    chipScale: 1.02,
    glowScale: 1.08,
    motionScale: 0.94,
    motionPersonality: "soft",
  },
  void: {
    value: "void",
    name: "Void",
    description: "Desaturated depth, low-border surfaces, and darker atmospheric pull.",
    accent: "#8b9cf9",
    spacingScale: 1.02,
    transparencyScale: 1.14,
    blurScale: 1.02,
    borderScale: 0.7,
    shadowScale: 1.18,
    hoverEnergy: 0.86,
    separationScale: 1.08,
    typographyScale: 0.98,
    compactnessScale: 0.96,
    ambientScale: 1.2,
    floatingIntensity: 1.1,
    introStageScale: 1.04,
    alignment: "offset",
    chipScale: 0.96,
    glowScale: 0.9,
    motionScale: 0.9,
    motionPersonality: "ghost",
  },
  softglass: {
    value: "softglass",
    name: "Softglass",
    description: "Creamier blur, translucent softness, and gentle premium separation.",
    accent: "#67e8f9",
    spacingScale: 1.04,
    transparencyScale: 1.16,
    blurScale: 1.22,
    borderScale: 0.84,
    shadowScale: 0.94,
    hoverEnergy: 0.9,
    separationScale: 1.04,
    typographyScale: 1.01,
    compactnessScale: 1,
    ambientScale: 1.04,
    floatingIntensity: 0.98,
    introStageScale: 1.02,
    alignment: "balanced",
    chipScale: 1,
    glowScale: 1.04,
    motionScale: 0.92,
    motionPersonality: "soft",
  },
  mono: {
    value: "mono",
    name: "Mono",
    description: "Near-monochrome restraint with flatter modules and reduced visual noise.",
    accent: "#d9dde7",
    spacingScale: 0.94,
    transparencyScale: 0.96,
    blurScale: 0.82,
    borderScale: 0.9,
    shadowScale: 0.76,
    hoverEnergy: 0.78,
    separationScale: 0.94,
    typographyScale: 0.97,
    compactnessScale: 0.92,
    ambientScale: 0.82,
    floatingIntensity: 0.88,
    introStageScale: 0.94,
    alignment: "centered",
    chipScale: 0.92,
    glowScale: 0.72,
    motionScale: 0.82,
    motionPersonality: "mono",
  },
  pulse: {
    value: "pulse",
    name: "Pulse",
    description: "Charged glow, quick hover energy, and a more active living stage.",
    accent: "#fb7185",
    spacingScale: 0.96,
    transparencyScale: 1,
    blurScale: 0.96,
    borderScale: 1.08,
    shadowScale: 1.04,
    hoverEnergy: 1.2,
    separationScale: 0.98,
    typographyScale: 1,
    compactnessScale: 0.96,
    ambientScale: 1.18,
    floatingIntensity: 1.16,
    introStageScale: 1.02,
    alignment: "offset",
    chipScale: 0.96,
    glowScale: 1.24,
    motionScale: 1.16,
    motionPersonality: "pulse",
  },
  clean: {
    value: "clean",
    name: "Clean",
    description: "Calm premium balance with tidy rhythm and low visual pressure.",
    accent: "#f5f7ff",
    spacingScale: 0.98,
    transparencyScale: 1,
    blurScale: 0.94,
    borderScale: 0.96,
    shadowScale: 0.9,
    hoverEnergy: 0.9,
    separationScale: 0.98,
    typographyScale: 0.99,
    compactnessScale: 0.96,
    ambientScale: 0.94,
    floatingIntensity: 0.94,
    introStageScale: 0.98,
    alignment: "centered",
    chipScale: 0.96,
    glowScale: 0.9,
    motionScale: 0.9,
    motionPersonality: "soft",
  },
  cinematic: {
    value: "cinematic",
    name: "Cinematic",
    description: "Deeper shadows, wider breathing space, and a stronger opening stage.",
    accent: "#f59e0b",
    spacingScale: 1.08,
    transparencyScale: 1.04,
    blurScale: 1.04,
    borderScale: 0.92,
    shadowScale: 1.2,
    hoverEnergy: 0.94,
    separationScale: 1.12,
    typographyScale: 1.04,
    compactnessScale: 1.02,
    ambientScale: 1.2,
    floatingIntensity: 1.12,
    introStageScale: 1.1,
    alignment: "balanced",
    chipScale: 1.02,
    glowScale: 1.16,
    motionScale: 0.9,
    motionPersonality: "cinematic",
  },
};

export const PROFILE_DNA_OPTIONS = PROFILE_DNA_TYPES.map((value) => {
  const dna = PROFILE_DNA_DEFINITIONS[value];

  return {
    value: dna.value,
    name: dna.name,
    description: dna.description,
    accent: dna.accent,
  };
});

export function normalizeProfileDna(value: unknown): ProfileDnaType | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  return PROFILE_DNA_TYPES.includes(trimmed as ProfileDnaType)
    ? (trimmed as ProfileDnaType)
    : null;
}

export function getProfileDnaTuning(value: unknown): ProfileDnaTuning {
  const dna = normalizeProfileDna(value);

  return dna ? PROFILE_DNA_DEFINITIONS[dna] : DEFAULT_PROFILE_DNA_TUNING;
}
