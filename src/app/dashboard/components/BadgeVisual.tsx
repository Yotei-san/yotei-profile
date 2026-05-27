import type { CSSProperties, ReactNode } from "react";

type Props = {
  slug?: string | null;
  icon?: string | null;
  name?: string | null;
  color?: string | null;
  rarity?: string | null;
  category?: string | null;
  size?: number;
  compact?: boolean;
};

type Palette = {
  outer: string;
  inner: string;
  edge: string;
  glow: string;
  icon: string;
  accent: string;
  plate: string;
  plateShadow: string;
  halo: string;
};

type GlyphRenderer = (compact: boolean) => ReactNode;

const BADGE_GLYPHS: Record<string, GlyphRenderer> = {
  owner: (compact) => (
    <>
      <path d="m6 15.7 1.6-6.2 4.4 3.2 4.4-3.2 1.6 6.2" />
      <path d="m7.6 9.5 2.6 1.9L12 6.2l1.8 5.2 2.6-1.9" />
      <path d="M8.4 18.1h7.2" />
      <path d="M12 8.7v5.5" />
      <path d="m10 12.2 2-1.3 2 1.3" />
      <circle cx="12" cy="5.5" r={compact ? 0.95 : 1.1} fill="currentColor" stroke="none" />
    </>
  ),
  admin: () => (
    <>
      <path d="M12 4.1 18 7v4.4c0 4-2.4 6.8-6 8.5-3.6-1.7-6-4.5-6-8.5V7Z" />
      <path d="M9.5 12.2h5" />
      <path d="M12 9.7v5" />
      <path d="m8.5 9.3 1.3 1.2" />
      <path d="m15.5 9.3-1.3 1.2" />
      <path d="m8.5 15.1 1.3-1.2" />
      <path d="m15.5 15.1-1.3-1.2" />
    </>
  ),
  staff: () => (
    <>
      <path d="m12 5.3.9 1.8 2 .4-1.5 1.5.4 2.1-1.8-1-1.8 1 .4-2.1-1.5-1.5 2-.4Z" />
      <circle cx="12" cy="12.8" r="2" />
      <path d="M12 8.8v1.5" />
      <path d="M12 15.3v1.5" />
      <path d="M8.8 12.8h1.5" />
      <path d="M13.7 12.8h1.5" />
      <path d="m9.6 10.4 1 1" />
      <path d="m14.4 10.4-1 1" />
      <path d="m9.6 15.2 1-1" />
      <path d="m14.4 15.2-1-1" />
    </>
  ),
  verified: () => (
    <>
      <path d="M12 4.2 14 5.3l2.3-.1 1.1 2 1.9 1.3-.5 2.2.5 2.2-1.9 1.3-1.1 2-2.3-.1-2 1.1-2-1.1-2.3.1-1.1-2-1.9-1.3.5-2.2-.5-2.2L6.6 7.2l1.1-2 2.3.1Z" />
      <path d="m8.8 12.1 2 2 4.5-4.5" />
    </>
  ),
  premium: () => (
    <>
      <path d="m12 4.2 4.1 2.2 1.8 4-1.8 4-4.1 2.2-4.1-2.2-1.8-4 1.8-4Z" />
      <path d="m12 6.3 1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3Z" />
      <path d="M9.6 14.6 12 16l2.4-1.4" />
    </>
  ),
  supporter: () => (
    <>
      <path d="m12 18.2-4-2.8c-1.7-1.2-2.7-2.7-2.7-4.5a3.3 3.3 0 0 1 6.1-1.8A3.3 3.3 0 0 1 18.7 11c0 1.8-1 3.3-2.7 4.5Z" />
      <path d="m12 8.2.8 1.5 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3Z" />
    </>
  ),
  "early-supporter": () => (
    <>
      <path d="M5.4 15.8a6.6 6.6 0 0 1 13.2 0" />
      <path d="M4.8 18.1h14.4" />
      <path d="M12 5.2v3.6" />
      <path d="m8.9 7.4 1.4 1.4" />
      <path d="m15.1 7.4-1.4 1.4" />
      <path d="m12 10 .8 1.5 1.7.3-1.2 1.1.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.1 1.7-.3Z" />
    </>
  ),
  "first-profile": () => (
    <>
      <path d="M7.2 4.8v14.4" />
      <path d="M7.2 6.1h8.1l-1.6 2.8 1.6 2.8H7.2" />
      <path d="m15.3 13.4.7 1.4 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" />
    </>
  ),
  "first-link": () => (
    <>
      <path d="M10.2 13.8 8 16a2.7 2.7 0 1 1-3.8-3.8l2.2-2.2" />
      <path d="M13.8 10.2 16 8a2.7 2.7 0 1 1 3.8 3.8l-2.2 2.2" />
      <path d="m9.3 14.7 5.4-5.4" />
    </>
  ),
  "social-starter": () => (
    <>
      <path d="M6.4 8.7A3.7 3.7 0 0 1 10.1 5h3.6a3.7 3.7 0 0 1 3.7 3.7v2a3.6 3.6 0 0 1-3.6 3.6h-2.1l-2.6 1.8v-1.8a3.6 3.6 0 0 1-2.7-3.5Z" />
      <circle cx="16.8" cy="7.4" r="1.3" />
      <path d="M17 10.8a3.8 3.8 0 0 1-3.7 3.7" />
    </>
  ),
  "social-pro": () => (
    <>
      <circle cx="7.2" cy="7.2" r="1.7" />
      <circle cx="16.8" cy="7.2" r="1.7" />
      <circle cx="7.2" cy="16.8" r="1.7" />
      <circle cx="16.8" cy="16.8" r="1.7" />
      <circle cx="12" cy="12" r="2.1" />
      <path d="m8.5 8.5 2 2" />
      <path d="m15.5 8.5-2 2" />
      <path d="m8.5 15.5 2-2" />
      <path d="m15.5 15.5-2-2" />
    </>
  ),
  "template-creator": () => (
    <>
      <rect x="4.8" y="5.3" width="14.4" height="13.4" rx="2.4" />
      <path d="M9.1 5.3v13.4" />
      <path d="M11.2 9h4.7" />
      <path d="M11.2 12h4.7" />
      <path d="M11.2 15h3.2" />
    </>
  ),
  popular: () => (
    <>
      <path d="M12 4.8c2.5 2 4.8 4.8 4.8 7.6a4.8 4.8 0 0 1-9.6 0c0-2.8 2.3-5.6 4.8-7.6Z" />
      <path d="M10.8 13.1c.7-.6 1.1-1.4 1.1-2.3 1.7.7 2.6 1.9 2.6 3a2.3 2.3 0 1 1-4.6 0c0-.2 0-.5.1-.7Z" />
    </>
  ),
  rising: () => (
    <>
      <path d="M5.2 17.4h13.6" />
      <path d="m7.4 14.9 3.7-3.7 2.5 2.5 4.2-4.2" />
      <path d="M14.9 9.5h3.7v3.7" />
      <path d="m8.2 9.2.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2Z" />
    </>
  ),
  builder: () => (
    <>
      <path d="m8.1 7 2.4 2.4-2.5 2.5-2.4-2.4Z" />
      <path d="m10.4 9.3 3.7-3.7 2.4 2.4-3.7 3.7" />
      <path d="m12.4 13.1 5.1 5.1" />
      <path d="m8.9 14 3 3 3.9-3.3-3-3Z" />
    </>
  ),
  "music-taste": () => (
    <>
      <path d="M15.2 5.3v8.5a2 2 0 1 1-1.4-1.9V7.4l-5.4 1.3V15a2 2 0 1 1-1.4-1.9V7.5Z" />
      <path d="M17.3 8.5c1 .3 1.8 1.1 2 2.2" />
      <path d="M17 11.4c1.8.4 3 1.7 3.3 3.4" />
    </>
  ),
  streamer: () => (
    <>
      <path d="M6 9h6.6a3.9 3.9 0 0 1 3.9 3.9v1.9" />
      <path d="M6 12.5A5.5 5.5 0 0 1 11.5 7" />
      <path d="M16.2 15.9a1.6 1.6 0 1 1 3.2 0" />
      <path d="M14.2 18a3.8 3.8 0 0 1 7.6 0" />
      <path d="M4.6 16.1h5" />
    </>
  ),
  fallback: (compact) => (
    <>
      <path d="M12 4.4 17 7v4.4c0 3.7-2.1 6.4-5 8-2.9-1.6-5-4.3-5-8V7Z" />
      <path d="M10.1 8.4 12 10.2l1.9-1.8" />
      <path d="M12 10.2v4.7" />
      <path d="m9.3 14.7 2.7 1.4 2.7-1.4" />
      <path d="m12 6.2.8 1.4 1.6.2-1.2 1-.2.2" />
      <path d="m12 6.2-.8 1.4-1.6.2 1.2 1 .2.2" />
      <circle cx="12" cy="15.6" r={compact ? 0.9 : 1} fill="currentColor" stroke="none" />
    </>
  ),
};

const BADGE_ALIASES: Record<string, string> = {
  badge: "fallback",
  broadcast: "streamer",
  "broadcast-live": "streamer",
  chain: "first-link",
  "chain-link": "first-link",
  check: "verified",
  "check-shield": "verified",
  code: "builder",
  command: "admin",
  "command-shield": "admin",
  crest: "fallback",
  crown: "owner",
  "flag-spark": "first-profile",
  fire: "popular",
  flame: "popular",
  gear: "staff",
  "gear-star": "staff",
  gem: "premium",
  "gem-star": "premium",
  grid: "template-creator",
  hammer: "builder",
  "hammer-cube": "builder",
  heart: "supporter",
  "heart-gem": "supporter",
  layout: "template-creator",
  "layout-grid": "template-creator",
  link: "first-link",
  music: "music-taste",
  "music-wave": "music-taste",
  network: "social-pro",
  "network-orbit": "social-pro",
  nodes: "social-starter",
  "chat-orbit": "social-starter",
  orbit: "social-pro",
  popular: "popular",
  profile: "first-profile",
  "profile-card": "first-profile",
  shield: "admin",
  spark: "fallback",
  star: "premium",
  sunrise: "early-supporter",
  "sunrise-star": "early-supporter",
  template: "template-creator",
  tools: "staff",
  uptrend: "rising",
  verified: "verified",
  "arrow-star": "rising",
  "y-crest": "owner",
};

export default function BadgeVisual({
  slug,
  icon,
  name,
  color,
  rarity,
  category,
  size = 56,
  compact = false,
}: Props) {
  const badgeKey = resolveBadgeKey({ slug, icon, name, category });
  const palette = getBadgePalette({ slug: badgeKey, color, rarity, category });
  const ringInset = compact ? 1.5 : 2.2;
  const plateInset = compact ? 3.4 : 4.6;
  const coreInset = compact ? 6.1 : 7.8;

  return (
    <div
      aria-hidden="true"
      style={{
        ...wrapStyle,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        style={{
          ...glowStyle,
          background: `radial-gradient(circle, ${palette.halo} 0%, ${alpha(palette.halo, "00")} 70%)`,
          transform: compact ? "scale(1.1)" : "scale(1.16)",
        }}
      />
      <div
        style={{
          ...ringStyle,
          inset: `${ringInset}px`,
          background: `linear-gradient(145deg, ${palette.outer}, ${palette.inner})`,
          border: `1px solid ${palette.edge}`,
          boxShadow: `
            0 14px 28px ${alpha(palette.glow, compact ? "16" : "24")},
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -10px 16px rgba(0,0,0,0.18)
          `,
        }}
      >
        <div
          style={{
            ...foilStyle,
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "18" : "20",
            )}, rgba(255,255,255,0.02))`,
          }}
        />
        <div
          style={{
            ...plateStyle,
            inset: `${plateInset}px`,
            background: `linear-gradient(180deg, ${palette.plate}, ${palette.plateShadow})`,
            border: `1px solid ${alpha(palette.edge, compact ? "b6" : "d4")}`,
          }}
        />
        <div
          style={{
            ...crestStyle,
            borderColor: alpha(palette.edge, compact ? "d8" : "ff"),
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "22" : "2c",
            )}, rgba(7,9,16,0.94))`,
            boxShadow: `0 8px 16px ${alpha(palette.glow, compact ? "18" : "26")}`,
          }}
        />
        <div
          style={{
            ...coreStyle,
            inset: `${coreInset}px`,
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "16" : "1b",
            )}, rgba(7,9,16,0.96))`,
            border: `1px solid ${alpha(palette.edge, compact ? "d0" : "ff")}`,
          }}
        >
          <div
            style={{
              ...shineStyle,
              background: "linear-gradient(180deg, rgba(255,255,255,0.34), transparent 72%)",
            }}
          />
          <svg
            viewBox="0 0 24 24"
            style={{
              position: "relative",
              zIndex: 1,
              width: compact ? "15px" : "21px",
              height: compact ? "15px" : "21px",
              color: palette.icon,
              filter: `drop-shadow(0 2px 4px ${alpha(palette.glow, compact ? "38" : "46")})`,
              overflow: "visible",
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth={compact ? "1.95" : "1.85"}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {BADGE_GLYPHS[badgeKey]?.(compact) ?? BADGE_GLYPHS.fallback(compact)}
          </svg>
        </div>
      </div>
    </div>
  );
}

function resolveBadgeKey(input: {
  slug?: string | null;
  icon?: string | null;
  name?: string | null;
  category?: string | null;
}) {
  const candidates = [input.slug, input.icon, input.name, input.category]
    .map(normalizeBadgeToken)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (candidate in BADGE_GLYPHS) {
      return candidate;
    }

    if (candidate in BADGE_ALIASES) {
      return BADGE_ALIASES[candidate];
    }
  }

  return "fallback";
}

function normalizeBadgeToken(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function getBadgePalette(input: {
  slug: string;
  color?: string | null;
  rarity?: string | null;
  category?: string | null;
}): Palette {
  const accent = input.color || "#a1a1aa";

  if (input.slug === "owner") {
    return {
      outer: "rgba(89,56,14,0.98)",
      inner: "rgba(25,16,8,0.98)",
      edge: "#f6d37d",
      glow: "#f5bf5e",
      icon: "#fff4ca",
      accent: "#f6d37d",
      plate: "rgba(167,126,51,0.84)",
      plateShadow: "rgba(38,24,10,0.96)",
      halo: "#f8d784",
    };
  }

  if (input.slug === "premium") {
    return {
      outer: "rgba(72,24,53,0.98)",
      inner: "rgba(24,10,24,0.98)",
      edge: "#ff96d3",
      glow: "#ff9dcc",
      icon: "#fff4d9",
      accent: "#ff96d3",
      plate: "rgba(132,57,103,0.84)",
      plateShadow: "rgba(29,12,27,0.96)",
      halo: "#ff9dcc",
    };
  }

  if (input.category === "official") {
    return {
      outer: "rgba(8,31,42,0.98)",
      inner: "rgba(8,13,22,0.98)",
      edge: accent,
      glow: "#7dd3fc",
      icon: "#ebfbff",
      accent,
      plate: "rgba(28,71,95,0.84)",
      plateShadow: "rgba(8,16,27,0.96)",
      halo: "#7dd3fc",
    };
  }

  if (input.category === "premium") {
    return {
      outer: "rgba(58,22,43,0.98)",
      inner: "rgba(18,10,19,0.98)",
      edge: accent,
      glow: "#ff9dcb",
      icon: "#fff2d6",
      accent,
      plate: "rgba(122,54,96,0.84)",
      plateShadow: "rgba(21,11,25,0.96)",
      halo: "#ff9dcb",
    };
  }

  if (input.rarity === "mythic") {
    return {
      outer: "rgba(57,25,70,0.98)",
      inner: "rgba(10,12,26,0.98)",
      edge: "#f4b9ff",
      glow: "#7dd3fc",
      icon: "#fff7fe",
      accent: "#f4b9ff",
      plate: "rgba(105,55,136,0.82)",
      plateShadow: "rgba(12,15,31,0.98)",
      halo: "#c0b5ff",
    };
  }

  if (input.rarity === "legendary" || input.rarity === "owner") {
    return {
      outer: "rgba(73,48,10,0.98)",
      inner: "rgba(20,14,7,0.98)",
      edge: accent,
      glow: "#f5c153",
      icon: "#fff6dd",
      accent,
      plate: "rgba(145,105,38,0.84)",
      plateShadow: "rgba(33,20,8,0.96)",
      halo: "#f5c153",
    };
  }

  if (input.rarity === "epic") {
    return {
      outer: "rgba(53,21,59,0.98)",
      inner: "rgba(16,9,23,0.98)",
      edge: accent,
      glow: "#d392ff",
      icon: "#fbf2ff",
      accent,
      plate: "rgba(95,46,130,0.84)",
      plateShadow: "rgba(19,12,29,0.96)",
      halo: "#d392ff",
    };
  }

  if (input.rarity === "rare") {
    return {
      outer: "rgba(15,31,58,0.98)",
      inner: "rgba(8,12,22,0.98)",
      edge: accent,
      glow: "#77c6ff",
      icon: "#ecf7ff",
      accent,
      plate: "rgba(40,78,125,0.84)",
      plateShadow: "rgba(8,15,29,0.96)",
      halo: "#77c6ff",
    };
  }

  return {
    outer: "rgba(46,49,58,0.98)",
    inner: "rgba(12,13,18,0.98)",
    edge: accent,
    glow: "#c7cedb",
    icon: "#f5f7fb",
    accent,
    plate: "rgba(71,76,88,0.82)",
    plateShadow: "rgba(11,13,19,0.98)",
    halo: "#c7cedb",
  };
}

function alpha(hex: string, suffix: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return `${hex}${suffix}`;
  }

  return hex;
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const glowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  clipPath:
    "polygon(50% 0%, 78% 8%, 94% 28%, 94% 72%, 78% 92%, 50% 100%, 22% 92%, 6% 72%, 6% 28%, 22% 8%)",
  filter: "blur(12px)",
  opacity: 0.92,
};

const ringStyle: CSSProperties = {
  position: "absolute",
  clipPath:
    "polygon(50% 0%, 79% 9%, 95% 28%, 95% 72%, 79% 91%, 50% 100%, 21% 91%, 5% 72%, 5% 28%, 21% 9%)",
  display: "block",
  overflow: "hidden",
};

const foilStyle: CSSProperties = {
  position: "absolute",
  inset: "1px",
  clipPath:
    "polygon(50% 1%, 77% 10%, 92% 29%, 92% 71%, 77% 90%, 50% 99%, 23% 90%, 8% 71%, 8% 29%, 23% 10%)",
  opacity: 0.9,
  pointerEvents: "none",
};

const plateStyle: CSSProperties = {
  position: "absolute",
  clipPath:
    "polygon(50% 1%, 78% 10%, 92% 30%, 92% 70%, 78% 90%, 50% 99%, 22% 90%, 8% 70%, 8% 30%, 22% 10%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -8px 12px rgba(0,0,0,0.16)",
};

const crestStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "-1px",
  width: "34%",
  height: "24%",
  transform: "translateX(-50%)",
  clipPath: "polygon(50% 0%, 100% 42%, 82% 100%, 18% 100%, 0% 42%)",
  border: "1px solid transparent",
  pointerEvents: "none",
};

const coreStyle: CSSProperties = {
  position: "absolute",
  clipPath:
    "polygon(50% 1%, 78% 11%, 90% 31%, 90% 69%, 78% 89%, 50% 99%, 22% 89%, 10% 69%, 10% 31%, 22% 11%)",
  display: "grid",
  placeItems: "center",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const shineStyle: CSSProperties = {
  position: "absolute",
  inset: "0",
  clipPath:
    "polygon(50% 2%, 74% 10%, 83% 28%, 50% 46%, 17% 28%, 26% 10%)",
  opacity: 0.8,
  pointerEvents: "none",
};
