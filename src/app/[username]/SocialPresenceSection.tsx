import type { CSSProperties } from "react";
import { LuSparkles } from "react-icons/lu";
import type { ProfileCompositionSocialsStyle } from "@/app/lib/profile-composition";
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
  mode?: "all" | "socials" | "live";
  displayStyle?: ProfileCompositionSocialsStyle;
};

export default function SocialPresenceSection({
  blocks,
  themeColor,
  compact = false,
  preview = false,
  mode = "all",
  displayStyle = "grid",
}: Props) {
  const visibleBlocks = [...sanitizeBlocks(blocks)]
    .filter((block) => block.isEnabled)
    .filter((block) => {
      if (mode === "live") {
        return isLiveBlock(block);
      }

      if (mode === "socials") {
        return !isLiveBlock(block);
      }

      return true;
    })
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
          {mode === "live" ? "Live" : compact ? "Presence" : "Socials"}
        </div>
      </div>

      <div style={gridStyle(displayStyle, compact)}>
        {visibleBlocks.map((block, index) => {
          const wrapperStyle = socialItemStyle(displayStyle, index, compact);

          if (block.platform === "discord") {
            return (
              <div key={block.id} style={wrapperStyle}>
                <ProfileRenderBoundary
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
              </div>
            );
          }

          if (block.platform === "github") {
            return (
              <div key={block.id} style={wrapperStyle}>
                <ProfileRenderBoundary
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
              </div>
            );
          }

          if (block.platform === "spotify") {
            return (
              <div key={block.id} style={wrapperStyle}>
                <ProfileRenderBoundary
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
              </div>
            );
          }

          if (block.platform === "youtube" || block.platform === "twitch") {
            return (
              <div key={block.id} style={wrapperStyle}>
                <ProfileRenderBoundary
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
              </div>
            );
          }

          if (
            block.platform === "twitch_live" ||
            block.platform === "youtube_live" ||
            block.platform === "kick_live"
          ) {
            return (
              <div key={block.id} style={wrapperStyle}>
                <ProfileRenderBoundary
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
              </div>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}

function isLivePriority(block: PublicSocialBlock) {
  if (isLiveBlock(block) && block.isLive) {
    return 2;
  }

  if (isLiveBlock(block)) {
    return 1;
  }

  return 0;
}

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  minWidth: 0,
};

const kickerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  width: "fit-content",
  minHeight: "26px",
  padding: "0 9px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e4e4e7",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.02em",
};

function gridStyle(
  displayStyle: ProfileCompositionSocialsStyle,
  compact: boolean,
): CSSProperties {
  if (displayStyle === "grid" && !compact) {
    return {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
      gap: "8px",
      minWidth: 0,
      alignItems: "start",
    };
  }

  return {
    display: "grid",
    gap: displayStyle === "spotlight" ? "10px" : "8px",
    minWidth: 0,
  };
}

function socialItemStyle(
  displayStyle: ProfileCompositionSocialsStyle,
  index: number,
  compact: boolean,
): CSSProperties {
  if (displayStyle === "spotlight") {
    return index === 0
      ? {
          display: "grid",
          minWidth: 0,
        }
      : {
          display: "grid",
          minWidth: 0,
          marginInlineStart: compact ? "0" : "8px",
        };
  }

  if (displayStyle === "stack") {
    return {
      display: "grid",
      minWidth: 0,
    };
  }

  return {
    display: "grid",
    minWidth: 0,
  };
}

function isLiveBlock(block: Pick<PublicSocialBlock, "platform">) {
  return (
    block.platform === "twitch_live" ||
    block.platform === "youtube_live" ||
    block.platform === "kick_live"
  );
}

function sanitizeBlocks(blocks: PublicSocialBlock[]) {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.filter((block): block is PublicSocialBlock => {
    return Boolean(block && typeof block.id === "string" && typeof block.platform === "string");
  });
}
