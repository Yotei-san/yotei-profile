import type { SocialBrandIconName } from "@/app/dashboard/components/SocialBrandIcon";

export const LIVE_EMBED_PLATFORMS = [
  "twitch_live",
  "youtube_live",
  "kick_live",
] as const;

export type LiveEmbedPlatform = (typeof LIVE_EMBED_PLATFORMS)[number];

export type LiveEmbedMetadata = {
  streamTitle: string | null;
  isLive: boolean;
  accentColor: string | null;
  embedUrl: string | null;
  openUrl: string | null;
};

type LiveEmbedTheme = {
  icon: SocialBrandIconName;
  label: string;
  shortLabel: string;
  accent: string;
  glow: string;
  background: string;
  border: string;
  button: string;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const TWITCH_HOSTS = new Set(["twitch.tv", "www.twitch.tv", "m.twitch.tv"]);
const KICK_HOSTS = new Set(["kick.com", "www.kick.com"]);

export function isLiveEmbedPlatform(value: string): value is LiveEmbedPlatform {
  return LIVE_EMBED_PLATFORMS.includes(value as LiveEmbedPlatform);
}

export function getLiveEmbedTheme(
  platform: LiveEmbedPlatform,
  accentColor?: string | null
): LiveEmbedTheme {
  const accent = normalizeAccentColorValue(accentColor) ?? getDefaultAccentColor(platform);

  if (platform === "twitch_live") {
    return {
      icon: "twitch",
      label: "Twitch Live",
      shortLabel: "Twitch",
      accent,
      glow: withAlpha(accent, 0.34),
      background:
        "linear-gradient(145deg, rgba(167,112,255,0.24), rgba(22,10,38,0.97) 45%, rgba(9,5,18,0.98) 100%)",
      border: withAlpha(accent, 0.38),
      button: "linear-gradient(135deg, #a970ff 0%, #7c3aed 100%)",
    };
  }

  if (platform === "youtube_live") {
    return {
      icon: "youtube",
      label: "YouTube Live",
      shortLabel: "YouTube",
      accent,
      glow: withAlpha(accent, 0.34),
      background:
        "linear-gradient(145deg, rgba(255,56,56,0.24), rgba(38,10,12,0.97) 45%, rgba(18,5,8,0.98) 100%)",
      border: withAlpha(accent, 0.38),
      button: "linear-gradient(135deg, #ff3838 0%, #fb7185 100%)",
    };
  }

  return {
    icon: "kick",
    label: "Kick Live",
    shortLabel: "Kick",
    accent,
    glow: withAlpha(accent, 0.34),
    background:
      "linear-gradient(145deg, rgba(83,252,24,0.18), rgba(10,28,14,0.97) 45%, rgba(5,18,9,0.98) 100%)",
    border: withAlpha(accent, 0.38),
    button: "linear-gradient(135deg, #53fc18 0%, #16a34a 100%)",
  };
}

export function getDefaultAccentColor(platform: LiveEmbedPlatform) {
  if (platform === "twitch_live") return "#a970ff";
  if (platform === "youtube_live") return "#ff3838";
  return "#53fc18";
}

export function normalizeAccentColorValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized.toLowerCase() : null;
}

export function withAlpha(hexColor: string, alpha: number) {
  const normalized = normalizeAccentColorValue(hexColor) ?? "#ffffff";
  const channel = normalized.slice(1);
  const alphaByte = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    .toString(16)
    .padStart(2, "0");
  return `#${channel}${alphaByte}`;
}

export function sanitizeChannelName(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/^@/, "");
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, 80);
}

export function buildLiveEmbedMetadata(metadata: LiveEmbedMetadata) {
  return {
    streamTitle: metadata.streamTitle,
    isLive: metadata.isLive,
    accentColor: normalizeAccentColorValue(metadata.accentColor),
    embedUrl: metadata.embedUrl,
    openUrl: metadata.openUrl,
  };
}

export function readLiveEmbedMetadata(value: unknown): LiveEmbedMetadata {
  const metadata =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  return {
    streamTitle: readStringValue(metadata, "streamTitle"),
    isLive: Boolean(metadata?.isLive),
    accentColor: normalizeAccentColorValue(readStringValue(metadata, "accentColor")),
    embedUrl: readStringValue(metadata, "embedUrl"),
    openUrl: readStringValue(metadata, "openUrl"),
  };
}

export async function resolveLiveEmbedConfig({
  platform,
  channelName,
  streamUrl,
}: {
  platform: LiveEmbedPlatform;
  channelName: string | null;
  streamUrl: string | null;
}) {
  const sanitizedChannelName = sanitizeChannelName(channelName);

  if (platform === "twitch_live") {
    return resolveTwitchConfig({
      channelName: sanitizedChannelName,
      streamUrl,
    });
  }

  if (platform === "youtube_live") {
    return resolveYouTubeConfig({
      channelName: sanitizedChannelName,
      streamUrl,
    });
  }

  return resolveKickConfig({
    channelName: sanitizedChannelName,
    streamUrl,
  });
}

export function buildTwitchEmbedUrl(channelName: string, currentHostname: string | null) {
  const sanitizedChannelName = sanitizeChannelName(channelName);

  if (!sanitizedChannelName) {
    return null;
  }

  const parents = Array.from(
    new Set(
      ["localhost", "127.0.0.1", "yotei-profile.vercel.app", currentHostname ?? ""].filter(
        Boolean
      )
    )
  );

  const searchParams = new URLSearchParams({
    channel: sanitizedChannelName,
    autoplay: "true",
    muted: "true",
  });

  for (const parent of parents) {
    searchParams.append("parent", parent);
  }

  return `https://player.twitch.tv/?${searchParams.toString()}`;
}

function resolveTwitchConfig({
  channelName,
  streamUrl,
}: {
  channelName: string | null;
  streamUrl: string | null;
}) {
  const parsedUrl = streamUrl ? parsePlatformUrl("twitch_live", streamUrl) : null;
  const finalChannelName = parsedUrl?.channelName ?? channelName;

  if (!finalChannelName) {
    return {
      channelName: null,
      embedUrl: null,
      openUrl: null,
      hasValidSource: false,
    };
  }

  return {
    channelName: finalChannelName,
    embedUrl: null,
    openUrl: parsedUrl?.openUrl ?? `https://www.twitch.tv/${finalChannelName}`,
    hasValidSource: true,
  };
}

async function resolveYouTubeConfig({
  channelName,
  streamUrl,
}: {
  channelName: string | null;
  streamUrl: string | null;
}) {
  const parsedUrl = streamUrl ? parsePlatformUrl("youtube_live", streamUrl) : null;
  let embedUrl = parsedUrl?.embedUrl ?? null;
  let openUrl = parsedUrl?.openUrl ?? streamUrl ?? null;
  let finalChannelName = parsedUrl?.channelName ?? channelName;

  if (!embedUrl && streamUrl) {
    const resolvedChannelId = await resolveYouTubeChannelId(streamUrl);

    if (resolvedChannelId) {
      embedUrl = buildYouTubeLiveChannelEmbedUrl(resolvedChannelId);
      openUrl = `https://www.youtube.com/channel/${resolvedChannelId}/live`;

      if (!finalChannelName) {
        finalChannelName = resolvedChannelId;
      }
    }
  }

  if (!embedUrl && channelName && /^UC[\w-]{20,32}$/.test(channelName)) {
    embedUrl = buildYouTubeLiveChannelEmbedUrl(channelName);
    openUrl = openUrl ?? `https://www.youtube.com/channel/${channelName}/live`;
  }

  return {
    channelName: finalChannelName,
    embedUrl,
    openUrl,
    hasValidSource: Boolean(embedUrl || openUrl),
  };
}

function resolveKickConfig({
  channelName,
  streamUrl,
}: {
  channelName: string | null;
  streamUrl: string | null;
}) {
  const parsedUrl = streamUrl ? parsePlatformUrl("kick_live", streamUrl) : null;
  const finalChannelName = parsedUrl?.channelName ?? channelName;

  if (!finalChannelName) {
    return {
      channelName: null,
      embedUrl: null,
      openUrl: null,
      hasValidSource: false,
    };
  }

  return {
    channelName: finalChannelName,
    embedUrl: null,
    openUrl: parsedUrl?.openUrl ?? `https://kick.com/${finalChannelName}`,
    hasValidSource: true,
  };
}

export function parsePlatformUrl(platform: LiveEmbedPlatform, value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  if (platform === "twitch_live") {
    if (!TWITCH_HOSTS.has(hostname)) {
      return null;
    }

    const channelName = sanitizeChannelName(getFirstPathSegment(url.pathname));

    if (!channelName || isReservedTwitchPath(channelName)) {
      return null;
    }

    return {
      channelName,
      embedUrl: null,
      openUrl: `https://www.twitch.tv/${channelName}`,
    };
  }

  if (platform === "kick_live") {
    if (!KICK_HOSTS.has(hostname)) {
      return null;
    }

    const channelName = sanitizeChannelName(getFirstPathSegment(url.pathname));

    if (!channelName) {
      return null;
    }

    return {
      channelName,
      embedUrl: null,
      openUrl: `https://kick.com/${channelName}`,
    };
  }

  if (!YOUTUBE_HOSTS.has(hostname)) {
    return null;
  }

  const videoId = getYouTubeVideoId(url);

  if (videoId) {
    return {
      channelName: null,
      embedUrl: buildYouTubeVideoEmbedUrl(videoId),
      openUrl: value,
    };
  }

  const channelId = getYouTubeChannelIdFromUrl(url);

  if (channelId) {
    return {
      channelName: channelId,
      embedUrl: buildYouTubeLiveChannelEmbedUrl(channelId),
      openUrl: `https://www.youtube.com/channel/${channelId}/live`,
    };
  }

  return {
    channelName: null,
    embedUrl: null,
    openUrl: value,
  };
}

function buildYouTubeVideoEmbedUrl(videoId: string) {
  const searchParams = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  return `https://www.youtube.com/embed/${videoId}?${searchParams.toString()}`;
}

function buildYouTubeLiveChannelEmbedUrl(channelId: string) {
  const searchParams = new URLSearchParams({
    channel: channelId,
    autoplay: "1",
    mute: "1",
    playsinline: "1",
  });

  return `https://www.youtube.com/embed/live_stream?${searchParams.toString()}`;
}

function getYouTubeVideoId(url: URL) {
  const hostname = url.hostname.toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);

  if (hostname === "youtu.be" || hostname === "www.youtu.be") {
    return segments[0] ?? null;
  }

  if (segments[0] === "watch") {
    return sanitizeYouTubeVideoId(url.searchParams.get("v"));
  }

  if (segments[0] === "live" || segments[0] === "embed" || segments[0] === "shorts") {
    return sanitizeYouTubeVideoId(segments[1] ?? null);
  }

  return sanitizeYouTubeVideoId(url.searchParams.get("v"));
}

function getYouTubeChannelIdFromUrl(url: URL) {
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "channel") {
    return /^UC[\w-]{20,32}$/.test(segments[1] ?? "") ? segments[1] : null;
  }

  return null;
}

function sanitizeYouTubeVideoId(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return /^[\w-]{11}$/.test(normalized) ? normalized : null;
}

function getFirstPathSegment(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] ?? null;
}

function isReservedTwitchPath(value: string) {
  return new Set([
    "directory",
    "downloads",
    "jobs",
    "login",
    "logout",
    "products",
    "search",
    "settings",
    "signup",
    "subscriptions",
  ]).has(value.toLowerCase());
}

async function resolveYouTubeChannelId(streamUrl: string) {
  try {
    const response = await fetch(streamUrl, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const channelIdMatch =
      html.match(/"channelId":"(UC[\w-]{20,32})"/) ??
      html.match(/https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{20,32})/);

    return channelIdMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

function readStringValue(
  metadata: Record<string, unknown> | null,
  key: string
): string | null {
  if (!metadata) {
    return null;
  }

  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
