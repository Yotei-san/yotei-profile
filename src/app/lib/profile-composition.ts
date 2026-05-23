import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";
import type { ProfileIntroMode } from "@/app/lib/profile-customization";
import {
  normalizeProfileCustomBlocks,
  type ProfileCustomBlock,
} from "@/app/lib/profile-custom-blocks";
import {
  normalizeProfileDna,
  type ProfileDnaType,
} from "@/app/lib/profile-dna";
import {
  normalizeProfilePreset,
  type ProfilePresetId,
} from "@/app/lib/profile-presets";

export const PROFILE_COMPOSITION_BLOCKS = [
  "hero",
  "music",
  "socials",
  "live",
  "links",
] as const;

export const PROFILE_COMPOSITION_DENSITIES = [
  "compact",
  "balanced",
  "spacious",
] as const;
export const PROFILE_COMPOSITION_MODES = ["contained", "floating"] as const;
export const PROFILE_FLOATING_PERSONALITIES = [
  "centered",
  "cinematic",
  "scattered",
  "minimal",
] as const;

export const PROFILE_COMPOSITION_LINK_STYLES = [
  "cards",
  "pills",
  "minimal",
  "stacked",
] as const;

export const PROFILE_COMPOSITION_SOCIAL_STYLES = [
  "grid",
  "stack",
  "spotlight",
] as const;

export const PROFILE_COMPOSITION_METADATA_PLACEMENTS = [
  "under-username",
  "bio",
  "footer",
  "hidden",
] as const;

export type ProfileCompositionBlock = (typeof PROFILE_COMPOSITION_BLOCKS)[number];
export type ProfileCompositionDensity = (typeof PROFILE_COMPOSITION_DENSITIES)[number];
export type ProfileCompositionMode = (typeof PROFILE_COMPOSITION_MODES)[number];
export type ProfileFloatingPersonality =
  (typeof PROFILE_FLOATING_PERSONALITIES)[number];
export type ProfileCompositionLinksStyle =
  (typeof PROFILE_COMPOSITION_LINK_STYLES)[number];
export type ProfileCompositionSocialsStyle =
  (typeof PROFILE_COMPOSITION_SOCIAL_STYLES)[number];
export type ProfileCompositionMetadataPlacement =
  (typeof PROFILE_COMPOSITION_METADATA_PLACEMENTS)[number];

export type ProfileCompositionMetadata = {
  placement: ProfileCompositionMetadataPlacement;
  locationText: string;
  showBadges: boolean;
};

export type ProfileComposition = {
  preset: ProfilePresetId | null;
  dna: ProfileDnaType | null;
  mode: ProfileCompositionMode;
  visible: {
    music: boolean;
    socials: boolean;
    links: boolean;
    live: boolean;
  };
  order: ProfileCompositionBlock[];
  density: ProfileCompositionDensity;
  linksStyle: ProfileCompositionLinksStyle;
  socialsStyle: ProfileCompositionSocialsStyle;
  metadata: ProfileCompositionMetadata;
  customBlocks: ProfileCustomBlock[];
};

export const DEFAULT_PROFILE_COMPOSITION: ProfileComposition = {
  preset: null,
  dna: null,
  mode: "contained",
  visible: {
    music: true,
    socials: true,
    links: true,
    live: true,
  },
  order: ["hero", "music", "socials", "live", "links"],
  density: "balanced",
  linksStyle: "cards",
  socialsStyle: "grid",
  metadata: {
    placement: "under-username",
    locationText: "",
    showBadges: true,
  },
  customBlocks: [],
};

export const PROFILE_COMPOSITION_DENSITY_OPTIONS = [
  {
    value: "compact",
    name: "Compact",
    description: "Tighter widget spacing and denser block rhythm.",
  },
  {
    value: "balanced",
    name: "Balanced",
    description: "The default structure with premium breathing room.",
  },
  {
    value: "spacious",
    name: "Spacious",
    description: "More separation between widgets and looser pacing.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionDensity;
  name: string;
  description: string;
}>;

export const PROFILE_COMPOSITION_MODE_OPTIONS = [
  {
    value: "contained",
    name: "Contained",
    description: "Keep modules grouped in the current structured profile presentation.",
  },
  {
    value: "floating",
    name: "Floating",
    description: "Let identity and widgets live as separate modules inside the scene.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionMode;
  name: string;
  description: string;
}>;

export const PROFILE_COMPOSITION_LINK_STYLE_OPTIONS = [
  {
    value: "cards",
    name: "Cards",
    description: "Full rich link cards with metadata and glow.",
  },
  {
    value: "pills",
    name: "Pills",
    description: "Shorter pill-like links for a lighter feed.",
  },
  {
    value: "minimal",
    name: "Minimal",
    description: "Lower-chrome links with restrained framing.",
  },
  {
    value: "stacked",
    name: "Stacked",
    description: "Editorial stacked list with more text hierarchy.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionLinksStyle;
  name: string;
  description: string;
}>;

export const PROFILE_COMPOSITION_SOCIAL_STYLE_OPTIONS = [
  {
    value: "grid",
    name: "Grid",
    description: "Balanced multi-card social layout.",
  },
  {
    value: "stack",
    name: "Stack",
    description: "One-column social feed for clarity.",
  },
  {
    value: "spotlight",
    name: "Spotlight",
    description: "Lead with the first block and tuck the rest beneath it.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionSocialsStyle;
  name: string;
  description: string;
}>;

export const PROFILE_COMPOSITION_METADATA_PLACEMENT_OPTIONS = [
  {
    value: "under-username",
    name: "Under username",
    description: "Keep views, reactions, and location directly in the identity stack.",
  },
  {
    value: "bio",
    name: "Bio area",
    description: "Tuck metadata beneath the bio for a more editorial profile flow.",
  },
  {
    value: "footer",
    name: "Footer row",
    description: "Let metadata sit lower on the page as a quiet profile footer.",
  },
  {
    value: "hidden",
    name: "Hidden",
    description: "Hide views, reactions, and location from the public profile.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionMetadataPlacement;
  name: string;
  description: string;
}>;

type RenderAvailability = Record<ProfileCompositionBlock, boolean>;

export type ProfileFloatingPlacementWidth =
  | "compact"
  | "medium"
  | "wide"
  | "bar"
  | "footer";

export type ProfileFloatingModulePlacement = {
  align: "start" | "center" | "end";
  columnStart: number;
  span: number;
  width: ProfileFloatingPlacementWidth;
  xOffset: number;
  yOffset: number;
};

export function normalizeProfileComposition(value: unknown): ProfileComposition {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  return {
    preset: normalizeProfilePreset(candidate?.preset),
    dna: normalizeProfileDna(candidate?.dna),
    mode: normalizeCompositionMode(candidate?.mode),
    visible: normalizeVisible(candidate?.visible),
    order: normalizeOrder(candidate?.order),
    density: normalizeCompositionDensity(candidate?.density),
    linksStyle: normalizeCompositionLinksStyle(candidate?.linksStyle),
    socialsStyle: normalizeCompositionSocialsStyle(candidate?.socialsStyle),
    metadata: normalizeMetadata(candidate?.metadata, candidate?.visible),
    customBlocks: normalizeProfileCustomBlocks(candidate?.customBlocks),
  };
}

export function parseProfileCompositionInput(value: string | null | undefined) {
  const trimmed = value?.trim() || "";

  if (!trimmed) {
    return DEFAULT_PROFILE_COMPOSITION;
  }

  try {
    return normalizeProfileComposition(JSON.parse(trimmed));
  } catch {
    return DEFAULT_PROFILE_COMPOSITION;
  }
}

export function getRenderableCompositionOrder(
  composition: ProfileComposition,
  availability: Partial<RenderAvailability>,
) {
  const seen = new Set<ProfileCompositionBlock>();
  const output: ProfileCompositionBlock[] = [];

  for (const block of normalizeOrder(composition.order)) {
    if (seen.has(block)) {
      continue;
    }

    if (!isBlockRenderable(block, composition, availability)) {
      continue;
    }

    output.push(block);
    seen.add(block);
  }

  for (const fallback of DEFAULT_PROFILE_COMPOSITION.order) {
    if (seen.has(fallback)) {
      continue;
    }

    if (!isBlockRenderable(fallback, composition, availability)) {
      continue;
    }

    output.push(fallback);
    seen.add(fallback);
  }

  return output;
}

export function partitionSocialBlocks(blocks: PublicSocialBlock[]) {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  return safeBlocks.reduce(
    (acc, block) => {
      if (isLiveSocialBlock(block)) {
        acc.live.push(block);
      } else {
        acc.socials.push(block);
      }

      return acc;
    },
    {
      socials: [] as PublicSocialBlock[],
      live: [] as PublicSocialBlock[],
    },
  );
}

export function getProfileCompositionSpacingScale(
  density: ProfileCompositionDensity,
) {
  if (density === "compact") {
    return 0.88;
  }

  if (density === "spacious") {
    return 1.16;
  }

  return 1;
}

export function getProfileFloatingCompositionPlan(input: {
  density: ProfileCompositionDensity;
  introMode: ProfileIntroMode;
  orderedBlocks: ProfileCompositionBlock[];
  personalityOverride?: ProfileFloatingPersonality | null;
}) {
  const visibleCount = input.orderedBlocks.length;
  const personality =
    input.personalityOverride ??
    selectFloatingPersonality({
      density: input.density,
      introMode: input.introMode,
      visibleCount,
    });

  const placements = input.orderedBlocks.reduce(
    (acc, block, index) => {
      acc[block] = getFloatingModulePlacement({
        personality,
        block,
        index,
        visibleCount,
      });
      return acc;
    },
    {} as Partial<Record<ProfileCompositionBlock, ProfileFloatingModulePlacement>>,
  );

  return {
    personality,
    visibleCount,
    placements,
  };
}

export function isMissingProfileCompositionColumnError(error: unknown) {
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
    (column.includes("profileComposition") || message.includes("profileComposition"))
  );
}

export function isLiveSocialBlock(block: Pick<PublicSocialBlock, "platform">) {
  return (
    block.platform === "twitch_live" ||
    block.platform === "youtube_live" ||
    block.platform === "kick_live"
  );
}

function normalizeVisible(value: unknown): ProfileComposition["visible"] {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    music: normalizeVisibleFlag(candidate.music, DEFAULT_PROFILE_COMPOSITION.visible.music),
    socials: normalizeVisibleFlag(
      candidate.socials,
      DEFAULT_PROFILE_COMPOSITION.visible.socials,
    ),
    links: normalizeVisibleFlag(candidate.links, DEFAULT_PROFILE_COMPOSITION.visible.links),
    live: normalizeVisibleFlag(candidate.live, DEFAULT_PROFILE_COMPOSITION.visible.live),
  };
}

function normalizeMetadata(
  value: unknown,
  legacyVisibleValue: unknown,
): ProfileCompositionMetadata {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const legacyVisible =
    legacyVisibleValue &&
    typeof legacyVisibleValue === "object" &&
    !Array.isArray(legacyVisibleValue)
      ? (legacyVisibleValue as Record<string, unknown>)
      : {};
  const normalizedLocationText = normalizeLocationText(
    candidate.locationText ?? candidate.location ?? candidate.country,
  );
  const defaultPlacement = normalizeVisibleFlag(
    legacyVisible.stats,
    true,
  )
    ? DEFAULT_PROFILE_COMPOSITION.metadata.placement
    : "hidden";

  return {
    placement: normalizeMetadataPlacement(candidate.placement, defaultPlacement),
    locationText: normalizedLocationText,
    showBadges: normalizeVisibleFlag(
      candidate.showBadges,
      normalizeVisibleFlag(
        legacyVisible.badges,
        DEFAULT_PROFILE_COMPOSITION.metadata.showBadges,
      ),
    ),
  };
}

function normalizeVisibleFlag(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeOrder(value: unknown) {
  if (!Array.isArray(value)) {
    return [...DEFAULT_PROFILE_COMPOSITION.order];
  }

  const seen = new Set<ProfileCompositionBlock>();
  const normalized: ProfileCompositionBlock[] = [];

  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }

    const trimmed = entry.trim().toLowerCase();

    if (
      PROFILE_COMPOSITION_BLOCKS.includes(trimmed as ProfileCompositionBlock) &&
      !seen.has(trimmed as ProfileCompositionBlock)
    ) {
      normalized.push(trimmed as ProfileCompositionBlock);
      seen.add(trimmed as ProfileCompositionBlock);
    }
  }

  for (const fallback of DEFAULT_PROFILE_COMPOSITION.order) {
    if (!seen.has(fallback)) {
      normalized.push(fallback);
    }
  }

  const heroIndex = normalized.indexOf("hero");

  if (heroIndex > 0) {
    normalized.splice(heroIndex, 1);
    normalized.unshift("hero");
  }

  return normalized;
}

function normalizeCompositionDensity(value: unknown): ProfileCompositionDensity {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_DENSITIES,
    DEFAULT_PROFILE_COMPOSITION.density,
  );
}

function normalizeCompositionMode(value: unknown): ProfileCompositionMode {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_MODES,
    DEFAULT_PROFILE_COMPOSITION.mode,
  );
}

function normalizeCompositionLinksStyle(value: unknown): ProfileCompositionLinksStyle {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_LINK_STYLES,
    DEFAULT_PROFILE_COMPOSITION.linksStyle,
  );
}

function normalizeCompositionSocialsStyle(value: unknown): ProfileCompositionSocialsStyle {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_SOCIAL_STYLES,
    DEFAULT_PROFILE_COMPOSITION.socialsStyle,
  );
}

function normalizeMetadataPlacement(
  value: unknown,
  fallback = DEFAULT_PROFILE_COMPOSITION.metadata.placement,
): ProfileCompositionMetadataPlacement {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_METADATA_PLACEMENTS,
    fallback,
  );
}

function normalizeLocationText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 80);
}

function normalizeEnumValue<TValue extends string>(
  value: unknown,
  candidates: readonly TValue[],
  fallback: TValue,
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim().toLowerCase();

  return candidates.includes(trimmed as TValue) ? (trimmed as TValue) : fallback;
}

function isBlockRenderable(
  block: ProfileCompositionBlock,
  composition: ProfileComposition,
  availability: Partial<RenderAvailability>,
) {
  if (block === "hero") {
    return true;
  }

  const available = availability[block] ?? false;

  if (!available) {
    return false;
  }

  if (block === "music") {
    return composition.visible.music;
  }

  if (block === "socials") {
    return composition.visible.socials;
  }

  if (block === "links") {
    return composition.visible.links;
  }

  return composition.visible.live;
}

function selectFloatingPersonality(input: {
  density: ProfileCompositionDensity;
  introMode: ProfileIntroMode;
  visibleCount: number;
}): ProfileFloatingPersonality {
  if (input.introMode === "cinematic") {
    return "cinematic";
  }

  if (input.density === "compact") {
    return input.visibleCount <= 3 ? "minimal" : "scattered";
  }

  if (input.visibleCount >= 5) {
    return "scattered";
  }

  if (input.introMode === "minimal") {
    return input.visibleCount <= 3 ? "centered" : "minimal";
  }

  if (input.visibleCount <= 2) {
    return "centered";
  }

  return "minimal";
}

function getFloatingModulePlacement(input: {
  personality: ProfileFloatingPersonality;
  block: ProfileCompositionBlock;
  index: number;
  visibleCount: number;
}): ProfileFloatingModulePlacement {
  const base = FLOATING_PLACEMENT_MAP[input.personality][input.block] ??
    FLOATING_PLACEMENT_MAP.centered[input.block];

  if (input.visibleCount <= 2) {
    return {
      ...base,
      columnStart: input.index % 2 === 0 ? 3 : 5,
      span: Math.min(8, Math.max(base.span, 6)),
      align: "center",
      xOffset: input.index % 2 === 0 ? -8 : 10,
      yOffset: base.yOffset + input.index * 8,
    };
  }

  return base;
}

const FLOATING_PLACEMENT_MAP: Record<
  ProfileFloatingPersonality,
  Record<ProfileCompositionBlock, ProfileFloatingModulePlacement>
> = {
  centered: {
    hero: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    music: {
      columnStart: 3,
      span: 8,
      width: "bar",
      align: "center",
      xOffset: 16,
      yOffset: -6,
    },
    socials: {
      columnStart: 2,
      span: 4,
      width: "compact",
      align: "start",
      xOffset: -24,
      yOffset: 10,
    },
    live: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 22,
      yOffset: 18,
    },
    links: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 10,
      yOffset: 18,
    },
  },
  cinematic: {
    hero: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    music: {
      columnStart: 5,
      span: 7,
      width: "bar",
      align: "end",
      xOffset: 24,
      yOffset: -12,
    },
    socials: {
      columnStart: 2,
      span: 4,
      width: "compact",
      align: "start",
      xOffset: -28,
      yOffset: 16,
    },
    live: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 28,
      yOffset: 22,
    },
    links: {
      columnStart: 4,
      span: 7,
      width: "wide",
      align: "center",
      xOffset: 18,
      yOffset: 26,
    },
  },
  scattered: {
    hero: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    music: {
      columnStart: 1,
      span: 6,
      width: "bar",
      align: "start",
      xOffset: -18,
      yOffset: -4,
    },
    socials: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 22,
      yOffset: -10,
    },
    live: {
      columnStart: 2,
      span: 4,
      width: "compact",
      align: "start",
      xOffset: 14,
      yOffset: 22,
    },
    links: {
      columnStart: 5,
      span: 7,
      width: "wide",
      align: "end",
      xOffset: -12,
      yOffset: 20,
    },
  },
  minimal: {
    hero: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    music: {
      columnStart: 3,
      span: 7,
      width: "bar",
      align: "center",
      xOffset: 0,
      yOffset: -2,
    },
    socials: {
      columnStart: 2,
      span: 4,
      width: "compact",
      align: "start",
      xOffset: -10,
      yOffset: 10,
    },
    live: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 10,
      yOffset: 14,
    },
    links: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 16,
    },
  },
};
