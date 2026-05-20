import { hasPremiumAccess } from "@/app/lib/premium";

export const DECORATION_RARITIES = [
  "common",
  "rare",
  "epic",
  "legendary",
  "limited",
  "seasonal",
  "owner",
] as const;

export const DECORATION_CATEGORIES = ["frame", "aura", "effect"] as const;

export type DecorationRarity = (typeof DECORATION_RARITIES)[number];
export type DecorationCategory = (typeof DECORATION_CATEGORIES)[number];

export type StarterDecorationDefinition = {
  name: string;
  slug: string;
  description: string;
  rarity: DecorationRarity;
  category: DecorationCategory;
  isPremium: boolean;
  isAnimated: boolean;
  previewStyle: string;
  sortOrder: number;
};

export type DecorationAccessUser = {
  role?: string | null;
  plan?: string | null;
  premiumBadge?: boolean | null;
  premiumUntil?: Date | null;
  subscriptionStatus?: string | null;
};

export type DecorationRecord = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  previewUrl: string | null;
  posterUrl: string | null;
  mediaType: string;
  overlayScale: number | null;
  overlayOffsetY: number | null;
  createdByUserId?: string | null;
};

export type DecorationCatalogItem = DecorationRecord & {
  description: string;
  rarity: DecorationRarity;
  category: DecorationCategory;
  isPremium: boolean;
  isAnimated: boolean;
  previewStyle: string;
  isStarter: boolean;
  isLocked: boolean;
  lockedReason: "premium" | "owner" | null;
};

const STARTER_DECORATIONS: StarterDecorationDefinition[] = [
  {
    name: "Neon Pulse",
    slug: "neon-pulse",
    description: "A vivid pulse ring with arcade energy around the avatar.",
    rarity: "rare",
    category: "frame",
    isPremium: false,
    isAnimated: true,
    previewStyle: "Pulse ring",
    sortOrder: 10,
  },
  {
    name: "Galaxy Orbit",
    slug: "galaxy-orbit",
    description: "Soft orbiting lights and cosmic depth with subtle motion.",
    rarity: "epic",
    category: "aura",
    isPremium: true,
    isAnimated: true,
    previewStyle: "Orbit halo",
    sortOrder: 20,
  },
  {
    name: "Void Ring",
    slug: "void-ring",
    description: "Dark contrast ring with low-light pressure and clean edges.",
    rarity: "rare",
    category: "frame",
    isPremium: false,
    isAnimated: true,
    previewStyle: "Shadow ring",
    sortOrder: 30,
  },
  {
    name: "Cyber Scanline",
    slug: "cyber-scanline",
    description: "Tech-noir scan accents with a subtle rotating signal arc.",
    rarity: "epic",
    category: "effect",
    isPremium: true,
    isAnimated: true,
    previewStyle: "Signal sweep",
    sortOrder: 40,
  },
  {
    name: "Fire Ember",
    slug: "fire-ember",
    description: "Warm ember sparks built for live energy and active profiles.",
    rarity: "legendary",
    category: "effect",
    isPremium: true,
    isAnimated: true,
    previewStyle: "Ember sparks",
    sortOrder: 50,
  },
  {
    name: "Frost Halo",
    slug: "frost-halo",
    description: "A cool translucent halo with calm icy bloom.",
    rarity: "common",
    category: "aura",
    isPremium: false,
    isAnimated: true,
    previewStyle: "Icy halo",
    sortOrder: 60,
  },
  {
    name: "Owner Crown",
    slug: "owner-crown",
    description: "Reserved crown frame for admins and owners only.",
    rarity: "owner",
    category: "frame",
    isPremium: false,
    isAnimated: true,
    previewStyle: "Crown crest",
    sortOrder: 70,
  },
  {
    name: "Minimal Glow",
    slug: "minimal-glow",
    description: "A clean edge glow for users who want polish without noise.",
    rarity: "common",
    category: "frame",
    isPremium: false,
    isAnimated: false,
    previewStyle: "Clean glow",
    sortOrder: 80,
  },
];

const STARTER_DECORATION_MAP = new Map(
  STARTER_DECORATIONS.map((item) => [item.slug, item]),
);

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function inferMediaType(url: string) {
  const lower = url.toLowerCase();
  if (lower.endsWith(".webm")) return "webm";
  if (lower.endsWith(".gif")) return "gif";
  return "image";
}

export function getStarterDecorationDefinition(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return STARTER_DECORATION_MAP.get(slug) ?? null;
}

export function isStarterDecorationSlug(slug: string | null | undefined) {
  return Boolean(getStarterDecorationDefinition(slug));
}

export function getStarterDecorations() {
  return STARTER_DECORATIONS;
}

export function canUserEquipDecoration(
  decoration: Pick<
    DecorationCatalogItem,
    "slug" | "isPremium" | "isStarter"
  >,
  user: DecorationAccessUser,
) {
  if (decoration.slug === "owner-crown") {
    return user.role === "owner" || user.role === "admin";
  }

  if (decoration.isPremium) {
    return hasPremiumAccess(user);
  }

  return true;
}

export function getDecorationLockedReason(
  decoration: Pick<
    DecorationCatalogItem,
    "slug" | "isPremium" | "isStarter"
  >,
  user: DecorationAccessUser,
) {
  if (decoration.slug === "owner-crown") {
    return user.role === "owner" || user.role === "admin" ? null : "owner";
  }

  if (decoration.isPremium && !hasPremiumAccess(user)) {
    return "premium";
  }

  return null;
}

export function toDecorationCatalogItem(
  record: DecorationRecord,
  user: DecorationAccessUser,
): DecorationCatalogItem {
  const starter = getStarterDecorationDefinition(record.slug);
  const isStarter = Boolean(starter);
  const fallbackAnimated = record.mediaType === "webm" || record.mediaType === "gif";
  const lockedReason = getDecorationLockedReason(
    {
      slug: record.slug,
      isPremium: starter?.isPremium ?? false,
      isStarter,
    },
    user,
  );

  return {
    ...record,
    description:
      starter?.description ??
      "Uploaded overlay that keeps the existing avatar decoration pipeline available.",
    rarity: starter?.rarity ?? "limited",
    category: starter?.category ?? "effect",
    isPremium: starter?.isPremium ?? false,
    isAnimated: starter?.isAnimated ?? fallbackAnimated,
    previewStyle: starter?.previewStyle ?? "Uploaded overlay",
    isStarter,
    isLocked: Boolean(lockedReason),
    lockedReason,
  };
}

export function resolveEquippedDecoration<T extends DecorationRecord>(
  decoration: T | null | undefined,
  user: DecorationAccessUser,
) {
  if (!decoration) {
    return null;
  }

  const catalogItem = toDecorationCatalogItem(decoration, user);
  return canUserEquipDecoration(catalogItem, user) ? decoration : null;
}
