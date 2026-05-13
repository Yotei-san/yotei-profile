import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";

type Props = {
  username: string | null;
  statusText: string | null;
  url: string | null;
  enabled: boolean;
  compact?: boolean;
};

export default function DiscordBlockPreview({
  username,
  statusText,
  url,
  enabled,
  compact = false,
}: Props) {
  const cardPadding = compact ? "18px" : "22px";
  const titleSize = compact ? "22px" : "26px";
  const iconSize = compact ? 22 : 24;

  return (
    <div style={{ ...cardStyle, padding: cardPadding }}>
      <div style={glowStyle} />

      <div style={topRowStyle}>
        <div style={brandWrapStyle}>
          <SocialBrandIcon name="discord" size={iconSize} />
        </div>

        <div style={badgeRowStyle}>
          <span style={platformBadgeStyle}>Discord</span>
          <span style={enabled ? connectedBadgeStyle : disabledBadgeStyle}>
            {enabled ? "Connected" : "Disabled"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        <div style={{ fontSize: titleSize, fontWeight: 900, letterSpacing: "-0.04em" }}>
          {username ? `@${username.replace(/^@+/, "")}` : "Discord handle"}
        </div>
        <p style={copyStyle}>
          {statusText || "Premium profile block ready for future presence and community signals."}
        </p>
      </div>

      <div style={footerRowStyle}>
        <div style={metaLineStyle}>
          <span style={statusDotStyle(enabled)} />
          <span>{enabled ? "Visible on public profile" : "Saved but hidden"}</span>
        </div>

        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={ctaStyle}>
            Open Discord
          </a>
        ) : (
          <span style={hintStyle}>Invite URL optional</span>
        )}
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gap: "18px",
  borderRadius: "24px",
  border: "1px solid rgba(88,101,242,0.24)",
  background:
    "linear-gradient(160deg, rgba(88,101,242,0.18), rgba(18,20,34,0.98) 34%, rgba(8,9,16,0.98) 100%)",
  boxShadow: "0 24px 54px rgba(0,0,0,0.32)",
};

const glowStyle: CSSProperties = {
  position: "absolute",
  top: "-28%",
  right: "-14%",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(88,101,242,0.26) 0%, transparent 68%)",
  filter: "blur(12px)",
  pointerEvents: "none",
};

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
  backgroundColor: "rgba(88,101,242,0.16)",
  border: "1px solid rgba(129,140,248,0.34)",
  boxShadow: "0 0 22px rgba(88,101,242,0.18)",
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
  color: "#dbe4ff",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const connectedBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#c7d2fe",
  backgroundColor: "rgba(88,101,242,0.16)",
  border: "1px solid rgba(129,140,248,0.32)",
};

const disabledBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#fcd34d",
  backgroundColor: "rgba(245,158,11,0.12)",
  border: "1px solid rgba(245,158,11,0.22)",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "#bfc7dd",
  fontSize: "14px",
  lineHeight: 1.7,
  maxWidth: "44ch",
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
  color: "#dbe4ff",
  fontSize: "13px",
  fontWeight: 700,
};

const statusDotStyle = (enabled: boolean): CSSProperties => ({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: enabled ? "#818cf8" : "#f59e0b",
  boxShadow: enabled
    ? "0 0 12px rgba(129,140,248,0.56)"
    : "0 0 12px rgba(245,158,11,0.42)",
  flexShrink: 0,
});

const ctaStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "38px",
  padding: "0 14px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 800,
  background: "linear-gradient(135deg, rgba(88,101,242,0.94), rgba(124,58,237,0.92))",
  boxShadow: "0 16px 28px rgba(88,101,242,0.22)",
};

const hintStyle: CSSProperties = {
  color: "#9da7bf",
  fontSize: "13px",
  fontWeight: 700,
};
