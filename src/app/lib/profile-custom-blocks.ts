export const PROFILE_CUSTOM_BLOCK_TYPES = [
  "quote",
  "text-strip",
  "divider",
  "mood",
  "image-card",
  "status-banner",
] as const;

export const PROFILE_CUSTOM_BLOCK_ALIGNMENTS = [
  "start",
  "center",
  "end",
] as const;

export const PROFILE_CUSTOM_BLOCK_WIDTHS = ["compact", "normal"] as const;

export const MAX_PROFILE_CUSTOM_BLOCKS = 6;

export type ProfileCustomBlockType = (typeof PROFILE_CUSTOM_BLOCK_TYPES)[number];
export type ProfileCustomBlockAlignment =
  (typeof PROFILE_CUSTOM_BLOCK_ALIGNMENTS)[number];
export type ProfileCustomBlockWidth = (typeof PROFILE_CUSTOM_BLOCK_WIDTHS)[number];

export type ProfileCustomBlock = {
  id: string;
  type: ProfileCustomBlockType;
  visible: boolean;
  alignment: ProfileCustomBlockAlignment;
  width: ProfileCustomBlockWidth;
  glow: boolean;
  transparency: boolean;
  accentColor: string | null;
  text: string | null;
  secondaryText: string | null;
  imageUrl: string | null;
  linkUrl?: string | null;
};

export const PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS = [
  {
    value: "quote",
    name: "Quote",
    description: "Short atmospheric quote text.",
  },
  {
    value: "text-strip",
    name: "Text strip",
    description: "Single-line floating text insert.",
  },
  {
    value: "divider",
    name: "Divider",
    description: "A minimal separator or glow line.",
  },
  {
    value: "mood",
    name: "Mood",
    description: "Small ambient descriptor card.",
  },
  {
    value: "image-card",
    name: "Image card",
    description: "Compact image panel with optional caption.",
  },
  {
    value: "status-banner",
    name: "Status banner",
    description: "Slim banner-style message strip.",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileCustomBlockType;
  name: string;
  description: string;
}>;

export const PROFILE_CUSTOM_BLOCK_ALIGNMENT_OPTIONS = [
  { value: "start", name: "Left" },
  { value: "center", name: "Center" },
  { value: "end", name: "Right" },
] as const satisfies ReadonlyArray<{
  value: ProfileCustomBlockAlignment;
  name: string;
}>;

export const PROFILE_CUSTOM_BLOCK_WIDTH_OPTIONS = [
  { value: "compact", name: "Compact" },
  { value: "normal", name: "Normal" },
] as const satisfies ReadonlyArray<{
  value: ProfileCustomBlockWidth;
  name: string;
}>;

export const DEFAULT_PROFILE_CUSTOM_BLOCK_TYPE: ProfileCustomBlockType = "quote";

export function normalizeProfileCustomBlocks(value: unknown): ProfileCustomBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .slice(0, MAX_PROFILE_CUSTOM_BLOCKS)
    .map((entry, index) => normalizeProfileCustomBlock(entry, index));

  return normalized.filter(
    (entry): entry is ProfileCustomBlock => entry !== null,
  );
}

export function normalizeProfileCustomBlockType(
  value: unknown,
): ProfileCustomBlockType {
  return normalizeEnumValue(
    value,
    PROFILE_CUSTOM_BLOCK_TYPES,
    DEFAULT_PROFILE_CUSTOM_BLOCK_TYPE,
  );
}

export function normalizeProfileCustomBlockAlignment(
  value: unknown,
): ProfileCustomBlockAlignment {
  return normalizeEnumValue(
    value,
    PROFILE_CUSTOM_BLOCK_ALIGNMENTS,
    "center",
  );
}

export function normalizeProfileCustomBlockWidth(
  value: unknown,
) {
  return normalizeEnumValue(value, PROFILE_CUSTOM_BLOCK_WIDTHS, "normal");
}

export function getProfileCustomBlockTypeMeta(type: ProfileCustomBlockType) {
  return (
    PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS.find((option) => option.value === type) ??
    PROFILE_CUSTOM_BLOCK_TYPE_OPTIONS[0]
  );
}

export function createProfileCustomBlockDraft(
  type: ProfileCustomBlockType,
  id: string,
): ProfileCustomBlock {
  return {
    id,
    type,
    visible: true,
    alignment: type === "text-strip" || type === "divider" ? "center" : "start",
    width: type === "divider" || type === "status-banner" ? "normal" : "compact",
    glow: type === "divider" || type === "status-banner",
    transparency: true,
    accentColor: null,
    text: defaultBlockText(type),
    secondaryText: defaultBlockSecondaryText(type),
    imageUrl: null,
    linkUrl: null,
  };
}

export function blockSupportsSecondaryText(type: ProfileCustomBlockType) {
  return (
    type === "text-strip" ||
    type === "mood" ||
    type === "status-banner" ||
    type === "image-card"
  );
}

export function blockSupportsImage(type: ProfileCustomBlockType) {
  return (
    type === "text-strip" ||
    type === "mood" ||
    type === "status-banner" ||
    type === "image-card"
  );
}

function normalizeProfileCustomBlock(
  value: unknown,
  index: number,
): ProfileCustomBlock | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const type = normalizeProfileCustomBlockType(candidate.type);

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id.trim().slice(0, 64)
        : `custom-${index + 1}`,
    type,
    visible: candidate.visible !== false,
    alignment: normalizeProfileCustomBlockAlignment(candidate.alignment),
    width: normalizeProfileCustomBlockWidth(candidate.width),
    glow: Boolean(candidate.glow),
    transparency: Boolean(candidate.transparency),
    accentColor: normalizeOptionalHexColor(candidate.accentColor),
    text: normalizeBlockText(candidate.text, 220),
    secondaryText: blockSupportsSecondaryText(type)
      ? normalizeBlockText(candidate.secondaryText, 140)
      : null,
    imageUrl: blockSupportsImage(type)
      ? sanitizeHttpUrl(candidate.imageUrl)
      : null,
    linkUrl:
      type === "divider" || type === "quote"
        ? null
        : sanitizeHttpUrl(candidate.linkUrl ?? candidate.url ?? candidate.href),
  } satisfies ProfileCustomBlock;
}

function defaultBlockText(type: ProfileCustomBlockType) {
  if (type === "quote") {
    return "some nights the profile is the room";
  }

  if (type === "text-strip") {
    return "building quietly in the background";
  }

  if (type === "mood") {
    return "soft static";
  }

  if (type === "status-banner") {
    return "currently in a deep focus window";
  }

  return null;
}

function defaultBlockSecondaryText(type: ProfileCustomBlockType) {
  if (type === "text-strip") {
    return "small profile detail";
  }

  if (type === "mood") {
    return "late-night clarity";
  }

  if (type === "status-banner") {
    return "responses may be slow";
  }

  if (type === "image-card") {
    return "caption";
  }

  return null;
}

function normalizeBlockText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const collapsed = value.replace(/\s+/g, " ").trim();

  return collapsed ? collapsed.slice(0, maxLength) : null;
}

function normalizeOptionalHexColor(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const shortHexMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed);

  if (shortHexMatch) {
    return `#${shortHexMatch[1]
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`;
  }

  return /^#([0-9a-fA-F]{6})$/.test(trimmed) ? trimmed : null;
}

function sanitizeHttpUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
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
