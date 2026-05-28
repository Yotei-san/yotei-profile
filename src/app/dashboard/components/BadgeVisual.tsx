import { memo, useId, type CSSProperties, type ReactNode } from "react";

type Props = {
  slug?: string | null;
  icon?: string | null;
  name?: string | null;
  description?: string | null;
  color?: string | null;
  rarity?: string | null;
  category?: string | null;
  size?: number;
  compact?: boolean;
  equipped?: boolean;
  animated?: boolean;
  className?: string;
};

type BadgeArtifactRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "owner";

type BadgeArtifactFamily =
  | "founder"
  | "v1"
  | "orbital"
  | "ghost"
  | "eclipse"
  | "reactor"
  | "void"
  | "dev-verified"
  | "stream-sync"
  | "mythic-core";

type BadgeArtifactFrame =
  | "plate"
  | "shard"
  | "ring"
  | "core"
  | "seal"
  | "sigil";

type BadgeArtifactGlyph =
  | "founder"
  | "v1"
  | "orbital"
  | "ghost"
  | "eclipse"
  | "reactor"
  | "void"
  | "dev-verified"
  | "stream-sync"
  | "mythic-core";

type BadgeArtifactProfile = {
  accent: string;
  auraColor: string;
  family: BadgeArtifactFamily;
  frame: BadgeArtifactFrame;
  glyph: BadgeArtifactGlyph;
  lore: string;
  rarity: BadgeArtifactRarity;
  slug: string;
  title: string;
};

type BadgeArtifactPalette = {
  accent: string;
  backdrop: string;
  core: string;
  coreSoft: string;
  edge: string;
  energy: string;
  energySoft: string;
  glow: string;
  icon: string;
  matte: string;
  orbit: string;
  plate: string;
  shade: string;
};

type FamilyDefinition = {
  accent: string;
  auraColor: string;
  frame: BadgeArtifactFrame;
  glyph: BadgeArtifactGlyph;
  lore: string;
  title: string;
};

const FAMILY_DEFINITIONS: Record<BadgeArtifactFamily, FamilyDefinition> = {
  founder: {
    title: "Founder",
    lore: "First-wave Yotei founder relic with command-grade prestige.",
    frame: "plate",
    glyph: "founder",
    accent: "#f6d37d",
    auraColor: "#ffe7ab",
  },
  v1: {
    title: "V1",
    lore: "Launch-phase identity mark from the original Yotei wave.",
    frame: "seal",
    glyph: "v1",
    accent: "#ff91cd",
    auraColor: "#ffc5ea",
  },
  orbital: {
    title: "Orbital",
    lore: "Orbital presence seal for profiles with connected signal lines.",
    frame: "ring",
    glyph: "orbital",
    accent: "#79c9ff",
    auraColor: "#a8e3ff",
  },
  ghost: {
    title: "Ghost",
    lore: "Spectral identity fragment tuned for low-pressure, high-style presence.",
    frame: "seal",
    glyph: "ghost",
    accent: "#b7b6ff",
    auraColor: "#e3dcff",
  },
  eclipse: {
    title: "Eclipse",
    lore: "Prestige orbit caught between shadow pull and stage light.",
    frame: "ring",
    glyph: "eclipse",
    accent: "#ff9b9f",
    auraColor: "#ffd1cb",
  },
  reactor: {
    title: "Reactor",
    lore: "Energized identity core with loaded-system authority.",
    frame: "core",
    glyph: "reactor",
    accent: "#8d8bff",
    auraColor: "#bfb6ff",
  },
  void: {
    title: "Void",
    lore: "Fractured dark-signal shard with controlled singularity pressure.",
    frame: "shard",
    glyph: "void",
    accent: "#8c7dff",
    auraColor: "#cfbfff",
  },
  "dev-verified": {
    title: "Dev Verified",
    lore: "Verification seal for builders with traceable craft and signal clarity.",
    frame: "seal",
    glyph: "dev-verified",
    accent: "#79e2ff",
    auraColor: "#aff4ff",
  },
  "stream-sync": {
    title: "Stream Sync",
    lore: "Broadcast-linked presence artifact with live-state energy.",
    frame: "core",
    glyph: "stream-sync",
    accent: "#ff7ba8",
    auraColor: "#ffb0d3",
  },
  "mythic-core": {
    title: "Mythic Core",
    lore: "God-tier identity sigil shaped for impossible-looking presence.",
    frame: "sigil",
    glyph: "mythic-core",
    accent: "#f4b9ff",
    auraColor: "#a3e6ff",
  },
};

const BADGE_FAMILY_ALIASES: Record<string, BadgeArtifactFamily> = {
  owner: "founder",
  founder: "founder",
  "early-supporter": "founder",
  v1: "v1",
  premium: "reactor",
  "first-profile": "v1",
  orbital: "orbital",
  "first-link": "orbital",
  rising: "orbital",
  ghost: "ghost",
  supporter: "ghost",
  "social-starter": "ghost",
  eclipse: "eclipse",
  popular: "eclipse",
  "social-pro": "eclipse",
  reactor: "reactor",
  admin: "reactor",
  "template-creator": "reactor",
  void: "void",
  mythic: "void",
  "dev-verified": "dev-verified",
  verified: "dev-verified",
  builder: "dev-verified",
  staff: "dev-verified",
  "stream-sync": "stream-sync",
  streamer: "stream-sync",
  "music-taste": "stream-sync",
  "mythic-core": "mythic-core",
};

export function getBadgeArtifactProfile(input: {
  slug?: string | null;
  icon?: string | null;
  name?: string | null;
  description?: string | null;
  color?: string | null;
  rarity?: string | null;
  category?: string | null;
}): BadgeArtifactProfile {
  const slug = normalizeBadgeToken(input.slug) || "badge";
  const candidates = [input.slug, input.icon, input.name, input.category]
    .map(normalizeBadgeToken)
    .filter(Boolean);
  const family = resolveBadgeFamily(candidates, input.rarity, input.category, slug);
  const definition = FAMILY_DEFINITIONS[family];
  const accent = normalizeHex(input.color) ?? definition.accent;

  return {
    slug,
    family,
    frame: definition.frame,
    glyph: definition.glyph,
    title: input.name?.trim() || definition.title,
    lore: input.description?.trim() || definition.lore,
    rarity: normalizeArtifactRarity(input.rarity, slug),
    accent,
    auraColor: definition.auraColor,
  };
}

const BadgeVisual = memo(function BadgeVisual({
  slug,
  icon,
  name,
  description,
  color,
  rarity,
  category,
  size = 56,
  compact = false,
  equipped = false,
  animated = false,
  className,
}: Props) {
  const artifact = getBadgeArtifactProfile({
    slug,
    icon,
    name,
    description,
    color,
    rarity,
    category,
  });
  const palette = buildArtifactPalette(artifact);
  const uniqueId = useId().replace(/:/g, "");
  const gradientId = `badgeGradient-${uniqueId}`;
  const coreGradientId = `badgeCore-${uniqueId}`;
  const auraGradientId = `badgeAura-${uniqueId}`;
  const orbitGradientId = `badgeOrbit-${uniqueId}`;
  const strokeWidth = compact ? 1.85 : 2.15;
  const edgeWidth = compact ? 1.45 : 1.7;
  const orbitOpacity = artifact.rarity === "common" ? 0.38 : artifact.rarity === "rare" ? 0.56 : 0.78;

  return (
    <div
      aria-hidden="true"
      className={className}
      data-artifact-family={artifact.family}
      data-artifact-frame={artifact.frame}
      data-artifact-rarity={artifact.rarity}
      style={{
        ...wrapStyle,
        width: `${size}px`,
        height: `${size}px`,
        opacity: compact && artifact.rarity === "common" ? 0.96 : 1,
        transform: equipped ? "translateZ(0)" : undefined,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={palette.plate} />
            <stop offset="52%" stopColor={palette.core} />
            <stop offset="100%" stopColor={palette.shade} />
          </linearGradient>
          <linearGradient id={coreGradientId} x1="16" y1="10" x2="48" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={palette.energySoft} />
            <stop offset="100%" stopColor={palette.backdrop} />
          </linearGradient>
          <radialGradient id={auraGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.energy} stopOpacity={artifact.rarity === "common" ? 0.18 : 0.3} />
            <stop offset="72%" stopColor={palette.glow} stopOpacity={artifact.rarity === "mythic" ? 0.24 : 0.12} />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={orbitGradientId} x1="10" y1="16" x2="54" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={palette.energySoft} />
            <stop offset="50%" stopColor={palette.icon} />
            <stop offset="100%" stopColor={palette.energy} />
          </linearGradient>
        </defs>

        <ellipse
          cx="32"
          cy="34"
          rx={artifact.frame === "ring" ? 25 : artifact.frame === "sigil" ? 23 : 21}
          ry={artifact.frame === "shard" ? 20 : artifact.frame === "sigil" ? 18 : 16}
          fill={`url(#${auraGradientId})`}
          opacity={compact ? 0.76 : 0.92}
        />

        {renderFrameBackdrop(artifact.frame, palette, gradientId, compact)}
        {renderFrameEdges(artifact.frame, palette, edgeWidth, gradientId)}
        {renderFrameEnergy(artifact, palette, orbitGradientId, orbitOpacity, compact, animated)}
        {renderCenterPlate(artifact.frame, palette, coreGradientId, compact)}
        {renderRarityAccents(artifact, palette, orbitGradientId, animated, compact)}
        {renderGlyph(artifact.glyph, palette, strokeWidth, compact)}

        {artifact.rarity !== "common" ? (
          <circle
            cx="32"
            cy="32"
            r={artifact.frame === "sigil" ? 24 : 22}
            fill="none"
            stroke={palette.glow}
            strokeWidth={compact ? 0.9 : 1.05}
            strokeDasharray={artifact.frame === "ring" ? "13 11" : artifact.rarity === "mythic" ? "20 16" : "8 10"}
            strokeLinecap="round"
            opacity={artifact.rarity === "mythic" ? 0.52 : 0.24}
          />
        ) : null}
      </svg>
    </div>
  );
});

BadgeVisual.displayName = "BadgeVisual";

export default BadgeVisual;

function resolveBadgeFamily(
  candidates: string[],
  rarity: string | null | undefined,
  category: string | null | undefined,
  slug: string,
): BadgeArtifactFamily {
  for (const candidate of candidates) {
    if (candidate in FAMILY_DEFINITIONS) {
      return candidate as BadgeArtifactFamily;
    }

    if (candidate in BADGE_FAMILY_ALIASES) {
      return BADGE_FAMILY_ALIASES[candidate];
    }
  }

  const normalizedRarity = normalizeArtifactRarity(rarity, slug);

  if (normalizedRarity === "mythic") {
    return "mythic-core";
  }

  if (normalizedRarity === "legendary" || normalizedRarity === "owner") {
    return category === "official" ? "founder" : "eclipse";
  }

  if (normalizedRarity === "epic") {
    return category === "premium" ? "reactor" : "stream-sync";
  }

  if (normalizedRarity === "rare") {
    return category === "official" ? "dev-verified" : "orbital";
  }

  return "v1";
}

function normalizeArtifactRarity(
  rarity: string | null | undefined,
  slug?: string | null,
): BadgeArtifactRarity {
  const token = normalizeBadgeToken(rarity);

  if (token === "owner" || slug === "owner") {
    return "owner";
  }

  if (token === "legendary") {
    return "legendary";
  }

  if (token === "epic") {
    return "epic";
  }

  if (token === "rare") {
    return "rare";
  }

  if (token === "mythic") {
    return "mythic";
  }

  return "common";
}

function normalizeBadgeToken(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function normalizeHex(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  const shortHex = /^#([0-9a-fA-F]{3})$/.exec(trimmed);

  if (shortHex) {
    return `#${shortHex[1]
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`;
  }

  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : null;
}

function buildArtifactPalette(artifact: BadgeArtifactProfile): BadgeArtifactPalette {
  const rarity = artifact.rarity;
  const accent = artifact.accent;
  const aura = artifact.auraColor;

  if (rarity === "mythic") {
    return {
      accent,
      backdrop: "rgba(7,10,22,0.92)",
      core: withAlpha(aura, "24"),
      coreSoft: withAlpha(accent, "2f"),
      edge: withAlpha(aura, "d8"),
      energy: aura,
      energySoft: withAlpha(accent, "a8"),
      glow: withAlpha(aura, "78"),
      icon: "#fffafc",
      matte: "rgba(10,14,28,0.94)",
      orbit: withAlpha(aura, "ba"),
      plate: withAlpha(accent, "30"),
      shade: "rgba(6,8,16,0.98)",
    };
  }

  if (rarity === "legendary" || rarity === "owner") {
    return {
      accent,
      backdrop: "rgba(15,11,7,0.94)",
      core: withAlpha(aura, "1c"),
      coreSoft: withAlpha(accent, "24"),
      edge: withAlpha(aura, "c6"),
      energy: aura,
      energySoft: withAlpha(accent, "92"),
      glow: withAlpha(accent, "68"),
      icon: "#fff4d8",
      matte: "rgba(18,14,10,0.95)",
      orbit: withAlpha(aura, "96"),
      plate: withAlpha(accent, "2a"),
      shade: "rgba(10,8,6,0.98)",
    };
  }

  if (rarity === "epic") {
    return {
      accent,
      backdrop: "rgba(12,9,24,0.94)",
      core: withAlpha(aura, "22"),
      coreSoft: withAlpha(accent, "2c"),
      edge: withAlpha(aura, "bc"),
      energy: aura,
      energySoft: withAlpha(accent, "8e"),
      glow: withAlpha(accent, "62"),
      icon: "#fef6ff",
      matte: "rgba(13,10,24,0.95)",
      orbit: withAlpha(aura, "8e"),
      plate: withAlpha(accent, "24"),
      shade: "rgba(8,8,18,0.98)",
    };
  }

  if (rarity === "rare") {
    return {
      accent,
      backdrop: "rgba(8,13,26,0.94)",
      core: withAlpha(aura, "20"),
      coreSoft: withAlpha(accent, "24"),
      edge: withAlpha(aura, "af"),
      energy: aura,
      energySoft: withAlpha(accent, "7c"),
      glow: withAlpha(accent, "54"),
      icon: "#effaff",
      matte: "rgba(10,14,26,0.96)",
      orbit: withAlpha(aura, "88"),
      plate: withAlpha(accent, "1f"),
      shade: "rgba(7,11,20,0.98)",
    };
  }

  return {
    accent,
    backdrop: "rgba(11,13,20,0.94)",
    core: withAlpha(aura, "16"),
    coreSoft: withAlpha(accent, "18"),
    edge: "rgba(229,236,248,0.54)",
    energy: aura,
    energySoft: withAlpha(accent, "56"),
    glow: withAlpha(accent, "34"),
    icon: "#f4f7fb",
    matte: "rgba(13,15,22,0.96)",
    orbit: "rgba(226,232,240,0.42)",
    plate: "rgba(255,255,255,0.08)",
    shade: "rgba(7,9,16,0.98)",
  };
}

function renderFrameBackdrop(
  frame: BadgeArtifactFrame,
  palette: BadgeArtifactPalette,
  gradientId: string,
  compact: boolean,
) {
  if (frame === "ring") {
    return (
      <>
        <circle
          cx="32"
          cy="32"
          r="20.5"
          fill={palette.matte}
          stroke={palette.edge}
          strokeWidth={compact ? 2.2 : 2.8}
        />
        <circle
          cx="32"
          cy="32"
          r="16.2"
          fill={`url(#${gradientId})`}
          opacity="0.94"
        />
      </>
    );
  }

  if (frame === "sigil") {
    return (
      <>
        <circle
          cx="32"
          cy="32"
          r="19.5"
          fill={palette.backdrop}
          stroke={palette.edge}
          strokeWidth={compact ? 1.6 : 1.9}
        />
        <path
          d="M32 8.5c7.7 0 15 4.6 18.8 12.2l-4.3 1.8C43.5 16.7 38.1 13.5 32 13.5s-11.5 3.2-14.5 9l-4.3-1.8C17 13.1 24.3 8.5 32 8.5Z"
          fill={`url(#${gradientId})`}
          opacity="0.86"
        />
      </>
    );
  }

  return (
    <path
      d={getFramePath(frame)}
      fill={`url(#${gradientId})`}
      stroke={palette.edge}
      strokeWidth={compact ? 1.4 : 1.7}
      strokeLinejoin="round"
    />
  );
}

function renderFrameEdges(
  frame: BadgeArtifactFrame,
  palette: BadgeArtifactPalette,
  strokeWidth: number,
  gradientId: string,
) {
  if (frame === "ring") {
    return (
      <>
        <path
          d="M16 24.8c3.2-5.8 9.2-9.4 16-9.4 6.6 0 12.6 3.3 15.8 8.9"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.92"
        />
        <path
          d="M48.2 39.6c-3.4 5.5-9.3 8.9-16.2 8.9-6.6 0-12.5-3.1-15.9-8.4"
          fill="none"
          stroke={palette.orbit}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.84"
        />
      </>
    );
  }

  if (frame === "sigil") {
    return (
      <>
        <path
          d="M14.8 40.2C18.2 47 24.7 51.5 32 51.5c7 0 13.3-4.2 16.9-10.6"
          fill="none"
          stroke={palette.orbit}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M22.4 15.8c2.8-1.5 6-2.3 9.6-2.3 3.5 0 6.8.8 9.6 2.3"
          fill="none"
          stroke={palette.edge}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.9"
        />
      </>
    );
  }

  return (
    <path
      d={getInnerEdgePath(frame)}
      fill="none"
      stroke={palette.orbit}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity="0.8"
    />
  );
}

function renderFrameEnergy(
  artifact: BadgeArtifactProfile,
  palette: BadgeArtifactPalette,
  orbitGradientId: string,
  opacity: number,
  compact: boolean,
  animated: boolean,
) {
  const baseOpacity = animated ? opacity : opacity * 0.82;

  if (artifact.frame === "ring") {
    return (
      <>
        <ellipse
          cx="32"
          cy="32"
          rx="23"
          ry="13.6"
          fill="none"
          stroke={`url(#${orbitGradientId})`}
          strokeWidth={compact ? 1.3 : 1.55}
          strokeDasharray="18 10"
          strokeLinecap="round"
          opacity={baseOpacity}
          transform="rotate(-18 32 32)"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="13.8"
          ry="23.2"
          fill="none"
          stroke={palette.orbit}
          strokeWidth={compact ? 0.95 : 1.2}
          strokeDasharray="10 11"
          strokeLinecap="round"
          opacity={baseOpacity * 0.88}
          transform="rotate(18 32 32)"
        />
      </>
    );
  }

  if (artifact.frame === "core") {
    return (
      <>
        <path
          d="M32 16v6M32 42v6M18 32h6M40 32h6"
          fill="none"
          stroke={palette.orbit}
          strokeWidth={compact ? 1.05 : 1.3}
          strokeLinecap="round"
          opacity={baseOpacity}
        />
        <circle
          cx="32"
          cy="32"
          r="12.2"
          fill="none"
          stroke={`url(#${orbitGradientId})`}
          strokeWidth={compact ? 1.15 : 1.45}
          strokeDasharray="7 6"
          opacity={baseOpacity}
        />
      </>
    );
  }

  if (artifact.frame === "shard") {
    return (
      <path
        d="M16 24.5 27.5 14l19 4.5M20.5 43.5 35.5 49l11-10"
        fill="none"
        stroke={palette.orbit}
        strokeWidth={compact ? 1.1 : 1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={baseOpacity}
      />
    );
  }

  return (
    <path
      d="M21 22.5h22M18.6 31.8h26.8M23 41.3h18"
      fill="none"
      stroke={palette.orbit}
      strokeWidth={compact ? 0.95 : 1.15}
      strokeLinecap="round"
      opacity={baseOpacity * 0.82}
    />
  );
}

function renderCenterPlate(
  frame: BadgeArtifactFrame,
  palette: BadgeArtifactPalette,
  gradientId: string,
  compact: boolean,
) {
  if (frame === "ring") {
    return (
      <circle
        cx="32"
        cy="32"
        r="12.4"
        fill={`url(#${gradientId})`}
        stroke={palette.edge}
        strokeWidth={compact ? 1.15 : 1.35}
      />
    );
  }

  if (frame === "sigil") {
    return (
      <path
        d="M32 19.5 42 25.4v12.7L32 44l-10-5.9V25.4Z"
        fill={`url(#${gradientId})`}
        stroke={palette.edge}
        strokeWidth={compact ? 1.05 : 1.25}
        strokeLinejoin="round"
        opacity="0.92"
      />
    );
  }

  if (frame === "shard") {
    return (
      <path
        d="M30 16.8 43.8 22l-2.8 20L24 47l-5.8-11.8 3.7-14.5Z"
        fill={`url(#${gradientId})`}
        stroke={palette.edge}
        strokeWidth={compact ? 1.05 : 1.25}
        strokeLinejoin="round"
        opacity="0.94"
      />
    );
  }

  return (
    <path
      d={frame === "core" ? "M32 18 42.5 24v16L32 46l-10.5-6V24Z" : "M32 18.8 44.4 25.6v12.8L32 45.2l-12.4-6.8V25.6Z"}
      fill={`url(#${gradientId})`}
      stroke={palette.edge}
      strokeWidth={compact ? 1.05 : 1.25}
      strokeLinejoin="round"
      opacity="0.94"
    />
  );
}

function renderRarityAccents(
  artifact: BadgeArtifactProfile,
  palette: BadgeArtifactPalette,
  gradientId: string,
  animated: boolean,
  compact: boolean,
) {
  if (artifact.rarity === "common") {
    return (
      <path
        d="M24.5 46.5h15"
        fill="none"
        stroke={palette.glow}
        strokeWidth={compact ? 0.8 : 0.95}
        strokeLinecap="round"
        opacity="0.45"
      />
    );
  }

  if (artifact.rarity === "rare") {
    return (
      <circle
        cx="32"
        cy="32"
        r="8.4"
        fill="none"
        stroke={palette.glow}
        strokeWidth={compact ? 0.85 : 1.05}
        strokeDasharray="4 5"
        opacity={animated ? 0.64 : 0.5}
      />
    );
  }

  if (artifact.rarity === "epic") {
    return (
      <path
        d="M20.5 20.8c3.3-3.1 7.3-4.8 11.5-4.8 4.2 0 8.2 1.7 11.5 4.8M22 43.2C25 46 28.7 47.6 32 47.6c3.3 0 7-1.6 10-4.4"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={compact ? 1.05 : 1.25}
        strokeLinecap="round"
        opacity={animated ? 0.82 : 0.68}
      />
    );
  }

  if (artifact.rarity === "legendary" || artifact.rarity === "owner") {
    return (
      <path
        d="M17.5 31.8h29M22 17.5l20 29"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={compact ? 0.95 : 1.15}
        strokeLinecap="round"
        opacity={animated ? 0.84 : 0.7}
      />
    );
  }

  return (
    <>
      <circle
        cx="32"
        cy="32"
        r="17.2"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={compact ? 0.95 : 1.15}
        strokeDasharray="3 7"
        strokeLinecap="round"
        opacity={animated ? 0.9 : 0.72}
      />
      <path
        d="M24.8 15.4h14.4M21.2 48.6h21.6"
        fill="none"
        stroke={palette.glow}
        strokeWidth={compact ? 0.95 : 1.1}
        strokeLinecap="round"
        opacity="0.74"
      />
    </>
  );
}

function renderGlyph(
  glyph: BadgeArtifactGlyph,
  palette: BadgeArtifactPalette,
  strokeWidth: number,
  compact: boolean,
) {
  return (
    <g
      fill="none"
      stroke={palette.icon}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.98"
    >
      {GLYPH_RENDERERS[glyph](palette, compact)}
    </g>
  );
}

const GLYPH_RENDERERS: Record<
  BadgeArtifactGlyph,
  (palette: BadgeArtifactPalette, compact: boolean) => ReactNode
> = {
  founder: () => (
    <>
      <path d="M23 22h8l1 3.3 1-3.3h8L34 34v8.4h-4V34Z" />
      <path d="m24.5 18.4 3.5 3.6L32 18l4 4 3.5-3.6" />
      <path d="M26.5 44.2h11" />
    </>
  ),
  v1: () => (
    <>
      <path d="m22.5 20.5 8.2 22 8.3-22" />
      <path d="M40.5 21v22" />
      <path d="M36.7 42h7.6" />
    </>
  ),
  orbital: () => (
    <>
      <circle cx="32" cy="32" r="4.3" />
      <ellipse cx="32" cy="32" rx="12.5" ry="7.1" transform="rotate(-18 32 32)" />
      <path d="M24.4 21.6 19.8 17M43.4 44.4l4.5 4.4" />
    </>
  ),
  ghost: () => (
    <>
      <path d="M32 19v24" />
      <path d="M25 24.5c2-3 4.3-4.5 7-4.5 2.6 0 4.9 1.5 7 4.5" />
      <path d="M24.5 39.2c2.2 3 4.7 4.6 7.5 4.6s5.3-1.6 7.5-4.6" />
      <path d="M27.6 31.6h8.8" />
    </>
  ),
  eclipse: () => (
    <>
      <path d="M37.8 20.5c-2.1-1.4-4.2-2-6.2-2-5.8 0-10.4 4.7-10.4 10.5s4.6 10.5 10.4 10.5c2 0 4.1-.6 6.2-2-1.3 3.7-4.9 6.4-9.1 6.4-5.5 0-10-4.6-10-10.4s4.5-10.4 10-10.4c4.2 0 7.8 2.6 9.1 6.4Z" />
      <path d="M40.5 25.2 46 24M40.5 38.7l5.5 1.2" />
    </>
  ),
  reactor: () => (
    <>
      <path d="M32 21.5 39.8 26v9.2L32 39.7l-7.8-4.5V26Z" />
      <circle cx="32" cy="30.6" r="2.4" />
      <path d="M32 16.8v3.6M32 40.8v4M19.8 30.6h3.7M40.5 30.6h3.7" />
    </>
  ),
  void: () => (
    <>
      <path d="M25 18.8 41.4 24 37 45 22.8 40.2Z" />
      <path d="M33 20.8 28.2 41.8" />
      <path d="M23.5 31.8h8.6" />
    </>
  ),
  "dev-verified": () => (
    <>
      <path d="M24 22.6h8.2L32 26l-.2 16.2" />
      <path d="m35.4 33.4 3.1 3.2 5.5-6.1" />
      <path d="M22.5 42.4h10" />
    </>
  ),
  "stream-sync": (palette, compact) => (
    <>
      <path d="M22.5 34.2c2.5-5.8 6.2-8.7 11.1-8.7 3.4 0 6.1 1.3 8.4 4" />
      <path d="M23.5 39.8c2.1-3.5 4.8-5.2 8.1-5.2 2.4 0 4.6 1 6.6 3" />
      <circle cx="42.8" cy="28.8" r={compact ? 1.6 : 1.9} fill={palette.icon} stroke="none" />
      <circle cx="39.2" cy="37.2" r={compact ? 1.2 : 1.5} fill={palette.icon} stroke="none" />
    </>
  ),
  "mythic-core": () => (
    <>
      <path d="M32 18.6 41 23.8v6.4L32 35.4l-9-5.2v-6.4Z" />
      <path d="M32 35.4V45" />
      <path d="M25.6 41.2 32 45l6.4-3.8" />
      <path d="M21.2 19.6 32 13l10.8 6.6" />
    </>
  ),
};

function getFramePath(frame: BadgeArtifactFrame) {
  if (frame === "plate") {
    return "M32 6.5 49.5 16 55.2 32 49.5 48 32 57.5 14.5 48 8.8 32 14.5 16Z";
  }

  if (frame === "shard") {
    return "M19.2 9.4 43.8 8.3 55.4 24.6 47.8 54.6 22 57.8 9.4 36.2Z";
  }

  if (frame === "core") {
    return "M32 8.6 46.8 16.9 51.5 32 46.8 47.1 32 55.4 17.2 47.1 12.5 32 17.2 16.9Z";
  }

  if (frame === "seal") {
    return "M21.5 8.6h21l12 11.7v23.4L42.5 55.4h-21L9.5 43.7V20.3Z";
  }

  return "M32 10 50 20 54 32 50 44 32 54 14 44 10 32 14 20Z";
}

function getInnerEdgePath(frame: BadgeArtifactFrame) {
  if (frame === "plate") {
    return "M32 14 43.8 20.4 47.6 32 43.8 43.6 32 50 20.2 43.6 16.4 32 20.2 20.4Z";
  }

  if (frame === "shard") {
    return "M22.8 15.5 40.6 15 48.8 26.5 43.3 49 24.7 51.6 15.6 35.5Z";
  }

  if (frame === "core") {
    return "M32 15.8 41.7 21.3 44.8 32 41.7 42.7 32 48.2 22.3 42.7 19.2 32 22.3 21.3Z";
  }

  if (frame === "seal") {
    return "M24.4 15.4h15.2l8.7 8.4v16.4l-8.7 8.4H24.4l-8.7-8.4V23.8Z";
  }

  return "M32 16 43.2 22.4 46 32 43.2 41.6 32 48 20.8 41.6 18 32 20.8 22.4Z";
}

function withAlpha(hex: string, alpha: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex;
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  pointerEvents: "none",
};
