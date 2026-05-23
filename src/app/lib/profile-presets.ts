import type {
  ProfileComposition,
  ProfileCompositionDensity,
  ProfileCompositionLinksStyle,
  ProfileCompositionMode,
  ProfileCompositionSocialsStyle,
  ProfileFloatingPersonality,
} from "@/app/lib/profile-composition";
import type { ProfileDnaType } from "@/app/lib/profile-dna";
import type { ProfileMotionPersonality } from "@/app/lib/profile-motion";
import type {
  ProfileBackgroundIntensity,
  ProfileBannerStyle,
  ProfileCardStyle,
  ProfileCornerStyle,
  ProfileDensity,
  ProfileGlassIntensity,
  ProfileIntroMode,
  ProfileMotionLevel,
} from "@/app/lib/profile-customization";
import type { ProfileAura, ProfileMood } from "@/app/lib/profile-presence";
import type { ProfileScene } from "@/app/lib/profile-scenes";

export const PROFILE_PRESET_IDS = [
  "cinematic",
  "ghost",
  "cyber",
  "minimalist",
  "ambient",
  "floating",
  "devcore",
  "afterhours",
  "softglass",
] as const;

export type ProfilePresetId = (typeof PROFILE_PRESET_IDS)[number];
export type ProfilePresetShellVisibility = "ghost" | "soft" | "solid";

export type ProfilePresetRenderTuning = {
  shellVisibility: ProfilePresetShellVisibility;
  moduleGapScale: number;
  stageWidthScale: number;
  widgetWidthScale: number;
  floatingPersonality: ProfileFloatingPersonality | null;
  introStageScale: number;
  motionPersonality: ProfileMotionPersonality | null;
};

type ProfilePresetDefinition = {
  value: ProfilePresetId;
  name: string;
  description: string;
  accent: string;
  dna: ProfileDnaType;
  mood: ProfileMood;
  aura: ProfileAura;
  scene: ProfileScene;
  backgroundIntensity: ProfileBackgroundIntensity;
  glassIntensity: ProfileGlassIntensity;
  bannerStyle: ProfileBannerStyle;
  introMode: ProfileIntroMode;
  density: ProfileDensity;
  cardStyle: ProfileCardStyle;
  cornerStyle: ProfileCornerStyle;
  motionLevel: ProfileMotionLevel;
  composition: {
    mode: ProfileCompositionMode;
    density: ProfileCompositionDensity;
    linksStyle: ProfileCompositionLinksStyle;
    socialsStyle: ProfileCompositionSocialsStyle;
    visible: ProfileComposition["visible"];
    order: ProfileComposition["order"];
  };
  render: ProfilePresetRenderTuning;
};

const DEFAULT_RENDER_TUNING: ProfilePresetRenderTuning = {
  shellVisibility: "soft",
  moduleGapScale: 1,
  stageWidthScale: 1,
  widgetWidthScale: 1,
  floatingPersonality: null,
  introStageScale: 1,
  motionPersonality: null,
};

const PROFILE_PRESET_DEFINITIONS: Record<ProfilePresetId, ProfilePresetDefinition> = {
  cinematic: {
    value: "cinematic",
    name: "Cinematic",
    description: "Dramatic opening stage, deeper atmosphere, and wider floating modules.",
    accent: "#f59e0b",
    dna: "cinematic",
    mood: "night",
    aura: "galaxy",
    scene: "galaxy-room",
    backgroundIntensity: "high",
    glassIntensity: "high",
    bannerStyle: "cinematic",
    introMode: "cinematic",
    density: "spacious",
    cardStyle: "glass",
    cornerStyle: "rounded",
    motionLevel: "alive",
    composition: {
      mode: "floating",
      density: "spacious",
      linksStyle: "stacked",
      socialsStyle: "spotlight",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "music", "links", "socials", "live"],
    },
    render: {
      shellVisibility: "ghost",
      moduleGapScale: 1.08,
      stageWidthScale: 1.04,
      widgetWidthScale: 1.08,
      floatingPersonality: "cinematic",
      introStageScale: 1.08,
      motionPersonality: "cinematic",
    },
  },
  ghost: {
    value: "ghost",
    name: "Ghost",
    description: "Low-pressure identity, airy spacing, and pale floating traces in the scene.",
    accent: "#c084fc",
    dna: "ghost",
    mood: "afk",
    aura: "void",
    scene: "void-core",
    backgroundIntensity: "medium",
    glassIntensity: "medium",
    bannerStyle: "dark",
    introMode: "minimal",
    density: "balanced",
    cardStyle: "minimal",
    cornerStyle: "soft",
    motionLevel: "subtle",
    composition: {
      mode: "floating",
      density: "compact",
      linksStyle: "minimal",
      socialsStyle: "stack",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "music", "links", "socials", "live"],
    },
    render: {
      shellVisibility: "ghost",
      moduleGapScale: 0.94,
      stageWidthScale: 0.92,
      widgetWidthScale: 0.92,
      floatingPersonality: "centered",
      introStageScale: 0.94,
      motionPersonality: "ghost",
    },
  },
  cyber: {
    value: "cyber",
    name: "Cyber",
    description: "Tech-noir asymmetry, brighter glow, and a tighter floating rhythm.",
    accent: "#22d3ee",
    dna: "cyber",
    mood: "coding",
    aura: "cyber",
    scene: "cyber-tokyo",
    backgroundIntensity: "high",
    glassIntensity: "medium",
    bannerStyle: "clean",
    introMode: "minimal",
    density: "compact",
    cardStyle: "glass",
    cornerStyle: "sharp",
    motionLevel: "alive",
    composition: {
      mode: "floating",
      density: "compact",
      linksStyle: "cards",
      socialsStyle: "spotlight",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "music", "socials", "links", "live"],
    },
    render: {
      shellVisibility: "soft",
      moduleGapScale: 0.9,
      stageWidthScale: 0.94,
      widgetWidthScale: 0.98,
      floatingPersonality: "scattered",
      introStageScale: 0.96,
      motionPersonality: "cyber",
    },
  },
  minimalist: {
    value: "minimalist",
    name: "Minimalist",
    description: "A small identity stage with almost no chrome and only the essentials left on screen.",
    accent: "#e5e7eb",
    dna: "mono",
    mood: "chilling",
    aura: "none",
    scene: "default",
    backgroundIntensity: "low",
    glassIntensity: "low",
    bannerStyle: "clean",
    introMode: "minimal",
    density: "compact",
    cardStyle: "minimal",
    cornerStyle: "sharp",
    motionLevel: "off",
    composition: {
      mode: "contained",
      density: "compact",
      linksStyle: "minimal",
      socialsStyle: "stack",
      visible: {
        music: false,
        socials: false,
        links: true,
        live: false,
      },
      order: ["hero", "links", "music", "socials", "live"],
    },
    render: {
      shellVisibility: "ghost",
      moduleGapScale: 0.82,
      stageWidthScale: 0.82,
      widgetWidthScale: 0.9,
      floatingPersonality: "centered",
      introStageScale: 0.9,
      motionPersonality: "mono",
    },
  },
  ambient: {
    value: "ambient",
    name: "Ambient",
    description: "Soft editorial spacing with a room-like scene and calmer premium surfaces.",
    accent: "#a78bfa",
    dna: "ambient",
    mood: "chilling",
    aura: "galaxy",
    scene: "galaxy-room",
    backgroundIntensity: "high",
    glassIntensity: "high",
    bannerStyle: "clean",
    introMode: "minimal",
    density: "spacious",
    cardStyle: "glass",
    cornerStyle: "soft",
    motionLevel: "subtle",
    composition: {
      mode: "contained",
      density: "balanced",
      linksStyle: "stacked",
      socialsStyle: "grid",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "links", "music", "socials", "live"],
    },
    render: {
      shellVisibility: "soft",
      moduleGapScale: 1.08,
      stageWidthScale: 0.98,
      widgetWidthScale: 1,
      floatingPersonality: "minimal",
      introStageScale: 1.04,
      motionPersonality: "soft",
    },
  },
  floating: {
    value: "floating",
    name: "Floating",
    description: "A clean scene-first preset that leans into module separation without going too theatrical.",
    accent: "#f472b6",
    dna: "clean",
    mood: "locked-in",
    aura: "neon",
    scene: "default",
    backgroundIntensity: "medium",
    glassIntensity: "medium",
    bannerStyle: "clean",
    introMode: "minimal",
    density: "balanced",
    cardStyle: "minimal",
    cornerStyle: "rounded",
    motionLevel: "subtle",
    composition: {
      mode: "floating",
      density: "balanced",
      linksStyle: "cards",
      socialsStyle: "grid",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "links", "music", "socials", "live"],
    },
    render: {
      shellVisibility: "ghost",
      moduleGapScale: 1,
      stageWidthScale: 0.95,
      widgetWidthScale: 1.02,
      floatingPersonality: "centered",
      introStageScale: 0.98,
      motionPersonality: "soft",
    },
  },
  devcore: {
    value: "devcore",
    name: "Devcore",
    description: "Sharper surfaces, cleaner hierarchy, and a compact build-log energy.",
    accent: "#38bdf8",
    dna: "mono",
    mood: "coding",
    aura: "frost",
    scene: "frost-byte",
    backgroundIntensity: "medium",
    glassIntensity: "low",
    bannerStyle: "clean",
    introMode: "off",
    density: "compact",
    cardStyle: "solid",
    cornerStyle: "sharp",
    motionLevel: "subtle",
    composition: {
      mode: "contained",
      density: "compact",
      linksStyle: "stacked",
      socialsStyle: "stack",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "links", "socials", "music", "live"],
    },
    render: {
      shellVisibility: "soft",
      moduleGapScale: 0.88,
      stageWidthScale: 0.9,
      widgetWidthScale: 0.94,
      floatingPersonality: "minimal",
      introStageScale: 0.94,
      motionPersonality: "mono",
    },
  },
  afterhours: {
    value: "afterhours",
    name: "Afterhours",
    description: "Late-night neon with deeper darkness, richer glass, and a dramatic floating stage.",
    accent: "#60a5fa",
    dna: "void",
    mood: "night",
    aura: "void",
    scene: "arcade-night",
    backgroundIntensity: "high",
    glassIntensity: "high",
    bannerStyle: "dark",
    introMode: "cinematic",
    density: "balanced",
    cardStyle: "glass",
    cornerStyle: "rounded",
    motionLevel: "subtle",
    composition: {
      mode: "floating",
      density: "balanced",
      linksStyle: "stacked",
      socialsStyle: "spotlight",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "music", "links", "live", "socials"],
    },
    render: {
      shellVisibility: "ghost",
      moduleGapScale: 1.02,
      stageWidthScale: 1,
      widgetWidthScale: 1.06,
      floatingPersonality: "cinematic",
      introStageScale: 1.06,
      motionPersonality: "cinematic",
    },
  },
  softglass: {
    value: "softglass",
    name: "Softglass",
    description: "Creamier blur, softer corners, and calm translucent modules with room to breathe.",
    accent: "#67e8f9",
    dna: "softglass",
    mood: "chilling",
    aura: "frost",
    scene: "frost-byte",
    backgroundIntensity: "medium",
    glassIntensity: "high",
    bannerStyle: "clean",
    introMode: "minimal",
    density: "balanced",
    cardStyle: "glass",
    cornerStyle: "soft",
    motionLevel: "subtle",
    composition: {
      mode: "contained",
      density: "balanced",
      linksStyle: "pills",
      socialsStyle: "grid",
      visible: {
        music: true,
        socials: true,
        links: true,
        live: true,
      },
      order: ["hero", "music", "links", "socials", "live"],
    },
    render: {
      shellVisibility: "soft",
      moduleGapScale: 1.02,
      stageWidthScale: 0.94,
      widgetWidthScale: 0.98,
      floatingPersonality: "minimal",
      introStageScale: 1,
      motionPersonality: "soft",
    },
  },
};

export const PROFILE_PRESET_OPTIONS = PROFILE_PRESET_IDS.map((value) => {
  const preset = PROFILE_PRESET_DEFINITIONS[value];

  return {
    value: preset.value,
    name: preset.name,
    description: preset.description,
    accent: preset.accent,
    mode: preset.composition.mode,
    introMode: preset.introMode,
  };
});

export function normalizeProfilePreset(value: unknown): ProfilePresetId | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  return PROFILE_PRESET_IDS.includes(trimmed as ProfilePresetId)
    ? (trimmed as ProfilePresetId)
    : null;
}

export function getProfilePresetDefinition(value: unknown) {
  const preset = normalizeProfilePreset(value);

  return preset ? PROFILE_PRESET_DEFINITIONS[preset] : null;
}

export function getProfilePresetRenderTuning(value: unknown): ProfilePresetRenderTuning {
  return getProfilePresetDefinition(value)?.render ?? DEFAULT_RENDER_TUNING;
}

export function applyProfilePresetToState(
  preset: ProfilePresetId,
  currentComposition: ProfileComposition,
) {
  const definition = PROFILE_PRESET_DEFINITIONS[preset];

  return {
    mood: definition.mood,
    aura: definition.aura,
    scene: definition.scene,
    backgroundIntensity: definition.backgroundIntensity,
    glassIntensity: definition.glassIntensity,
    bannerStyle: definition.bannerStyle,
    introMode: definition.introMode,
    density: definition.density,
    cardStyle: definition.cardStyle,
    cornerStyle: definition.cornerStyle,
    motionLevel: definition.motionLevel,
    composition: {
      ...currentComposition,
      preset: definition.value,
      dna: definition.dna,
      mode: definition.composition.mode,
      density: definition.composition.density,
      linksStyle: definition.composition.linksStyle,
      socialsStyle: definition.composition.socialsStyle,
      visible: { ...definition.composition.visible },
      order: [...definition.composition.order],
    } satisfies ProfileComposition,
  };
}
