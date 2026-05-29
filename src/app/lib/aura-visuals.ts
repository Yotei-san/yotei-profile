import type { AuraRank } from "@/app/lib/aura";

export type AuraRankTone =
  | "ash"
  | "mist"
  | "glacier"
  | "violet"
  | "rose"
  | "solar";

export type AuraVisualProfile = {
  rank: AuraRank;
  label: string;
  tone: AuraRankTone;
  accentColor: string;
  softColor: string;
  glowColor: string;
  surfaceColor: string;
  ringColor: string;
  intensity: number;
  motion: number;
  ambientDotOpacity: number;
  avatarHaloScale: number;
  avatarRingBoost: number;
  identityGlowBoost: number;
  badgeAccentBoost: number;
  hasAuraChip: boolean;
  hasAvatarGlow: boolean;
  hasAmbientDots: boolean;
  hasIdentityGlow: boolean;
  hasLivingAura: boolean;
  hasSignatureCrest: boolean;
};

const AURA_VISUAL_PROFILES: Record<AuraRank, AuraVisualProfile> = {
  E: {
    rank: "E",
    label: "Dormant",
    tone: "ash",
    accentColor: "#94a3b8",
    softColor: "#cbd5e1",
    glowColor: "rgba(148,163,184,0.18)",
    surfaceColor: "rgba(148,163,184,0.10)",
    ringColor: "#a7b6c9",
    intensity: 0.12,
    motion: 0.06,
    ambientDotOpacity: 0,
    avatarHaloScale: 1,
    avatarRingBoost: 0.02,
    identityGlowBoost: 0.04,
    badgeAccentBoost: 0.04,
    hasAuraChip: false,
    hasAvatarGlow: false,
    hasAmbientDots: false,
    hasIdentityGlow: false,
    hasLivingAura: false,
    hasSignatureCrest: false,
  },
  D: {
    rank: "D",
    label: "Awakening",
    tone: "mist",
    accentColor: "#93c5fd",
    softColor: "#dbeafe",
    glowColor: "rgba(147,197,253,0.24)",
    surfaceColor: "rgba(147,197,253,0.12)",
    ringColor: "#a7d0ff",
    intensity: 0.2,
    motion: 0.12,
    ambientDotOpacity: 0,
    avatarHaloScale: 1.03,
    avatarRingBoost: 0.08,
    identityGlowBoost: 0.08,
    badgeAccentBoost: 0.08,
    hasAuraChip: true,
    hasAvatarGlow: true,
    hasAmbientDots: false,
    hasIdentityGlow: false,
    hasLivingAura: false,
    hasSignatureCrest: false,
  },
  C: {
    rank: "C",
    label: "Charged",
    tone: "glacier",
    accentColor: "#7dd3fc",
    softColor: "#cffafe",
    glowColor: "rgba(125,211,252,0.30)",
    surfaceColor: "rgba(125,211,252,0.14)",
    ringColor: "#8fe0ff",
    intensity: 0.34,
    motion: 0.22,
    ambientDotOpacity: 0.38,
    avatarHaloScale: 1.06,
    avatarRingBoost: 0.16,
    identityGlowBoost: 0.14,
    badgeAccentBoost: 0.18,
    hasAuraChip: true,
    hasAvatarGlow: true,
    hasAmbientDots: true,
    hasIdentityGlow: false,
    hasLivingAura: false,
    hasSignatureCrest: false,
  },
  B: {
    rank: "B",
    label: "Radiant",
    tone: "violet",
    accentColor: "#a78bfa",
    softColor: "#ddd6fe",
    glowColor: "rgba(167,139,250,0.36)",
    surfaceColor: "rgba(167,139,250,0.16)",
    ringColor: "#b99cff",
    intensity: 0.5,
    motion: 0.42,
    ambientDotOpacity: 0.44,
    avatarHaloScale: 1.1,
    avatarRingBoost: 0.24,
    identityGlowBoost: 0.26,
    badgeAccentBoost: 0.28,
    hasAuraChip: true,
    hasAvatarGlow: true,
    hasAmbientDots: true,
    hasIdentityGlow: true,
    hasLivingAura: true,
    hasSignatureCrest: false,
  },
  A: {
    rank: "A",
    label: "Ascendant",
    tone: "rose",
    accentColor: "#f472b6",
    softColor: "#fbcfe8",
    glowColor: "rgba(244,114,182,0.42)",
    surfaceColor: "rgba(244,114,182,0.18)",
    ringColor: "#ff8dcc",
    intensity: 0.68,
    motion: 0.54,
    ambientDotOpacity: 0.5,
    avatarHaloScale: 1.12,
    avatarRingBoost: 0.32,
    identityGlowBoost: 0.42,
    badgeAccentBoost: 0.42,
    hasAuraChip: true,
    hasAvatarGlow: true,
    hasAmbientDots: true,
    hasIdentityGlow: true,
    hasLivingAura: true,
    hasSignatureCrest: false,
  },
  S: {
    rank: "S",
    label: "Sovereign",
    tone: "solar",
    accentColor: "#f5d06e",
    softColor: "#fef3c7",
    glowColor: "rgba(245,208,110,0.48)",
    surfaceColor: "rgba(245,208,110,0.20)",
    ringColor: "#ffe199",
    intensity: 0.84,
    motion: 0.68,
    ambientDotOpacity: 0.56,
    avatarHaloScale: 1.16,
    avatarRingBoost: 0.42,
    identityGlowBoost: 0.56,
    badgeAccentBoost: 0.58,
    hasAuraChip: true,
    hasAvatarGlow: true,
    hasAmbientDots: true,
    hasIdentityGlow: true,
    hasLivingAura: true,
    hasSignatureCrest: true,
  },
};

export function getAuraVisualProfile(rank: string | null | undefined): AuraVisualProfile {
  return AURA_VISUAL_PROFILES[normalizeAuraRank(rank)];
}

export function getAuraRankLabel(rank: string | null | undefined) {
  return getAuraVisualProfile(rank).label;
}

export function getAuraRankTone(rank: string | null | undefined) {
  return getAuraVisualProfile(rank).tone;
}

function normalizeAuraRank(rank: string | null | undefined): AuraRank {
  return rank === "D" ||
    rank === "C" ||
    rank === "B" ||
    rank === "A" ||
    rank === "S"
    ? rank
    : "E";
}
