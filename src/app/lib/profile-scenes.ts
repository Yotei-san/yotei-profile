import { getProfilePresence, type ProfileAura, type ProfileMood } from "@/app/lib/profile-presence";

export const PROFILE_SCENES = [
  "default",
  "cyber-tokyo",
  "void-core",
  "galaxy-room",
  "inferno-live",
  "frost-byte",
  "arcade-night",
] as const;

export type ProfileScene = (typeof PROFILE_SCENES)[number];
export const DEFAULT_PROFILE_SCENE: ProfileScene = "default";

type ProfileSceneDefinition = {
  value: ProfileScene;
  name: string;
  description: string;
  previewLabel: string;
  accent: string;
  contrast: string;
  soft: string;
  pulse: string;
  shellBackground: string;
  surfaceBackground: string;
  surfaceBorder: string;
  backgroundVariant:
    | "mood-driven"
    | "cyber"
    | "void"
    | "galaxy"
    | "fire"
    | "frost"
    | "neon";
};

const PROFILE_SCENE_DEFINITIONS: Record<ProfileScene, ProfileSceneDefinition> = {
  default: {
    value: "default",
    name: "Default",
    description: "Use your mood and aura as the primary atmosphere driver.",
    previewLabel: "Mood driven",
    accent: "#f472b6",
    contrast: "#8b5cf6",
    soft: "#f9a8d4",
    pulse: "#ff69b4",
    shellBackground:
      "linear-gradient(180deg, rgba(13, 15, 24, 0.56), rgba(8, 9, 15, 0.74)), linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(10,11,18,0.96), rgba(8,9,15,0.98))",
    surfaceBorder: "rgba(255,255,255,0.08)",
    backgroundVariant: "mood-driven",
  },
  "cyber-tokyo": {
    value: "cyber-tokyo",
    name: "Cyber Tokyo",
    description: "Cyan-pink neon, scanlines, and a futuristic city-grid atmosphere.",
    previewLabel: "Neon grid",
    accent: "#22d3ee",
    contrast: "#f472b6",
    soft: "#7dd3fc",
    pulse: "#38bdf8",
    shellBackground:
      "linear-gradient(180deg, rgba(8, 17, 28, 0.82), rgba(7, 11, 20, 0.9)), linear-gradient(135deg, rgba(34,211,238,0.08), rgba(244,114,182,0.06), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(8,15,24,0.96), rgba(6,10,18,0.98))",
    surfaceBorder: "rgba(34,211,238,0.18)",
    backgroundVariant: "cyber",
  },
  "void-core": {
    value: "void-core",
    name: "Void Core",
    description: "Black-violet depth and shadow pressure with mysterious energy.",
    previewLabel: "Shadow core",
    accent: "#8b5cf6",
    contrast: "#312e81",
    soft: "#c4b5fd",
    pulse: "#a78bfa",
    shellBackground:
      "linear-gradient(180deg, rgba(10, 8, 20, 0.84), rgba(6, 7, 15, 0.92)), linear-gradient(135deg, rgba(124,58,237,0.08), rgba(17,24,39,0.04), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(9,8,18,0.96), rgba(5,6,14,0.98))",
    surfaceBorder: "rgba(139,92,246,0.16)",
    backgroundVariant: "void",
  },
  "galaxy-room": {
    value: "galaxy-room",
    name: "Galaxy Room",
    description: "Cosmic stars, blue-purple glows, and a soft orbiting room feel.",
    previewLabel: "Cosmic orbit",
    accent: "#818cf8",
    contrast: "#c084fc",
    soft: "#e0e7ff",
    pulse: "#a78bfa",
    shellBackground:
      "linear-gradient(180deg, rgba(9, 10, 24, 0.82), rgba(8, 10, 20, 0.92)), linear-gradient(135deg, rgba(129,140,248,0.10), rgba(192,132,252,0.06), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(8,10,24,0.96), rgba(7,9,18,0.98))",
    surfaceBorder: "rgba(129,140,248,0.18)",
    backgroundVariant: "galaxy",
  },
  "inferno-live": {
    value: "inferno-live",
    name: "Inferno Live",
    description: "Red-orange streamer energy with ember accents and live pressure.",
    previewLabel: "Live fire",
    accent: "#fb7185",
    contrast: "#f97316",
    soft: "#fecaca",
    pulse: "#ef4444",
    shellBackground:
      "linear-gradient(180deg, rgba(24, 10, 10, 0.82), rgba(18, 8, 8, 0.92)), linear-gradient(135deg, rgba(251,113,133,0.10), rgba(249,115,22,0.08), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(22,10,10,0.96), rgba(16,8,8,0.98))",
    surfaceBorder: "rgba(251,113,133,0.18)",
    backgroundVariant: "fire",
  },
  "frost-byte": {
    value: "frost-byte",
    name: "Frost Byte",
    description: "Icy cyan-blue ambience with a calm, clean tech-frost glow.",
    previewLabel: "Icy haze",
    accent: "#67e8f9",
    contrast: "#60a5fa",
    soft: "#dff7ff",
    pulse: "#93c5fd",
    shellBackground:
      "linear-gradient(180deg, rgba(8, 16, 24, 0.84), rgba(7, 12, 20, 0.92)), linear-gradient(135deg, rgba(103,232,249,0.08), rgba(96,165,250,0.06), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(8,15,24,0.96), rgba(6,11,18,0.98))",
    surfaceBorder: "rgba(103,232,249,0.18)",
    backgroundVariant: "frost",
  },
  "arcade-night": {
    value: "arcade-night",
    name: "Arcade Night",
    description: "Retro pink-purple-blue neon with a playful arcade-night charge.",
    previewLabel: "Retro neon",
    accent: "#f472b6",
    contrast: "#38bdf8",
    soft: "#ddd6fe",
    pulse: "#a78bfa",
    shellBackground:
      "linear-gradient(180deg, rgba(18, 10, 24, 0.82), rgba(10, 8, 18, 0.92)), linear-gradient(135deg, rgba(244,114,182,0.10), rgba(56,189,248,0.06), rgba(255,255,255,0.02))",
    surfaceBackground:
      "linear-gradient(180deg, rgba(18,10,24,0.96), rgba(10,8,18,0.98))",
    surfaceBorder: "rgba(244,114,182,0.18)",
    backgroundVariant: "neon",
  },
};

export function normalizeProfileScene(value: string | null | undefined): ProfileScene {
  if (typeof value !== "string") {
    return DEFAULT_PROFILE_SCENE;
  }

  const trimmed = value.trim();

  return PROFILE_SCENES.includes(trimmed as ProfileScene)
    ? (trimmed as ProfileScene)
    : DEFAULT_PROFILE_SCENE;
}

export function getProfileSceneDefinition(value: string | null | undefined) {
  return PROFILE_SCENE_DEFINITIONS[normalizeProfileScene(value)];
}

export function getProfileSceneOptions() {
  return PROFILE_SCENES.map((scene) => PROFILE_SCENE_DEFINITIONS[scene]);
}

export function getProfileSceneAppearance(input: {
  scene: string | null | undefined;
  mood: ProfileMood;
  aura: ProfileAura;
  themeColor: string;
}) {
  const scene = getProfileSceneDefinition(input.scene);
  const basePresence = getProfilePresence({
    mood: input.mood,
    aura: input.aura,
    themeColor: input.themeColor,
  });

  if (scene.value === "default") {
    return {
      scene,
      presence: basePresence,
      shellBackground: scene.shellBackground,
      surfaceBackground: scene.surfaceBackground,
      surfaceBorder: scene.surfaceBorder,
      linkThemeColor: input.themeColor,
      socialThemeColor: input.themeColor,
      backgroundVariant: "mood-driven" as const,
    };
  }

  const accent = scene.accent;
  const contrast = scene.contrast;
  const soft = scene.soft;
  const pulse = scene.pulse;

  return {
    scene,
    presence: {
      ...basePresence,
      accent,
      contrast,
      soft,
      pulse,
      highlight: input.themeColor,
      badgeBackground: `linear-gradient(135deg, ${withAlpha(accent, "18")}, ${withAlpha(contrast, "12")})`,
      badgeBorder: withAlpha(accent, "34"),
      stageGlow: [
        `radial-gradient(circle at 16% 18%, ${withAlpha(accent, "22")} 0%, transparent 28%)`,
        `radial-gradient(circle at 82% 72%, ${withAlpha(contrast, "18")} 0%, transparent 30%)`,
        `radial-gradient(circle at 76% 16%, ${withAlpha(soft, "14")} 0%, transparent 22%)`,
      ].join(", "),
      panelGlow: `0 0 0 1px ${withAlpha(accent, "18")}, 0 32px 84px ${withAlpha(contrast, "14")}`,
      avatarAuraBackground: `radial-gradient(circle, ${withAlpha(accent, "22")} 0%, ${withAlpha(contrast, "12")} 56%, transparent 76%)`,
      avatarRing: withAlpha(accent, "58"),
      avatarGlow: withAlpha(contrast, "32"),
      presenceDot: accent,
      presenceBackground: `linear-gradient(135deg, ${withAlpha(accent, "24")}, ${withAlpha(contrast, "14")})`,
      presenceBorder: withAlpha(accent, "34"),
      auraOverlay: `linear-gradient(135deg, ${withAlpha(accent, "12")}, transparent 72%)`,
      ambientGrid:
        scene.value === "cyber-tokyo"
          ? `linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)`
          : basePresence.ambientGrid,
    },
    shellBackground: scene.shellBackground,
    surfaceBackground: scene.surfaceBackground,
    surfaceBorder: scene.surfaceBorder,
    linkThemeColor: accent,
    socialThemeColor: accent,
    backgroundVariant: scene.backgroundVariant,
  };
}

function withAlpha(hex: string, alpha: string) {
  return /^#([0-9a-fA-F]{6})$/.test(hex.trim()) ? `${hex}${alpha}` : hex;
}

export function isMissingProfileSceneColumnError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    meta?: {
      column?: unknown;
    };
  };
  const column = typeof candidate.meta?.column === "string" ? candidate.meta.column : "";
  const message = typeof candidate.message === "string" ? candidate.message : "";

  return (
    candidate.code === "P2022" &&
    (column.includes("profileScene") || message.includes("profileScene"))
  );
}
