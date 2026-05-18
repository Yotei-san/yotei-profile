import Link from "next/link";
import type { CSSProperties } from "react";
import FormActionButton from "@/app/components/FormActionButton";
import DiscordBlockPreview from "@/app/dashboard/components/DiscordBlockPreview";
import GitHubBlockPreview from "@/app/dashboard/components/GitHubBlockPreview";
import CreatorVideoBlockPreview from "@/app/dashboard/components/CreatorVideoBlockPreview";
import LiveEmbedBlockPreview from "@/app/dashboard/components/LiveEmbedBlockPreview";
import SpotifyBlockPreview from "@/app/dashboard/components/SpotifyBlockPreview";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";
import SocialIntegrationCard, {
  type SocialIntegrationItem,
} from "@/app/dashboard/components/SocialIntegrationCard";
import VerificationLockedPanel from "@/app/dashboard/components/VerificationLockedPanel";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import {
  isEmailVerificationEnforced,
  isEmailVerified,
} from "@/app/lib/email-verification";
import {
  readLiveEmbedMetadata,
  type LiveEmbedPlatform,
} from "@/app/lib/live-embed";
import { prisma } from "@/app/lib/prisma";
import {
  deleteSocialBlock,
  toggleSocialBlock,
  upsertDiscordBlock,
  upsertGitHubBlock,
  upsertLiveEmbedBlock,
  upsertSpotifyBlock,
  upsertCreatorVideoBlock,
} from "./actions";

type PageProps = {
  searchParams?: Promise<{
    active?: string;
    success?: string;
    error?: string;
  }>;
};

type DiscordBlockState = {
  id: string;
  username: string | null;
  discordUserId: string | null;
  url: string | null;
  statusText: string | null;
  isEnabled: boolean;
};

type GitHubBlockState = {
  id: string;
  username: string | null;
  url: string | null;
  statusText: string | null;
  featuredRepo: string | null;
  isEnabled: boolean;
};

type SpotifyBlockState = {
  id: string;
  username: string | null;
  url: string | null;
  trackName: string | null;
  artistName: string | null;
  statusText: string | null;
  isEnabled: boolean;
};

type CreatorVideoBlockState = {
  id: string;
  username: string | null;
  url: string | null;
  headline: string | null;
  featuredVideoTitle: string | null;
  isEnabled: boolean;
};

type LiveEmbedBlockState = {
  id: string;
  platform: LiveEmbedPlatform;
  username: string | null;
  url: string | null;
  streamTitle: string | null;
  embedUrl: string | null;
  openUrl: string | null;
  accentColor: string | null;
  isLive: boolean;
  isEnabled: boolean;
};

type SocialsPageUser = {
  username: string;
  emailVerified: Date | null;
  socialBlocks: Array<{
    id: string;
    platform: string;
    title: string | null;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
    sortOrder: number;
  }>;
};

const integrations: SocialIntegrationItem[] = [
  {
    key: "discord",
    name: "Discord",
    description: "Show your server, identity, and future live presence in a premium block.",
    accent: "#5865F2",
    icon: "discord",
  },
  {
    key: "github",
    name: "GitHub",
    description: "Highlight repos, streaks, and developer identity inside your public profile.",
    accent: "#93C5FD",
    icon: "github",
  },
  {
    key: "roblox",
    name: "Roblox",
    description: "Feature your universe, avatar links, and creator presence in one block.",
    accent: "#FF4757",
    icon: "roblox",
  },
  {
    key: "telegram",
    name: "Telegram",
    description: "Add direct message access and channel visibility with a cleaner CTA.",
    accent: "#27A7E7",
    icon: "telegram",
  },
  {
    key: "lastfm",
    name: "Last.fm",
    description: "Surface listening habits, scrobbles, and taste signals with a music-first card.",
    accent: "#D51007",
    icon: "lastfm",
  },
  {
    key: "statsfm",
    name: "Stats.fm",
    description: "Preview a richer analytics block for top artists, tracks, and listening trends.",
    accent: "#F472B6",
    icon: "statsfm",
  },
  {
    key: "valorant",
    name: "Valorant",
    description: "Show rank, agent flair, and competitive identity in a bold hero module.",
    accent: "#FF4655",
    icon: "valorant",
  },
  {
    key: "chess",
    name: "Chess",
    description: "Add a smart profile block for rating, rapid stats, and daily puzzle flex.",
    accent: "#7DD3FC",
    icon: "chess",
  },
  {
    key: "tiktok",
    name: "TikTok",
    description: "Pull attention to short-form content with a punchy creator-focused card.",
    accent: "#E5E7EB",
    icon: "tiktok",
  },
  {
    key: "instagram",
    name: "Instagram",
    description: "Spotlight reels, feed identity, and visual social proof in a premium block.",
    accent: "#FF5EA8",
    icon: "instagram",
  },
  {
    key: "x",
    name: "X / Twitter",
    description: "Feature your handle and audience touchpoint with a sharp monochrome panel.",
    accent: "#E2E8F0",
    icon: "x",
  },
  {
    key: "steam",
    name: "Steam",
    description: "Expose game library identity, wishlist hooks, and profile presence cleanly.",
    accent: "#66C0F4",
    icon: "steam",
  },
  {
    key: "spotify",
    name: "Spotify",
    description: "Promote now-playing energy, playlists, and audio taste with Yotei polish.",
    accent: "#1ED760",
    icon: "spotify",
  },
  {
    key: "youtube",
    name: "YouTube",
    description: "Create a channel-forward block for uploads, premieres, and long-form content.",
    accent: "#FF3131",
    icon: "youtube",
  },
  {
    key: "twitch",
    name: "Twitch",
    description: "Give livestream identity a dedicated slot with room for status and CTA later.",
    accent: "#A970FF",
    icon: "twitch",
  },
  {
    key: "twitch_live",
    name: "Twitch Live",
    description: "Premium live block with official Twitch embed, ON AIR glow, and responsive player.",
    accent: "#A970FF",
    icon: "twitch",
  },
  {
    key: "youtube_live",
    name: "YouTube Live",
    description: "Turn live URLs, channel URLs, or video URLs into a premium ON AIR player block.",
    accent: "#FF3131",
    icon: "youtube",
  },
  {
    key: "kick_live",
    name: "Kick Live",
    description: "Show a premium live status card with CTA-first treatment when embed support is limited.",
    accent: "#53FC18",
    icon: "kick",
  },
  {
    key: "minecraft",
    name: "Minecraft",
    description: "Reserve a custom block for username, realm presence, or server showcase.",
    accent: "#34D399",
    icon: "minecraft",
  },
  {
    key: "weather",
    name: "Weather",
    description: "Blend ambient location vibes into the profile with a stylish live-info module.",
    accent: "#38BDF8",
    icon: "weather",
  },
  {
    key: "brawl-stars",
    name: "Brawl Stars",
    description: "Make space for trophies, favorite brawler, and mobile-gamer identity.",
    accent: "#F59E0B",
    icon: "brawl-stars",
  },
];

export default async function SocialsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};
  const selectedKey = integrations.some((item) => item.key === params.active)
    ? String(params.active)
    : "discord";
  const selectedItem =
    integrations.find((item) => item.key === selectedKey) ?? integrations[0];

  const user = (await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      username: true,
      emailVerified: true,
      socialBlocks: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          platform: true,
          title: true,
          username: true,
          url: true,
          metadata: true,
          isEnabled: true,
          sortOrder: true,
        },
      },
    } as any,
  })) as SocialsPageUser | null;

  const resolvedUser = user ?? (await redirectWithClearedSession());

  if (isEmailVerificationEnforced() && !isEmailVerified(resolvedUser)) {
    return (
      <VerificationLockedPanel
        title="Verify your email to unlock social blocks."
        description="Your dashboard is active, but live embeds and social publishing stay locked until your email is verified. Finish verification to enable Twitch, YouTube, Kick and the rest of your Social Presence blocks."
      />
    );
  }

  const discordBlock = getDiscordBlock(resolvedUser.socialBlocks);
  const githubBlock = getGitHubBlock(resolvedUser.socialBlocks);
  const spotifyBlock = getSpotifyBlock(resolvedUser.socialBlocks);
  const youtubeBlock = getCreatorVideoBlock(resolvedUser.socialBlocks, "youtube");
  const twitchBlock = getCreatorVideoBlock(resolvedUser.socialBlocks, "twitch");
  const twitchLiveBlock = getLiveEmbedBlock(resolvedUser.socialBlocks, "twitch_live");
  const youtubeLiveBlock = getLiveEmbedBlock(resolvedUser.socialBlocks, "youtube_live");
  const kickLiveBlock = getLiveEmbedBlock(resolvedUser.socialBlocks, "kick_live");
  const configuredCount = resolvedUser.socialBlocks.length;
  const enabledCount = resolvedUser.socialBlocks.filter((block) => block.isEnabled).length;
  const successMessage = getSuccessMessage(params.success);
  const errorMessage = getErrorMessage(params.error);
  const discordCardHref = "/dashboard/socials?active=discord#discord-block-form";
  const githubCardHref = "/dashboard/socials?active=github#github-block-form";
  const spotifyCardHref = "/dashboard/socials?active=spotify#spotify-block-form";
  const youtubeCardHref = "/dashboard/socials?active=youtube#youtube-block-form";
  const twitchCardHref = "/dashboard/socials?active=twitch#twitch-block-form";
  const twitchLiveCardHref = "/dashboard/socials?active=twitch_live#twitch-live-block-form";
  const youtubeLiveCardHref =
    "/dashboard/socials?active=youtube_live#youtube-live-block-form";
  const kickLiveCardHref = "/dashboard/socials?active=kick_live#kick-live-block-form";
  const selectedIsDiscord = selectedKey === "discord";
  const selectedIsGitHub = selectedKey === "github";
  const selectedIsSpotify = selectedKey === "spotify";
  const selectedIsYouTube = selectedKey === "youtube";
  const selectedIsTwitch = selectedKey === "twitch";
  const selectedIsTwitchLive = selectedKey === "twitch_live";
  const selectedIsYouTubeLive = selectedKey === "youtube_live";
  const selectedIsKickLive = selectedKey === "kick_live";
  const heroPrimaryHref = selectedIsGitHub
    ? githubCardHref
    : selectedIsSpotify
      ? spotifyCardHref
      : selectedIsYouTube
        ? youtubeCardHref
        : selectedIsTwitch
          ? twitchCardHref
          : selectedIsTwitchLive
            ? twitchLiveCardHref
            : selectedIsYouTubeLive
              ? youtubeLiveCardHref
              : selectedIsKickLive
                ? kickLiveCardHref
      : discordCardHref;
  const heroPrimaryLabel = selectedIsGitHub
    ? githubBlock
      ? "Edit GitHub Block"
      : "Configure GitHub"
    : selectedIsSpotify
      ? spotifyBlock
        ? "Edit Spotify Block"
        : "Configure Spotify"
      : selectedIsYouTube
        ? youtubeBlock
          ? "Edit YouTube Block"
          : "Configure YouTube"
        : selectedIsTwitch
          ? twitchBlock
            ? "Edit Twitch Block"
            : "Configure Twitch"
          : selectedIsTwitchLive
            ? twitchLiveBlock
              ? "Edit Twitch Live"
              : "Configure Twitch Live"
            : selectedIsYouTubeLive
              ? youtubeLiveBlock
                ? "Edit YouTube Live"
                : "Configure YouTube Live"
              : selectedIsKickLive
                ? kickLiveBlock
                  ? "Edit Kick Live"
                  : "Configure Kick Live"
      : discordBlock
        ? "Edit Discord Block"
        : "Configure Discord";

  return (
    <main style={pageStyle}>
      <section style={heroPanelStyle}>
        <div style={heroCopyStyle}>
          <div style={eyebrowStyle}>Social Blocks Phase 1</div>
          <h1 style={heroTitleStyle}>Social Integrations</h1>
          <p style={heroDescriptionStyle}>
            Discord, GitHub, Spotify, YouTube, Twitch, Twitch Live, YouTube Live and
            Kick Live are now real blocks you can configure, preview, and publish on
            your public profile. The remaining integrations stay as visual previews
            while the block system expands safely.
          </p>

          <div style={heroActionsStyle}>
            <Link href={heroPrimaryHref} style={primaryActionStyle}>
              {heroPrimaryLabel}
            </Link>
            <Link
              href={`/${resolvedUser.username}`}
              style={secondaryActionStyle}
              target="_blank"
            >
              Open Public Profile
            </Link>
          </div>
        </div>

        <div style={heroRailStyle}>
          <div
            style={
              selectedIsGitHub
                ? githubBlock?.isEnabled
                  ? enabledBadgeStyle
                  : mutedBadgeStyle
                : selectedIsSpotify
                  ? spotifyBlock?.isEnabled
                    ? enabledBadgeStyle
                    : mutedBadgeStyle
                  : selectedIsYouTube
                    ? youtubeBlock?.isEnabled
                      ? enabledBadgeStyle
                      : mutedBadgeStyle
                    : selectedIsTwitch
                      ? twitchBlock?.isEnabled
                        ? enabledBadgeStyle
                        : mutedBadgeStyle
                      : selectedIsTwitchLive
                        ? twitchLiveBlock?.isEnabled
                          ? enabledBadgeStyle
                          : mutedBadgeStyle
                        : selectedIsYouTubeLive
                          ? youtubeLiveBlock?.isEnabled
                            ? enabledBadgeStyle
                            : mutedBadgeStyle
                          : selectedIsKickLive
                            ? kickLiveBlock?.isEnabled
                              ? enabledBadgeStyle
                              : mutedBadgeStyle
                : discordBlock?.isEnabled
                  ? enabledBadgeStyle
                  : mutedBadgeStyle
            }
          >
            {selectedIsGitHub
              ? githubBlock?.isEnabled
                ? "GitHub live"
                : githubBlock
                  ? "Saved draft"
                  : "Not configured"
              : selectedIsSpotify
                ? spotifyBlock?.isEnabled
                  ? "Spotify live"
                  : spotifyBlock
                    ? "Saved draft"
                    : "Not configured"
                : selectedIsYouTube
                  ? youtubeBlock?.isEnabled
                    ? "YouTube live"
                    : youtubeBlock
                      ? "Saved draft"
                      : "Not configured"
                  : selectedIsTwitch
                    ? twitchBlock?.isEnabled
                      ? "Twitch live"
                      : twitchBlock
                        ? "Saved draft"
                        : "Not configured"
                    : selectedIsTwitchLive
                      ? twitchLiveBlock?.isLive && twitchLiveBlock?.isEnabled
                        ? "Twitch ON AIR"
                        : twitchLiveBlock
                          ? "Saved draft"
                          : "Not configured"
                      : selectedIsYouTubeLive
                        ? youtubeLiveBlock?.isLive && youtubeLiveBlock?.isEnabled
                          ? "YouTube ON AIR"
                          : youtubeLiveBlock
                            ? "Saved draft"
                            : "Not configured"
                        : selectedIsKickLive
                          ? kickLiveBlock?.isLive && kickLiveBlock?.isEnabled
                            ? "Kick ON AIR"
                            : kickLiveBlock
                              ? "Saved draft"
                              : "Not configured"
              : discordBlock?.isEnabled
                ? "Discord live"
                : discordBlock
                  ? "Saved draft"
                  : "Not configured"}
          </div>

          {selectedIsDiscord ? (
            <DiscordBlockPreview
              username={discordBlock?.username ?? null}
              statusText={discordBlock?.statusText ?? null}
              url={discordBlock?.url ?? null}
              enabled={discordBlock?.isEnabled ?? false}
            />
          ) : selectedIsGitHub ? (
            <GitHubBlockPreview
              username={githubBlock?.username ?? null}
              statusText={githubBlock?.statusText ?? null}
              featuredRepo={githubBlock?.featuredRepo ?? null}
              url={githubBlock?.url ?? null}
              enabled={githubBlock?.isEnabled ?? false}
            />
          ) : selectedIsSpotify ? (
            <SpotifyBlockPreview
              username={spotifyBlock?.username ?? null}
              trackName={spotifyBlock?.trackName ?? null}
              artistName={spotifyBlock?.artistName ?? null}
              statusText={spotifyBlock?.statusText ?? null}
              url={spotifyBlock?.url ?? null}
              enabled={spotifyBlock?.isEnabled ?? false}
            />
          ) : selectedIsYouTube ? (
            <CreatorVideoBlockPreview
              platform="youtube"
              channelName={youtubeBlock?.username ?? null}
              headline={youtubeBlock?.headline ?? null}
              featuredVideoTitle={youtubeBlock?.featuredVideoTitle ?? null}
              url={youtubeBlock?.url ?? null}
              enabled={youtubeBlock?.isEnabled ?? false}
            />
          ) : selectedIsTwitch ? (
            <CreatorVideoBlockPreview
              platform="twitch"
              channelName={twitchBlock?.username ?? null}
              headline={twitchBlock?.headline ?? null}
              featuredVideoTitle={twitchBlock?.featuredVideoTitle ?? null}
              url={twitchBlock?.url ?? null}
              enabled={twitchBlock?.isEnabled ?? false}
            />
          ) : selectedIsTwitchLive ? (
            <LiveEmbedBlockPreview
              platform="twitch_live"
              channelName={twitchLiveBlock?.username ?? null}
              streamTitle={twitchLiveBlock?.streamTitle ?? null}
              url={twitchLiveBlock?.url ?? null}
              openUrl={twitchLiveBlock?.openUrl ?? null}
              embedUrl={twitchLiveBlock?.embedUrl ?? null}
              accentColor={twitchLiveBlock?.accentColor ?? null}
              isLive={twitchLiveBlock?.isLive ?? false}
              enabled={twitchLiveBlock?.isEnabled ?? false}
            />
          ) : selectedIsYouTubeLive ? (
            <LiveEmbedBlockPreview
              platform="youtube_live"
              channelName={youtubeLiveBlock?.username ?? null}
              streamTitle={youtubeLiveBlock?.streamTitle ?? null}
              url={youtubeLiveBlock?.url ?? null}
              openUrl={youtubeLiveBlock?.openUrl ?? null}
              embedUrl={youtubeLiveBlock?.embedUrl ?? null}
              accentColor={youtubeLiveBlock?.accentColor ?? null}
              isLive={youtubeLiveBlock?.isLive ?? false}
              enabled={youtubeLiveBlock?.isEnabled ?? false}
            />
          ) : selectedIsKickLive ? (
            <LiveEmbedBlockPreview
              platform="kick_live"
              channelName={kickLiveBlock?.username ?? null}
              streamTitle={kickLiveBlock?.streamTitle ?? null}
              url={kickLiveBlock?.url ?? null}
              openUrl={kickLiveBlock?.openUrl ?? null}
              embedUrl={kickLiveBlock?.embedUrl ?? null}
              accentColor={kickLiveBlock?.accentColor ?? null}
              isLive={kickLiveBlock?.isLive ?? false}
              enabled={kickLiveBlock?.isEnabled ?? false}
            />
          ) : (
            <div style={previewPanelStyle}>
              <div style={previewLabelStyle}>Current preview</div>
              <div style={previewTitleStyle}>
                <span aria-hidden="true" style={previewIconWrapStyle}>
                  <SocialBrandIcon name={selectedItem.icon} size={20} />
                </span>
                {selectedItem.name}
              </div>
              <p style={previewTextStyle}>{selectedItem.description}</p>
              <div style={previewHintPanelStyle}>
                Discord, GitHub, Spotify, YouTube, Twitch, Twitch Live, YouTube Live
                and Kick Live are functional in this phase. The other cards stay in
                design preview mode for now.
              </div>
            </div>
          )}

          <div style={statGridStyle}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{configuredCount}</div>
              <div style={statLabelStyle}>Configured blocks</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{enabledCount}</div>
              <div style={statLabelStyle}>Enabled publicly</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>8</div>
              <div style={statLabelStyle}>Functional blocks</div>
            </div>
          </div>
        </div>
      </section>

      {successMessage ? <div style={successBoxStyle}>{successMessage}</div> : null}
      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

      <section style={subPanelStyle}>
        <div>
          <div style={sectionEyebrowStyle}>Available modules</div>
          <h2 style={sectionTitleStyle}>Choose what your public profile can show</h2>
        </div>
        <div style={sectionHintStyle}>
          Discord, GitHub, Spotify, YouTube, Twitch, Twitch Live, YouTube Live and Kick
          Live are functional now. The remaining integrations stay lightweight and visual
          until each block gets its own safe backend phase.
        </div>
      </section>

      <section style={gridStyle}>
        {integrations.map((item) => {
          const isDiscord = item.key === "discord";
          const isGitHub = item.key === "github";
          const isSpotify = item.key === "spotify";
          const isYouTube = item.key === "youtube";
          const isTwitch = item.key === "twitch";
          const isTwitchLive = item.key === "twitch_live";
          const isYouTubeLive = item.key === "youtube_live";
          const isKickLive = item.key === "kick_live";
          const isConfigured = isDiscord
            ? Boolean(discordBlock?.username)
            : isGitHub
              ? Boolean(githubBlock?.username)
              : isSpotify
                ? Boolean(spotifyBlock?.username)
                : isYouTube
                  ? Boolean(youtubeBlock?.username)
                  : isTwitch
                    ? Boolean(twitchBlock?.username)
                    : isTwitchLive
                      ? Boolean(twitchLiveBlock?.username || twitchLiveBlock?.url)
                      : isYouTubeLive
                        ? Boolean(youtubeLiveBlock?.username || youtubeLiveBlock?.url)
                        : isKickLive
                          ? Boolean(kickLiveBlock?.username || kickLiveBlock?.url)
              : false;
          const isEnabled = isDiscord
            ? Boolean(discordBlock?.isEnabled)
            : isGitHub
              ? Boolean(githubBlock?.isEnabled)
              : isSpotify
                ? Boolean(spotifyBlock?.isEnabled)
                : isYouTube
                  ? Boolean(youtubeBlock?.isEnabled)
                  : isTwitch
                    ? Boolean(twitchBlock?.isEnabled)
                    : isTwitchLive
                      ? Boolean(twitchLiveBlock?.isEnabled)
                      : isYouTubeLive
                        ? Boolean(youtubeLiveBlock?.isEnabled)
                        : isKickLive
                          ? Boolean(kickLiveBlock?.isEnabled)
              : false;
          const isOnAir = isTwitchLive
            ? Boolean(twitchLiveBlock?.isEnabled && twitchLiveBlock?.isLive)
            : isYouTubeLive
              ? Boolean(youtubeLiveBlock?.isEnabled && youtubeLiveBlock?.isLive)
              : isKickLive
                ? Boolean(kickLiveBlock?.isEnabled && kickLiveBlock?.isLive)
                : false;

          return (
            <SocialIntegrationCard
              key={item.key}
              item={item}
              selected={item.key === selectedKey}
              href={
                isDiscord
                  ? discordCardHref
                  : isGitHub
                    ? githubCardHref
                  : isSpotify
                    ? spotifyCardHref
                    : isYouTube
                      ? youtubeCardHref
                      : isTwitch
                        ? twitchCardHref
                        : isTwitchLive
                          ? twitchLiveCardHref
                          : isYouTubeLive
                            ? youtubeLiveCardHref
                            : isKickLive
                              ? kickLiveCardHref
                    : `/dashboard/socials?active=${item.key}`
              }
              stateLabel={
                isDiscord ||
                isGitHub ||
                isSpotify ||
                isYouTube ||
                isTwitch ||
                isTwitchLive ||
                isYouTubeLive ||
                isKickLive
                  ? isConfigured
                    ? isOnAir
                      ? "ON AIR"
                      : isEnabled
                        ? "Configured"
                        : "Saved"
                    : "Setup"
                  : item.key === selectedKey
                    ? "Selected"
                    : "Preview"
              }
              footerLabel={
                isDiscord ||
                isGitHub ||
                isSpotify ||
                isYouTube ||
                isTwitch ||
                isTwitchLive ||
                isYouTubeLive ||
                isKickLive
                  ? isConfigured
                    ? isOnAir
                      ? "ON AIR on your public profile"
                      : "Live block available on profile"
                    : "Real social block"
                  : "Design preview only in this phase"
              }
              actionLabel={
                isDiscord ||
                isGitHub ||
                isSpotify ||
                isYouTube ||
                isTwitch ||
                isTwitchLive ||
                isYouTubeLive ||
                isKickLive
                  ? isConfigured
                    ? "Edit"
                    : "Configure"
                  : "Preview"
              }
            />
          );
        })}
      </section>

      <section id="youtube-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>YouTube Block</div>
            <h2 style={sectionTitleStyle}>Configure your YouTube creator block</h2>
            <p style={sectionDescriptionStyle}>
              This saves a manual YouTube channel block for now. Real channel data and richer video
              signals can plug into the same structure later without breaking your profile.
            </p>
          </div>

          <form action={upsertCreatorVideoBlock} style={formGridStyle}>
            <input type="hidden" name="platformType" value="youtube" />

            <label style={labelStyle}>
              Channel name
              <input
                type="text"
                name="username"
                required
                maxLength={64}
                placeholder="ex: Yotei Channel"
                defaultValue={youtubeBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Channel URL
              <input
                type="url"
                name="url"
                placeholder="https://youtube.com/..."
                defaultValue={youtubeBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Headline
              <textarea
                name="headline"
                rows={4}
                maxLength={120}
                placeholder="Short creator headline, upload vibe, or channel positioning."
                defaultValue={youtubeBlock?.headline ?? ""}
                style={textareaStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Featured video title
              <input
                type="text"
                name="featuredVideoTitle"
                maxLength={120}
                placeholder="ex: Building the ultimate Yotei profile"
                defaultValue={youtubeBlock?.featuredVideoTitle ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={youtubeBlock?.isEnabled ?? true}
              />
              <span>Show this block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Future YouTube integrations will plug into metadata later. This phase only stores
              manual creator data safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={youtubeBlock ? "Save YouTube Block" : "Create YouTube Block"}
                pendingLabel={
                  youtubeBlock ? "Saving YouTube Block..." : "Creating YouTube Block..."
                }
                style={submitButtonStyle}
              />

              {youtubeBlock ? (
                <>
                  <FormActionButton
                    idleLabel={youtubeBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, youtubeBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, youtubeBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <CreatorVideoBlockPreview
            platform="youtube"
            channelName={youtubeBlock?.username ?? null}
            headline={youtubeBlock?.headline ?? null}
            featuredVideoTitle={youtubeBlock?.featuredVideoTitle ?? null}
            url={youtubeBlock?.url ?? null}
            enabled={youtubeBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When enabled, this block appears with the other Social Presence cards on your public profile.
            </p>
          </div>
        </div>
      </section>

      <section id="twitch-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>Twitch Block</div>
            <h2 style={sectionTitleStyle}>Configure your Twitch creator block</h2>
            <p style={sectionDescriptionStyle}>
              This saves a manual Twitch channel block for now. Real livestream and viewer signals
              can plug into the same structure later without breaking your profile.
            </p>
          </div>

          <form action={upsertCreatorVideoBlock} style={formGridStyle}>
            <input type="hidden" name="platformType" value="twitch" />

            <label style={labelStyle}>
              Channel name
              <input
                type="text"
                name="username"
                required
                maxLength={64}
                placeholder="ex: YoteiLive"
                defaultValue={twitchBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Channel URL
              <input
                type="url"
                name="url"
                placeholder="https://twitch.tv/..."
                defaultValue={twitchBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Headline
              <textarea
                name="headline"
                rows={4}
                maxLength={120}
                placeholder="Short creator headline, stream vibe, or channel positioning."
                defaultValue={twitchBlock?.headline ?? ""}
                style={textareaStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Featured stream or video title
              <input
                type="text"
                name="featuredVideoTitle"
                maxLength={120}
                placeholder="ex: Late night ranked grind"
                defaultValue={twitchBlock?.featuredVideoTitle ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={twitchBlock?.isEnabled ?? true}
              />
              <span>Show this block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Future Twitch integrations will plug into metadata later. This phase only stores
              manual creator data safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={twitchBlock ? "Save Twitch Block" : "Create Twitch Block"}
                pendingLabel={
                  twitchBlock ? "Saving Twitch Block..." : "Creating Twitch Block..."
                }
                style={submitButtonStyle}
              />

              {twitchBlock ? (
                <>
                  <FormActionButton
                    idleLabel={twitchBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, twitchBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, twitchBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <CreatorVideoBlockPreview
            platform="twitch"
            channelName={twitchBlock?.username ?? null}
            headline={twitchBlock?.headline ?? null}
            featuredVideoTitle={twitchBlock?.featuredVideoTitle ?? null}
            url={twitchBlock?.url ?? null}
            enabled={twitchBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When enabled, this block appears with the other Social Presence cards on your public profile.
            </p>
          </div>
        </div>
      </section>

      <section id="twitch-live-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>Twitch Live</div>
            <h2 style={sectionTitleStyle}>Configure your Twitch LIVE NOW block</h2>
            <p style={sectionDescriptionStyle}>
              Official Twitch embed with safe parent detection, manual ON AIR status, and a
              premium social presence treatment.
            </p>
          </div>

          <form action={upsertLiveEmbedBlock} style={formGridStyle}>
            <input type="hidden" name="platformType" value="twitch_live" />

            <label style={labelStyle}>
              Channel name
              <input
                type="text"
                name="channelName"
                maxLength={80}
                placeholder="ex: YoteiLive"
                defaultValue={twitchLiveBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Stream URL
              <input
                type="url"
                name="streamUrl"
                placeholder="https://twitch.tv/..."
                defaultValue={twitchLiveBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Stream title
              <input
                type="text"
                name="streamTitle"
                maxLength={120}
                placeholder="ex: Ranked grind with neon HUD"
                defaultValue={twitchLiveBlock?.streamTitle ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Accent color
              <input
                type="text"
                name="accentColor"
                maxLength={7}
                placeholder="#a970ff"
                defaultValue={twitchLiveBlock?.accentColor ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="isLive" defaultChecked={twitchLiveBlock?.isLive ?? false} />
              <span>Mark this stream as LIVE NOW</span>
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={twitchLiveBlock?.isEnabled ?? true}
              />
              <span>Show this live block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Twitch preview loads lazily and injects the required <code>parent</code> host
              values for localhost, the Vercel domain, and the current hostname.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={twitchLiveBlock ? "Save Twitch Live" : "Create Twitch Live"}
                pendingLabel={
                  twitchLiveBlock ? "Saving Twitch Live..." : "Creating Twitch Live..."
                }
                style={submitButtonStyle}
              />

              {twitchLiveBlock ? (
                <>
                  <FormActionButton
                    idleLabel={twitchLiveBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, twitchLiveBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, twitchLiveBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <LiveEmbedBlockPreview
            platform="twitch_live"
            channelName={twitchLiveBlock?.username ?? null}
            streamTitle={twitchLiveBlock?.streamTitle ?? null}
            url={twitchLiveBlock?.url ?? null}
            openUrl={twitchLiveBlock?.openUrl ?? null}
            embedUrl={twitchLiveBlock?.embedUrl ?? null}
            accentColor={twitchLiveBlock?.accentColor ?? null}
            isLive={twitchLiveBlock?.isLive ?? false}
            enabled={twitchLiveBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When ON AIR, this block becomes a large LIVE NOW module inside Social Presence
              with the Twitch player and Watch Stream CTA.
            </p>
          </div>
        </div>
      </section>

      <section id="youtube-live-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>YouTube Live</div>
            <h2 style={sectionTitleStyle}>Configure your YouTube LIVE NOW block</h2>
            <p style={sectionDescriptionStyle}>
              Accepts live URLs, channel URLs, and video URLs. The save action resolves a safe
              embed automatically whenever YouTube exposes enough information.
            </p>
          </div>

          <form action={upsertLiveEmbedBlock} style={formGridStyle}>
            <input type="hidden" name="platformType" value="youtube_live" />

            <label style={labelStyle}>
              Channel name
              <input
                type="text"
                name="channelName"
                maxLength={80}
                placeholder="ex: Yotei Streams"
                defaultValue={youtubeLiveBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Stream URL
              <input
                type="url"
                name="streamUrl"
                placeholder="https://youtube.com/watch?v=..."
                defaultValue={youtubeLiveBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Stream title
              <input
                type="text"
                name="streamTitle"
                maxLength={120}
                placeholder="ex: Building the ultimate gamer profile live"
                defaultValue={youtubeLiveBlock?.streamTitle ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Accent color
              <input
                type="text"
                name="accentColor"
                maxLength={7}
                placeholder="#ff3838"
                defaultValue={youtubeLiveBlock?.accentColor ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isLive"
                defaultChecked={youtubeLiveBlock?.isLive ?? false}
              />
              <span>Mark this stream as LIVE NOW</span>
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={youtubeLiveBlock?.isEnabled ?? true}
              />
              <span>Show this live block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              YouTube embeds lazy load only when visible. Channel URLs are resolved to embedable
              live streams when a channel ID can be discovered safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={youtubeLiveBlock ? "Save YouTube Live" : "Create YouTube Live"}
                pendingLabel={
                  youtubeLiveBlock
                    ? "Saving YouTube Live..."
                    : "Creating YouTube Live..."
                }
                style={submitButtonStyle}
              />

              {youtubeLiveBlock ? (
                <>
                  <FormActionButton
                    idleLabel={youtubeLiveBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, youtubeLiveBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, youtubeLiveBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <LiveEmbedBlockPreview
            platform="youtube_live"
            channelName={youtubeLiveBlock?.username ?? null}
            streamTitle={youtubeLiveBlock?.streamTitle ?? null}
            url={youtubeLiveBlock?.url ?? null}
            openUrl={youtubeLiveBlock?.openUrl ?? null}
            embedUrl={youtubeLiveBlock?.embedUrl ?? null}
            accentColor={youtubeLiveBlock?.accentColor ?? null}
            isLive={youtubeLiveBlock?.isLive ?? false}
            enabled={youtubeLiveBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When ON AIR, this block becomes a large LIVE NOW module inside Social Presence
              with responsive YouTube embed and CTA.
            </p>
          </div>
        </div>
      </section>

      <section id="kick-live-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>Kick Live</div>
            <h2 style={sectionTitleStyle}>Configure your Kick LIVE NOW block</h2>
            <p style={sectionDescriptionStyle}>
              Kick uses a premium fallback card with channel identity, strong CTA, and neon
              social presence when official embed support is not reliable enough.
            </p>
          </div>

          <form action={upsertLiveEmbedBlock} style={formGridStyle}>
            <input type="hidden" name="platformType" value="kick_live" />

            <label style={labelStyle}>
              Channel name
              <input
                type="text"
                name="channelName"
                maxLength={80}
                placeholder="ex: YoteiKick"
                defaultValue={kickLiveBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Stream URL
              <input
                type="url"
                name="streamUrl"
                placeholder="https://kick.com/..."
                defaultValue={kickLiveBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Stream title
              <input
                type="text"
                name="streamTitle"
                maxLength={120}
                placeholder="ex: Community queue and late-night chaos"
                defaultValue={kickLiveBlock?.streamTitle ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Accent color
              <input
                type="text"
                name="accentColor"
                maxLength={7}
                placeholder="#53fc18"
                defaultValue={kickLiveBlock?.accentColor ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="isLive" defaultChecked={kickLiveBlock?.isLive ?? false} />
              <span>Mark this stream as LIVE NOW</span>
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={kickLiveBlock?.isEnabled ?? true}
              />
              <span>Show this live block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Kick renders as a premium aesthetic card with fake avatar, ON AIR state, and Watch
              Stream button for a cleaner cross-device experience.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={kickLiveBlock ? "Save Kick Live" : "Create Kick Live"}
                pendingLabel={
                  kickLiveBlock ? "Saving Kick Live..." : "Creating Kick Live..."
                }
                style={submitButtonStyle}
              />

              {kickLiveBlock ? (
                <>
                  <FormActionButton
                    idleLabel={kickLiveBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, kickLiveBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, kickLiveBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <LiveEmbedBlockPreview
            platform="kick_live"
            channelName={kickLiveBlock?.username ?? null}
            streamTitle={kickLiveBlock?.streamTitle ?? null}
            url={kickLiveBlock?.url ?? null}
            openUrl={kickLiveBlock?.openUrl ?? null}
            embedUrl={kickLiveBlock?.embedUrl ?? null}
            accentColor={kickLiveBlock?.accentColor ?? null}
            isLive={kickLiveBlock?.isLive ?? false}
            enabled={kickLiveBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When ON AIR, this block becomes a premium LIVE NOW CTA card in Social Presence,
              optimized for mobile and non-embed fallback flows.
            </p>
          </div>
        </div>
      </section>

      <section id="discord-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>Discord Block</div>
            <h2 style={sectionTitleStyle}>Configure your Discord profile block</h2>
            <p style={sectionDescriptionStyle}>
              This saves a manual Discord block for now. Real-time presence can plug into the
              same structure later without breaking your profile.
            </p>
          </div>

          <form action={upsertDiscordBlock} style={formGridStyle}>
            <label style={labelStyle}>
              Discord username
              <input
                type="text"
                name="username"
                required
                maxLength={64}
                placeholder="ex: yotei"
                defaultValue={discordBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Discord user ID
              <input
                type="text"
                name="discordUserId"
                inputMode="numeric"
                placeholder="optional numeric ID"
                defaultValue={discordBlock?.discordUserId ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Discord invite or profile URL
              <input
                type="url"
                name="url"
                placeholder="https://discord.gg/..."
                defaultValue={discordBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Short status
              <textarea
                name="status"
                rows={4}
                maxLength={120}
                placeholder="Short line for your community vibe, role, or current status."
                defaultValue={discordBlock?.statusText ?? ""}
                style={textareaStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={discordBlock?.isEnabled ?? true}
              />
              <span>Show this block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Future presence fields will plug into metadata later. This phase only stores
              manual profile data safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={discordBlock ? "Save Discord Block" : "Create Discord Block"}
                pendingLabel={
                  discordBlock ? "Saving Discord Block..." : "Creating Discord Block..."
                }
                style={submitButtonStyle}
              />

              {discordBlock ? (
                <>
                  <FormActionButton
                    idleLabel={discordBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, discordBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, discordBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <DiscordBlockPreview
            username={discordBlock?.username ?? null}
            statusText={discordBlock?.statusText ?? null}
            url={discordBlock?.url ?? null}
            enabled={discordBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When enabled, this block appears in a new Social Presence section on your public
              profile before the links list.
            </p>
          </div>
        </div>
      </section>

      <section id="github-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>GitHub Block</div>
            <h2 style={sectionTitleStyle}>Configure your GitHub profile block</h2>
            <p style={sectionDescriptionStyle}>
              This saves a manual GitHub block for now. Real repositories, stats, and contribution
              signals can plug into the same structure later without breaking your profile.
            </p>
          </div>

          <form action={upsertGitHubBlock} style={formGridStyle}>
            <label style={labelStyle}>
              GitHub username
              <input
                type="text"
                name="username"
                required
                maxLength={64}
                placeholder="ex: octocat"
                defaultValue={githubBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              GitHub profile URL
              <input
                type="url"
                name="url"
                placeholder="https://github.com/..."
                defaultValue={githubBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Short status
              <textarea
                name="status"
                rows={4}
                maxLength={120}
                placeholder="Short line for your dev focus, stack, or current momentum."
                defaultValue={githubBlock?.statusText ?? ""}
                style={textareaStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Featured repository
              <input
                type="text"
                name="featuredRepo"
                maxLength={120}
                placeholder="ex: andre/yotei-profile"
                defaultValue={githubBlock?.featuredRepo ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={githubBlock?.isEnabled ?? true}
              />
              <span>Show this block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Future GitHub signals will plug into metadata later. This phase only stores
              manual profile data safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={githubBlock ? "Save GitHub Block" : "Create GitHub Block"}
                pendingLabel={
                  githubBlock ? "Saving GitHub Block..." : "Creating GitHub Block..."
                }
                style={submitButtonStyle}
              />

              {githubBlock ? (
                <>
                  <FormActionButton
                    idleLabel={githubBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, githubBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, githubBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <GitHubBlockPreview
            username={githubBlock?.username ?? null}
            statusText={githubBlock?.statusText ?? null}
            featuredRepo={githubBlock?.featuredRepo ?? null}
            url={githubBlock?.url ?? null}
            enabled={githubBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When enabled, this block appears alongside Discord inside the Social Presence
              section on your public profile.
            </p>
          </div>
        </div>
      </section>

      <section id="spotify-block-form" style={discordSectionStyle}>
        <div style={discordFormColumnStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={sectionEyebrowStyle}>Spotify Block</div>
            <h2 style={sectionTitleStyle}>Configure your Spotify music block</h2>
            <p style={sectionDescriptionStyle}>
              This saves a manual Spotify block for now. Live listening, OAuth and richer music
              signals can plug into the same structure later without breaking your profile.
            </p>
          </div>

          <form action={upsertSpotifyBlock} style={formGridStyle}>
            <label style={labelStyle}>
              Spotify username or display name
              <input
                type="text"
                name="username"
                required
                maxLength={64}
                placeholder="ex: Yotei"
                defaultValue={spotifyBlock?.username ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Spotify URL
              <input
                type="url"
                name="url"
                placeholder="https://open.spotify.com/..."
                defaultValue={spotifyBlock?.url ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Track name
              <input
                type="text"
                name="trackName"
                maxLength={120}
                placeholder="ex: Nightcall"
                defaultValue={spotifyBlock?.trackName ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Artist name
              <input
                type="text"
                name="artistName"
                maxLength={120}
                placeholder="ex: Kavinsky"
                defaultValue={spotifyBlock?.artistName ?? ""}
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              Short status
              <textarea
                name="status"
                rows={4}
                maxLength={120}
                placeholder="Short line for your music taste, current mood, or favorite listening era."
                defaultValue={spotifyBlock?.statusText ?? ""}
                style={textareaStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="isEnabled"
                defaultChecked={spotifyBlock?.isEnabled ?? true}
              />
              <span>Show this block on my public profile</span>
            </label>

            <div style={hintBoxStyle}>
              Future Spotify integrations will plug into metadata later. This phase only stores
              manual music data safely.
            </div>

            <div style={actionRowStyle}>
              <FormActionButton
                idleLabel={spotifyBlock ? "Save Spotify Block" : "Create Spotify Block"}
                pendingLabel={
                  spotifyBlock ? "Saving Spotify Block..." : "Creating Spotify Block..."
                }
                style={submitButtonStyle}
              />

              {spotifyBlock ? (
                <>
                  <FormActionButton
                    idleLabel={spotifyBlock.isEnabled ? "Disable Block" : "Enable Block"}
                    pendingLabel="Updating block..."
                    formAction={toggleSocialBlock.bind(null, spotifyBlock.id)}
                    style={secondaryButtonStyle}
                  />

                  <FormActionButton
                    idleLabel="Delete Block"
                    pendingLabel="Deleting block..."
                    formAction={deleteSocialBlock.bind(null, spotifyBlock.id)}
                    style={dangerButtonStyle}
                  />
                </>
              ) : null}
            </div>
          </form>
        </div>

        <div style={discordPreviewColumnStyle}>
          <div style={previewLabelStyle}>Saved preview</div>
          <SpotifyBlockPreview
            username={spotifyBlock?.username ?? null}
            trackName={spotifyBlock?.trackName ?? null}
            artistName={spotifyBlock?.artistName ?? null}
            statusText={spotifyBlock?.statusText ?? null}
            url={spotifyBlock?.url ?? null}
            enabled={spotifyBlock?.isEnabled ?? false}
            compact
          />

          <div style={previewMetaPanelStyle}>
            <div style={previewMetaTitleStyle}>Public rendering</div>
            <p style={previewMetaTextStyle}>
              When enabled, this block appears alongside Discord and GitHub inside the Social
              Presence section on your public profile.
            </p>
          </div>
        </div>
      </section>

      <section style={footerNoteStyle}>
        <div style={footerIconWrapStyle} aria-hidden="true">
          <SocialBrandIcon
            name={
              selectedIsGitHub
                ? "github"
                : selectedIsSpotify
                  ? "spotify"
                  : selectedIsYouTube
                    ? "youtube"
                    : selectedIsTwitch
                      ? "twitch"
                      : selectedIsTwitchLive
                        ? "twitch"
                        : selectedIsYouTubeLive
                          ? "youtube"
                          : selectedIsKickLive
                            ? "kick"
                      : "discord"
            }
            size={18}
          />
        </div>
        <p style={footerTextStyle}>
          Discord, GitHub, Spotify, YouTube, Twitch, Twitch Live, YouTube Live and Kick
          Live now write to the database and render on the public profile. Other social
          cards remain lightweight previews until their backend phases start.
        </p>
      </section>
    </main>
  );
}

function getDiscordBlock(
  blocks: Array<{
    id: string;
    platform: string;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
  }>
): DiscordBlockState | null {
  const block = blocks.find((item) => item.platform === "discord");

  if (!block) {
    return null;
  }

  const metadata = getMetadataObject(block.metadata);

  return {
    id: block.id,
    username: block.username,
    discordUserId: readMetadataValue(metadata, "discordUserId"),
    url: block.url,
    statusText: readMetadataValue(metadata, "shortStatus"),
    isEnabled: block.isEnabled,
  };
}

function getSpotifyBlock(
  blocks: Array<{
    id: string;
    platform: string;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
  }>
): SpotifyBlockState | null {
  const block = blocks.find((item) => item.platform === "spotify");

  if (!block) {
    return null;
  }

  const metadata = getMetadataObject(block.metadata);

  return {
    id: block.id,
    username: block.username,
    url: block.url,
    trackName: readMetadataValue(metadata, "trackName"),
    artistName: readMetadataValue(metadata, "artistName"),
    statusText: readMetadataValue(metadata, "statusText"),
    isEnabled: block.isEnabled,
  };
}

function getCreatorVideoBlock(
  blocks: Array<{
    id: string;
    platform: string;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
  }>,
  platform: "youtube" | "twitch"
): CreatorVideoBlockState | null {
  const block = blocks.find((item) => item.platform === platform);

  if (!block) {
    return null;
  }

  const metadata = getMetadataObject(block.metadata);

  return {
    id: block.id,
    username: block.username,
    url: block.url,
    headline: readMetadataValue(metadata, "headline"),
    featuredVideoTitle: readMetadataValue(metadata, "featuredVideoTitle"),
    isEnabled: block.isEnabled,
  };
}

function getLiveEmbedBlock(
  blocks: Array<{
    id: string;
    platform: string;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
  }>,
  platform: LiveEmbedPlatform
): LiveEmbedBlockState | null {
  const block = blocks.find((item) => item.platform === platform);

  if (!block) {
    return null;
  }

  const metadata = readLiveEmbedMetadata(block.metadata);

  return {
    id: block.id,
    platform,
    username: block.username,
    url: block.url,
    streamTitle: metadata.streamTitle,
    embedUrl: metadata.embedUrl,
    openUrl: metadata.openUrl,
    accentColor: metadata.accentColor,
    isLive: metadata.isLive,
    isEnabled: block.isEnabled,
  };
}

function getGitHubBlock(
  blocks: Array<{
    id: string;
    platform: string;
    username: string | null;
    url: string | null;
    metadata: unknown;
    isEnabled: boolean;
  }>
): GitHubBlockState | null {
  const block = blocks.find((item) => item.platform === "github");

  if (!block) {
    return null;
  }

  const metadata = getMetadataObject(block.metadata);

  return {
    id: block.id,
    username: block.username,
    url: block.url,
    statusText: readMetadataValue(metadata, "statusText"),
    featuredRepo: readMetadataValue(metadata, "featuredRepo"),
    isEnabled: block.isEnabled,
  };
}

function getMetadataObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readMetadataValue(
  metadata: Record<string, unknown> | null,
  key: string
) {
  if (!metadata) {
    return null;
  }

  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getSuccessMessage(code?: string) {
  if (code === "discord-saved") return "Discord block salvo com sucesso.";
  if (code === "discord-enabled") return "Discord block ativado no perfil publico.";
  if (code === "discord-disabled") return "Discord block desativado no perfil publico.";
  if (code === "discord-deleted") return "Discord block removido com sucesso.";
  if (code === "github-saved") return "GitHub block salvo com sucesso.";
  if (code === "github-enabled") return "GitHub block ativado no perfil publico.";
  if (code === "github-disabled") return "GitHub block desativado no perfil publico.";
  if (code === "github-deleted") return "GitHub block removido com sucesso.";
  if (code === "spotify-saved") return "Spotify block salvo com sucesso.";
  if (code === "spotify-enabled") return "Spotify block ativado no perfil publico.";
  if (code === "spotify-disabled") return "Spotify block desativado no perfil publico.";
  if (code === "spotify-deleted") return "Spotify block removido com sucesso.";
  if (code === "youtube-saved") return "YouTube block salvo com sucesso.";
  if (code === "youtube-enabled") return "YouTube block ativado no perfil publico.";
  if (code === "youtube-disabled") return "YouTube block desativado no perfil publico.";
  if (code === "youtube-deleted") return "YouTube block removido com sucesso.";
  if (code === "twitch-saved") return "Twitch block salvo com sucesso.";
  if (code === "twitch-enabled") return "Twitch block ativado no perfil publico.";
  if (code === "twitch-disabled") return "Twitch block desativado no perfil publico.";
  if (code === "twitch-deleted") return "Twitch block removido com sucesso.";
  if (code === "twitch_live-saved") return "Twitch Live salvo com sucesso.";
  if (code === "twitch_live-enabled") return "Twitch Live ativado no perfil publico.";
  if (code === "twitch_live-disabled") return "Twitch Live desativado no perfil publico.";
  if (code === "twitch_live-deleted") return "Twitch Live removido com sucesso.";
  if (code === "youtube_live-saved") return "YouTube Live salvo com sucesso.";
  if (code === "youtube_live-enabled") return "YouTube Live ativado no perfil publico.";
  if (code === "youtube_live-disabled") return "YouTube Live desativado no perfil publico.";
  if (code === "youtube_live-deleted") return "YouTube Live removido com sucesso.";
  if (code === "kick_live-saved") return "Kick Live salvo com sucesso.";
  if (code === "kick_live-enabled") return "Kick Live ativado no perfil publico.";
  if (code === "kick_live-disabled") return "Kick Live desativado no perfil publico.";
  if (code === "kick_live-deleted") return "Kick Live removido com sucesso.";
  return "";
}

function getErrorMessage(code?: string) {
  if (code === "discord-username-required") return "Digite um username do Discord.";
  if (code === "discord-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "github-username-required") return "Digite um username do GitHub.";
  if (code === "github-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "spotify-username-required") return "Digite um nome de usuario do Spotify.";
  if (code === "spotify-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "youtube-channel-required") return "Digite o nome do canal do YouTube.";
  if (code === "youtube-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "twitch-channel-required") return "Digite o nome do canal da Twitch.";
  if (code === "twitch-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "twitch_live-channel-required") return "Digite o nome do canal da Twitch ou use uma URL valida.";
  if (code === "twitch_live-url-invalid") return "URL da Twitch invalida. Use um endereco http ou https da Twitch.";
  if (code === "twitch_live-source-required") return "Informe um canal ou URL valida para o Twitch Live.";
  if (code === "twitch_live-accent-invalid") return "Cor invalida. Use hexadecimal no formato #RRGGBB.";
  if (code === "youtube_live-channel-required") return "Digite o nome do canal do YouTube ou use uma URL valida.";
  if (code === "youtube_live-url-invalid") return "URL do YouTube invalida. Use uma URL de live, canal ou video.";
  if (code === "youtube_live-source-required") return "Nao foi possivel gerar um embed seguro para esta URL do YouTube.";
  if (code === "youtube_live-accent-invalid") return "Cor invalida. Use hexadecimal no formato #RRGGBB.";
  if (code === "kick_live-channel-required") return "Digite o nome do canal da Kick ou use uma URL valida.";
  if (code === "kick_live-url-invalid") return "URL da Kick invalida. Use um endereco http ou https da Kick.";
  if (code === "kick_live-source-required") return "Informe um canal ou URL valida para o Kick Live.";
  if (code === "kick_live-accent-invalid") return "Cor invalida. Use hexadecimal no formato #RRGGBB.";
  if (code === "social-block-not-found") return "Bloco social nao encontrado.";
  return "";
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
  border: "1px solid rgba(88,101,242,0.24)",
  backgroundColor: "rgba(88,101,242,0.12)",
  color: "#c7d2fe",
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
  maxWidth: "62ch",
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
    "linear-gradient(135deg, rgba(88,101,242,0.96), rgba(124,58,237,0.92))",
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
  backgroundColor: "rgba(88,101,242,0.14)",
  border: "1px solid rgba(129,140,248,0.28)",
  color: "#c7d2fe",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontSize: "12px",
};

const mutedBadgeStyle: CSSProperties = {
  ...enabledBadgeStyle,
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#d4d4d8",
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

const previewIconWrapStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  marginRight: "10px",
  borderRadius: "12px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  flexShrink: 0,
};

const previewTextStyle: CSSProperties = {
  margin: 0,
  color: "#b7c0d4",
  lineHeight: 1.7,
  fontSize: "14px",
};

const previewHintPanelStyle: CSSProperties = {
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#c4cde2",
  fontSize: "13px",
  lineHeight: 1.65,
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

const successBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  fontWeight: 700,
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

const sectionDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.7,
  fontSize: "14px",
  maxWidth: "60ch",
};

const sectionHintStyle: CSSProperties = {
  maxWidth: "36ch",
  color: "#9da7bf",
  fontSize: "14px",
  lineHeight: 1.6,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const discordSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
  padding: "26px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(16,16,20,0.98), rgba(9,9,13,0.98))",
};

const discordFormColumnStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
};

const discordPreviewColumnStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "14px",
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#e4e4e7",
  fontSize: "14px",
  fontWeight: 700,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  outline: "none",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "120px",
};

const checkboxLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  minHeight: "48px",
  padding: "0 2px",
  color: "#e4e4e7",
  fontSize: "14px",
  fontWeight: 700,
};

const hintBoxStyle: CSSProperties = {
  display: "grid",
  alignItems: "center",
  minHeight: "48px",
  color: "#a1a1aa",
  fontSize: "13px",
  lineHeight: 1.6,
};

const actionRowStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const buttonBaseStyle: CSSProperties = {
  minHeight: "48px",
  padding: "0 18px",
  borderRadius: "16px",
  fontWeight: 800,
  fontSize: "14px",
  cursor: "pointer",
};

const submitButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(88,101,242,0.28)",
  background:
    "linear-gradient(135deg, rgba(88,101,242,0.96), rgba(124,58,237,0.92))",
  color: "#ffffff",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
};

const dangerButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(239,68,68,0.20)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
};

const previewMetaPanelStyle: CSSProperties = {
  borderRadius: "20px",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const previewMetaTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 800,
  marginBottom: "8px",
};

const previewMetaTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  fontSize: "14px",
  lineHeight: 1.65,
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
  color: "#c7d2fe",
  backgroundColor: "rgba(88,101,242,0.12)",
  border: "1px solid rgba(129,140,248,0.18)",
  flexShrink: 0,
};

const footerTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.6,
  fontSize: "14px",
};
