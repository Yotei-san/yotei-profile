import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";

type Props = {
  platform: "youtube" | "twitch";
  channelName: string | null;
  headline: string | null;
  featuredVideoTitle: string | null;
  url: string | null;
  enabled: boolean;
  compact?: boolean;
};

export default function CreatorVideoBlockPreview({
  platform,
  channelName,
  headline,
  featuredVideoTitle,
  url,
  enabled,
  compact = false,
}: Props) {
  const theme = getTheme(platform);

  return (
    <div
      style={{
        ...cardStyle,
        padding: compact ? "18px" : "22px",
        border: `1px solid ${theme.border}`,
        background: theme.background,
      }}
    >
      <div style={glowStyle(theme.glow)} />

      <div style={topRowStyle}>
        <div style={{ ...brandWrapStyle, backgroundColor: theme.brandBg, border: `1px solid ${theme.brandBorder}`, boxShadow: `0 0 22px ${theme.glow}` }}>
          <SocialBrandIcon name={platform} size={compact ? 22 : 24} />
        </div>

        <div style={badgeRowStyle}>
          <span style={platformBadgeStyle}>{theme.label}</span>
          <span style={enabled ? connectedBadgeStyle(theme) : disabledBadgeStyle}>
            {enabled ? "Connected" : "Disabled"}
          </span>
        </div>
      </div>

      <div style={videoShellStyle}>
        <div style={thumbnailStyle(theme.thumbnail)}>
          <div style={thumbnailPlayStyle}>▶</div>
        </div>

        <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
          <div style={channelLabelStyle}>Creator channel</div>
          <div style={{ fontSize: compact ? "21px" : "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>
            {channelName || `${theme.label} channel`}
          </div>
          <div style={headlineStyle}>{headline || "Premium creator block ready for future channel and video signals."}</div>
          {featuredVideoTitle ? <div style={featuredVideoStyle}>Featured: {featuredVideoTitle}</div> : null}
        </div>
      </div>

      <div style={footerRowStyle}>
        <div style={metaLineStyle}>
          <span style={statusDotStyle(enabled, theme.dot)} />
          <span>{enabled ? "Visible on public profile" : "Saved but hidden"}</span>
        </div>

        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={ctaStyle(theme.ctaBackground, theme.ctaColor)}>
            Open Channel
          </a>
        ) : (
          <span style={hintStyle}>Channel URL optional</span>
        )}
      </div>
    </div>
  );
}

function getTheme(platform: "youtube" | "twitch") {
  if (platform === "twitch") {
    return {
      label: "Twitch",
      border: "rgba(169,112,255,0.24)",
      background:
        "linear-gradient(155deg, rgba(169,112,255,0.18), rgba(18,12,28,0.98) 36%, rgba(9,7,15,0.98) 100%)",
      glow: "rgba(169,112,255,0.18)",
      brandBg: "rgba(169,112,255,0.18)",
      brandBorder: "rgba(196,181,253,0.26)",
      thumbnail:
        "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.22), transparent 18%), linear-gradient(145deg, #a970ff 0%, #3b1d73 52%, #0b0714 100%)",
      dot: "#a970ff",
      ctaBackground: "linear-gradient(135deg, rgba(169,112,255,0.96), rgba(124,58,237,0.92))",
      ctaColor: "#ffffff",
    };
  }

  return {
    label: "YouTube",
    border: "rgba(255,49,49,0.24)",
    background:
      "linear-gradient(155deg, rgba(255,49,49,0.18), rgba(28,12,12,0.98) 36%, rgba(15,7,7,0.98) 100%)",
    glow: "rgba(255,49,49,0.18)",
    brandBg: "rgba(255,49,49,0.18)",
    brandBorder: "rgba(252,165,165,0.26)",
    thumbnail:
      "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.22), transparent 18%), linear-gradient(145deg, #ff3131 0%, #7f1d1d 52%, #120708 100%)",
    dot: "#ff5c5c",
    ctaBackground: "linear-gradient(135deg, rgba(255,49,49,0.98), rgba(248,113,113,0.92))",
    ctaColor: "#ffffff",
  };
}

const cardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gap: "18px",
  borderRadius: "24px",
  boxShadow: "0 24px 54px rgba(0,0,0,0.32)",
};

const glowStyle = (color: string): CSSProperties => ({
  position: "absolute",
  top: "-28%",
  right: "-14%",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
  filter: "blur(12px)",
  pointerEvents: "none",
});

const topRowStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const brandWrapStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  flexShrink: 0,
};

const badgeRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const chipBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "30px",
  padding: "0 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const platformBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#f4f4f5",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const connectedBadgeStyle = (theme: ReturnType<typeof getTheme>): CSSProperties => ({
  ...chipBaseStyle,
  color: "#ffffff",
  backgroundColor: theme.brandBg,
  border: `1px solid ${theme.brandBorder}`,
});

const disabledBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#fcd34d",
  backgroundColor: "rgba(245,158,11,0.12)",
  border: "1px solid rgba(245,158,11,0.22)",
};

const videoShellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "118px minmax(0, 1fr)",
  gap: "14px",
  alignItems: "center",
};

const thumbnailStyle = (background: string): CSSProperties => ({
  position: "relative",
  width: "118px",
  height: "86px",
  borderRadius: "18px",
  overflow: "hidden",
  background,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
});

const thumbnailPlayStyle: CSSProperties = {
  position: "absolute",
  inset: "auto 12px 12px auto",
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.16)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 900,
  backdropFilter: "blur(8px)",
};

const channelLabelStyle: CSSProperties = {
  color: "#d4d4d8",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const headlineStyle: CSSProperties = {
  color: "#d4d4d8",
  fontSize: "14px",
  lineHeight: 1.65,
};

const featuredVideoStyle: CSSProperties = {
  color: "#a5b4fc",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: 1.5,
};

const footerRowStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const metaLineStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  color: "#f4f4f5",
  fontSize: "13px",
  fontWeight: 700,
};

const statusDotStyle = (enabled: boolean, color: string): CSSProperties => ({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: enabled ? color : "#f59e0b",
  boxShadow: enabled ? `0 0 12px ${color}` : "0 0 12px rgba(245,158,11,0.42)",
  flexShrink: 0,
});

const ctaStyle = (background: string, color: string): CSSProperties => ({
  textDecoration: "none",
  minHeight: "38px",
  padding: "0 14px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color,
  fontSize: "13px",
  fontWeight: 900,
  background,
  boxShadow: "0 16px 28px rgba(0,0,0,0.20)",
});

const hintStyle: CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  fontWeight: 700,
};
