"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuLoaderCircle, LuMessageSquare, LuTrash2, LuX } from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import { toIntlLocale } from "@/app/lib/i18n";

type ProfileCommentItem = {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
  canDelete: boolean;
};

type Props = {
  username: string;
  commentCount: number;
  canComment: boolean;
  isOwnProfile: boolean;
  open: boolean;
  onClose: () => void;
  onCountChange: (count: number) => void;
};

type CommentSort = "newest" | "oldest";

export default function ProfileCommentsModal({
  username,
  commentCount,
  canComment,
  isOwnProfile,
  open,
  onClose,
  onCountChange,
}: Props) {
  const { locale, t } = useI18n();
  const [comments, setComments] = useState<ProfileCommentItem[]>([]);
  const [sort, setSort] = useState<CommentSort>("newest");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadComments(sort);
  }, [open, sort]);

  async function loadComments(nextSort: CommentSort) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/profile-comments/${username}?sort=${nextSort}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        setError(payload?.error || t("publicProfile.loadCommentsError"));
        return;
      }

      setComments(Array.isArray(payload.comments) ? payload.comments : []);
      onCountChange(typeof payload.count === "number" ? payload.count : 0);
      setHasLoaded(true);
    } catch {
      setError(t("publicProfile.loadCommentsError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canComment || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/profile-comments/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: draft }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        setError(payload?.error || t("publicProfile.postCommentError"));
        return;
      }

      setDraft("");
      onCountChange(typeof payload.count === "number" ? payload.count : commentCount + 1);
      await loadComments(sort);
    } catch {
      setError(t("publicProfile.postCommentError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (deletingId) {
      return;
    }

    setDeletingId(commentId);
    setError(null);

    try {
      const response = await fetch(
        `/api/profile-comments/${username}/${commentId}`,
        {
          method: "DELETE",
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        setError(payload?.error || t("publicProfile.deleteCommentError"));
        return;
      }

      onCountChange(typeof payload.count === "number" ? payload.count : Math.max(0, commentCount - 1));
      await loadComments(sort);
    } catch {
      setError(t("publicProfile.deleteCommentError"));
    } finally {
      setDeletingId(null);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-comments-title"
      style={overlayStyle}
      onClick={onClose}
    >
      <style>{`
        .profile-comments-shell {
          animation: profile-comments-rise 180ms ease;
        }

        .profile-comments-shell textarea::placeholder {
          color: #77839f;
        }

        .profile-comments-shell button,
        .profile-comments-shell textarea {
          font: inherit;
        }

        .profile-comments-shell .spin {
          animation: profile-comments-spin 0.9s linear infinite;
        }

        @keyframes profile-comments-rise {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes profile-comments-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .profile-comments-shell {
            width: min(100vw - 18px, 100%);
            max-height: calc(100vh - 18px);
            border-radius: 24px;
          }
        }
      `}</style>

      <div
        className="profile-comments-shell"
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={headerStyle}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={eyebrowStyle}>
              <LuMessageSquare size={13} />
              {t("publicProfile.commentModalEyebrow")}
            </div>
            <div id="profile-comments-title" style={titleStyle}>
              {t("publicProfile.commentModalTitle")}
            </div>
            <div style={subtitleStyle}>
              {commentCount === 1
                ? t("publicProfile.commentCountOne", {
                    count: commentCount.toLocaleString(toIntlLocale(locale)),
                  })
                : t("publicProfile.commentCountOther", {
                    count: commentCount.toLocaleString(toIntlLocale(locale)),
                  })}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label={t("publicProfile.closeComments")}
          >
            <LuX size={18} />
          </button>
        </div>

        <div style={toolbarStyle}>
          <div style={sortGroupStyle}>
            <SortButton
              label={t("publicProfile.newest")}
              active={sort === "newest"}
              onClick={() => setSort("newest")}
            />
            <SortButton
              label={t("publicProfile.oldest")}
              active={sort === "oldest"}
              onClick={() => setSort("oldest")}
            />
          </div>

          {isOwnProfile ? (
            <div style={ownerNoteStyle}>{t("publicProfile.ownProfileNote")}</div>
          ) : null}
        </div>

        {canComment ? (
          <form onSubmit={handleSubmit} style={composerStyle}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={300}
              rows={4}
              placeholder={
                isOwnProfile
                  ? t("publicProfile.ownProfilePlaceholder")
                  : t("publicProfile.visitorPlaceholder", { username })
              }
              style={textareaStyle}
            />
            <div style={composerFooterStyle}>
              <div style={charCountStyle}>{draft.length}/300</div>
              <button type="submit" disabled={submitting} style={submitButtonStyle(submitting)}>
                {submitting
                  ? t("publicProfile.postingComment")
                  : isOwnProfile
                    ? t("publicProfile.writeCommentOwnProfile")
                    : t("publicProfile.postComment")}
              </button>
            </div>
          </form>
        ) : (
          <div style={signinPanelStyle}>
            <div style={{ display: "grid", gap: "6px" }}>
              <strong style={{ color: "#ffffff" }}>{t("publicProfile.signInConversation")}</strong>
              <span style={{ color: "#9aa8c2", fontSize: "13px", lineHeight: 1.7 }}>
                {t("publicProfile.signInConversationBody")}
              </span>
            </div>
            <Link href="/login" style={signinButtonStyle} onClick={onClose}>
              {t("publicProfile.signIn")}
            </Link>
          </div>
        )}

        {error ? <div style={errorStyle}>{error}</div> : null}

        <div style={listShellStyle}>
          {loading && !hasLoaded ? (
            <div style={loadingStateStyle}>
              <LuLoaderCircle size={18} className="spin" />
              {t("publicProfile.loadingComments")}
            </div>
          ) : comments.length === 0 ? (
            <div style={emptyStateStyle}>
              {t("publicProfile.noCommentsYet")}{" "}
              {canComment
                ? t("publicProfile.startFirstThread")
                : t("publicProfile.beFirstAfterSignIn")}
            </div>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} style={commentCardStyle}>
                <div style={commentHeaderStyle}>
                  <div style={{ display: "grid", gap: "4px" }}>
                    <strong style={{ color: "#ffffff", fontSize: "14px" }}>{comment.authorName}</strong>
                    <span style={{ color: "#7f8ba3", fontSize: "12px" }}>
                      {formatCommentDate(comment.createdAt, locale, t)}
                    </span>
                  </div>

                  {comment.canDelete ? (
                    <button
                      type="button"
                      onClick={() => void handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      style={deleteButtonStyle(deletingId === comment.id)}
                    >
                      <LuTrash2 size={13} />
                      {deletingId === comment.id
                        ? t("publicProfile.deleting")
                        : t("publicProfile.delete")}
                    </button>
                  ) : null}
                </div>

                <div style={commentBodyStyle}>{comment.body}</div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SortButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={sortButtonStyle(active)}>
      {label}
    </button>
  );
}

function formatCommentDate(
  value: string,
  locale: ReturnType<typeof useI18n>["locale"],
  t: ReturnType<typeof useI18n>["t"],
) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return t("publicProfile.justNow");
  }

  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 90,
  display: "grid",
  placeItems: "center",
  padding: "20px",
  background: "rgba(2, 4, 10, 0.76)",
  backdropFilter: "blur(20px) saturate(118%)",
  WebkitBackdropFilter: "blur(20px) saturate(118%)",
} as const;

const panelStyle = {
  width: "min(720px, calc(100vw - 24px))",
  maxHeight: "min(82vh, 860px)",
  overflow: "auto",
  padding: "22px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top, rgba(135,118,255,0.16), transparent 22%), linear-gradient(180deg, rgba(16,18,28,0.98), rgba(8,10,17,0.98))",
  boxShadow: "0 32px 80px rgba(0,0,0,0.34)",
  display: "grid",
  gap: "16px",
} as const;

const headerStyle = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "14px",
} as const;

const eyebrowStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  color: "#cfc4ff",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
} as const;

const titleStyle = {
  color: "#ffffff",
  fontSize: "32px",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.05em",
} as const;

const subtitleStyle = {
  color: "#90a0bb",
  fontSize: "13px",
  lineHeight: 1.6,
} as const;

const closeButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#dce5f6",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
} as const;

const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
} as const;

const sortGroupStyle = {
  display: "inline-flex",
  gap: "8px",
  flexWrap: "wrap",
} as const;

const ownerNoteStyle = {
  color: "#8f9ab4",
  fontSize: "12px",
  lineHeight: 1.6,
} as const;

const composerStyle = {
  display: "grid",
  gap: "12px",
  padding: "16px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(255,255,255,0.03)",
} as const;

const textareaStyle = {
  width: "100%",
  minHeight: "112px",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(8,10,16,0.82)",
  color: "#f7fbff",
  resize: "vertical" as const,
  outline: "none",
  lineHeight: 1.7,
} as const;

const composerFooterStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
} as const;

const charCountStyle = {
  color: "#7f8ba3",
  fontSize: "12px",
} as const;

const signinPanelStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  padding: "16px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(255,255,255,0.03)",
} as const;

const signinButtonStyle = {
  textDecoration: "none",
  minHeight: "40px",
  padding: "0 14px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
  color: "#ffffff",
  fontWeight: 800,
  flexShrink: 0,
} as const;

const errorStyle = {
  padding: "12px 14px",
  borderRadius: "16px",
  border: "1px solid rgba(248,113,113,0.18)",
  background: "rgba(248,113,113,0.10)",
  color: "#ffd2d2",
  fontSize: "13px",
  lineHeight: 1.6,
} as const;

const listShellStyle = {
  display: "grid",
  gap: "12px",
} as const;

const loadingStateStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  color: "#dce5f6",
  padding: "20px 4px",
} as const;

const emptyStateStyle = {
  padding: "22px",
  borderRadius: "20px",
  border: "1px dashed rgba(255,255,255,0.12)",
  color: "#96a3bc",
  textAlign: "center" as const,
  lineHeight: 1.7,
} as const;

const commentCardStyle = {
  display: "grid",
  gap: "12px",
  padding: "16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(255,255,255,0.025)",
} as const;

const commentHeaderStyle = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
} as const;

const commentBodyStyle = {
  color: "#dfe8f7",
  fontSize: "14px",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap" as const,
  overflowWrap: "anywhere" as const,
} as const;

function sortButtonStyle(active: boolean) {
  return {
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    border: active ? "1px solid rgba(255,110,168,0.28)" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(255,110,168,0.12)" : "rgba(255,255,255,0.03)",
    color: active ? "#ffd7e8" : "#dce5f6",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  } as const;
}

function submitButtonStyle(disabled: boolean) {
  return {
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "14px",
    border: "1px solid rgba(135,118,255,0.24)",
    background: "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
    color: "#ffffff",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  } as const;
}

function deleteButtonStyle(disabled: boolean) {
  return {
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "1px solid rgba(248,113,113,0.18)",
    background: "rgba(248,113,113,0.10)",
    color: "#ffd0d0",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  } as const;
}
