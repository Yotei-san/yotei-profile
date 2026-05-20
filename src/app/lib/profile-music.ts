export const PROFILE_MUSIC_PROVIDERS = [
  "spotify",
  "youtube",
  "soundcloud",
  "custom",
] as const;

export type ProfileMusicProvider = (typeof PROFILE_MUSIC_PROVIDERS)[number];

export type ProfileMusicData = {
  enabled: boolean;
  title: string | null;
  artist: string | null;
  url: string | null;
  provider: ProfileMusicProvider;
};

type NormalizeProfileMusicInput = {
  enabled: boolean | null | undefined;
  title: string | null | undefined;
  artist: string | null | undefined;
  url: string | null | undefined;
  provider: string | null | undefined;
};

export function normalizeProfileMusicProvider(
  value: string | null | undefined,
): ProfileMusicProvider {
  return PROFILE_MUSIC_PROVIDERS.includes(value as ProfileMusicProvider)
    ? (value as ProfileMusicProvider)
    : "custom";
}

export function normalizeProfileMusic(
  input: NormalizeProfileMusicInput,
): ProfileMusicData {
  return {
    enabled: Boolean(input.enabled),
    title: normalizeProfileMusicText(input.title, 120),
    artist: normalizeProfileMusicText(input.artist, 120),
    url: normalizeOptionalUrl(input.url),
    provider: normalizeProfileMusicProvider(input.provider),
  };
}

export function hasConfiguredProfileMusic(music: ProfileMusicData) {
  return Boolean(music.title || music.artist || music.url);
}

export function shouldRenderProfileMusic(music: ProfileMusicData) {
  return music.enabled && hasConfiguredProfileMusic(music);
}

export function getProfileMusicProviderLabel(provider: ProfileMusicProvider) {
  if (provider === "spotify") {
    return "Spotify";
  }

  if (provider === "youtube") {
    return "YouTube";
  }

  if (provider === "soundcloud") {
    return "SoundCloud";
  }

  return "Custom";
}

export function getProfileMusicTitle(music: ProfileMusicData) {
  return music.title || "Profile soundtrack";
}

export function getProfileMusicArtist(music: ProfileMusicData) {
  return music.artist || "Atmosphere link";
}

export function getProfileMusicCtaLabel(provider: ProfileMusicProvider) {
  if (provider === "spotify") {
    return "Open on Spotify";
  }

  if (provider === "youtube") {
    return "Open on YouTube";
  }

  if (provider === "soundcloud") {
    return "Open on SoundCloud";
  }

  return "Open track";
}

function normalizeProfileMusicText(
  value: string | null | undefined,
  maxLength: number,
) {
  const trimmed = value?.trim() || "";

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function normalizeOptionalUrl(value: string | null | undefined) {
  const trimmed = value?.trim() || "";

  if (!trimmed) {
    return null;
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
