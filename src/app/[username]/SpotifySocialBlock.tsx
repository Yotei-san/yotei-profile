import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";

type Props = {
  username: string | null;
  trackName: string | null;
  artistName: string | null;
  statusText: string | null;
  url: string | null;
  themeColor: string;
  compact?: boolean;
};

export default function SpotifySocialBlock({
  username,
  trackName,
  artistName,
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
          <SocialBrandIcon name="spotify" size={24} />
        </div>

        <div style={badgeRowStyle}>
          <span style={platformBadgeStyle}>Spotify</span>
          <span style={connectedBadgeStyle}>Connected</span>
        </div>
      </div>

      <div style={playerShellStyle}>
        <div style={coverArtStyle}>
          <div style={vinylGlowStyle} />
        </div>

        <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
          <div style={nowPlayingLabelStyle}>Now playing</div>
          <div style={{ fontSize: compact ? "21px" : "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>
            {trackName || "Track title"}
          </div>
          <div style={artistStyle}>{artistName || "Artist name"}</div>
          <div style={usernameStyle}>{username ? `by @${username.replace(/^@+/, "")}` : "Spotify profile"}</div>
        </div>
      </div>

      <p style={copyStyle}>
        {statusText || "Manual music block with room for future live listening and deeper audio presence."}
      </p>

      <div style={footerRowStyle}>
        <div style={metaLineStyle}>
          <span style={statusDotStyle} />
          <span>Music presence</span>
        </div>

        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={ctaStyle}>
            Open Spotify
          </a>
        ) : (
          <span style={hintStyle}>Spotify URL not set</span>
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
  border: "1px solid rgba(30,215,96,0.24)",
  background:
    "linear-gradient(155deg, rgba(30,215,96,0.16), rgba(12,18,16,0.98) 36%, rgba(7,11,10,0.98) 100%)",
  boxShadow: "0 22px 48px rgba(0,0,0,0.28)",
};

const glowStyle = (themeColor: string): CSSProperties => ({
  position: "absolute",
  top: "-32%",
  right: "-16%",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${themeColor}20 0%, transparent 68%)`,
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
  backgroundColor: "rgba(30,215,96,0.18)",
  border: "1px solid rgba(74,222,128,0.24)",
  boxShadow: "0 0 20px rgba(30,215,96,0.16)",
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
  color: "#dcfce7",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const connectedBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#bbf7d0",
  backgroundColor: "rgba(30,215,96,0.14)",
  border: "1px solid rgba(74,222,128,0.20)",
};

const playerShellStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "86px minmax(0, 1fr)",
  gap: "14px",
  alignItems: "center",
  minWidth: 0,
};

const coverArtStyle: CSSProperties = {
  position: "relative",
  width: "86px",
  height: "86px",
  borderRadius: "20px",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 18%), linear-gradient(145deg, #1ed760 0%, #0f172a 58%, #05070b 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
};

const vinylGlowStyle: CSSProperties = {
  position: "absolute",
  inset: "20%",
  borderRadius: "999px",
  background:
    "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(15,23,42,0.82) 52%, rgba(2,6,23,0.96) 100%)",
  boxShadow: "0 0 18px rgba(30,215,96,0.16)",
};

const nowPlayingLabelStyle: CSSProperties = {
  color: "#86efac",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const artistStyle: CSSProperties = {
  color: "#d1fae5",
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: 1.5,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const usernameStyle: CSSProperties = {
  color: "#9fb3a8",
  fontSize: "13px",
  fontWeight: 700,
  overflowWrap: "anywhere",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "#d0e5d7",
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
  color: "#dcfce7",
  fontSize: "13px",
  fontWeight: 700,
};

const statusDotStyle: CSSProperties = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: "#1ed760",
  boxShadow: "0 0 12px rgba(30,215,96,0.52)",
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
  color: "#04110a",
  fontSize: "13px",
  fontWeight: 900,
  background: "linear-gradient(135deg, rgba(30,215,96,0.98), rgba(74,222,128,0.92))",
  boxShadow: "0 16px 28px rgba(30,215,96,0.20)",
};

const hintStyle: CSSProperties = {
  color: "#98b5a5",
  fontSize: "13px",
  fontWeight: 700,
  overflowWrap: "anywhere",
};
