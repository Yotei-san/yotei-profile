import type { CSSProperties } from "react";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";
import LiveEmbedPlayer from "@/app/lib/LiveEmbedPlayer";
import {
  getLiveEmbedTheme,
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
  enabled: boolean;
  compact?: boolean;
};

export default function LiveEmbedBlockPreview({
  platform,
  channelName,
  streamTitle,
  url,
  openUrl,
  embedUrl,
  accentColor,
  isLive,
  enabled,
  compact = false,
}: Props) {
  const theme = getLiveEmbedTheme(platform, accentColor);
  const ctaUrl = openUrl ?? url;
  const canEmbed = isLive && (platform === "twitch_live" ? Boolean(channelName) : Boolean(embedUrl));
  const statusLabel = isLive ? "On Air" : enabled ? "Standby" : "Disabled";

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

      <div style={headerStyle}>
        <div style={brandRowStyle}>
          <div
            style={{
              ...brandWrapStyle,
              boxShadow: `0 0 26px ${theme.glow}`,
              border: `1px solid ${theme.border}`,
            }}
          >
            <SocialBrandIcon name={theme.icon} size={24} />
          </div>

          <div style={{ display: "grid", gap: "6px", minWidth: 0 }}>
            <div style={liveRowStyle}>
              <span style={platformChipStyle}>{theme.shortLabel}</span>
              <span style={isLive ? liveChipStyle : mutedChipStyle}>{statusLabel}</span>
            </div>
            <div
              style={{
                fontSize: compact ? "22px" : "28px",
                fontWeight: 900,
                letterSpacing: "-0.05em",
              }}
            >
              {channelName || theme.label}
            </div>
            <div style={subtitleStyle}>
              {streamTitle ||
                "Premium live block with gamer presentation, manual status, and platform-safe embeds."}
            </div>
          </div>
        </div>
      </div>

      {canEmbed ? (
        <LiveEmbedPlayer
          platform={platform === "kick_live" ? "youtube_live" : platform}
          channelName={channelName}
          embedUrl={embedUrl}
          title={`${theme.label} preview`}
        />
      ) : (
        <div style={offlineShellStyle}>
          <div style={offlineBadgeStyle}>{isLive ? "No embeddable preview for this source" : "Manual live toggle off"}</div>
          <div style={offlineTitleStyle}>
            {platform === "kick_live" ? "Kick uses a premium fallback card by design." : "Embed loads only when ON AIR and source is valid."}
          </div>
        </div>
      )}

      <div style={footerStyle}>
        <div style={metaStyle}>
          <span style={dotStyle(theme.accent, isLive)} />
          <span>{enabled ? "Visible on public profile" : "Saved as draft"}</span>
        </div>

        {ctaUrl ? (
          <a href={ctaUrl} target="_blank" rel="noreferrer" style={ctaStyle(theme.button)}>
            Watch Stream
          </a>
        ) : (
          <span style={hintStyle}>Add a valid URL to activate the CTA</span>
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
  borderRadius: "28px",
  boxShadow: "0 24px 58px rgba(0,0,0,0.34)",
};

const glowStyle = (color: string): CSSProperties => ({
  position: "absolute",
  top: "-24%",
  right: "-10%",
  width: "260px",
  height: "260px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
  filter: "blur(22px)",
  pointerEvents: "none",
});

const headerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "12px",
};

const brandRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "56px minmax(0, 1fr)",
  gap: "14px",
  alignItems: "start",
};

const brandWrapStyle: CSSProperties = {
  width: "56px",
  height: "56px",
  borderRadius: "18px",
  display: "grid",
  placeItems: "center",
  color: "#ffffff",
  background: "rgba(255,255,255,0.07)",
};

const liveRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
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

const platformChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#f4f4f5",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const liveChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#ffffff",
  background: "linear-gradient(135deg, rgba(239,68,68,0.94), rgba(248,113,113,0.92))",
  boxShadow: "0 0 20px rgba(248,113,113,0.34)",
};

const mutedChipStyle: CSSProperties = {
  ...chipBaseStyle,
  color: "#d4d4d8",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const subtitleStyle: CSSProperties = {
  color: "#d4d4d8",
  fontSize: "14px",
  lineHeight: 1.65,
  overflowWrap: "anywhere",
};

const offlineShellStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "10px",
  padding: "18px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.03))",
};

const offlineBadgeStyle: CSSProperties = {
  color: "#fca5a5",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const offlineTitleStyle: CSSProperties = {
  color: "#f4f4f5",
  fontSize: "14px",
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
  fontWeight: 700,
};

const dotStyle = (accent: string, isLive: boolean): CSSProperties => ({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: isLive ? "#ef4444" : accent,
  boxShadow: isLive ? "0 0 14px rgba(239,68,68,0.92)" : `0 0 14px ${accent}`,
  flexShrink: 0,
});

const ctaStyle = (background: string): CSSProperties => ({
  textDecoration: "none",
  minHeight: "40px",
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
