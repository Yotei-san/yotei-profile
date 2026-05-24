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
  const ringInset = compact ? 1.5 : 2.5;
  const coreInset = compact ? 6.5 : 8.5;

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
            ...foilStyle,
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "18" : "20"
            )}, rgba(255,255,255,0.02))`,
          }}
        />
        <div
          style={{
            ...crestStyle,
            borderColor: alpha(palette.edge, compact ? "d8" : "ff"),
            background: `linear-gradient(180deg, ${alpha(
              palette.accent,
              compact ? "22" : "2c"
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
              compact ? "16" : "1b"
            )}, rgba(7,9,16,0.96))`,
            border: `1px solid ${alpha(palette.edge, compact ? "d0" : "ff")}`,
          }}
        >
          <div
            style={{
              ...shineStyle,
              background: `linear-gradient(180deg, rgba(255,255,255,0.34), transparent 72%)`,
            }}
          />
          <svg
            viewBox="0 0 24 24"
            style={{
              position: "relative",
              zIndex: 1,
              width: compact ? "14px" : "20px",
              height: compact ? "14px" : "20px",
              color: palette.icon,
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth={compact ? "2.05" : "1.9"}
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
          <path d="M5.2 17.5 6.9 8.6 12 12l5.1-3.4 1.7 8.9Z" />
          <path d="M6.9 8.6 9.3 10.9 12 6l2.7 4.9 2.4-2.3" />
          <path d="M7.4 19h9.2" />
          <circle cx="12" cy="6" r="0.95" fill="currentColor" stroke="none" />
        </>
      );
    case "admin":
      return (
        <>
          <path d="M12 3.2 18 6.3v4.8c0 4.2-2.6 7.2-6 9-3.4-1.8-6-4.8-6-9V6.3Z" />
          <circle cx="12" cy="11.2" r="2.1" />
          <path d="m12 7.8.8 1.5 1.7.2-1.2 1.1.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.1 1.7-.2Z" />
        </>
      );
    case "staff":
      return (
        <>
          <path d="M12 3.5 17.7 6v4.8c0 3.7-2.2 6.4-5.7 8.2-3.5-1.8-5.7-4.5-5.7-8.2V6Z" />
          <circle cx="12" cy="11" r="2.1" />
          <path d="M12 7.1v1.4" />
          <path d="M12 13.5v1.4" />
          <path d="M8.8 11h1.4" />
          <path d="M13.8 11h1.4" />
          <path d="m9.7 8.7 1 1" />
          <path d="m13.3 12.3 1 1" />
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
          <path d="m12 3.7 4 2 1.9 4.3-1.9 4.2-4 2-4-2-1.9-4.2L8 5.7Z" />
          <path d="m12 6.5 1.2 2.3 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4Z" />
        </>
      );
    case "supporter":
      return (
        <>
          <path d="m12 18.5-3.6-2.5C6.4 14.5 5.3 12.9 5.3 10.9A3.3 3.3 0 0 1 12 9.3a3.3 3.3 0 0 1 6.7 1.6c0 2-1.1 3.6-3.1 5.1Z" />
          <path d="m12 7.2 1 1.8 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3Z" />
        </>
      );
    case "early-supporter":
      return (
        <>
          <path d="M5 16a7 7 0 0 1 14 0" />
          <path d="M4.7 18.5h14.6" />
          <path d="M12 5.3v3.6" />
          <path d="m9.1 7.4 1.5 1.6" />
          <path d="m14.9 7.4-1.5 1.6" />
          <path d="m12 10.1.9 1.6 1.9.3-1.4 1.3.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3Z" />
        </>
      );
    case "first-profile":
      return (
        <>
          <path d="M7 4.8v14.4" />
          <path d="M7 6h8.6l-1.8 2.9 1.8 2.9H7" />
          <path d="m16.2 14.1.8 1.5 1.7.2-1.3 1.1.4 1.7-1.6-.8-1.6.8.4-1.7-1.3-1.1 1.7-.2Z" />
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
          <path d="M7 8.6a3.6 3.6 0 0 1 3.6-3.6h4.1a3.3 3.3 0 0 1 3.3 3.3v2.1a3.3 3.3 0 0 1-3.3 3.3h-2.9l-3 2v-2A3.7 3.7 0 0 1 7 10.1Z" />
          <circle cx="16.6" cy="7.3" r="1.3" />
          <path d="M15 15.6a4.1 4.1 0 0 0 4-4.1" />
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
          <path d="M12 4.7c2.3 2.1 4.7 4.7 4.7 7.6a4.7 4.7 0 0 1-9.4 0c0-2.9 2.4-5.5 4.7-7.6Z" />
          <path d="M10.5 13.1c.8-.6 1.2-1.4 1.2-2.4 1.8.8 2.7 2 2.7 3.2a2.4 2.4 0 0 1-4.8 0c0-.3 0-.5.1-.8Z" />
        </>
      );
    case "rising":
      return (
        <>
          <path d="M5.5 17.5h13" />
          <path d="m7.5 15.5 3.8-3.8 2.5 2.5 4.7-4.7" />
          <path d="M15.2 9.5H19v3.8" />
        </>
      );
    case "builder":
      return (
        <>
          <path d="m8.2 7.1 2.2 2.2-2.3 2.3-2.2-2.2Z" />
          <path d="m10.3 9.2 3.8-3.8 2.3 2.3-3.8 3.8" />
          <path d="m12.5 13.1 5.3 5.3" />
          <path d="m9.1 14 3 3 4.1-3.3-3-3Z" />
        </>
      );
    case "music-taste":
      return (
        <>
          <path d="M15.4 5.4v8.8a2.2 2.2 0 1 1-1.5-2.1V7.4l-5.7 1.4v6.5a2.2 2.2 0 1 1-1.5-2.1V7.5Z" />
          <path d="M17.3 8.4c1.1.3 1.8 1.1 2 2.2" />
          <path d="M17 11.1c1.8.4 3 1.7 3.4 3.5" />
        </>
      );
    case "streamer":
      return (
        <>
          <path d="M6.1 8.2h7.5a4 4 0 0 1 4 4v2.7" />
          <path d="M6.1 12a6 6 0 0 1 6-6" />
          <path d="M16.4 16.3a1.7 1.7 0 1 1 3.4 0" />
          <path d="M14.1 18.4a4 4 0 0 1 8 0" />
          <path d="M4.7 16.7h4.9" />
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
