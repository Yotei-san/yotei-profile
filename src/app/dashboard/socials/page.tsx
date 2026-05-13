import Link from "next/link";
import type { CSSProperties } from "react";
import DiscordBlockPreview from "@/app/dashboard/components/DiscordBlockPreview";
import GitHubBlockPreview from "@/app/dashboard/components/GitHubBlockPreview";
import SpotifyBlockPreview from "@/app/dashboard/components/SpotifyBlockPreview";
import SocialBrandIcon from "@/app/dashboard/components/SocialBrandIcon";
import SocialIntegrationCard, {
  type SocialIntegrationItem,
} from "@/app/dashboard/components/SocialIntegrationCard";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  deleteSocialBlock,
  toggleSocialBlock,
  upsertDiscordBlock,
  upsertGitHubBlock,
  upsertSpotifyBlock,
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

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      username: true,
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
    },
  });

  if (!user) {
    throw new Error("Usuario nao encontrado.");
  }

  const discordBlock = getDiscordBlock(user.socialBlocks);
  const githubBlock = getGitHubBlock(user.socialBlocks);
  const spotifyBlock = getSpotifyBlock(user.socialBlocks);
  const configuredCount = user.socialBlocks.length;
  const enabledCount = user.socialBlocks.filter((block) => block.isEnabled).length;
  const successMessage = getSuccessMessage(params.success);
  const errorMessage = getErrorMessage(params.error);
  const discordCardHref = "/dashboard/socials?active=discord#discord-block-form";
  const githubCardHref = "/dashboard/socials?active=github#github-block-form";
  const spotifyCardHref = "/dashboard/socials?active=spotify#spotify-block-form";
  const selectedIsDiscord = selectedKey === "discord";
  const selectedIsGitHub = selectedKey === "github";
  const selectedIsSpotify = selectedKey === "spotify";
  const heroPrimaryHref = selectedIsGitHub
    ? githubCardHref
    : selectedIsSpotify
      ? spotifyCardHref
      : discordCardHref;
  const heroPrimaryLabel = selectedIsGitHub
    ? githubBlock
      ? "Edit GitHub Block"
      : "Configure GitHub"
    : selectedIsSpotify
      ? spotifyBlock
        ? "Edit Spotify Block"
        : "Configure Spotify"
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
            Discord, GitHub and Spotify are now real blocks you can configure, save, and publish
            on your public profile. The remaining integrations stay as visual previews
            while the block system expands safely.
          </p>

          <div style={heroActionsStyle}>
            <Link href={heroPrimaryHref} style={primaryActionStyle}>
              {heroPrimaryLabel}
            </Link>
            <Link href={`/${user.username}`} style={secondaryActionStyle} target="_blank">
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
                Discord, GitHub and Spotify are live social blocks in this phase. The other cards stay
                in design preview mode for now.
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
              <div style={statValueStyle}>3</div>
              <div style={statLabelStyle}>Live platforms</div>
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
          Discord, GitHub and Spotify are functional now. The remaining integrations stay lightweight
          and visual until each block gets its own safe backend phase.
        </div>
      </section>

      <section style={gridStyle}>
        {integrations.map((item) => {
          const isDiscord = item.key === "discord";
          const isGitHub = item.key === "github";
          const isSpotify = item.key === "spotify";
          const isConfigured = isDiscord
            ? Boolean(discordBlock?.username)
            : isGitHub
              ? Boolean(githubBlock?.username)
              : isSpotify
                ? Boolean(spotifyBlock?.username)
              : false;
          const isEnabled = isDiscord
            ? Boolean(discordBlock?.isEnabled)
            : isGitHub
              ? Boolean(githubBlock?.isEnabled)
              : isSpotify
                ? Boolean(spotifyBlock?.isEnabled)
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
                    : `/dashboard/socials?active=${item.key}`
              }
              stateLabel={
                isDiscord || isGitHub || isSpotify
                  ? isConfigured
                    ? isEnabled
                      ? "Configured"
                      : "Saved"
                    : "Setup"
                  : item.key === selectedKey
                    ? "Selected"
                    : "Preview"
              }
              footerLabel={
                isDiscord || isGitHub || isSpotify
                  ? isConfigured
                    ? "Live block available on profile"
                    : "Real social block"
                  : "Design preview only in this phase"
              }
              actionLabel={
                isDiscord || isGitHub || isSpotify
                  ? isConfigured
                    ? "Edit"
                    : "Configure"
                  : "Preview"
              }
            />
          );
        })}
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
              <button type="submit" style={submitButtonStyle}>
                {discordBlock ? "Save Discord Block" : "Create Discord Block"}
              </button>

              {discordBlock ? (
                <>
                  <button
                    type="submit"
                    formAction={toggleSocialBlock.bind(null, discordBlock.id)}
                    style={secondaryButtonStyle}
                  >
                    {discordBlock.isEnabled ? "Disable Block" : "Enable Block"}
                  </button>

                  <button
                    type="submit"
                    formAction={deleteSocialBlock.bind(null, discordBlock.id)}
                    style={dangerButtonStyle}
                  >
                    Delete Block
                  </button>
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
              <button type="submit" style={submitButtonStyle}>
                {githubBlock ? "Save GitHub Block" : "Create GitHub Block"}
              </button>

              {githubBlock ? (
                <>
                  <button
                    type="submit"
                    formAction={toggleSocialBlock.bind(null, githubBlock.id)}
                    style={secondaryButtonStyle}
                  >
                    {githubBlock.isEnabled ? "Disable Block" : "Enable Block"}
                  </button>

                  <button
                    type="submit"
                    formAction={deleteSocialBlock.bind(null, githubBlock.id)}
                    style={dangerButtonStyle}
                  >
                    Delete Block
                  </button>
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
              <button type="submit" style={submitButtonStyle}>
                {spotifyBlock ? "Save Spotify Block" : "Create Spotify Block"}
              </button>

              {spotifyBlock ? (
                <>
                  <button
                    type="submit"
                    formAction={toggleSocialBlock.bind(null, spotifyBlock.id)}
                    style={secondaryButtonStyle}
                  >
                    {spotifyBlock.isEnabled ? "Disable Block" : "Enable Block"}
                  </button>

                  <button
                    type="submit"
                    formAction={deleteSocialBlock.bind(null, spotifyBlock.id)}
                    style={dangerButtonStyle}
                  >
                    Delete Block
                  </button>
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
            name={selectedIsGitHub ? "github" : selectedIsSpotify ? "spotify" : "discord"}
            size={18}
          />
        </div>
        <p style={footerTextStyle}>
          Discord, GitHub and Spotify now write to the database and render on the public profile.
          Other social cards remain lightweight previews until their backend phases start.
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
  return "";
}

function getErrorMessage(code?: string) {
  if (code === "discord-username-required") return "Digite um username do Discord.";
  if (code === "discord-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "github-username-required") return "Digite um username do GitHub.";
  if (code === "github-url-invalid") return "URL invalida. Use um endereco http ou https.";
  if (code === "spotify-username-required") return "Digite um nome de usuario do Spotify.";
  if (code === "spotify-url-invalid") return "URL invalida. Use um endereco http ou https.";
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
  gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)",
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
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
