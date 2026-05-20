import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";
import LiveEmbedPlayer from "@/app/lib/LiveEmbedPlayer";
import {
  getLiveEmbedTheme,
  withAlpha,
  type LiveEmbedPlatform,
} from "@/app/lib/live-embed";

type Props = {
  platform: LiveEmbedPlatform;
  channelName: string | null;
  streamTitle: string | null;
  url: string | null;
  openUrl: string | null;
  embedUrl: string | null;
  accentColor: string | null;
  isLive: boolean;
  compact?: boolean;
  preview?: boolean;
};

export default function LiveEmbedSocialBlock({
  platform,
  channelName,
  streamTitle,
  url,
  openUrl,
  embedUrl,
  accentColor,
  isLive,
  compact = false,
  preview = false,
}: Props) {
  const theme = getLiveEmbedTheme(platform, accentColor);
  const ctaUrl = openUrl ?? url;
  const canEmbed =
    !preview &&
    isLive &&
    (platform === "twitch_live" ? Boolean(channelName) : Boolean(embedUrl));
  const avatarText = (channelName || theme.shortLabel).slice(0, 2).toUpperCase();

  return (
    <article
      style={{
        ...cardStyle,
        padding: compact ? "18px" : "24px",
        border: `1px solid ${theme.border}`,
        background: theme.background,
        boxShadow: `0 26px 62px ${withAlpha(theme.accent, 0.16)}`,
      }}
    >
      <div style={glowStyle(theme.glow)} />

      <div style={headerStyle}>
        <div style={badgeRowStyle}>
          <span style={liveBadgeStyle(isLive)}>{isLive ? "LIVE NOW" : "OFF AIR"}</span>
          <span style={platformBadgeStyle}>{theme.shortLabel}</span>
        </div>

        <div style={identityRowStyle}>
          <div
            style={{
              ...avatarShellStyle,
              border: `1px solid ${theme.border}`,
              boxShadow: `0 0 28px ${theme.glow}`,
            }}
          >
            {platform === "kick_live" ? (
              <span style={avatarTextStyle}>{avatarText}</span>
            ) : (
              <SocialBrandIcon name={theme.icon} size={26} />
            )}
          </div>

          <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
            <div
              style={{
                fontSize: compact ? "26px" : "32px",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                overflowWrap: "anywhere",
              }}
            >
              {channelName || theme.label}
            </div>
            <div style={streamTitleStyle}>
              {streamTitle ||
                (isLive
                  ? "Streamer mode active with a premium live presentation."
                  : "Standby mode active until the live toggle goes on air.")}
            </div>
          </div>
        </div>
      </div>

      {canEmbed ? (
        <LiveEmbedPlayer
          platform={platform === "kick_live" ? "youtube_live" : platform}
          channelName={channelName}
          embedUrl={embedUrl}
          title={`${theme.label} player`}
        />
      ) : (
        <div style={fallbackShellStyle}>
          <div style={fallbackCardStyle(theme.accent)}>
            <div style={fallbackTopStyle}>
              <div style={viewerTagStyle(isLive)}>
                {isLive ? "Viewer lobby open" : "Standby mode"}
              </div>
              <div style={pulseStyle(theme.accent, isLive)} />
            </div>
            <div style={fallbackTitleStyle}>
              {platform === "kick_live"
                ? "Kick keeps a premium CTA card here for a cleaner experience."
                : isLive
                  ? "This source is live, but the embed could not be generated from the current URL."
                  : "Enable the manual live toggle to turn this block into a full LIVE NOW feature."}
            </div>
            <div style={fallbackCaptionStyle}>
              Neon glow, CTA focus and social presence stay active even when the player is offline.
            </div>
          </div>
        </div>
      )}

      <div style={footerStyle}>
        <div style={metaStyle}>
          <span style={statusDotStyle(theme.accent, isLive)} />
          <span>{isLive ? "ON AIR" : "OFF AIR"}</span>
        </div>

        {ctaUrl ? (
          <a href={ctaUrl} target="_blank" rel="noreferrer" style={ctaStyle(theme.button)}>
            Watch Stream
          </a>
        ) : (
          <span style={hintStyle}>Configure a safe stream URL to unlock the CTA</span>
        )}
      </div>
    </article>
  );
}

const cardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gap: "18px",
  width: "100%",
  minWidth: 0,
  borderRadius: "30px",
  boxSizing: "border-box",
};

const glowStyle = (color: string): CSSProperties => ({
  position: "absolute",
  top: "-26%",
  right: "-8%",
  width: "280px",
  height: "280px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  filter: "blur(28px)",
  pointerEvents: "none",
});

const headerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "14px",
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
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const liveBadgeStyle = (isLive: boolean): CSSProperties => ({
  ...chipBaseStyle,
  color: "#ffffff",
  background: isLive
    ? "linear-gradient(135deg, rgba(239,68,68,0.96), rgba(248,113,113,0.92))"
    : "linear-gradient(135deg, rgba(113,113,122,0.92), rgba(82,82,91,0.88))",
  boxShadow: isLive ? "0 0 24px rgba(239,68,68,0.38)" : "none",
});

const platformBadgeStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#f4f4f5",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const identityRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "64px minmax(0, 1fr)",
  gap: "14px",
  alignItems: "center",
  minWidth: 0,
};

const avatarShellStyle: CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "20px",
  display: "grid",
  placeItems: "center",
  color: "#ffffff",
  background:
    "radial-gradient(circle at top, rgba(255,255,255,0.16), transparent 48%), rgba(255,255,255,0.08)",
};

const avatarTextStyle: CSSProperties = {
  fontSize: "22px",
  fontWeight: 900,
  letterSpacing: "0.08em",
};

const streamTitleStyle: CSSProperties = {
  color: "#e4e4e7",
  fontSize: "14px",
  lineHeight: 1.7,
  overflowWrap: "anywhere",
};

const fallbackShellStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const fallbackCardStyle = (accent: string): CSSProperties => ({
  display: "grid",
  gap: "12px",
  padding: "18px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: `linear-gradient(145deg, ${withAlpha(accent, 0.18)}, rgba(255,255,255,0.03) 44%, rgba(10,10,14,0.48))`,
});

const fallbackTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const viewerTagStyle = (isLive: boolean): CSSProperties => ({
  color: isLive ? "#fca5a5" : "#d4d4d8",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const pulseStyle = (accent: string, isLive: boolean): CSSProperties => ({
  width: "12px",
  height: "12px",
  borderRadius: "999px",
  backgroundColor: isLive ? "#ef4444" : accent,
  boxShadow: isLive ? "0 0 18px rgba(239,68,68,0.9)" : `0 0 18px ${accent}`,
});

const fallbackTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 800,
  lineHeight: 1.55,
};

const fallbackCaptionStyle: CSSProperties = {
  color: "#d4d4d8",
  fontSize: "13px",
  lineHeight: 1.65,
};

const footerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const metaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  color: "#f4f4f5",
  fontSize: "13px",
  fontWeight: 800,
};

const statusDotStyle = (accent: string, isLive: boolean): CSSProperties => ({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: isLive ? "#ef4444" : accent,
  boxShadow: isLive ? "0 0 14px rgba(239,68,68,0.92)" : `0 0 14px ${accent}`,
  flexShrink: 0,
});

const ctaStyle = (background: string): CSSProperties => ({
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 16px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 900,
  background,
  boxShadow: "0 16px 28px rgba(0,0,0,0.22)",
});

const hintStyle: CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  fontWeight: 700,
};
