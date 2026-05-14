import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";

type Props = {
  username: string | null;
  statusText: string | null;
  url: string | null;
  themeColor: string;
  compact?: boolean;
};

export default function DiscordSocialBlock({
  username,
  statusText,
  url,
  themeColor,
  compact = false,
}: Props) {
  return (
    <article style={{ ...cardStyle, padding: compact ? "18px" : "22px" }}>
      <div style={glowStyle(themeColor)} />

      <div style={topRowStyle}>
        <div style={brandWrapStyle}>
          <SocialBrandIcon name="discord" size={24} />
        </div>

        <div style={badgeRowStyle}>
          <span style={platformBadgeStyle}>Discord</span>
          <span style={connectedBadgeStyle}>Connected</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "8px" }}>
        <div style={{ fontSize: compact ? "22px" : "26px", fontWeight: 900, letterSpacing: "-0.04em" }}>
          {username ? `@${username.replace(/^@+/, "")}` : "Discord"}
        </div>
        <p style={copyStyle}>
          {statusText || "Manual Discord profile block with room for future live presence."}
        </p>
      </div>

      <div style={footerRowStyle}>
        <div style={metaLineStyle}>
          <span style={statusDotStyle} />
          <span>Social presence</span>
        </div>

        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={ctaStyle}>
            Open Discord
          </a>
        ) : (
          <span style={hintStyle}>Invite or profile URL not set</span>
        )}
      </div>
    </article>
  );
}

const cardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gap: "16px",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  borderRadius: "24px",
  border: "1px solid rgba(88,101,242,0.24)",
  background:
    "linear-gradient(155deg, rgba(88,101,242,0.20), rgba(15,18,30,0.98) 36%, rgba(7,9,15,0.98) 100%)",
  boxShadow: "0 22px 48px rgba(0,0,0,0.28)",
};

const glowStyle = (themeColor: string): CSSProperties => ({
  position: "absolute",
  top: "-32%",
  right: "-16%",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${themeColor}22 0%, transparent 68%)`,
  filter: "blur(18px)",
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
  backgroundColor: "rgba(88,101,242,0.18)",
  border: "1px solid rgba(129,140,248,0.34)",
  boxShadow: "0 0 20px rgba(88,101,242,0.18)",
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

const copyStyle: CSSProperties = {
  margin: 0,
  color: "#c4cbe0",
  fontSize: "14px",
  lineHeight: 1.7,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
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

const statusDotStyle: CSSProperties = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: "#818cf8",
  boxShadow: "0 0 12px rgba(129,140,248,0.52)",
  flexShrink: 0,
};

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
  boxShadow: "0 16px 28px rgba(88,101,242,0.20)",
};

const hintStyle: CSSProperties = {
  color: "#98a3bf",
  fontSize: "13px",
  fontWeight: 700,
  overflowWrap: "anywhere",
};
