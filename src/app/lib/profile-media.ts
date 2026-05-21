const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"] as const;
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"] as const;

export const PROFILE_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
export const PROFILE_BANNER_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime";

export const PROFILE_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export const PROFILE_BANNER_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const PROFILE_AVATAR_MAX_BYTES = 8 * 1024 * 1024;
export const PROFILE_BANNER_IMAGE_MAX_BYTES = 15 * 1024 * 1024;
export const PROFILE_BANNER_VIDEO_MAX_BYTES = 30 * 1024 * 1024;

export type ProfileMediaPurpose = "avatar" | "banner";

export function isProfileImageMimeType(
  mimeType: string
): mimeType is (typeof PROFILE_IMAGE_MIME_TYPES)[number] {
  return PROFILE_IMAGE_MIME_TYPES.includes(
    mimeType.toLowerCase() as (typeof PROFILE_IMAGE_MIME_TYPES)[number]
  );
}

export function isProfileBannerVideoMimeType(
  mimeType: string
): mimeType is (typeof PROFILE_BANNER_VIDEO_MIME_TYPES)[number] {
  return PROFILE_BANNER_VIDEO_MIME_TYPES.includes(
    mimeType.toLowerCase() as (typeof PROFILE_BANNER_VIDEO_MIME_TYPES)[number]
  );
}

export function getProfileMediaMaxBytes(
  purpose: ProfileMediaPurpose,
  mimeType: string
) {
  if (purpose === "avatar") {
    return PROFILE_AVATAR_MAX_BYTES;
  }

  return isProfileBannerVideoMimeType(mimeType)
    ? PROFILE_BANNER_VIDEO_MAX_BYTES
    : PROFILE_BANNER_IMAGE_MAX_BYTES;
}

export function getProfileMediaTypeError(purpose: ProfileMediaPurpose) {
  return purpose === "avatar"
    ? "Avatar aceita apenas PNG, JPG, WEBP ou GIF."
    : "Banner aceita PNG, JPG, WEBP, GIF, MP4, WebM ou MOV.";
}

export function getProfileMediaSizeError(
  purpose: ProfileMediaPurpose,
  mimeType: string,
  status = 400
) {
  if (purpose === "banner" && isProfileBannerVideoMimeType(mimeType) && status === 413) {
    return "Arquivo muito grande. Use vídeo até 30MB ou comprima antes de enviar.";
  }

  const maxBytes = getProfileMediaMaxBytes(purpose, mimeType);
  const label =
    purpose === "avatar"
      ? "Avatar"
      : isProfileBannerVideoMimeType(mimeType)
        ? "Video do banner"
        : "Banner";

  return `${label} muito grande. O limite e ${formatBytes(maxBytes)}.`;
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  const [withoutHash] = trimmed.split("#", 1);
  const [withoutQuery] = withoutHash.split("?", 1);
  return withoutQuery;
}

function hasKnownExtension(url: string, extensions: readonly string[]) {
  const normalized = normalizeUrl(url);
  return extensions.some((extension) => normalized.endsWith(extension));
}

export function isVideoUrl(url: string): boolean {
  return hasKnownExtension(url, VIDEO_EXTENSIONS);
}

export function isImageUrl(url: string): boolean {
  return hasKnownExtension(url, IMAGE_EXTENSIONS);
}

export function getMediaKind(url: string): "video" | "image" | "unknown" {
  if (!url.trim()) return "unknown";
  if (isVideoUrl(url)) return "video";
  if (isImageUrl(url)) return "image";
  return "unknown";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}
