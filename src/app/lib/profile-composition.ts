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
  "identity",
  "about",
  "presence",
  "music",
  "socials",
  "showcase",
  "projects",
  "gallery",
  "extras",
] as const;

export const PROFILE_COMPOSITION_DENSITIES = [
  "compact",
  "balanced",
  "spacious",
] as const;
export const PROFILE_COMPOSITION_MODES = ["contained", "floating"] as const;
export const PROFILE_COMPOSITION_ALIGNMENTS = ["left", "center"] as const;
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
  "hero-footer",
  "screen-bottom-left",
  "screen-bottom-right",
  "hidden",
] as const;

export const PROFILE_BADGE_SHOWCASE_MODES = ["rail", "showcase"] as const;
export const PROFILE_BADGE_STYLE_VARIANTS = ["default", "holographic"] as const;
export const PROFILE_BADGE_SEASONAL_THEMES = ["none", "solstice", "lunar"] as const;
export const PROFILE_NAME_TYPOGRAPHY_STYLES = [
  "signature",
  "editorial",
  "mono",
  "luxe",
] as const;

export type ProfileCompositionBlock = (typeof PROFILE_COMPOSITION_BLOCKS)[number];
export type ProfileCompositionDensity = (typeof PROFILE_COMPOSITION_DENSITIES)[number];
export type ProfileCompositionMode = (typeof PROFILE_COMPOSITION_MODES)[number];
export type ProfileCompositionAlignment =
  (typeof PROFILE_COMPOSITION_ALIGNMENTS)[number];
export type ProfileFloatingPersonality =
  (typeof PROFILE_FLOATING_PERSONALITIES)[number];
export type ProfileCompositionLinksStyle =
  (typeof PROFILE_COMPOSITION_LINK_STYLES)[number];
export type ProfileCompositionSocialsStyle =
  (typeof PROFILE_COMPOSITION_SOCIAL_STYLES)[number];
export type ProfileCompositionMetadataPlacement =
  (typeof PROFILE_COMPOSITION_METADATA_PLACEMENTS)[number];
export type ProfileBadgeShowcaseMode =
  (typeof PROFILE_BADGE_SHOWCASE_MODES)[number];
export type ProfileBadgeStyleVariant =
  (typeof PROFILE_BADGE_STYLE_VARIANTS)[number];
export type ProfileBadgeSeasonalTheme =
  (typeof PROFILE_BADGE_SEASONAL_THEMES)[number];
export type ProfileNameTypographyStyle =
  (typeof PROFILE_NAME_TYPOGRAPHY_STYLES)[number];

export type ProfileCompositionMetadata = {
  placement: ProfileCompositionMetadataPlacement;
  locationText: string;
  showBadges: boolean;
  badgeMode: ProfileBadgeShowcaseMode;
  badgeStyle: ProfileBadgeStyleVariant;
  badgeSeason: ProfileBadgeSeasonalTheme;
  favoriteBadgeSlugs: string[];
  nameTypography: ProfileNameTypographyStyle;
};

export type ProfileComposition = {
  preset: ProfilePresetId | null;
  dna: ProfileDnaType | null;
  mode: ProfileCompositionMode;
  alignment: ProfileCompositionAlignment;
  visible: {
    identity: boolean;
    about: boolean;
    presence: boolean;
    music: boolean;
    socials: boolean;
    showcase: boolean;
    projects: boolean;
    gallery: boolean;
    extras: boolean;
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
  alignment: "left",
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
    "projects",
    "gallery",
    "extras",
  ],
  density: "balanced",
  linksStyle: "cards",
  socialsStyle: "grid",
  metadata: {
    placement: "under-username",
    locationText: "",
    showBadges: true,
    badgeMode: "rail",
    badgeStyle: "default",
    badgeSeason: "none",
    favoriteBadgeSlugs: [],
    nameTypography: "signature",
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

export const PROFILE_COMPOSITION_ALIGNMENT_OPTIONS = [
  {
    value: "left",
    name: "Left",
    description: "Anchor sections to the left for a stronger editorial flow.",
  },
  {
    value: "center",
    name: "Center",
    description: "Keep the scene more symmetrical and display-led.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCompositionAlignment;
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
    description: "Keep views, reactions, and location directly beneath the name.",
  },
  {
    value: "hero-footer",
    name: "Hero footer",
    description: "Anchor the stats row lower in the hero for a quieter identity stack.",
  },
  {
    value: "screen-bottom-left",
    name: "Bottom-left corner",
    description: "Pin views, reactions, and location to the lower-left screen edge.",
  },
  {
    value: "screen-bottom-right",
    name: "Bottom-right corner",
    description: "Pin views, reactions, and location to the lower-right screen edge.",
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

export const PROFILE_BADGE_SHOWCASE_MODE_OPTIONS = [
  {
    value: "rail",
    name: "Rail",
    description: "Compact collectible rail tucked into the identity stack.",
  },
  {
    value: "showcase",
    name: "Showcase",
    description: "Larger premium badge tiles with more room to breathe.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileBadgeShowcaseMode;
  name: string;
  description: string;
}>;

export const PROFILE_BADGE_STYLE_VARIANT_OPTIONS = [
  {
    value: "default",
    name: "Classic glow",
    description: "Refined glass and glow treatment.",
  },
  {
    value: "holographic",
    name: "Holographic",
    description: "Adds a spectral sheen for higher-energy scenes.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileBadgeStyleVariant;
  name: string;
  description: string;
}>;

export const PROFILE_BADGE_SEASONAL_THEME_OPTIONS = [
  {
    value: "none",
    name: "Evergreen",
    description: "No seasonal overlay.",
  },
  {
    value: "solstice",
    name: "Solstice",
    description: "Warm celebratory highlights with gold undertones.",
  },
  {
    value: "lunar",
    name: "Lunar",
    description: "Cool silver-blue seasonal shimmer.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileBadgeSeasonalTheme;
  name: string;
  description: string;
}>;

export const PROFILE_NAME_TYPOGRAPHY_STYLE_OPTIONS = [
  {
    value: "signature",
    name: "Signature",
    description: "Readable hero typography with soft premium lift.",
  },
  {
    value: "editorial",
    name: "Editorial",
    description: "Sharper high-contrast hierarchy for identity-first profiles.",
  },
  {
    value: "mono",
    name: "Mono",
    description: "Technical restrained rhythm with cleaner spacing.",
  },
  {
    value: "luxe",
    name: "Luxe",
    description: "Wide display treatment with cinematic polish.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileNameTypographyStyle;
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
    alignment: normalizeCompositionAlignment(candidate?.alignment),
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
    identity: true,
    about: normalizeVisibleFlag(candidate.about, DEFAULT_PROFILE_COMPOSITION.visible.about),
    presence: normalizeVisibleFlag(
      candidate.presence,
      normalizeVisibleFlag(candidate.links, DEFAULT_PROFILE_COMPOSITION.visible.presence),
    ),
    music: normalizeVisibleFlag(candidate.music, DEFAULT_PROFILE_COMPOSITION.visible.music),
    socials: normalizeVisibleFlag(
      candidate.socials,
      DEFAULT_PROFILE_COMPOSITION.visible.socials,
    ),
    showcase: normalizeVisibleFlag(
      candidate.showcase,
      DEFAULT_PROFILE_COMPOSITION.visible.showcase,
    ),
    projects: normalizeVisibleFlag(
      candidate.projects,
      DEFAULT_PROFILE_COMPOSITION.visible.projects,
    ),
    gallery: normalizeVisibleFlag(
      candidate.gallery,
      DEFAULT_PROFILE_COMPOSITION.visible.gallery,
    ),
    extras: normalizeVisibleFlag(candidate.extras, DEFAULT_PROFILE_COMPOSITION.visible.extras),
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
    badgeMode: normalizeBadgeShowcaseMode(candidate.badgeMode),
    badgeStyle: normalizeBadgeStyleVariant(candidate.badgeStyle),
    badgeSeason: normalizeBadgeSeasonalTheme(candidate.badgeSeason),
    favoriteBadgeSlugs: normalizeFavoriteBadgeSlugs(candidate.favoriteBadgeSlugs),
    nameTypography: normalizeNameTypographyStyle(candidate.nameTypography),
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

    const trimmed = mapLegacyCompositionBlock(entry.trim().toLowerCase());

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

  const identityIndex = normalized.indexOf("identity");

  if (identityIndex > 0) {
    normalized.splice(identityIndex, 1);
    normalized.unshift("identity");
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

function normalizeCompositionAlignment(value: unknown): ProfileCompositionAlignment {
  return normalizeEnumValue(
    value,
    PROFILE_COMPOSITION_ALIGNMENTS,
    DEFAULT_PROFILE_COMPOSITION.alignment,
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
  if (typeof value === "string") {
    const legacyValue = value.trim().toLowerCase();

    if (legacyValue === "footer") {
      return "hero-footer";
    }
  }

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

function normalizeBadgeShowcaseMode(value: unknown): ProfileBadgeShowcaseMode {
  return normalizeEnumValue(
    value,
    PROFILE_BADGE_SHOWCASE_MODES,
    DEFAULT_PROFILE_COMPOSITION.metadata.badgeMode,
  );
}

function normalizeBadgeStyleVariant(value: unknown): ProfileBadgeStyleVariant {
  return normalizeEnumValue(
    value,
    PROFILE_BADGE_STYLE_VARIANTS,
    DEFAULT_PROFILE_COMPOSITION.metadata.badgeStyle,
  );
}

function normalizeBadgeSeasonalTheme(value: unknown): ProfileBadgeSeasonalTheme {
  return normalizeEnumValue(
    value,
    PROFILE_BADGE_SEASONAL_THEMES,
    DEFAULT_PROFILE_COMPOSITION.metadata.badgeSeason,
  );
}

function normalizeNameTypographyStyle(value: unknown): ProfileNameTypographyStyle {
  return normalizeEnumValue(
    value,
    PROFILE_NAME_TYPOGRAPHY_STYLES,
    DEFAULT_PROFILE_COMPOSITION.metadata.nameTypography,
  );
}

function normalizeFavoriteBadgeSlugs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }

    const slug = entry.trim().toLowerCase();

    if (!slug || seen.has(slug)) {
      continue;
    }

    normalized.push(slug.slice(0, 64));
    seen.add(slug);

    if (normalized.length >= 4) {
      break;
    }
  }

  return normalized;
}

function mapLegacyCompositionBlock(value: string) {
  if (value === "hero") {
    return "identity";
  }

  if (value === "links" || value === "live") {
    return "presence";
  }

  if (value === "information") {
    return "extras";
  }

  return value;
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
  if (block === "identity") {
    return true;
  }

  const available = availability[block] ?? false;

  if (!available) {
    return false;
  }

  if (block === "about") {
    return composition.visible.about;
  }

  if (block === "presence") {
    return composition.visible.presence;
  }

  if (block === "music") {
    return composition.visible.music;
  }

  if (block === "socials") {
    return composition.visible.socials;
  }

  if (block === "showcase") {
    return composition.visible.showcase;
  }

  if (block === "projects") {
    return composition.visible.projects;
  }

  if (block === "gallery") {
    return composition.visible.gallery;
  }

  return composition.visible.extras;
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
    identity: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    about: {
      columnStart: 3,
      span: 6,
      width: "medium",
      align: "center",
      xOffset: -14,
      yOffset: -6,
    },
    presence: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 10,
      yOffset: 18,
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
    showcase: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 22,
      yOffset: 18,
    },
    projects: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 10,
      yOffset: 18,
    },
    gallery: {
      columnStart: 2,
      span: 5,
      width: "medium",
      align: "start",
      xOffset: -12,
      yOffset: 30,
    },
    extras: {
      columnStart: 7,
      span: 5,
      width: "medium",
      align: "end",
      xOffset: 12,
      yOffset: 34,
    },
  },
  cinematic: {
    identity: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    about: {
      columnStart: 2,
      span: 5,
      width: "medium",
      align: "start",
      xOffset: -24,
      yOffset: 10,
    },
    presence: {
      columnStart: 5,
      span: 7,
      width: "wide",
      align: "end",
      xOffset: 20,
      yOffset: 26,
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
    showcase: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 28,
      yOffset: 22,
    },
    projects: {
      columnStart: 4,
      span: 7,
      width: "wide",
      align: "center",
      xOffset: 18,
      yOffset: 26,
    },
    gallery: {
      columnStart: 1,
      span: 5,
      width: "medium",
      align: "start",
      xOffset: -18,
      yOffset: 36,
    },
    extras: {
      columnStart: 7,
      span: 5,
      width: "medium",
      align: "end",
      xOffset: 18,
      yOffset: 40,
    },
  },
  scattered: {
    identity: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    about: {
      columnStart: 1,
      span: 5,
      width: "medium",
      align: "start",
      xOffset: -18,
      yOffset: -2,
    },
    presence: {
      columnStart: 5,
      span: 7,
      width: "wide",
      align: "end",
      xOffset: -12,
      yOffset: 20,
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
    showcase: {
      columnStart: 2,
      span: 4,
      width: "compact",
      align: "start",
      xOffset: 14,
      yOffset: 22,
    },
    projects: {
      columnStart: 5,
      span: 7,
      width: "wide",
      align: "end",
      xOffset: -12,
      yOffset: 20,
    },
    gallery: {
      columnStart: 2,
      span: 5,
      width: "medium",
      align: "start",
      xOffset: -4,
      yOffset: 34,
    },
    extras: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 18,
      yOffset: 36,
    },
  },
  minimal: {
    identity: {
      columnStart: 3,
      span: 8,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 0,
    },
    about: {
      columnStart: 3,
      span: 6,
      width: "medium",
      align: "center",
      xOffset: 0,
      yOffset: -2,
    },
    presence: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 16,
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
    showcase: {
      columnStart: 8,
      span: 4,
      width: "compact",
      align: "end",
      xOffset: 10,
      yOffset: 14,
    },
    projects: {
      columnStart: 4,
      span: 6,
      width: "wide",
      align: "center",
      xOffset: 0,
      yOffset: 16,
    },
    gallery: {
      columnStart: 3,
      span: 5,
      width: "medium",
      align: "center",
      xOffset: 0,
      yOffset: 28,
    },
    extras: {
      columnStart: 5,
      span: 5,
      width: "medium",
      align: "center",
      xOffset: 0,
      yOffset: 32,
    },
  },
};
