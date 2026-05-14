import type { CSSProperties } from "react";
import { LuSparkles } from "react-icons/lu";
import DiscordSocialBlock from "./DiscordSocialBlock";
import GitHubSocialBlock from "./GitHubSocialBlock";
import SpotifySocialBlock from "./SpotifySocialBlock";
import CreatorVideoSocialBlock from "./CreatorVideoSocialBlock";

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
  isEnabled: boolean;
};

type Props = {
  blocks: PublicSocialBlock[];
  themeColor: string;
  compact?: boolean;
};

export default function SocialPresenceSection({
  blocks,
  themeColor,
  compact = false,
}: Props) {
  const visibleBlocks = blocks.filter((block) => block.isEnabled);

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
              <DiscordSocialBlock
                key={block.id}
                username={block.username}
                statusText={block.statusText}
                url={block.url}
                themeColor={themeColor}
                compact={compact}
              />
            );
          }

          if (block.platform === "github") {
            return (
              <GitHubSocialBlock
                key={block.id}
                username={block.username}
                statusText={block.statusText}
                featuredRepo={block.featuredRepo}
                url={block.url}
                themeColor={themeColor}
                compact={compact}
              />
            );
          }

          if (block.platform === "spotify") {
            return (
              <SpotifySocialBlock
                key={block.id}
                username={block.username}
                trackName={block.trackName}
                artistName={block.artistName}
                statusText={block.statusText}
                url={block.url}
                themeColor={themeColor}
                compact={compact}
              />
            );
          }

          if (block.platform === "youtube" || block.platform === "twitch") {
            return (
              <CreatorVideoSocialBlock
                key={block.id}
                platform={block.platform}
                channelName={block.username}
                headline={block.headline}
                featuredVideoTitle={block.featuredVideoTitle}
                url={block.url}
                themeColor={themeColor}
                compact={compact}
              />
            );
          }

          return null;
        })}
      </div>
    </section>
  );
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
