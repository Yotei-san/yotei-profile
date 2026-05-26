import type { CSSProperties } from "react";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";

type IdentityBadge = {
  id: string;
  badge: {
    slug: string;
    name: string;
    icon: string;
    color: string | null;
    category: string | null;
    rarity: string | null;
  };
};

type BadgeRailTheme = {
  accent: string;
  secondary: string;
  edge: string;
  glow: string;
  aura: string;
  sheen: string;
  pulse: string;
  fillTop: string;
  fillBottom: string;
  tooltip: string;
  tooltipAccent: string;
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
}: {
  badges: IdentityBadge[];
  extraBadgeCount?: number;
  themeColor: string;
  align?: "start" | "center";
  mode?: "rail" | "showcase";
  styleVariant?: "default" | "holographic";
  seasonalTheme?: "none" | "solstice" | "lunar";
  favoriteSlugs?: string[];
}) {
  if (badges.length === 0 && extraBadgeCount <= 0) {
    return null;
  }

  return (
    <div
      className={`profile-identity-badges align-${align} mode-${mode} variant-${styleVariant} season-${seasonalTheme}`}
      role="list"
      aria-label="Profile badges"
      style={
        {
          "--profile-badge-rail-tint": withAlpha(themeColor, "30"),
          "--profile-badge-rail-soft": withAlpha(themeColor, "16"),
        } as CSSProperties
      }
    >
      <style>{`
        .profile-identity-badges {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
          width: fit-content;
          max-width: 100%;
          padding: 7px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 16% 0%, rgba(255,255,255,0.1), transparent 38%),
            linear-gradient(135deg, rgba(255,255,255,0.05), rgba(8,10,16,0.62) 52%, rgba(8,10,16,0.34)),
            linear-gradient(180deg, var(--profile-badge-rail-soft), rgba(255,255,255,0.008));
          box-shadow:
            0 12px 24px rgba(0,0,0,0.16),
            0 0 0 1px rgba(255,255,255,0.03),
            0 0 18px var(--profile-badge-rail-soft),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(10px) saturate(112%);
          -webkit-backdrop-filter: blur(10px) saturate(112%);
        }

        .profile-identity-badges::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.12), transparent 28%),
            radial-gradient(circle at 50% -20%, var(--profile-badge-rail-tint), transparent 42%);
          pointer-events: none;
          opacity: 0.82;
        }

        .profile-identity-badges.align-center {
          justify-content: center;
          margin-inline: auto;
        }

        .profile-identity-badges.mode-showcase {
          gap: 10px;
          padding: 12px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 18% 0%, rgba(255,255,255,0.16), transparent 40%),
            linear-gradient(135deg, rgba(255,255,255,0.06), rgba(8,10,16,0.72) 50%, rgba(8,10,16,0.42)),
            linear-gradient(180deg, var(--profile-badge-rail-soft), rgba(255,255,255,0.02));
        }

        .profile-identity-badge {
          --profile-badge-accent: #f8fafc;
          --profile-badge-secondary: #a5b4fc;
          --profile-badge-edge: rgba(255,255,255,0.14);
          --profile-badge-glow: rgba(255,255,255,0.18);
          --profile-badge-aura: rgba(255,255,255,0.14);
          --profile-badge-sheen: rgba(255,255,255,0.26);
          --profile-badge-pulse: 0.08;
          --profile-badge-fill-top: rgba(255,255,255,0.12);
          --profile-badge-fill-bottom: rgba(8,10,16,0.88);
          --profile-badge-tooltip: rgba(8,10,16,0.96);
          --profile-badge-tooltip-accent: rgba(255,255,255,0.08);
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          padding: 0;
          border: 1px solid var(--profile-badge-edge);
          border-radius: 14px;
          overflow: hidden;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 120%, var(--profile-badge-aura) 0%, transparent 52%),
            radial-gradient(circle at 28% 20%, rgba(255,255,255,0.16), transparent 40%),
            linear-gradient(135deg, var(--profile-badge-fill-top), rgba(255,255,255,0.04) 42%, var(--profile-badge-fill-bottom));
          box-shadow:
            0 10px 18px rgba(0,0,0,0.16),
            0 0 0 1px rgba(255,255,255,0.03),
            0 0 14px var(--profile-badge-glow),
            inset 0 1px 0 rgba(255,255,255,0.08);
          color: #f8fbff;
          outline: none;
          transition:
            transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 180ms ease,
            box-shadow 180ms ease,
            filter 180ms ease,
            width 180ms cubic-bezier(0.22, 1, 0.36, 1),
            height 180ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .profile-identity-badges.mode-showcase .profile-identity-badge {
          width: 48px;
          height: 48px;
          border-radius: 16px;
        }

        .profile-identity-badges.variant-holographic .profile-identity-badge-shell::after {
          opacity: 0.48;
          background:
            linear-gradient(
              118deg,
              transparent 0%,
              rgba(255,255,255,0.02) 22%,
              rgba(255,255,255,0.24) 42%,
              rgba(96,165,250,0.18) 50%,
              rgba(244,114,182,0.2) 58%,
              transparent 74%,
              transparent 100%
            );
        }

        .profile-identity-badges.season-solstice .profile-identity-badge {
          box-shadow:
            0 10px 18px rgba(0,0,0,0.16),
            0 0 0 1px rgba(255,255,255,0.03),
            0 0 18px rgba(244,201,122,0.22),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .profile-identity-badges.season-lunar .profile-identity-badge {
          box-shadow:
            0 10px 18px rgba(0,0,0,0.16),
            0 0 0 1px rgba(255,255,255,0.03),
            0 0 18px rgba(125,196,255,0.2),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .profile-identity-badge::before,
        .profile-identity-badge::after {
          position: absolute;
          left: 50%;
          pointer-events: none;
          opacity: 0;
          transition:
            opacity 160ms ease,
            transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .profile-identity-badge::before {
          content: "";
          bottom: calc(100% + 5px);
          transform: translate(-50%, 4px);
          border-width: 6px 6px 0 6px;
          border-style: solid;
          border-color: var(--profile-badge-tooltip) transparent transparent transparent;
        }

        .profile-identity-badge::after {
          content: attr(data-tooltip);
          bottom: calc(100% + 12px);
          transform: translate(-50%, 7px);
          padding: 8px 11px;
          border-radius: 12px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), transparent),
            linear-gradient(135deg, var(--profile-badge-tooltip-accent), var(--profile-badge-tooltip));
          border: 1px solid var(--profile-badge-edge);
          box-shadow:
            0 16px 34px rgba(0,0,0,0.32),
            0 0 18px var(--profile-badge-glow);
          color: #f8fbff;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.02em;
          z-index: 4;
        }

        .profile-identity-badge:hover::before,
        .profile-identity-badge:hover::after,
        .profile-identity-badge:focus-visible::before,
        .profile-identity-badge:focus-visible::after {
          opacity: 1;
        }

        .profile-identity-badge:hover::before,
        .profile-identity-badge:focus-visible::before,
        .profile-identity-badge:hover::after,
        .profile-identity-badge:focus-visible::after {
          transform: translate(-50%, 0);
        }

        .profile-identity-badge:hover,
        .profile-identity-badge:focus-visible {
          transform: translateY(-2px) scale(1.06);
          border-color: var(--profile-badge-accent);
          box-shadow:
            0 14px 22px rgba(0,0,0,0.18),
            0 0 0 1px rgba(255,255,255,0.06),
            0 0 20px var(--profile-badge-glow),
            inset 0 1px 0 rgba(255,255,255,0.12);
          filter: saturate(1.04);
        }

        .profile-identity-badges.mode-showcase .profile-identity-badge:hover,
        .profile-identity-badges.mode-showcase .profile-identity-badge:focus-visible,
        .profile-identity-badge.favorite {
          width: 54px;
          height: 54px;
        }

        .profile-identity-badge-shell {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .profile-identity-badge-shell::before {
          content: "";
          position: absolute;
          inset: 6px;
          clip-path: polygon(50% 0%, 79% 10%, 93% 29%, 93% 71%, 79% 90%, 50% 100%, 21% 90%, 7% 71%, 7% 29%, 21% 10%);
          background:
            radial-gradient(circle at 50% 12%, rgba(255,255,255,0.12), transparent 40%),
            linear-gradient(180deg, rgba(8,10,16,0.08), rgba(8,10,16,0.44));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          pointer-events: none;
        }

        .profile-identity-badge-shell::after {
          content: "";
          position: absolute;
          inset: -6px;
          background:
            linear-gradient(
              118deg,
              transparent 0%,
              transparent 30%,
              var(--profile-badge-sheen) 46%,
              rgba(255,255,255,0.04) 56%,
              transparent 70%,
              transparent 100%
            );
          background-size: 220% 100%;
          background-position: -180% 50%;
          opacity: 0.34;
          mix-blend-mode: screen;
          pointer-events: none;
          animation: profile-badge-sheen 6.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        .profile-identity-badge-shell > * {
          position: relative;
          z-index: 1;
        }

        .profile-identity-badge-more {
          position: relative;
          z-index: 1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #f8fbff;
        }

        @media (max-width: 640px) {
          .profile-identity-badges {
            width: 100%;
            justify-content: flex-start;
            border-radius: 22px;
          }

          .profile-identity-badge::after {
            max-width: min(74vw, 220px);
            white-space: normal;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-identity-badge,
          .profile-identity-badge::before,
          .profile-identity-badge::after,
          .profile-identity-badge-shell::after {
            transition: none !important;
            animation: none !important;
          }
        }

        @keyframes profile-badge-sheen {
          0%,
          18% {
            background-position: -180% 50%;
            opacity: 0;
          }

          30%,
          74% {
            opacity: calc(0.16 + var(--profile-badge-pulse));
          }

          100% {
            background-position: 180% 50%;
            opacity: 0;
          }
        }
      `}</style>

      {badges.map((item) => {
        const badgeTheme = getBadgeRailTheme(item.badge, themeColor);
        const isFavorite = favoriteSlugs.includes(item.badge.slug);
        const tooltip = item.badge.rarity
          ? `${item.badge.name} · ${item.badge.rarity}`
          : item.badge.name;

        return (
          <span
            key={item.id}
            className={`profile-identity-badge rarity-${item.badge.rarity || "common"} ${isFavorite ? "favorite" : ""}`}
            data-tooltip={tooltip}
            tabIndex={0}
            aria-label={tooltip}
            title={tooltip}
            role="listitem"
            style={
              {
                "--profile-badge-accent": badgeTheme.accent,
                "--profile-badge-secondary": badgeTheme.secondary,
                "--profile-badge-edge": badgeTheme.edge,
                "--profile-badge-glow": badgeTheme.glow,
                "--profile-badge-aura": badgeTheme.aura,
                "--profile-badge-sheen": badgeTheme.sheen,
                "--profile-badge-pulse": badgeTheme.pulse,
                "--profile-badge-fill-top": badgeTheme.fillTop,
                "--profile-badge-fill-bottom": badgeTheme.fillBottom,
                "--profile-badge-tooltip": badgeTheme.tooltip,
                "--profile-badge-tooltip-accent": badgeTheme.tooltipAccent,
              } as CSSProperties
            }
          >
            <span className="profile-identity-badge-shell" aria-hidden="true">
              <BadgeVisual
                slug={item.badge.slug}
                icon={item.badge.icon}
              name={item.badge.name}
              color={badgeTheme.accent}
              rarity={item.badge.rarity}
              category={item.badge.category}
              size={24}
              compact
            />
            </span>
          </span>
        );
      })}

      {extraBadgeCount > 0 ? (
        <span
          className="profile-identity-badge"
          data-tooltip={`${extraBadgeCount} more badge${extraBadgeCount === 1 ? "" : "s"}`}
          tabIndex={0}
          aria-label={`${extraBadgeCount} more badges`}
          title={`${extraBadgeCount} more badge${extraBadgeCount === 1 ? "" : "s"}`}
          role="listitem"
          style={
            {
              "--profile-badge-accent": "#eef2ff",
              "--profile-badge-secondary": themeColor,
              "--profile-badge-edge": "rgba(255,255,255,0.16)",
              "--profile-badge-glow": withAlpha(themeColor, "30"),
              "--profile-badge-aura": withAlpha(themeColor, "18"),
              "--profile-badge-sheen": "rgba(255,255,255,0.26)",
              "--profile-badge-pulse": "0.06",
              "--profile-badge-fill-top": "rgba(255,255,255,0.12)",
              "--profile-badge-fill-bottom": "rgba(8,10,16,0.84)",
              "--profile-badge-tooltip": "rgba(8,10,16,0.96)",
              "--profile-badge-tooltip-accent": withAlpha(themeColor, "16"),
            } as CSSProperties
          }
        >
          <span className="profile-identity-badge-shell" aria-hidden="true">
            <span className="profile-identity-badge-more">+{extraBadgeCount}</span>
          </span>
        </span>
      ) : null}
    </div>
  );
}

function getBadgeRailTheme(
  badge: IdentityBadge["badge"],
  fallbackColor: string,
): BadgeRailTheme {
  const accent = badge.color || fallbackColor;

  if (badge.slug === "premium") {
    return createRailTheme("#ff82c6", "#b388ff", "#170d1c", "#2b1230");
  }

  if (badge.slug === "builder") {
    return createRailTheme("#74d9ff", "#4db9ff", "#091725", "#0d2132");
  }

  if (badge.slug === "owner") {
    return createRailTheme("#f6d37d", "#ffefb0", "#2a1a08", "#3b2309");
  }

  if (badge.slug === "social-starter") {
    return createRailTheme("#72b7ff", "#3f8cff", "#0c1830", "#11203f");
  }

  if (badge.slug === "first-profile") {
    return createRailTheme("#b892ff", "#8f7cff", "#15112a", "#1d1437");
  }

  if (badge.category === "official") {
    return createRailTheme(accent, "#8be0ff", "#091822", "#102232");
  }

  if (badge.category === "premium") {
    return createRailTheme(accent, "#f0a8ff", "#1a0f1f", "#25132a");
  }

  if (badge.rarity === "legendary" || badge.rarity === "owner") {
    return createRailTheme(accent, "#ffe49a", "#231707", "#33210a");
  }

  if (badge.rarity === "epic") {
    return createRailTheme(accent, "#c5a3ff", "#18112b", "#22163a");
  }

  if (badge.rarity === "rare") {
    return createRailTheme(accent, "#8fd7ff", "#0c1730", "#102144");
  }

  return createRailTheme(accent, "#d4d8ff", "#111522", "#161c2a");
}

function createRailTheme(
  accent: string,
  secondary: string,
  fillTopBase: string,
  fillBottomBase: string,
): BadgeRailTheme {
  return {
    accent,
    secondary,
    edge: withAlpha(accent, "72"),
    glow: withAlpha(accent, "38"),
    aura: withAlpha(secondary, "24"),
    sheen: withAlpha(secondary, "3c"),
    pulse: "0.08",
    fillTop: fillTopBase,
    fillBottom: fillBottomBase,
    tooltip: "rgba(8,10,16,0.96)",
    tooltipAccent: withAlpha(secondary, "18"),
  };
}

function withAlpha(hex: string, alpha: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return `${hex}${alpha}`;
  }

  return hex;
}
