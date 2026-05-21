import type { CSSProperties } from "react";
import { LuSparkles } from "react-icons/lu";
import DiscordSocialBlock from "./DiscordSocialBlock";
import GitHubSocialBlock from "./GitHubSocialBlock";
import SpotifySocialBlock from "./SpotifySocialBlock";
import CreatorVideoSocialBlock from "./CreatorVideoSocialBlock";
import LiveEmbedSocialBlock from "./LiveEmbedSocialBlock";
import ProfileRenderBoundary from "./ProfileRenderBoundary";

export type PublicSocialBlock = {
  id: string;
  platform: string;
  title: string | null;
  username: string | null;
  url: string | null;
  statusText: string | null;
  featuredRepo: string | null;
  trackName: string | null;
  artistName: string | null;
  headline: string | null;
  featuredVideoTitle: string | null;
  streamTitle: string | null;
  embedUrl: string | null;
  openUrl: string | null;
  accentColor: string | null;
  isLive: boolean;
  isEnabled: boolean;
};

type Props = {
  blocks: PublicSocialBlock[];
  themeColor: string;
  compact?: boolean;
  preview?: boolean;
};

export default function SocialPresenceSection({
  blocks,
  themeColor,
  compact = false,
  preview = false,
}: Props) {
  const visibleBlocks = [...sanitizeBlocks(blocks)]
    .filter((block) => block.isEnabled)
    .sort((left, right) => {
      const leftPriority = isLivePriority(left);
      const rightPriority = isLivePriority(right);
      return rightPriority - leftPriority;
    });

  if (visibleBlocks.length === 0) {
    return null;
  }

  return (
    <section style={sectionStyle}>
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={kickerStyle}>
          <LuSparkles size={13} />
          {compact ? "Presence" : "Socials"}
        </div>
      </div>

      <div style={gridStyle}>
        {visibleBlocks.map((block) => {
          if (block.platform === "discord") {
            return (
              <ProfileRenderBoundary
                key={block.id}
                label="Discord presence"
                compact
                resetKey={block.id}
              >
                <DiscordSocialBlock
                  username={block.username}
                  statusText={block.statusText}
                  url={block.url}
                  themeColor={themeColor}
                  compact={compact}
                />
              </ProfileRenderBoundary>
            );
          }

          if (block.platform === "github") {
            return (
              <ProfileRenderBoundary
                key={block.id}
                label="GitHub presence"
                compact
                resetKey={block.id}
              >
                <GitHubSocialBlock
                  username={block.username}
                  statusText={block.statusText}
                  featuredRepo={block.featuredRepo}
                  url={block.url}
                  themeColor={themeColor}
                  compact={compact}
                />
              </ProfileRenderBoundary>
            );
          }

          if (block.platform === "spotify") {
            return (
              <ProfileRenderBoundary
                key={block.id}
                label="Spotify presence"
                compact
                resetKey={block.id}
              >
                <SpotifySocialBlock
                  username={block.username}
                  trackName={block.trackName}
                  artistName={block.artistName}
                  statusText={block.statusText}
                  url={block.url}
                  themeColor={themeColor}
                  compact={compact}
                />
              </ProfileRenderBoundary>
            );
          }

          if (block.platform === "youtube" || block.platform === "twitch") {
            return (
              <ProfileRenderBoundary
                key={block.id}
                label="Creator video"
                compact
                resetKey={block.id}
              >
                <CreatorVideoSocialBlock
                  platform={block.platform}
                  channelName={block.username}
                  headline={block.headline}
                  featuredVideoTitle={block.featuredVideoTitle}
                  url={block.url}
                  themeColor={themeColor}
                  compact={compact}
                />
              </ProfileRenderBoundary>
            );
          }

          if (
            block.platform === "twitch_live" ||
            block.platform === "youtube_live" ||
            block.platform === "kick_live"
          ) {
            return (
              <ProfileRenderBoundary
                key={block.id}
                label="Live stream"
                compact
                resetKey={block.id}
              >
                <LiveEmbedSocialBlock
                  platform={block.platform}
                  channelName={block.username}
                  streamTitle={block.streamTitle}
                  url={block.url}
                  openUrl={block.openUrl}
                  embedUrl={block.embedUrl}
                  accentColor={block.accentColor}
                  isLive={block.isLive}
                  compact={compact}
                  preview={preview}
                />
              </ProfileRenderBoundary>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}

function isLivePriority(block: PublicSocialBlock) {
  if (
    (block.platform === "twitch_live" ||
      block.platform === "youtube_live" ||
      block.platform === "kick_live") &&
    block.isLive
  ) {
    return 2;
  }

  if (
    block.platform === "twitch_live" ||
    block.platform === "youtube_live" ||
    block.platform === "kick_live"
  ) {
    return 1;
  }

  return 0;
}

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  minWidth: 0,
};

const kickerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e4e4e7",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  minWidth: 0,
};

function sanitizeBlocks(blocks: PublicSocialBlock[]) {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.filter((block): block is PublicSocialBlock => {
    return Boolean(block && typeof block.id === "string" && typeof block.platform === "string");
  });
}
