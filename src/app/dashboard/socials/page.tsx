import Link from "next/link";
import type { CSSProperties } from "react";
import SocialIntegrationCard, {
  type SocialIntegrationItem,
} from "@/app/dashboard/components/SocialIntegrationCard";

type PageProps = {
  searchParams?: Promise<{
    active?: string;
  }>;
};

const integrations: SocialIntegrationItem[] = [
  {
    key: "discord",
    name: "Discord",
    description: "Show your server, presence, or community block with fast-call action.",
    accent: "#5865F2",
    emoji: "💬",
  },
  {
    key: "github",
    name: "GitHub",
    description: "Highlight repos, streaks, and developer identity inside your public profile.",
    accent: "#93C5FD",
    emoji: "💻",
  },
  {
    key: "roblox",
    name: "Roblox",
    description: "Feature your universe, avatar links, and creator presence in one block.",
    accent: "#FF4757",
    emoji: "🧱",
  },
  {
    key: "telegram",
    name: "Telegram",
    description: "Add direct message access and channel visibility with a cleaner CTA.",
    accent: "#27A7E7",
    emoji: "✈️",
  },
  {
    key: "lastfm",
    name: "Last.fm",
    description: "Surface listening habits, scrobbles, and taste signals with a music-first card.",
    accent: "#D51007",
    emoji: "🎵",
  },
  {
    key: "statsfm",
    name: "Stats.fm",
    description: "Preview a richer analytics block for top artists, tracks, and listening trends.",
    accent: "#F472B6",
    emoji: "📊",
  },
  {
    key: "valorant",
    name: "Valorant",
    description: "Show rank, agent flair, and competitive identity in a bold hero module.",
    accent: "#FF4655",
    emoji: "🎯",
  },
  {
    key: "chess",
    name: "Chess",
    description: "Add a smart profile block for rating, rapid stats, and daily puzzle flex.",
    accent: "#7DD3FC",
    emoji: "♟️",
  },
  {
    key: "tiktok",
    name: "TikTok",
    description: "Pull attention to short-form content with a punchy creator-focused card.",
    accent: "#E5E7EB",
    emoji: "🎬",
  },
  {
    key: "instagram",
    name: "Instagram",
    description: "Spotlight reels, feed identity, and visual social proof in a premium block.",
    accent: "#FF5EA8",
    emoji: "📸",
  },
  {
    key: "x",
    name: "X / Twitter",
    description: "Feature your handle and audience touchpoint with a sharp monochrome panel.",
    accent: "#E2E8F0",
    emoji: "🗞️",
  },
  {
    key: "steam",
    name: "Steam",
    description: "Expose game library identity, wishlist hooks, and profile presence cleanly.",
    accent: "#66C0F4",
    emoji: "🎮",
  },
  {
    key: "spotify",
    name: "Spotify",
    description: "Promote now-playing energy, playlists, and audio taste with Yotei polish.",
    accent: "#1ED760",
    emoji: "🟢",
  },
  {
    key: "youtube",
    name: "YouTube",
    description: "Create a channel-forward block for uploads, premieres, and long-form content.",
    accent: "#FF3131",
    emoji: "▶️",
  },
  {
    key: "twitch",
    name: "Twitch",
    description: "Give livestream identity a dedicated slot with room for status and CTA later.",
    accent: "#A970FF",
    emoji: "🟣",
  },
  {
    key: "minecraft",
    name: "Minecraft",
    description: "Reserve a custom block for username, realm presence, or server showcase.",
    accent: "#34D399",
    emoji: "⛏️",
  },
  {
    key: "weather",
    name: "Weather",
    description: "Blend ambient location vibes into the profile with a stylish live-info module.",
    accent: "#38BDF8",
    emoji: "☁️",
  },
  {
    key: "brawl-stars",
    name: "Brawl Stars",
    description: "Make space for trophies, favorite brawler, and mobile-gamer identity.",
    accent: "#F59E0B",
    emoji: "⭐",
  },
];

const previewStats = [
  { label: "Blocks ready", value: "18" },
  { label: "Preview mode", value: "Static UI" },
  { label: "Layout state", value: "Enabled" },
];

export default async function SocialsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedKey = integrations.some((item) => item.key === params.active)
    ? String(params.active)
    : "discord";
  const selectedItem =
    integrations.find((item) => item.key === selectedKey) ?? integrations[0];

  return (
    <main style={pageStyle}>
      <section style={heroPanelStyle}>
        <div style={heroCopyStyle}>
          <div style={eyebrowStyle}>Social Integration Layout Blocks</div>
          <h1 style={heroTitleStyle}>Social Integrations</h1>
          <p style={heroDescriptionStyle}>
            Build a more expressive public profile with modular social blocks.
            This dashboard preview stays UI-only for now, keeping the route
            cheap to build while the design direction evolves.
          </p>

          <div style={heroActionsStyle}>
            <Link href={`?active=${selectedItem.key}`} style={primaryActionStyle}>
              Keep {selectedItem.name} selected
            </Link>
            <Link href="/dashboard/links" style={secondaryActionStyle}>
              Open Links Manager
            </Link>
          </div>
        </div>

        <div style={heroRailStyle}>
          <div style={enabledBadgeStyle}>Enabled</div>

          <div style={previewPanelStyle}>
            <div style={previewLabelStyle}>Current preview</div>
            <div style={previewTitleStyle}>
              <span aria-hidden="true" style={{ marginRight: "10px" }}>
                {selectedItem.emoji}
              </span>
              {selectedItem.name}
            </div>
            <p style={previewTextStyle}>{selectedItem.description}</p>
          </div>

          <div style={statGridStyle}>
            {previewStats.map((stat) => (
              <div key={stat.label} style={statCardStyle}>
                <div style={statValueStyle}>{stat.value}</div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={subPanelStyle}>
        <div>
          <div style={sectionEyebrowStyle}>Available modules</div>
          <h2 style={sectionTitleStyle}>Choose what your public profile can show</h2>
        </div>
        <div style={sectionHintStyle}>
          Select a card to update the preview state without touching database or APIs.
        </div>
      </section>

      <section style={gridStyle}>
        {integrations.map((item) => (
          <SocialIntegrationCard
            key={item.key}
            item={item}
            selected={item.key === selectedKey}
            href={`/dashboard/socials?active=${item.key}`}
          />
        ))}
      </section>

      <section style={footerNoteStyle}>
        <div style={footerIconWrapStyle} aria-hidden="true">
          🎮
        </div>
        <p style={footerTextStyle}>
          This screen stays UI-only: no schema changes, no writes, and no public
          rendering side effects were introduced here.
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const heroPanelStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(135deg, rgba(18,17,24,0.98), rgba(7,7,10,0.98))",
  boxShadow: "0 28px 70px rgba(0,0,0,0.34)",
};

const heroCopyStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "16px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(244,114,182,0.18)",
  backgroundColor: "rgba(244,114,182,0.08)",
  color: "#f9a8d4",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "52px",
  lineHeight: 0.95,
  letterSpacing: "-0.04em",
};

const heroDescriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: "58ch",
  color: "#b4bdd1",
  fontSize: "16px",
  lineHeight: 1.7,
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
};

const primaryActionStyle: CSSProperties = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: "16px",
  color: "#ffffff",
  fontWeight: 800,
  background:
    "linear-gradient(135deg, rgba(236,72,153,0.92), rgba(124,58,237,0.92))",
};

const secondaryActionStyle: CSSProperties = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: "16px",
  color: "#dbe4ff",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const heroRailStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "14px",
};

const enabledBadgeStyle: CSSProperties = {
  justifySelf: "end",
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  backgroundColor: "rgba(96,165,250,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#c4b5fd",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontSize: "12px",
};

const previewPanelStyle: CSSProperties = {
  borderRadius: "24px",
  padding: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const previewLabelStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "10px",
};

const previewTitleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontSize: "30px",
  fontWeight: 900,
  marginBottom: "10px",
};

const previewTextStyle: CSSProperties = {
  margin: 0,
  color: "#b7c0d4",
  lineHeight: 1.7,
  fontSize: "14px",
};

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
};

const statCardStyle: CSSProperties = {
  borderRadius: "20px",
  padding: "16px",
  border: "1px solid rgba(255,255,255,0.07)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const statValueStyle: CSSProperties = {
  fontSize: "24px",
  fontWeight: 900,
  color: "#ffffff",
};

const statLabelStyle: CSSProperties = {
  marginTop: "6px",
  color: "#96a0b8",
  fontSize: "13px",
};

const subPanelStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  flexWrap: "wrap",
  gap: "14px",
  padding: "22px 26px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(8,8,12,0.9)",
};

const sectionEyebrowStyle: CSSProperties = {
  color: "#8b9ac4",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.1,
};

const sectionHintStyle: CSSProperties = {
  maxWidth: "34ch",
  color: "#9da7bf",
  fontSize: "14px",
  lineHeight: 1.6,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const footerNoteStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "18px 20px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(9,9,12,0.92)",
};

const footerIconWrapStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(59,130,246,0.10)",
  border: "1px solid rgba(59,130,246,0.18)",
  flexShrink: 0,
};

const footerTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.6,
  fontSize: "14px",
};
