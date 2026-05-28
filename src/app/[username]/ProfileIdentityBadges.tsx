import type { CSSProperties } from "react";
import BadgeVisual, {
  getBadgeArtifactProfile,
} from "@/app/dashboard/components/BadgeVisual";

type IdentityBadge = {
  id: string;
  badge: {
    slug: string;
    name: string;
    icon: string;
    description: string | null;
    color: string | null;
    category: string | null;
    rarity: string | null;
  };
};

type BadgeMotionProfile = {
  animated: boolean;
  glowBoost: number;
  hoverLiftPx: number;
  hoverScale: number;
  orbitDriftPx: number;
  sheenDurationS: number;
};

type BadgeRailTheme = {
  accent: string;
  aura: string;
  base: string;
  dockGlow: string;
  edge: string;
  orbital: string;
  segment: string;
  sheen: string;
  spotlight: string;
  tooltip: string;
  tooltipEdge: string;
};

type BadgeSlotTheme = {
  accent: string;
  edge: string;
  glow: string;
  orbital: string;
  shadow: string;
  sheen: string;
  surface: string;
  tooltip: string;
  tooltipEdge: string;
};

const DEFAULT_MOTION_PROFILE: BadgeMotionProfile = {
  animated: true,
  glowBoost: 1,
  hoverLiftPx: 2,
  hoverScale: 1.02,
  orbitDriftPx: 1,
  sheenDurationS: 6.6,
};

export default function ProfileIdentityBadges({
  badges,
  extraBadgeCount = 0,
  themeColor,
  align = "start",
  mode = "rail",
  styleVariant = "default",
  seasonalTheme = "none",
  favoriteSlugs = [],
  motionProfile = DEFAULT_MOTION_PROFILE,
}: {
  badges: IdentityBadge[];
  extraBadgeCount?: number;
  themeColor: string;
  align?: "start" | "center";
  mode?: "rail" | "showcase";
  styleVariant?: "default" | "holographic";
  seasonalTheme?: "none" | "solstice" | "lunar";
  favoriteSlugs?: string[];
  motionProfile?: BadgeMotionProfile;
}) {
  if (badges.length === 0 && extraBadgeCount <= 0) {
    return null;
  }

  const favoriteSet = new Set(
    favoriteSlugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean),
  );
  const resolvedMotion = {
    ...DEFAULT_MOTION_PROFILE,
    ...motionProfile,
  };
  const artifactEntries = badges.map((item) => {
    const artifact = getBadgeArtifactProfile({
      slug: item.badge.slug,
      icon: item.badge.icon,
      name: item.badge.name,
      description: item.badge.description,
      color: item.badge.color,
      rarity: item.badge.rarity,
      category: item.badge.category,
    });
    const equipped = favoriteSet.has(item.badge.slug.trim().toLowerCase());

    return {
      item,
      artifact,
      equipped,
      slotTheme: getBadgeSlotTheme(artifact, equipped, styleVariant, seasonalTheme),
      tooltip: formatTooltip(item.badge.name, item.badge.rarity, item.badge.description ?? artifact.lore),
    };
  });
  const railTheme = getBadgeRailTheme(
    artifactEntries,
    themeColor,
    styleVariant,
    seasonalTheme,
  );

  return (
    <div
      className={[
        "profile-identity-badges",
        `align-${align}`,
        `mode-${mode}`,
        `variant-${styleVariant}`,
        `season-${seasonalTheme}`,
        resolvedMotion.animated ? "motion-live" : "motion-off",
      ].join(" ")}
      role="list"
      aria-label="Profile badges"
      style={
        {
          "--profile-badge-rail-accent": railTheme.accent,
          "--profile-badge-rail-aura": railTheme.aura,
          "--profile-badge-rail-base": railTheme.base,
          "--profile-badge-rail-edge": railTheme.edge,
          "--profile-badge-rail-glow": railTheme.dockGlow,
          "--profile-badge-rail-orbital": railTheme.orbital,
          "--profile-badge-rail-segment": railTheme.segment,
          "--profile-badge-rail-sheen": railTheme.sheen,
          "--profile-badge-rail-spotlight": railTheme.spotlight,
          "--profile-badge-tooltip": railTheme.tooltip,
          "--profile-badge-tooltip-edge": railTheme.tooltipEdge,
          "--profile-badge-lift": `${resolvedMotion.hoverLiftPx}px`,
          "--profile-badge-scale": `${resolvedMotion.hoverScale}`,
          "--profile-badge-drift": `${resolvedMotion.orbitDriftPx}px`,
          "--profile-badge-sheen-duration": `${resolvedMotion.sheenDurationS}s`,
          "--profile-badge-glow-boost": `${resolvedMotion.glowBoost}`,
        } as CSSProperties
      }
    >
      <style>{`
        .profile-identity-badges {
          position: relative;
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          width: fit-content;
          max-width: 100%;
          min-width: 0;
          padding: 14px 16px;
          border-radius: 28px;
          border: 1px solid var(--profile-badge-rail-edge);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), transparent 24%),
            radial-gradient(circle at 16% -6%, var(--profile-badge-rail-spotlight), transparent 34%),
            radial-gradient(circle at 82% 114%, var(--profile-badge-rail-glow), transparent 40%),
            linear-gradient(160deg, rgba(255,255,255,0.03), transparent 32%),
            linear-gradient(180deg, rgba(7,10,18,0.96), var(--profile-badge-rail-base));
          box-shadow:
            0 22px 44px rgba(0,0,0,0.24),
            0 0 0 1px rgba(255,255,255,0.025),
            0 0 26px var(--profile-badge-rail-glow),
            inset 0 1px 0 rgba(255,255,255,0.08);
          isolation: isolate;
          overflow: hidden;
        }

        .profile-identity-badges::before,
        .profile-identity-badges::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .profile-identity-badges::before {
          inset: 1px;
          border-radius: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.14), transparent 24%),
            radial-gradient(circle at 50% 128%, var(--profile-badge-rail-aura), transparent 44%);
          opacity: 0.82;
        }

        .profile-identity-badges::after {
          inset: 9px 14px;
          border-radius: 20px;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0 18px,
              rgba(255,255,255,0.02) 18px 19px,
              transparent 19px 40px
            ),
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          opacity: 0.52;
          mask: linear-gradient(180deg, rgba(0,0,0,0.92), transparent 92%);
        }

        .profile-identity-badges.align-center {
          justify-content: center;
          margin-inline: auto;
        }

        .profile-identity-badges.mode-showcase {
          gap: 12px;
          padding: 16px 18px;
          border-radius: 32px;
        }

        .profile-identity-badge {
          --profile-badge-accent: #f8fafc;
          --profile-badge-edge: rgba(255,255,255,0.12);
          --profile-badge-glow: rgba(255,255,255,0.18);
          --profile-badge-orbital: rgba(255,255,255,0.18);
          --profile-badge-shadow: rgba(0,0,0,0.34);
          --profile-badge-sheen: rgba(255,255,255,0.24);
          --profile-badge-surface: rgba(255,255,255,0.06);
          --profile-badge-tooltip-local: var(--profile-badge-tooltip);
          --profile-badge-tooltip-local-edge: var(--profile-badge-tooltip-edge);
          position: relative;
          z-index: 1;
          width: 58px;
          height: 58px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 0;
          padding: 0;
          background: transparent;
          color: #f8fbff;
          outline: none;
          transition:
            transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 180ms ease;
        }

        .profile-identity-badges.mode-showcase .profile-identity-badge {
          width: 66px;
          height: 66px;
        }

        .profile-identity-badge::before,
        .profile-identity-badge::after {
          content: "";
          position: absolute;
          pointer-events: none;
          transition:
            opacity 180ms ease,
            transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .profile-identity-badge::before {
          inset: 8px;
          border-radius: 20px;
          border: 1px solid var(--profile-badge-edge);
          background:
            radial-gradient(circle at 50% 112%, var(--profile-badge-glow), transparent 58%),
            radial-gradient(circle at 28% 18%, rgba(255,255,255,0.12), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.04), var(--profile-badge-surface));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 12px 22px var(--profile-badge-shadow);
          opacity: 0.92;
        }

        .profile-identity-badge::after {
          left: 50%;
          bottom: calc(100% + 12px);
          transform: translate(-50%, 8px);
          max-width: min(240px, 72vw);
          padding: 9px 11px;
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), transparent),
            linear-gradient(145deg, var(--profile-badge-tooltip-local-edge), var(--profile-badge-tooltip-local));
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 18px 30px rgba(0,0,0,0.34),
            0 0 20px var(--profile-badge-glow);
          color: #f8fbff;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.35;
          text-align: center;
          letter-spacing: 0.01em;
          white-space: normal;
          content: attr(data-tooltip);
          opacity: 0;
          z-index: 4;
        }

        .profile-identity-badge-shape {
          position: absolute;
          inset: 10px;
          opacity: 0.78;
          pointer-events: none;
        }

        .profile-identity-badge-shape::before,
        .profile-identity-badge-shape::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
        }

        .profile-identity-badge-shape::before {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), transparent 44%),
            radial-gradient(circle at 50% 120%, var(--profile-badge-orbital), transparent 52%);
          opacity: 0.88;
        }

        .profile-identity-badge-shape::after {
          background:
            linear-gradient(
              118deg,
              transparent 0%,
              transparent 34%,
              var(--profile-badge-sheen) 48%,
              transparent 62%,
              transparent 100%
            );
          background-size: 220% 100%;
          background-position: -160% 50%;
          opacity: 0.2;
          mix-blend-mode: screen;
        }

        .profile-identity-badge.frame-plate .profile-identity-badge-shape,
        .profile-identity-badge.frame-core .profile-identity-badge-shape {
          clip-path: polygon(50% 0%, 80% 12%, 96% 34%, 86% 84%, 50% 100%, 14% 84%, 4% 34%, 20% 12%);
        }

        .profile-identity-badge.frame-seal .profile-identity-badge-shape {
          clip-path: polygon(24% 0%, 76% 0%, 100% 24%, 100% 76%, 76% 100%, 24% 100%, 0% 76%, 0% 24%);
        }

        .profile-identity-badge.frame-shard .profile-identity-badge-shape {
          clip-path: polygon(24% 2%, 78% 0%, 100% 30%, 84% 100%, 18% 94%, 0% 58%);
        }

        .profile-identity-badge.frame-ring .profile-identity-badge-shape {
          clip-path: ellipse(48% 42% at 50% 50%);
        }

        .profile-identity-badge.frame-sigil .profile-identity-badge-shape {
          clip-path: circle(48% at 50% 50%);
        }

        .profile-identity-badge-core {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .profile-identity-badge.frame-ring .profile-identity-badge-core,
        .profile-identity-badge.frame-sigil .profile-identity-badge-core {
          transform: translateY(-1px);
        }

        .profile-identity-badge.equipped::before {
          border-color: color-mix(in srgb, var(--profile-badge-accent) 62%, white 12%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 12px 22px var(--profile-badge-shadow),
            0 0 calc(20px * var(--profile-badge-glow-boost)) var(--profile-badge-glow);
        }

        .profile-identity-badge.equipped .profile-identity-badge-shape::before {
          opacity: 1;
        }

        .profile-identity-badge.rarity-common::before {
          opacity: 0.78;
        }

        .profile-identity-badge.rarity-rare::before {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 12px 22px var(--profile-badge-shadow),
            0 0 12px var(--profile-badge-glow);
        }

        .profile-identity-badge.rarity-epic::before,
        .profile-identity-badge.rarity-legendary::before,
        .profile-identity-badge.rarity-owner::before,
        .profile-identity-badge.rarity-mythic::before {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 12px 22px var(--profile-badge-shadow),
            0 0 16px var(--profile-badge-glow);
        }

        .profile-identity-badge.rarity-mythic::before {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 12px 22px var(--profile-badge-shadow),
            0 0 22px var(--profile-badge-glow);
        }

        .profile-identity-badge:hover,
        .profile-identity-badge:focus-visible {
          transform: translateY(calc(var(--profile-badge-lift) * -1)) scale(var(--profile-badge-scale));
          filter: saturate(1.08) brightness(1.04);
        }

        .profile-identity-badge:hover::after,
        .profile-identity-badge:focus-visible::after {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .profile-identity-badge:hover .profile-identity-badge-shape::after,
        .profile-identity-badge:focus-visible .profile-identity-badge-shape::after {
          opacity: 0.42;
        }

        .profile-identity-badge.motion-breathe::before {
          animation: profile-badge-breathe calc(var(--profile-badge-sheen-duration) * 1.08) ease-in-out infinite;
        }

        .profile-identity-badge.motion-breathe .profile-identity-badge-shape::after {
          animation: profile-badge-sheen var(--profile-badge-sheen-duration) cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        .profile-identity-badge.motion-orbit .profile-identity-badge-core {
          animation: profile-badge-orbit calc(var(--profile-badge-sheen-duration) * 1.16) ease-in-out infinite;
        }

        .profile-identity-badge-more .profile-identity-badge-core {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f8fbff;
        }

        .profile-identity-badges.motion-off .profile-identity-badge,
        .profile-identity-badges.motion-off .profile-identity-badge::before,
        .profile-identity-badges.motion-off .profile-identity-badge::after,
        .profile-identity-badges.motion-off .profile-identity-badge-shape::after,
        .profile-identity-badges.motion-off .profile-identity-badge-core {
          animation: none !important;
          transition-duration: 120ms !important;
        }

        @media (max-width: 640px) {
          .profile-identity-badges {
            width: 100%;
            justify-content: flex-start;
            padding: 12px 13px;
            gap: 8px;
          }

          .profile-identity-badge {
            width: 52px;
            height: 52px;
          }

          .profile-identity-badges.mode-showcase .profile-identity-badge {
            width: 58px;
            height: 58px;
          }

          .profile-identity-badge::after {
            max-width: min(76vw, 210px);
            font-size: 10px;
            padding: 8px 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-identity-badge,
          .profile-identity-badge::before,
          .profile-identity-badge::after,
          .profile-identity-badge-shape::after,
          .profile-identity-badge-core {
            animation: none !important;
            transition: none !important;
          }
        }

        @keyframes profile-badge-breathe {
          0%,
          100% {
            opacity: 0.84;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes profile-badge-sheen {
          0%,
          24% {
            background-position: -170% 50%;
            opacity: 0;
          }

          40%,
          74% {
            opacity: 0.32;
          }

          100% {
            background-position: 180% 50%;
            opacity: 0;
          }
        }

        @keyframes profile-badge-orbit {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(var(--profile-badge-drift), -1px, 0);
          }
        }
      `}</style>

      {artifactEntries.map(({ item, artifact, equipped, slotTheme, tooltip }, index) => {
        const shouldBreathe = resolvedMotion.animated && artifact.rarity !== "common";
        const shouldOrbit =
          resolvedMotion.animated &&
          (artifact.frame === "ring" ||
            artifact.frame === "core" ||
            artifact.rarity === "legendary" ||
            artifact.rarity === "mythic" ||
            equipped);

        return (
          <span
            key={item.id}
            className={[
              "profile-identity-badge",
              `rarity-${artifact.rarity}`,
              `frame-${artifact.frame}`,
              equipped ? "equipped" : "",
              shouldBreathe ? "motion-breathe" : "",
              shouldOrbit ? "motion-orbit" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-tooltip={tooltip}
            tabIndex={0}
            aria-label={tooltip}
            title={tooltip}
            role="listitem"
            style={
              {
                "--profile-badge-accent": slotTheme.accent,
                "--profile-badge-edge": slotTheme.edge,
                "--profile-badge-glow": slotTheme.glow,
                "--profile-badge-orbital": slotTheme.orbital,
                "--profile-badge-shadow": slotTheme.shadow,
                "--profile-badge-sheen": slotTheme.sheen,
                "--profile-badge-surface": slotTheme.surface,
                "--profile-badge-tooltip-local": slotTheme.tooltip,
                "--profile-badge-tooltip-local-edge": slotTheme.tooltipEdge,
                animationDelay: `${index * 120}ms`,
              } as CSSProperties
            }
          >
            <span className="profile-identity-badge-shape" aria-hidden="true" />
            <span className="profile-identity-badge-core" aria-hidden="true">
              <BadgeVisual
                slug={item.badge.slug}
                icon={item.badge.icon}
                name={item.badge.name}
                description={item.badge.description}
                color={slotTheme.accent}
                rarity={item.badge.rarity}
                category={item.badge.category}
                size={mode === "showcase" ? 48 : 40}
                compact={mode !== "showcase"}
                equipped={equipped}
                animated={resolvedMotion.animated}
              />
            </span>
          </span>
        );
      })}

      {extraBadgeCount > 0 ? (
        <span
          className="profile-identity-badge profile-identity-badge-more frame-seal"
          data-tooltip={`${extraBadgeCount} more relic${extraBadgeCount === 1 ? "" : "s"}`}
          tabIndex={0}
          aria-label={`${extraBadgeCount} more badges`}
          title={`${extraBadgeCount} more badges`}
          role="listitem"
          style={
            {
              "--profile-badge-accent": railTheme.accent,
              "--profile-badge-edge": withAlpha(railTheme.accent, "70"),
              "--profile-badge-glow": railTheme.dockGlow,
              "--profile-badge-orbital": railTheme.orbital,
              "--profile-badge-shadow": "rgba(0,0,0,0.34)",
              "--profile-badge-sheen": withAlpha(railTheme.aura, "56"),
              "--profile-badge-surface": "rgba(255,255,255,0.08)",
              "--profile-badge-tooltip-local": railTheme.tooltip,
              "--profile-badge-tooltip-local-edge": railTheme.tooltipEdge,
            } as CSSProperties
          }
        >
          <span className="profile-identity-badge-shape" aria-hidden="true" />
          <span className="profile-identity-badge-core">+{extraBadgeCount}</span>
        </span>
      ) : null}
    </div>
  );
}

function getBadgeRailTheme(
  entries: Array<{
    artifact: ReturnType<typeof getBadgeArtifactProfile>;
    equipped: boolean;
  }>,
  fallbackColor: string,
  styleVariant: "default" | "holographic",
  seasonalTheme: "none" | "solstice" | "lunar",
): BadgeRailTheme {
  const topArtifact = entries.find((entry) => entry.equipped) ?? entries[0];
  const accent = normalizeHex(topArtifact?.artifact.accent ?? fallbackColor) ?? "#a78bfa";
  const mythicCount = entries.filter((entry) => entry.artifact.rarity === "mythic").length;
  const legendaryCount = entries.filter(
    (entry) =>
      entry.artifact.rarity === "legendary" || entry.artifact.rarity === "owner",
  ).length;
  const equippedCount = entries.filter((entry) => entry.equipped).length;
  const auraBase =
    mythicCount > 0
      ? "#c3f0ff"
      : legendaryCount > 0
        ? "#ffe6a8"
        : styleVariant === "holographic"
          ? "#cdb6ff"
          : accent;
  const seasonalAura =
    seasonalTheme === "solstice"
      ? "#ffd39f"
      : seasonalTheme === "lunar"
        ? "#afdbff"
        : auraBase;

  return {
    accent,
    aura: withAlpha(seasonalAura, mythicCount > 0 ? "3c" : equippedCount > 1 ? "2d" : "24"),
    base:
      styleVariant === "holographic"
        ? "rgba(9,11,22,0.96)"
        : mythicCount > 0
          ? "rgba(8,10,20,0.96)"
          : "rgba(9,11,18,0.96)",
    dockGlow: withAlpha(accent, mythicCount > 0 ? "3e" : legendaryCount > 0 ? "32" : "26"),
    edge: withAlpha(accent, "40"),
    orbital:
      styleVariant === "holographic"
        ? withAlpha(seasonalAura, "34")
        : withAlpha(accent, "20"),
    segment: withAlpha(seasonalAura, "16"),
    sheen:
      seasonalTheme === "solstice"
        ? "rgba(255,223,179,0.24)"
        : seasonalTheme === "lunar"
          ? "rgba(190,226,255,0.22)"
          : "rgba(255,255,255,0.18)",
    spotlight: withAlpha(seasonalAura, styleVariant === "holographic" ? "24" : "18"),
    tooltip: "rgba(8,10,16,0.97)",
    tooltipEdge: withAlpha(seasonalAura, "18"),
  };
}

function getBadgeSlotTheme(
  artifact: ReturnType<typeof getBadgeArtifactProfile>,
  equipped: boolean,
  styleVariant: "default" | "holographic",
  seasonalTheme: "none" | "solstice" | "lunar",
): BadgeSlotTheme {
  const accent = normalizeHex(artifact.accent) ?? "#a78bfa";
  const seasonalGlow =
    seasonalTheme === "solstice"
      ? "#ffd4a3"
      : seasonalTheme === "lunar"
        ? "#aeddff"
        : artifact.auraColor;
  const rarityGlowAlpha =
    artifact.rarity === "mythic"
      ? "66"
      : artifact.rarity === "legendary" || artifact.rarity === "owner"
        ? "56"
        : artifact.rarity === "epic"
          ? "48"
          : artifact.rarity === "rare"
            ? "3e"
            : "2c";

  return {
    accent,
    edge: withAlpha(accent, equipped ? "9a" : artifact.rarity === "common" ? "54" : "72"),
    glow: withAlpha(seasonalGlow, equipped ? "58" : rarityGlowAlpha),
    orbital: withAlpha(seasonalGlow, styleVariant === "holographic" ? "3e" : "2f"),
    shadow:
      artifact.rarity === "mythic"
        ? "rgba(3,6,18,0.48)"
        : artifact.rarity === "legendary" || artifact.rarity === "owner"
          ? "rgba(11,8,3,0.38)"
          : "rgba(0,0,0,0.32)",
    sheen:
      styleVariant === "holographic"
        ? "rgba(255,255,255,0.34)"
        : artifact.rarity === "mythic"
          ? withAlpha(artifact.auraColor, "70")
          : withAlpha(accent, "42"),
    surface:
      artifact.rarity === "common"
        ? "rgba(255,255,255,0.04)"
        : artifact.rarity === "mythic"
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.06)",
    tooltip: "rgba(8,10,16,0.97)",
    tooltipEdge: withAlpha(accent, "1c"),
  };
}

function formatTooltip(name: string, rarity: string | null, lore: string) {
  const parts = [name];

  if (rarity) {
    parts.push(capitalizeToken(rarity));
  }

  if (lore) {
    parts.push(lore);
  }

  return parts.join(" | ");
}

function capitalizeToken(value: string) {
  return value.length ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
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

function withAlpha(hex: string, alpha: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex;
}
