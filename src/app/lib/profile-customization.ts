import { hasPremiumAccess } from "@/app/lib/premium";

export const PROFILE_NAME_EFFECTS = [
  "none",
  "glow",
  "rainbow",
  "typewriter",
  "particles",
  "glitch",
  "shimmer",
] as const;

export const PROFILE_BACKGROUND_INTENSITIES = ["low", "medium", "high"] as const;
export const PROFILE_GLASS_INTENSITIES = ["low", "medium", "high"] as const;
export const PROFILE_BANNER_STYLES = ["clean", "cinematic", "dark"] as const;

export type ProfileNameEffect = (typeof PROFILE_NAME_EFFECTS)[number];
export type ProfileBackgroundIntensity =
  (typeof PROFILE_BACKGROUND_INTENSITIES)[number];
export type ProfileGlassIntensity = (typeof PROFILE_GLASS_INTENSITIES)[number];
export type ProfileBannerStyle = (typeof PROFILE_BANNER_STYLES)[number];

export const MAX_PROFILE_NAME_EFFECTS = 2;

const FREE_PROFILE_NAME_EFFECTS = new Set<ProfileNameEffect>(["none", "glow"]);
const PREMIUM_PROFILE_NAME_EFFECTS = new Set<ProfileNameEffect>([
  "rainbow",
  "typewriter",
  "particles",
  "glitch",
  "shimmer",
]);

export const PROFILE_NAME_EFFECT_OPTIONS = [
  {
    value: "none",
    name: "None",
    description: "Keep the name clean, sharp, and unstyled.",
    premium: false,
  },
  {
    value: "glow",
    name: "Glow",
    description: "Soft neon bloom around the display name.",
    premium: false,
  },
  {
    value: "rainbow",
    name: "Rainbow",
    description: "Animated premium gradient text with restrained motion.",
    premium: true,
  },
  {
    value: "typewriter",
    name: "Typewriter",
    description: "Subtle cursor blink that feels alive without reflow.",
    premium: true,
  },
  {
    value: "particles",
    name: "Particles",
    description: "Tiny spark accents floating around the name block.",
    premium: true,
  },
  {
    value: "glitch",
    name: "Glitch",
    description: "Controlled digital flicker with lightweight shadow offsets.",
    premium: true,
  },
  {
    value: "shimmer",
    name: "Shimmer",
    description: "A moving highlight sweep across the identity area.",
    premium: true,
  },
] as const satisfies ReadonlyArray<{
  value: ProfileNameEffect;
  name: string;
  description: string;
  premium: boolean;
}>;

export const PROFILE_BACKGROUND_INTENSITY_OPTIONS = [
  {
    value: "low",
    name: "Low",
    description: "Background takes a back seat and keeps the profile cleaner.",
  },
  {
    value: "medium",
    name: "Medium",
    description: "Balanced atmosphere with the current Yotei default feel.",
  },
  {
    value: "high",
    name: "High",
    description: "More visible motion, glow, and scene energy behind the profile.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileBackgroundIntensity;
  name: string;
  description: string;
}>;

export const PROFILE_GLASS_INTENSITY_OPTIONS = [
  {
    value: "low",
    name: "Low",
    description: "More solid panels with lighter glass treatment.",
  },
  {
    value: "medium",
    name: "Medium",
    description: "Balanced glass depth and blur for readability.",
  },
  {
    value: "high",
    name: "High",
    description: "Stronger blur, highlights, and premium glass polish.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileGlassIntensity;
  name: string;
  description: string;
}>;

export const PROFILE_BANNER_STYLE_OPTIONS = [
  {
    value: "clean",
    name: "Clean",
    description: "Show more of the banner with lighter overlays and blur.",
  },
  {
    value: "cinematic",
    name: "Cinematic",
    description: "Balanced banner drama and legibility.",
  },
  {
    value: "dark",
    name: "Dark",
    description: "Heavier overlays for a moodier, darker stage.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileBannerStyle;
  name: string;
  description: string;
}>;

type PremiumUserInput = Parameters<typeof hasPremiumAccess>[0];

export function normalizeProfileNameEffects(
  values: Iterable<string | null | undefined>,
  hasPremiumState: boolean,
) {
  const resolved: ProfileNameEffect[] = [];
  const seen = new Set<ProfileNameEffect>();

  for (const rawValue of values) {
    const effect = normalizeProfileNameEffect(rawValue);

    if (!effect) {
      continue;
    }

    if (effect === "none") {
      return [] as ProfileNameEffect[];
    }

    if (!isNameEffectAvailable(effect, hasPremiumState) || seen.has(effect)) {
      continue;
    }

    resolved.push(effect);
    seen.add(effect);

    if (resolved.length >= MAX_PROFILE_NAME_EFFECTS) {
      break;
    }
  }

  return resolved;
}

export function normalizeProfileNameEffectsForUser(
  values: Iterable<string | null | undefined>,
  user: PremiumUserInput,
) {
  return normalizeProfileNameEffects(values, hasPremiumAccess(user));
}

export function normalizeProfileNameEffect(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  return PROFILE_NAME_EFFECTS.includes(trimmed as ProfileNameEffect)
    ? (trimmed as ProfileNameEffect)
    : null;
}

export function isNameEffectAvailable(
  effect: ProfileNameEffect,
  hasPremiumState: boolean,
) {
  if (FREE_PROFILE_NAME_EFFECTS.has(effect)) {
    return true;
  }

  return hasPremiumState && PREMIUM_PROFILE_NAME_EFFECTS.has(effect);
}

export function normalizeProfileBackgroundIntensity(
  value: string | null | undefined,
) {
  return normalizeEnumValue(
    value,
    PROFILE_BACKGROUND_INTENSITIES,
    "medium",
  );
}

export function normalizeProfileGlassIntensity(
  value: string | null | undefined,
) {
  return normalizeEnumValue(
    value,
    PROFILE_GLASS_INTENSITIES,
    "medium",
  );
}

export function normalizeProfileBannerStyle(
  value: string | null | undefined,
) {
  return normalizeEnumValue(
    value,
    PROFILE_BANNER_STYLES,
    "cinematic",
  );
}

export function getProfileBackgroundVisibility(
  intensity: ProfileBackgroundIntensity,
  previewMode = false,
) {
  const base =
    intensity === "low" ? 0.62 : intensity === "high" ? 1 : 0.84;

  return previewMode ? Math.min(base, 0.9) : base;
}

export function getProfileBackgroundSaturation(
  intensity: ProfileBackgroundIntensity,
) {
  return intensity === "low" ? 0.92 : intensity === "high" ? 1.1 : 1;
}

export function getProfileGlassTokens(intensity: ProfileGlassIntensity) {
  if (intensity === "low") {
    return {
      backgroundLayer:
        "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      backdropFilter: "blur(12px) saturate(112%)",
      shadowBoost: "0 20px 46px rgba(0,0,0,0.22)",
    };
  }

  if (intensity === "high") {
    return {
      backgroundLayer:
        "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
      backdropFilter: "blur(28px) saturate(145%)",
      shadowBoost: "0 28px 62px rgba(0,0,0,0.28)",
    };
  }

  return {
    backgroundLayer:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    backdropFilter: "blur(20px) saturate(128%)",
    shadowBoost: "0 24px 56px rgba(0,0,0,0.24)",
  };
}

export function getProfileBannerStyleTokens(style: ProfileBannerStyle) {
  if (style === "clean") {
    return {
      mediaScale: 1.02,
      mediaFilter: "brightness(0.98) saturate(1.06) contrast(1.02)",
      stageBlurHeight: "18vh",
      previewStageBlurHeight: "14%",
      stageOverlayTop: 0.08,
      stageOverlayMid: 0.22,
      stageOverlayBottom: 0.58,
      stageAccentOpacity: 0.16,
      vignetteOpacity: 0.24,
      sideShadeOpacity: 0.22,
      surfaceOverlayTop: 0.08,
      surfaceOverlayMid: 0.18,
      surfaceOverlayBottom: 0.44,
    };
  }

  if (style === "dark") {
    return {
      mediaScale: 1.08,
      mediaFilter: "brightness(0.78) saturate(0.98) contrast(1.06)",
      stageBlurHeight: "32vh",
      previewStageBlurHeight: "22%",
      stageOverlayTop: 0.22,
      stageOverlayMid: 0.44,
      stageOverlayBottom: 0.9,
      stageAccentOpacity: 0.18,
      vignetteOpacity: 0.5,
      sideShadeOpacity: 0.4,
      surfaceOverlayTop: 0.18,
      surfaceOverlayMid: 0.36,
      surfaceOverlayBottom: 0.78,
    };
  }

  return {
    mediaScale: 1.05,
    mediaFilter: "brightness(0.92) saturate(1.04) contrast(1.04)",
    stageBlurHeight: "26vh",
    previewStageBlurHeight: "18%",
    stageOverlayTop: 0.18,
    stageOverlayMid: 0.36,
    stageOverlayBottom: 0.74,
    stageAccentOpacity: 0.22,
    vignetteOpacity: 0.38,
    sideShadeOpacity: 0.42,
    surfaceOverlayTop: 0.1,
    surfaceOverlayMid: 0.28,
    surfaceOverlayBottom: 0.68,
  };
}

export function isMissingProfileCustomizationColumnError(error: unknown) {
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
    [
      "profileNameEffects",
      "profileBackgroundIntensity",
      "profileGlassIntensity",
      "profileBannerStyle",
    ].some((field) => column.includes(field) || message.includes(field))
  );
}

function normalizeEnumValue<TValue extends string>(
  value: string | null | undefined,
  candidates: readonly TValue[],
  fallback: TValue,
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim().toLowerCase();

  return candidates.includes(trimmed as TValue) ? (trimmed as TValue) : fallback;
}
