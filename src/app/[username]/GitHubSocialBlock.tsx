import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";

type Props = {
  username: string | null;
  statusText: string | null;
  featuredRepo: string | null;
  url: string | null;
  themeColor: string;
  compact?: boolean;
};

export default function GitHubSocialBlock({
  username,
  statusText,
  featuredRepo,
  url,
  themeColor,
  compact = false,
}: Props) {
  return (
    <article style={{ ...cardStyle, padding: compact ? "18px" : "22px" }}>
      <div style={glowStyle(themeColor)} />

      <div style={topRowStyle}>
        <div style={brandWrapStyle}>
          <SocialBrandIcon name="github" size={24} />
        </div>

        <div style={badgeRowStyle}>
          <span style={platformBadgeStyle}>GitHub</span>
          <span style={connectedBadgeStyle}>Connected</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "8px" }}>
        <div style={{ fontSize: compact ? "22px" : "26px", fontWeight: 900, letterSpacing: "-0.04em" }}>
          {username ? `@${username.replace(/^@+/, "")}` : "GitHub"}
        </div>
        <p style={copyStyle}>
          {statusText || "Manual GitHub profile block with room for future repository and contribution data."}
        </p>
      </div>

      {featuredRepo ? (
        <div style={repoCardStyle}>
          <div style={repoLabelStyle}>Featured repo</div>
          <div style={repoValueStyle}>{featuredRepo}</div>
        </div>
      ) : null}

      <div style={footerRowStyle}>
        <div style={metaLineStyle}>
          <span style={statusDotStyle} />
          <span>Developer presence</span>
        </div>

        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={ctaStyle}>
            View GitHub
          </a>
        ) : (
          <span style={hintStyle}>Profile URL not set</span>
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
  border: "1px solid rgba(148,163,184,0.22)",
  background:
    "linear-gradient(155deg, rgba(148,163,184,0.16), rgba(15,18,28,0.98) 36%, rgba(7,9,15,0.98) 100%)",
  boxShadow: "0 22px 48px rgba(0,0,0,0.28)",
};

const glowStyle = (themeColor: string): CSSProperties => ({
  position: "absolute",
  top: "-32%",
  right: "-16%",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${themeColor}1f 0%, transparent 68%)`,
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
  backgroundColor: "rgba(148,163,184,0.16)",
  border: "1px solid rgba(203,213,225,0.22)",
  boxShadow: "0 0 20px rgba(148,163,184,0.12)",
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
  color: "#e5e7eb",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const connectedBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#cbd5e1",
  backgroundColor: "rgba(148,163,184,0.14)",
  border: "1px solid rgba(203,213,225,0.18)",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "#cdd6e6",
  fontSize: "14px",
  lineHeight: 1.7,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const repoCardStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "6px",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.07)",
  backgroundColor: "rgba(255,255,255,0.035)",
};

const repoLabelStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const repoValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
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
  color: "#e2e8f0",
  fontSize: "13px",
  fontWeight: 700,
};

const statusDotStyle: CSSProperties = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: "#93c5fd",
  boxShadow: "0 0 12px rgba(147,197,253,0.44)",
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
  background: "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(71,85,105,0.92))",
  boxShadow: "0 16px 28px rgba(15,23,42,0.28)",
};

const hintStyle: CSSProperties = {
  color: "#98a3bf",
  fontSize: "13px",
  fontWeight: 700,
  overflowWrap: "anywhere",
};
