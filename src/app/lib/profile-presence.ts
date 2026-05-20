export const PROFILE_MOODS = [
  "locked-in",
  "chilling",
  "streaming",
  "coding",
  "afk",
  "night",
] as const;

export const PROFILE_AURAS = [
  "none",
  "neon",
  "void",
  "galaxy",
  "fire",
  "frost",
  "cyber",
] as const;

export type ProfileMood = (typeof PROFILE_MOODS)[number];
export type ProfileAura = (typeof PROFILE_AURAS)[number];

type MoodOption = {
  value: ProfileMood;
  name: string;
  description: string;
  statusLabel: string;
  chipLabel: string;
  primary: string;
  secondary: string;
  tertiary: string;
  pulse: string;
};

type AuraOption = {
  value: ProfileAura;
  name: string;
  description: string;
  ring: string;
  glow: string;
  accent: string;
  overlay: string;
};

const MOOD_OPTIONS: Record<ProfileMood, MoodOption> = {
  "locked-in": {
    value: "locked-in",
    name: "Locked In",
    description: "Focused pressure with a premium purple-pink edge.",
    statusLabel: "Locked in",
    chipLabel: "Focus pressure",
    primary: "#f472b6",
    secondary: "#8b5cf6",
    tertiary: "#f9a8d4",
    pulse: "#ff69b4",
  },
  chilling: {
    value: "chilling",
    name: "Chilling",
    description: "Soft blue-violet atmosphere with calmer energy.",
    statusLabel: "Chill presence",
    chipLabel: "Easy energy",
    primary: "#60a5fa",
    secondary: "#a78bfa",
    tertiary: "#c4b5fd",
    pulse: "#93c5fd",
  },
  streaming: {
    value: "streaming",
    name: "Streaming",
    description: "Live-ready heat with red highlights and urgency.",
    statusLabel: "Live energy",
    chipLabel: "On air",
    primary: "#fb7185",
    secondary: "#f97316",
    tertiary: "#fecaca",
    pulse: "#ef4444",
  },
  coding: {
    value: "coding",
    name: "Coding",
    description: "Cool blue cyber glow for build sessions.",
    statusLabel: "Building mode",
    chipLabel: "In the repo",
    primary: "#38bdf8",
    secondary: "#2563eb",
    tertiary: "#7dd3fc",
    pulse: "#22d3ee",
  },
  afk: {
    value: "afk",
    name: "AFK",
    description: "Muted, distant tones for away mode.",
    statusLabel: "Away",
    chipLabel: "Stepped away",
    primary: "#a78bfa",
    secondary: "#64748b",
    tertiary: "#cbd5e1",
    pulse: "#94a3b8",
  },
  night: {
    value: "night",
    name: "Night",
    description: "Dark blue midnight atmosphere with subtle depth.",
    statusLabel: "Night mode",
    chipLabel: "After hours",
    primary: "#1d4ed8",
    secondary: "#0f172a",
    tertiary: "#93c5fd",
    pulse: "#60a5fa",
  },
};

const AURA_OPTIONS: Record<ProfileAura, AuraOption> = {
  none: {
    value: "none",
    name: "None",
    description: "Keep the profile clean and atmospheric without an extra ring.",
    ring: "rgba(255,255,255,0.06)",
    glow: "rgba(255,255,255,0.00)",
    accent: "#94a3b8",
    overlay: "none",
  },
  neon: {
    value: "neon",
    name: "Neon",
    description: "Bright pink-violet ring glow with arcade energy.",
    ring: "#f472b6",
    glow: "rgba(244,114,182,0.34)",
    accent: "#f472b6",
    overlay: "linear-gradient(135deg, rgba(244,114,182,0.24), rgba(139,92,246,0.10), transparent 72%)",
  },
  void: {
    value: "void",
    name: "Void",
    description: "Deep violet shadow aura with low-light depth.",
    ring: "#7c3aed",
    glow: "rgba(76,29,149,0.34)",
    accent: "#8b5cf6",
    overlay: "radial-gradient(circle at 50% 30%, rgba(76,29,149,0.28), transparent 62%)",
  },
  galaxy: {
    value: "galaxy",
    name: "Galaxy",
    description: "Cosmic glow with light starfield detail.",
    ring: "#818cf8",
    glow: "rgba(99,102,241,0.28)",
    accent: "#c084fc",
    overlay:
      "radial-gradient(circle at 18% 24%, rgba(255,255,255,0.20) 0 1px, transparent 1.4px), radial-gradient(circle at 72% 34%, rgba(255,255,255,0.16) 0 1px, transparent 1.5px), radial-gradient(circle at 38% 74%, rgba(196,181,253,0.18) 0 1.2px, transparent 1.6px)",
  },
  fire: {
    value: "fire",
    name: "Fire",
    description: "Warm orange-red edge glow with active intensity.",
    ring: "#f97316",
    glow: "rgba(249,115,22,0.30)",
    accent: "#fb7185",
    overlay: "linear-gradient(180deg, rgba(249,115,22,0.24), rgba(239,68,68,0.10), transparent 72%)",
  },
  frost: {
    value: "frost",
    name: "Frost",
    description: "Soft cyan-blue glow with cool clarity.",
    ring: "#67e8f9",
    glow: "rgba(103,232,249,0.26)",
    accent: "#38bdf8",
    overlay: "linear-gradient(135deg, rgba(103,232,249,0.18), rgba(96,165,250,0.10), transparent 76%)",
  },
  cyber: {
    value: "cyber",
    name: "Cyber",
    description: "Grid and scanline energy with tech-noir tension.",
    ring: "#22d3ee",
    glow: "rgba(34,211,238,0.26)",
    accent: "#38bdf8",
    overlay:
      "repeating-linear-gradient(180deg, rgba(34,211,238,0.08) 0 1px, transparent 1px 7px), linear-gradient(135deg, rgba(59,130,246,0.16), transparent 68%)",
  },
};

export const PROFILE_MOOD_OPTIONS = PROFILE_MOODS.map((value) => MOOD_OPTIONS[value]);
export const PROFILE_AURA_OPTIONS = PROFILE_AURAS.map((value) => AURA_OPTIONS[value]);

export function normalizeProfileMood(value: string | null | undefined): ProfileMood {
  return PROFILE_MOODS.includes(value as ProfileMood)
    ? (value as ProfileMood)
    : "locked-in";
}

export function normalizeProfileAura(value: string | null | undefined): ProfileAura {
  return PROFILE_AURAS.includes(value as ProfileAura)
    ? (value as ProfileAura)
    : "neon";
}

export function getProfileMoodOption(value: string | null | undefined) {
  return MOOD_OPTIONS[normalizeProfileMood(value)];
}

export function getProfileAuraOption(value: string | null | undefined) {
  return AURA_OPTIONS[normalizeProfileAura(value)];
}

export function getProfilePresence(value: {
  mood: string | null | undefined;
  aura: string | null | undefined;
  themeColor: string;
}) {
  const mood = getProfileMoodOption(value.mood);
  const aura = getProfileAuraOption(value.aura);
  const themeColor = value.themeColor;

  return {
    mood,
    aura,
    accent: mood.primary,
    contrast: mood.secondary,
    highlight: themeColor,
    soft: mood.tertiary,
    pulse: mood.pulse,
    chipText: mood.chipLabel,
    statusLabel: mood.statusLabel,
    badgeBackground: `linear-gradient(135deg, ${withAlpha(mood.primary, "20")}, ${withAlpha(mood.secondary, "12")})`,
    badgeBorder: withAlpha(mood.primary, "34"),
    stageGlow: [
      `radial-gradient(circle at 16% 18%, ${withAlpha(mood.primary, "24")} 0%, transparent 26%)`,
      `radial-gradient(circle at 82% 72%, ${withAlpha(mood.secondary, "18")} 0%, transparent 28%)`,
      aura.value === "galaxy"
        ? `radial-gradient(circle at 68% 14%, rgba(255,255,255,0.12) 0%, transparent 10%)`
        : `radial-gradient(circle at 76% 16%, ${withAlpha(aura.accent, "12")} 0%, transparent 20%)`,
    ].join(", "),
    panelGlow: `0 0 0 1px ${withAlpha(mood.primary, "16")}, 0 30px 80px ${withAlpha(aura.accent, "14")}`,
    avatarAuraBackground:
      aura.value === "void"
        ? `radial-gradient(circle, ${withAlpha(mood.secondary, "26")} 0%, transparent 68%)`
        : aura.value === "fire"
          ? `radial-gradient(circle, ${withAlpha(mood.primary, "28")} 0%, ${withAlpha(aura.accent, "12")} 54%, transparent 72%)`
          : aura.value === "frost"
            ? `radial-gradient(circle, ${withAlpha(aura.ring, "24")} 0%, ${withAlpha(mood.primary, "14")} 58%, transparent 74%)`
            : `radial-gradient(circle, ${withAlpha(aura.ring, "24")} 0%, ${withAlpha(mood.primary, "12")} 62%, transparent 74%)`,
    avatarRing: aura.value === "none" ? withAlpha(themeColor, "28") : withAlpha(aura.ring, "58"),
    avatarGlow: aura.glow,
    presenceDot: aura.value === "none" ? mood.pulse : aura.ring,
    presenceBackground:
      aura.value === "none"
        ? `linear-gradient(135deg, ${withAlpha(mood.primary, "20")}, rgba(255,255,255,0.04))`
        : `linear-gradient(135deg, ${withAlpha(mood.primary, "24")}, ${withAlpha(aura.ring, "14")})`,
    presenceBorder:
      aura.value === "none" ? withAlpha(mood.primary, "26") : withAlpha(aura.ring, "36"),
    auraOverlay: aura.overlay,
    ambientGrid:
      aura.value === "cyber"
        ? `linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)`
        : "none",
  };
}

function withAlpha(hex: string, alpha: string) {
  const normalized = hex.trim();

  if (!/^#([0-9a-fA-F]{6})$/.test(normalized)) {
    return hex;
  }

  return `${normalized}${alpha}`;
}
