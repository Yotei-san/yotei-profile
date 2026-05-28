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
  "neon",
  "ghost",
  "luxury",
  "minimal",
  "orbit",
  "cyber",
  "mono",
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
    alignment: ProfileComposition["alignment"];
    density: ProfileCompositionDensity;
    linksStyle: ProfileCompositionLinksStyle;
    socialsStyle: ProfileCompositionSocialsStyle;
    visible: ProfileComposition["visible"];
    order: ProfileComposition["order"];
    metadata: Pick<
      ProfileComposition["metadata"],
      "badgeMode" | "badgeStyle" | "badgeSeason" | "nameTypography"
    >;
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
  neon: {
    value: "neon",
    name: "Neon",
    description: "High-energy glow, nightlife contrast, and badge-forward launch spacing.",
    accent: "#f472b6",
    dna: "pulse",
    mood: "night",
    aura: "neon",
    scene: "arcade-night",
    backgroundIntensity: "high",
    glassIntensity: "high",
    bannerStyle: "dark",
    introMode: "cinematic",
    density: "spacious",
    cardStyle: "glass",
    cornerStyle: "rounded",
    motionLevel: "alive",
    composition: {
      mode: "floating",
      alignment: "center",
      density: "spacious",
      linksStyle: "stacked",
      socialsStyle: "spotlight",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: true,
        projects: true,
        gallery: true,
        extras: true,
      },
      order: [
        "identity",
        "showcase",
        "music",
        "presence",
        "socials",
        "projects",
        "gallery",
        "about",
        "extras",
      ],
      metadata: {
        badgeMode: "showcase",
        badgeStyle: "holographic",
        badgeSeason: "none",
        nameTypography: "luxe",
      },
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
    description: "Low-pressure identity, airy spacing, and pale collectible traces in the scene.",
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
      alignment: "center",
      density: "compact",
      linksStyle: "minimal",
      socialsStyle: "stack",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: true,
        projects: true,
        gallery: true,
        extras: true,
      },
      order: [
        "identity",
        "about",
        "presence",
        "music",
        "socials",
        "showcase",
        "gallery",
        "projects",
        "extras",
      ],
      metadata: {
        badgeMode: "rail",
        badgeStyle: "holographic",
        badgeSeason: "lunar",
        nameTypography: "signature",
      },
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
  luxury: {
    value: "luxury",
    name: "Luxury",
    description: "Broader breathing room, richer surfaces, and polished collectible hierarchy.",
    accent: "#f4c97a",
    dna: "cinematic",
    mood: "locked-in",
    aura: "galaxy",
    scene: "galaxy-room",
    backgroundIntensity: "high",
    glassIntensity: "high",
    bannerStyle: "cinematic",
    introMode: "cinematic",
    density: "spacious",
    cardStyle: "glass",
    cornerStyle: "rounded",
    motionLevel: "subtle",
    composition: {
      mode: "contained",
      alignment: "left",
      density: "spacious",
      linksStyle: "stacked",
      socialsStyle: "grid",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: true,
        projects: true,
        gallery: true,
        extras: true,
      },
      order: [
        "identity",
        "about",
        "presence",
        "projects",
        "showcase",
        "music",
        "socials",
        "gallery",
        "extras",
      ],
      metadata: {
        badgeMode: "showcase",
        badgeStyle: "holographic",
        badgeSeason: "solstice",
        nameTypography: "luxe",
      },
    },
    render: {
      shellVisibility: "soft",
      moduleGapScale: 1.08,
      stageWidthScale: 1.02,
      widgetWidthScale: 1.04,
      floatingPersonality: "cinematic",
      introStageScale: 1.08,
      motionPersonality: "cinematic",
    },
  },
  minimal: {
    value: "minimal",
    name: "Minimal",
    description: "Editorial restraint, low chrome, and strict visual hierarchy.",
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
      alignment: "left",
      density: "compact",
      linksStyle: "minimal",
      socialsStyle: "stack",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: false,
        socials: true,
        showcase: false,
        projects: true,
        gallery: false,
        extras: true,
      },
      order: [
        "identity",
        "about",
        "presence",
        "projects",
        "socials",
        "extras",
        "music",
        "showcase",
        "gallery",
      ],
      metadata: {
        badgeMode: "rail",
        badgeStyle: "default",
        badgeSeason: "none",
        nameTypography: "editorial",
      },
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
  orbit: {
    value: "orbit",
    name: "Orbit",
    description: "Balanced scene modules with calmer motion and a cleaner collector-dock orbit.",
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
      mode: "floating",
      alignment: "center",
      density: "balanced",
      linksStyle: "cards",
      socialsStyle: "grid",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: true,
        projects: true,
        gallery: true,
        extras: true,
      },
      order: [
        "identity",
        "about",
        "music",
        "presence",
        "socials",
        "showcase",
        "projects",
        "gallery",
        "extras",
      ],
      metadata: {
        badgeMode: "showcase",
        badgeStyle: "holographic",
        badgeSeason: "none",
        nameTypography: "signature",
      },
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
      alignment: "left",
      density: "compact",
      linksStyle: "cards",
      socialsStyle: "spotlight",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: true,
        projects: true,
        gallery: true,
        extras: true,
      },
      order: [
        "identity",
        "projects",
        "presence",
        "socials",
        "music",
        "showcase",
        "gallery",
        "about",
        "extras",
      ],
      metadata: {
        badgeMode: "showcase",
        badgeStyle: "holographic",
        badgeSeason: "none",
        nameTypography: "mono",
      },
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
  mono: {
    value: "mono",
    name: "Mono",
    description: "Monochrome restraint with cleaner surfaces and a quieter motion profile.",
    accent: "#d9dde7",
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
      alignment: "left",
      density: "compact",
      linksStyle: "stacked",
      socialsStyle: "stack",
      visible: {
        identity: true,
        about: true,
        presence: true,
        music: true,
        socials: true,
        showcase: false,
        projects: true,
        gallery: false,
        extras: true,
      },
      order: [
        "identity",
        "about",
        "projects",
        "presence",
        "socials",
        "music",
        "extras",
        "showcase",
        "gallery",
      ],
      metadata: {
        badgeMode: "rail",
        badgeStyle: "default",
        badgeSeason: "none",
        nameTypography: "mono",
      },
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

  const trimmed = mapLegacyPresetAlias(value.trim().toLowerCase());

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
      alignment: definition.composition.alignment,
      density: definition.composition.density,
      linksStyle: definition.composition.linksStyle,
      socialsStyle: definition.composition.socialsStyle,
      visible: { ...definition.composition.visible },
      order: [...definition.composition.order],
      metadata: {
        ...currentComposition.metadata,
        ...definition.composition.metadata,
      },
    } satisfies ProfileComposition,
  };
}

function mapLegacyPresetAlias(value: string) {
  if (value === "cinematic" || value === "afterhours" || value === "floating") {
    return "neon";
  }

  if (value === "minimalist") {
    return "minimal";
  }

  if (value === "ambient" || value === "softglass") {
    return "orbit";
  }

  if (value === "devcore") {
    return "mono";
  }

  return value;
}
