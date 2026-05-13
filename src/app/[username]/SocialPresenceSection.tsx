import type { CSSProperties } from "react";
import { LuSparkles } from "react-icons/lu";
import DiscordSocialBlock from "./DiscordSocialBlock";
import GitHubSocialBlock from "./GitHubSocialBlock";
import SpotifySocialBlock from "./SpotifySocialBlock";

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
          Social Presence
        </div>
        <h2 style={titleStyle}>Connected blocks that add more context to the profile.</h2>
        <p style={copyStyle}>
          Premium-looking modules for communities, code and music, starting with Discord, GitHub and Spotify.
        </p>
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

          return null;
        })}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
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

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "28px",
  lineHeight: 1,
  letterSpacing: "-0.04em",
  color: "#ffffff",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  fontSize: "14px",
  lineHeight: 1.75,
  maxWidth: "58ch",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};
