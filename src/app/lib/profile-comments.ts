export const PROFILE_COMMENT_MAX_LENGTH = 300;
export const PROFILE_COMMENT_RATE_LIMIT_MS = 20_000;

export type ProfileCommentSort = "newest" | "oldest";

export function normalizeProfileCommentSort(
  value: string | null | undefined,
): ProfileCommentSort {
  return value === "oldest" ? "oldest" : "newest";
}

export function sanitizeProfileCommentBody(value: unknown) {
  if (typeof value !== "string") {
    return {
      ok: false as const,
      error: "Write a comment before posting.",
    };
  }

  const normalizedWhitespace = value
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  if (!normalizedWhitespace) {
    return {
      ok: false as const,
      error: "Comments cannot be empty.",
    };
  }

  if (normalizedWhitespace.length > PROFILE_COMMENT_MAX_LENGTH) {
    return {
      ok: false as const,
      error: `Comments can be up to ${PROFILE_COMMENT_MAX_LENGTH} characters.`,
    };
  }

  return {
    ok: true as const,
    body: normalizedWhitespace,
  };
}

export function canDeleteProfileComment(input: {
  viewerUserId: string | null | undefined;
  viewerRole: string | null | undefined;
  profileUserId: string;
  authorUserId: string | null;
}) {
  if (!input.viewerUserId) {
    return false;
  }

  if (input.viewerRole === "admin" || input.viewerRole === "owner") {
    return true;
  }

  if (input.viewerUserId === input.profileUserId) {
    return true;
  }

  return Boolean(input.authorUserId && input.viewerUserId === input.authorUserId);
}

export function resolveProfileCommentAuthorName(input: {
  authorName: string | null;
  authorUser:
    | {
        username: string;
        displayName: string | null;
      }
    | null
    | undefined;
}) {
  const displayName = input.authorUser?.displayName?.trim();

  if (displayName) {
    return displayName;
  }

  if (input.authorName?.trim()) {
    return input.authorName.trim();
  }

  if (input.authorUser?.username?.trim()) {
    return input.authorUser.username.trim();
  }

  return "Yotei User";
}
