import {
  normalizeProfileBackgroundIntensity,
  normalizeProfileMotionLevel,
  type ProfileBackgroundIntensity,
  type ProfileMotionLevel,
} from "@/app/lib/profile-customization";

export const PERFORMANCE_MODES = ["auto", "low", "medium", "high"] as const;

export type PerformanceMode = (typeof PERFORMANCE_MODES)[number];
export type PerformanceTier = Exclude<PerformanceMode, "auto">;

export type BrowserPerformanceSignals = {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  finePointer: boolean;
  coarsePointer: boolean;
  slowUpdate: boolean;
};

export type AdaptivePerformanceProfile = {
  mode: PerformanceMode;
  tier: PerformanceTier;
  safeMode: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  lowPowerDevice: boolean;
  finePointer: boolean;
  coarsePointer: boolean;
  allowMotion: boolean;
  allowAmbientMotion: boolean;
  allowDecorativeMotion: boolean;
  allowBlurEffects: boolean;
  allowCursorEffects: boolean;
  allowDeferredVisuals: boolean;
  blurScale: number;
  particleDensity: number;
  sceneIntensityScale: number;
  animationDurationScale: number;
};

export type AdaptiveMotionDebugSummary = {
  motionPolicy: "off" | "subtle" | "full";
  blockedBy: string;
  tierPolicy: string;
};

export const YOTEI_PERFORMANCE_STORAGE_KEY = "yotei:performance-mode";

export const DEFAULT_BROWSER_PERFORMANCE_SIGNALS: BrowserPerformanceSignals = {
  reducedMotion: false,
  saveData: false,
  deviceMemory: null,
  hardwareConcurrency: null,
  finePointer: true,
  coarsePointer: false,
  slowUpdate: false,
};

export function normalizePerformanceMode(value: unknown): PerformanceMode {
  if (typeof value !== "string") {
    return "auto";
  }

  const normalized = value.trim().toLowerCase();

  return PERFORMANCE_MODES.includes(normalized as PerformanceMode)
    ? (normalized as PerformanceMode)
    : "auto";
}

export function resolveAdaptivePerformanceProfile(input: {
  mode?: PerformanceMode;
  signals?: BrowserPerformanceSignals;
} = {}): AdaptivePerformanceProfile {
  const mode = input.mode ?? "auto";
  const signals = input.signals ?? DEFAULT_BROWSER_PERFORMANCE_SIGNALS;
  const tier = mode === "auto" ? resolveAutoPerformanceTier(signals) : mode;
  const lowDeviceMemory = signals.deviceMemory != null && signals.deviceMemory <= 2;
  const lowHardwareConcurrency =
    signals.hardwareConcurrency != null && signals.hardwareConcurrency <= 2;
  const constrainedDevice =
    signals.deviceMemory != null &&
    signals.hardwareConcurrency != null &&
    signals.deviceMemory <= 4 &&
    signals.hardwareConcurrency <= 4;
  const lowPowerDevice =
    signals.slowUpdate || lowDeviceMemory || lowHardwareConcurrency || constrainedDevice;
  const shouldConserveEffects =
    signals.reducedMotion || signals.saveData || lowPowerDevice;
  const safeMode = shouldConserveEffects;

  return {
    mode,
    tier,
    safeMode,
    reducedMotion: signals.reducedMotion,
    saveData: signals.saveData,
    lowPowerDevice,
    finePointer: signals.finePointer,
    coarsePointer: signals.coarsePointer,
    allowMotion: !signals.reducedMotion,
    allowAmbientMotion: !shouldConserveEffects,
    allowDecorativeMotion: !shouldConserveEffects,
    allowBlurEffects: !signals.reducedMotion && !signals.saveData && !lowPowerDevice && tier !== "low",
    allowCursorEffects:
      !signals.reducedMotion &&
      !signals.saveData &&
      signals.finePointer &&
      !signals.coarsePointer &&
      tier === "high",
    allowDeferredVisuals: !shouldConserveEffects && tier !== "low",
    blurScale: tier === "low" ? 0.52 : tier === "medium" ? 0.8 : 1,
    particleDensity: tier === "low" ? 0.42 : tier === "medium" ? 0.72 : 1,
    sceneIntensityScale: tier === "low" ? 0.68 : tier === "medium" ? 0.84 : 1,
    animationDurationScale: tier === "low" ? 1.14 : tier === "medium" ? 1.04 : 1,
  };
}

export function readBrowserPerformanceSignals(): BrowserPerformanceSignals {
  if (typeof window === "undefined") {
    return DEFAULT_BROWSER_PERFORMANCE_SIGNALS;
  }

  const navigatorConnection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  const navigatorWithHints = navigator as Navigator & {
    deviceMemory?: number;
  };

  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: navigatorConnection?.saveData === true,
    deviceMemory:
      typeof navigatorWithHints.deviceMemory === "number"
        ? navigatorWithHints.deviceMemory
        : null,
    hardwareConcurrency:
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : null,
    finePointer: window.matchMedia("(pointer: fine)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    slowUpdate: window.matchMedia("(update: slow)").matches,
  };
}

export function adaptProfileMotionLevel(
  motionLevel: ProfileMotionLevel,
  performance: AdaptivePerformanceProfile,
) {
  const normalizedMotionLevel = normalizeProfileMotionLevel(motionLevel);

  if (normalizedMotionLevel === "off") {
    return "off" as const;
  }

  if (!performance.allowMotion) {
    return "off" as const;
  }

  if (shouldDisableAdaptiveMotion(performance)) {
    return "off" as const;
  }

  if (performance.tier !== "high") {
    return "subtle" as const;
  }

  return normalizedMotionLevel;
}

export function adaptProfileBackgroundIntensity(
  intensity: ProfileBackgroundIntensity,
  performance: AdaptivePerformanceProfile,
) {
  const normalizedIntensity = normalizeProfileBackgroundIntensity(intensity);

  if (performance.safeMode) {
    return "low" as const;
  }

  if (performance.tier === "low") {
    return normalizedIntensity === "high" ? "medium" : normalizedIntensity;
  }

  if (performance.tier === "medium" && normalizedIntensity === "high") {
    return "medium" as const;
  }

  return normalizedIntensity;
}

export function shouldDisableAdaptiveMotion(
  profile: Pick<AdaptivePerformanceProfile, "reducedMotion" | "saveData" | "safeMode">,
) {
  return profile.reducedMotion || profile.saveData || profile.safeMode;
}

export function getAdaptiveMotionDebugSummary(
  profile: Pick<
    AdaptivePerformanceProfile,
    "tier" | "safeMode" | "reducedMotion" | "saveData"
  >,
): AdaptiveMotionDebugSummary {
  if (profile.reducedMotion) {
    return {
      motionPolicy: "off",
      blockedBy: "prefers-reduced-motion",
      tierPolicy: `${profile.tier}: reduced motion wins`,
    };
  }

  if (profile.saveData) {
    return {
      motionPolicy: "off",
      blockedBy: "save-data",
      tierPolicy: `${profile.tier}: save-data wins`,
    };
  }

  if (profile.safeMode) {
    return {
      motionPolicy: "off",
      blockedBy: "safe-mode",
      tierPolicy: `${profile.tier}: safe mode wins`,
    };
  }

  if (profile.tier === "high") {
    return {
      motionPolicy: "full",
      blockedBy: "none",
      tierPolicy: "high: full motion",
    };
  }

  return {
    motionPolicy: "subtle",
    blockedBy: "none",
    tierPolicy: `${profile.tier}: degrade to subtle`,
  };
}

function resolveAutoPerformanceTier(
  signals: BrowserPerformanceSignals,
): PerformanceTier {
  if (signals.reducedMotion || signals.saveData) {
    return "low";
  }

  let score = 0;

  if (signals.slowUpdate) {
    score -= 2;
  }

  if (signals.coarsePointer) {
    score -= 1;
  }

  if (signals.finePointer) {
    score += 1;
  }

  if (signals.deviceMemory != null) {
    score +=
      signals.deviceMemory >= 8 ? 2 : signals.deviceMemory >= 6 ? 1 : signals.deviceMemory >= 4 ? 0 : -1;
  }

  if (signals.hardwareConcurrency != null) {
    score +=
      signals.hardwareConcurrency >= 8
        ? 2
        : signals.hardwareConcurrency >= 6
          ? 1
          : signals.hardwareConcurrency >= 4
            ? 0
            : -1;
  }

  if (score >= 4) {
    return "high";
  }

  if (score <= 0) {
    return "low";
  }

  return "medium";
}
