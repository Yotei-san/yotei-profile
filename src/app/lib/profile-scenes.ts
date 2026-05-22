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

export const PROFILE_AMBIENT_TYPES = [
  "rain",
  "snow",
  "embers",
  "stars",
  "petals",
  "cyber",
  "dust",
  "none",
] as const;

export type ProfileAmbientType = (typeof PROFILE_AMBIENT_TYPES)[number];

export type ProfileSceneDepth = {
  ambientType: ProfileAmbientType;
  ambientDensity: number;
  mobileAmbientDensity: number;
  overlayStrength: number;
  vignetteStrength: number;
  foregroundHazeOpacity: number;
  lightingOpacity: number;
  shellShadeOpacity: number;
  surfaceShadeOpacity: number;
  spacingScale: number;
  stageGlowOpacity: number;
  stageGlowBlur: number;
  shadowDepth: number;
  shellMaxWidth: number;
};

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
  depth: ProfileSceneDepth;
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
    depth: {
      ambientType: "none",
      ambientDensity: 0,
      mobileAmbientDensity: 0,
      overlayStrength: 0.68,
      vignetteStrength: 0.42,
      foregroundHazeOpacity: 0.18,
      lightingOpacity: 0.34,
      shellShadeOpacity: 0.03,
      surfaceShadeOpacity: 0.08,
      spacingScale: 0.88,
      stageGlowOpacity: 0.52,
      stageGlowBlur: 16,
      shadowDepth: 0.82,
      shellMaxWidth: 900,
    },
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
    depth: {
      ambientType: "cyber",
      ambientDensity: 0.9,
      mobileAmbientDensity: 0.52,
      overlayStrength: 0.54,
      vignetteStrength: 0.34,
      foregroundHazeOpacity: 0.14,
      lightingOpacity: 0.44,
      shellShadeOpacity: 0.01,
      surfaceShadeOpacity: 0.06,
      spacingScale: 0.82,
      stageGlowOpacity: 0.66,
      stageGlowBlur: 12,
      shadowDepth: 0.74,
      shellMaxWidth: 860,
    },
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
    depth: {
      ambientType: "stars",
      ambientDensity: 0.38,
      mobileAmbientDensity: 0.2,
      overlayStrength: 0.76,
      vignetteStrength: 0.62,
      foregroundHazeOpacity: 0.1,
      lightingOpacity: 0.2,
      shellShadeOpacity: 0.08,
      surfaceShadeOpacity: 0.14,
      spacingScale: 0.92,
      stageGlowOpacity: 0.34,
      stageGlowBlur: 24,
      shadowDepth: 1,
      shellMaxWidth: 780,
    },
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
    depth: {
      ambientType: "stars",
      ambientDensity: 0.8,
      mobileAmbientDensity: 0.48,
      overlayStrength: 0.52,
      vignetteStrength: 0.34,
      foregroundHazeOpacity: 0.26,
      lightingOpacity: 0.5,
      shellShadeOpacity: 0.02,
      surfaceShadeOpacity: 0.06,
      spacingScale: 0.9,
      stageGlowOpacity: 0.62,
      stageGlowBlur: 16,
      shadowDepth: 0.82,
      shellMaxWidth: 920,
    },
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
    depth: {
      ambientType: "embers",
      ambientDensity: 0.84,
      mobileAmbientDensity: 0.5,
      overlayStrength: 0.72,
      vignetteStrength: 0.48,
      foregroundHazeOpacity: 0.16,
      lightingOpacity: 0.52,
      shellShadeOpacity: 0.03,
      surfaceShadeOpacity: 0.08,
      spacingScale: 0.84,
      stageGlowOpacity: 0.76,
      stageGlowBlur: 16,
      shadowDepth: 0.9,
      shellMaxWidth: 850,
    },
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
    depth: {
      ambientType: "snow",
      ambientDensity: 0.72,
      mobileAmbientDensity: 0.42,
      overlayStrength: 0.58,
      vignetteStrength: 0.32,
      foregroundHazeOpacity: 0.22,
      lightingOpacity: 0.4,
      shellShadeOpacity: 0.03,
      surfaceShadeOpacity: 0.06,
      spacingScale: 0.88,
      stageGlowOpacity: 0.5,
      stageGlowBlur: 14,
      shadowDepth: 0.78,
      shellMaxWidth: 880,
    },
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
    depth: {
      ambientType: "dust",
      ambientDensity: 0.56,
      mobileAmbientDensity: 0.34,
      overlayStrength: 0.58,
      vignetteStrength: 0.36,
      foregroundHazeOpacity: 0.16,
      lightingOpacity: 0.38,
      shellShadeOpacity: 0.03,
      surfaceShadeOpacity: 0.06,
      spacingScale: 0.86,
      stageGlowOpacity: 0.58,
      stageGlowBlur: 14,
      shadowDepth: 0.82,
      shellMaxWidth: 890,
    },
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
  const ambientType =
    scene.value === "default"
      ? getDefaultAmbientType(input.mood, input.aura)
      : scene.depth.ambientType;
  const depth =
    scene.value === "default"
      ? {
          ...scene.depth,
          ambientType,
          ambientDensity: ambientType === "none" ? 0 : 0.46,
          mobileAmbientDensity: ambientType === "none" ? 0 : 0.28,
          foregroundHazeOpacity:
            ambientType === "none" ? 0.18 : scene.depth.foregroundHazeOpacity,
          lightingOpacity: ambientType === "none" ? 0.24 : scene.depth.lightingOpacity,
        }
      : scene.depth;

  if (scene.value === "default") {
    return {
      scene,
      presence: basePresence,
      depth,
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
      stageGlow: getSceneStageGlow(scene.value, accent, contrast, soft, pulse),
      panelGlow: getScenePanelGlow(scene.value, accent, contrast, soft, pulse),
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
    depth,
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

function getDefaultAmbientType(mood: ProfileMood, aura: ProfileAura): ProfileAmbientType {
  if (aura === "galaxy") {
    return "stars";
  }

  if (aura === "fire" || mood === "streaming") {
    return "embers";
  }

  if (aura === "frost" || mood === "chilling") {
    return "snow";
  }

  if (aura === "cyber" || mood === "coding") {
    return "cyber";
  }

  if (mood === "night") {
    return "rain";
  }

  if (aura === "void" || mood === "afk") {
    return "dust";
  }

  return "none";
}

function getSceneStageGlow(
  scene: ProfileScene,
  accent: string,
  contrast: string,
  soft: string,
  pulse: string,
) {
  if (scene === "cyber-tokyo") {
    return [
      `radial-gradient(circle at 16% 20%, ${withAlpha(accent, "2c")} 0%, transparent 24%)`,
      `radial-gradient(circle at 82% 74%, ${withAlpha(contrast, "1e")} 0%, transparent 26%)`,
      `linear-gradient(180deg, transparent 12%, ${withAlpha(accent, "12")} 52%, transparent 88%)`,
    ].join(", ");
  }

  if (scene === "void-core") {
    return [
      `radial-gradient(circle at 50% 18%, ${withAlpha(soft, "12")} 0%, transparent 24%)`,
      `radial-gradient(circle at 22% 70%, ${withAlpha(accent, "18")} 0%, transparent 30%)`,
      `radial-gradient(circle at 78% 82%, ${withAlpha(contrast, "12")} 0%, transparent 32%)`,
    ].join(", ");
  }

  if (scene === "inferno-live") {
    return [
      `radial-gradient(circle at 18% 18%, ${withAlpha(contrast, "2c")} 0%, transparent 26%)`,
      `radial-gradient(circle at 78% 22%, ${withAlpha(accent, "28")} 0%, transparent 28%)`,
      `radial-gradient(circle at 52% 82%, ${withAlpha(pulse, "16")} 0%, transparent 30%)`,
    ].join(", ");
  }

  if (scene === "galaxy-room") {
    return [
      `radial-gradient(circle at 18% 18%, ${withAlpha(accent, "22")} 0%, transparent 26%)`,
      `radial-gradient(circle at 78% 22%, ${withAlpha(contrast, "22")} 0%, transparent 28%)`,
      `radial-gradient(circle at 56% 72%, ${withAlpha(soft, "18")} 0%, transparent 34%)`,
    ].join(", ");
  }

  return [
    `radial-gradient(circle at 16% 18%, ${withAlpha(accent, "22")} 0%, transparent 28%)`,
    `radial-gradient(circle at 82% 72%, ${withAlpha(contrast, "18")} 0%, transparent 30%)`,
    `radial-gradient(circle at 76% 16%, ${withAlpha(soft, "14")} 0%, transparent 22%)`,
  ].join(", ");
}

function getScenePanelGlow(
  scene: ProfileScene,
  accent: string,
  contrast: string,
  soft: string,
  pulse: string,
) {
  if (scene === "cyber-tokyo") {
    return `0 0 0 1px ${withAlpha(accent, "24")}, 0 24px 60px ${withAlpha(accent, "14")}, 0 0 28px ${withAlpha(soft, "12")}`;
  }

  if (scene === "void-core") {
    return `0 0 0 1px ${withAlpha(accent, "18")}, 0 34px 88px rgba(0,0,0,0.42), 0 0 24px ${withAlpha(contrast, "12")}`;
  }

  if (scene === "galaxy-room") {
    return `0 0 0 1px ${withAlpha(accent, "1c")}, 0 28px 72px ${withAlpha(contrast, "16")}, 0 0 36px ${withAlpha(soft, "12")}`;
  }

  if (scene === "inferno-live") {
    return `0 0 0 1px ${withAlpha(accent, "22")}, 0 30px 74px ${withAlpha(contrast, "1a")}, 0 0 34px ${withAlpha(pulse, "14")}`;
  }

  if (scene === "frost-byte") {
    return `0 0 0 1px ${withAlpha(accent, "18")}, 0 22px 58px ${withAlpha(contrast, "12")}, 0 0 24px ${withAlpha(soft, "12")}`;
  }

  return `0 0 0 1px ${withAlpha(accent, "18")}, 0 26px 64px ${withAlpha(contrast, "14")}, 0 0 28px ${withAlpha(soft, "10")}`;
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
