import type { CSSProperties } from "react";

type Props = {
  slug: string;
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
};

export default function BadgeVisual({
  slug,
  color,
  rarity,
  category,
  size = 56,
  compact = false,
}: Props) {
  const palette = getBadgePalette({ slug, color, rarity, category });
  const ringInset = compact ? 2 : 3;
  const coreInset = compact ? 7 : 9;

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
          background: `radial-gradient(circle, ${palette.glow} 0%, ${alpha(
            palette.glow,
            "00"
          )} 70%)`,
          transform: compact ? "scale(1.08)" : "scale(1.12)",
        }}
      />
      <div
        style={{
          ...ringStyle,
          inset: `${ringInset}px`,
          background: `linear-gradient(145deg, ${palette.outer}, ${palette.inner})`,
          border: `1px solid ${palette.edge}`,
          boxShadow: `0 14px 28px ${alpha(palette.glow, compact ? "16" : "24")}`,
        }}
      >
        <div
          style={{
            ...coreStyle,
            inset: `${coreInset}px`,
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "16" : "1b"
            )}, rgba(7,9,16,0.96))`,
            border: `1px solid ${alpha(palette.edge, compact ? "d0" : "ff")}`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              width: compact ? "16px" : "20px",
              height: compact ? "16px" : "20px",
              color: palette.icon,
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {renderBadgeGlyph(slug)}
          </svg>
        </div>
      </div>
    </div>
  );
}

function renderBadgeGlyph(slug: string) {
  switch (slug) {
    case "owner":
      return (
        <>
          <path d="M5 17.5 6.5 8 12 12l5.5-4 1.5 9.5Z" />
          <path d="M7.5 19h9" />
          <circle cx="6.5" cy="7" r="1" />
          <circle cx="12" cy="5.5" r="1" />
          <circle cx="17.5" cy="7" r="1" />
        </>
      );
    case "admin":
      return (
        <>
          <path d="M12 3 18 6v5.2c0 4.1-2.7 7-6 8.8-3.3-1.8-6-4.7-6-8.8V6Z" />
          <path d="M9.4 11.8 11 13.4l3.8-3.8" />
        </>
      );
    case "staff":
      return (
        <>
          <path d="M8.5 6.5 6 9l2.5 2.5" />
          <path d="M15.5 6.5 18 9l-2.5 2.5" />
          <path d="m13 5-2 8" />
          <path d="M7.5 17h9" />
        </>
      );
    case "verified":
      return (
        <>
          <path d="M12 3.8 14.2 5l2.5-.1 1.1 2.2 2 1.4-.6 2.4.6 2.4-2 1.4-1.1 2.2-2.5-.1L12 18.2l-2.2-1.2-2.5.1-1.1-2.2-2-1.4.6-2.4-.6-2.4 2-1.4 1.1-2.2 2.5.1Z" />
          <path d="m8.8 11.9 2.1 2.1 4.3-4.3" />
        </>
      );
    case "premium":
      return (
        <>
          <path d="m12 3.8 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.1l5-.7Z" />
        </>
      );
    case "supporter":
      return (
        <>
          <path d="M12 19s-6.5-4.1-6.5-9A3.5 3.5 0 0 1 12 7.8 3.5 3.5 0 0 1 18.5 10c0 4.9-6.5 9-6.5 9Z" />
        </>
      );
    case "early-supporter":
      return (
        <>
          <path d="M5 15.5a7 7 0 0 1 14 0" />
          <path d="M12 5v4" />
          <path d="m8.5 8.2 1.8 2" />
          <path d="m15.5 8.2-1.8 2" />
          <path d="M4.5 18h15" />
        </>
      );
    case "first-profile":
      return (
        <>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <circle cx="12" cy="10" r="2.2" />
          <path d="M8.5 15.5c1.1-1.6 2.2-2.4 3.5-2.4s2.4.8 3.5 2.4" />
        </>
      );
    case "first-link":
      return (
        <>
          <path d="M10 14 8.1 15.9a2.8 2.8 0 1 1-4-4L6 10" />
          <path d="M14 10 15.9 8.1a2.8 2.8 0 1 1 4 4L18 14" />
          <path d="m9 15 6-6" />
        </>
      );
    case "social-starter":
      return (
        <>
          <circle cx="7" cy="12" r="2" />
          <circle cx="17" cy="8" r="2" />
          <circle cx="17" cy="16" r="2" />
          <path d="M8.9 11.2 15.1 8.8" />
          <path d="M8.9 12.8 15.1 15.2" />
        </>
      );
    case "social-pro":
      return (
        <>
          <circle cx="7" cy="7" r="1.8" />
          <circle cx="17" cy="7" r="1.8" />
          <circle cx="7" cy="17" r="1.8" />
          <circle cx="17" cy="17" r="1.8" />
          <circle cx="12" cy="12" r="2" />
          <path d="M8.4 8.4 10.6 10.6" />
          <path d="M15.6 8.4 13.4 10.6" />
          <path d="M8.4 15.6 10.6 13.4" />
          <path d="M15.6 15.6 13.4 13.4" />
        </>
      );
    case "template-creator":
      return (
        <>
          <rect x="4.5" y="5" width="15" height="14" rx="2.5" />
          <path d="M9 5v14" />
          <path d="M10.8 9h5.2" />
          <path d="M10.8 12h4.2" />
          <path d="M10.8 15h3.4" />
        </>
      );
    case "popular":
      return (
        <>
          <path d="M2.8 12s3.5-5 9.2-5 9.2 5 9.2 5-3.5 5-9.2 5-9.2-5-9.2-5Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      );
    case "rising":
      return (
        <>
          <path d="M5 17c1.8-3.4 3.8-5.4 6-6 1.6-.4 2.8.1 4 .9 1 .7 1.8 1.5 3 1.6" />
          <path d="m14 7 5 1-1 5" />
          <path d="m18.5 8.4-5.1 5.1" />
        </>
      );
    case "builder":
      return (
        <>
          <path d="M8.2 7.5 5 10.8l3.2 3.2" />
          <path d="m15.8 7.5 3.2 3.3-3.2 3.2" />
          <path d="m13 5.5-2.2 11" />
        </>
      );
    case "music-taste":
      return (
        <>
          <path d="M15.5 5v9.2a2.3 2.3 0 1 1-1.6-2.2V7.2l-6 1.4v7.1a2.3 2.3 0 1 1-1.6-2.2V7.3Z" />
        </>
      );
    case "streamer":
      return (
        <>
          <path d="M6 8.5h8a4 4 0 0 1 4 4V16" />
          <path d="M6 12a6 6 0 0 1 6-6" />
          <circle cx="17.5" cy="16.5" r="2.2" />
          <path d="M4.5 16.5h5" />
        </>
      );
    default:
      return (
        <>
          <circle cx="12" cy="12" r="6" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </>
      );
  }
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
    };
  }

  if (input.rarity === "legendary") {
    return {
      outer: "rgba(73,48,10,0.98)",
      inner: "rgba(20,14,7,0.98)",
      edge: accent,
      glow: "#f5c153",
      icon: "#fff6dd",
      accent,
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
    };
  }

  return {
    outer: "rgba(46,49,58,0.98)",
    inner: "rgba(12,13,18,0.98)",
    edge: accent,
    glow: "#c7cedb",
    icon: "#f5f7fb",
    accent,
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
  borderRadius: "999px",
  filter: "blur(12px)",
  opacity: 0.92,
};

const ringStyle: CSSProperties = {
  position: "absolute",
  borderRadius: "999px",
  display: "block",
};

const coreStyle: CSSProperties = {
  position: "absolute",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};
