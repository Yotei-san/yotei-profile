import type { PublicSocialBlock } from "@/app/[username]/SocialPresenceSection";

export const PROFILE_COMPOSITION_BLOCKS = [
  "hero",
  "music",
  "socials",
  "live",
  "links",
  "badges",
  "stats",
] as const;

export const PROFILE_COMPOSITION_DENSITIES = [
  "compact",
  "balanced",
  "spacious",
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

export type ProfileCompositionBlock = (typeof PROFILE_COMPOSITION_BLOCKS)[number];
export type ProfileCompositionDensity = (typeof PROFILE_COMPOSITION_DENSITIES)[number];
export type ProfileCompositionLinksStyle =
  (typeof PROFILE_COMPOSITION_LINK_STYLES)[number];
export type ProfileCompositionSocialsStyle =
  (typeof PROFILE_COMPOSITION_SOCIAL_STYLES)[number];

export type ProfileComposition = {
  visible: {
    music: boolean;
    socials: boolean;
    links: boolean;
    badges: boolean;
    stats: boolean;
    live: boolean;
  };
  order: ProfileCompositionBlock[];
  density: ProfileCompositionDensity;
  linksStyle: ProfileCompositionLinksStyle;
  socialsStyle: ProfileCompositionSocialsStyle;
};

export const DEFAULT_PROFILE_COMPOSITION: ProfileComposition = {
  visible: {
    music: true,
    socials: true,
    links: true,
    badges: true,
    stats: true,
    live: true,
  },
  order: ["hero", "music", "socials", "live", "links", "badges", "stats"],
  density: "balanced",
  linksStyle: "cards",
  socialsStyle: "grid",
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

type CompositionVisibilityKey = keyof ProfileComposition["visible"];

type RenderAvailability = Record<ProfileCompositionBlock, boolean>;

export function normalizeProfileComposition(value: unknown): ProfileComposition {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  return {
    visible: normalizeVisible(candidate?.visible),
    order: normalizeOrder(candidate?.order),
    density: normalizeCompositionDensity(candidate?.density),
    linksStyle: normalizeCompositionLinksStyle(candidate?.linksStyle),
    socialsStyle: normalizeCompositionSocialsStyle(candidate?.socialsStyle),
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
    badges: normalizeVisibleFlag(candidate.badges, DEFAULT_PROFILE_COMPOSITION.visible.badges),
    stats: normalizeVisibleFlag(candidate.stats, DEFAULT_PROFILE_COMPOSITION.visible.stats),
    live: normalizeVisibleFlag(candidate.live, DEFAULT_PROFILE_COMPOSITION.visible.live),
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

  if (block === "badges") {
    return composition.visible.badges;
  }

  if (block === "stats") {
    return composition.visible.stats;
  }

  return composition.visible.live;
}
