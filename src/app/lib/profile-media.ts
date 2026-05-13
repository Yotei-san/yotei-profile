const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"] as const;
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"] as const;

export const PROFILE_IMAGE_ACCEPT =
  "image/png,image/jpeg,image/jpg,image/webp,image/gif";
export const PROFILE_BANNER_ACCEPT =
  "image/png,image/jpeg,image/jpg,image/webp,image/gif,video/mp4,video/webm,video/quicktime";

export const PROFILE_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
] as const;

export const PROFILE_BANNER_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const PROFILE_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const PROFILE_BANNER_VIDEO_MAX_BYTES = 30 * 1024 * 1024;

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
