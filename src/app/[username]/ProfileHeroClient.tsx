"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { LuEye, LuMapPin, LuMessageSquare, LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { useAdaptivePerformance } from "@/app/components/PerformanceProvider";

const ProfileCommentsModal = dynamic(() => import("./ProfileCommentsModal"), {
  loading: () => null,
});

type MyReaction = "like" | "dislike" | null;

type Props = {
  username: string;
  initialViews: number;
  initialLikes: number;
  initialDislikes: number;
  initialCommentCount: number;
  themeColor: string;
  initialMyReaction: MyReaction;
  canComment: boolean;
  isOwnProfile: boolean;
  locationText?: string | null;
  align?: "start" | "center";
  preview?: boolean;
  variant?: "inline" | "corner" | "micro";
};

function getDailyViewStorageKey(username: string) {
  return `profile-view:${username}:${new Date().toDateString()}`;
}

export default function ProfileHeroClient({
  username,
  initialViews,
  initialLikes,
  initialDislikes,
  initialCommentCount,
  themeColor,
  initialMyReaction,
  canComment,
  isOwnProfile,
  locationText,
  align = "start",
  preview = false,
  variant = "inline",
}: Props) {
  const { profile } = useAdaptivePerformance();
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [myReaction, setMyReaction] = useState<MyReaction>(initialMyReaction);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const hasTrackedView = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    setViews(initialViews);
    setLikes(initialLikes);
    setDislikes(initialDislikes);
    setCommentCount(initialCommentCount);
    setMyReaction(initialMyReaction);
  }, [initialViews, initialLikes, initialDislikes, initialCommentCount, initialMyReaction]);

  useEffect(() => {
    if (preview) {
      return;
    }

    if (hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;

    const storageKey = getDailyViewStorageKey(username);

    if (window.localStorage.getItem(storageKey)) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile-view/${username}`, {
          method: "POST",
          signal: controller.signal,
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json().catch(() => null);

        if (data && typeof data.views === "number") {
          setViews(data.views);
        }

        window.localStorage.setItem(storageKey, "1");
      } catch {}
    }, 1200);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [preview, username]);

  async function sendReaction(type: "like" | "dislike") {
    if (preview) {
      return;
    }

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/profile-reaction/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data) {
        if (typeof data.likes === "number") {
          setLikes(data.likes);
        }

        if (typeof data.dislikes === "number") {
          setDislikes(data.dislikes);
        }

        if (
          data.myReaction === "like" ||
          data.myReaction === "dislike" ||
          data.myReaction === null
        ) {
          setMyReaction(data.myReaction);
        }
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const normalizedLocationText = locationText?.trim() || "";
  const allowGlassEffects = profile.allowBlurEffects && variant !== "micro";
  const allowElevatedEffects = profile.allowDecorativeMotion && variant !== "micro";

  return (
    <div>
      <style>{`
        .profile-hero-metrics {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-hero-metrics.align-center {
          justify-content: center;
        }

        .profile-hero-metrics[data-variant="corner"] {
          gap: 7px;
          max-width: min(88vw, 480px);
        }

        .profile-hero-metrics[data-variant="micro"] {
          gap: 8px;
          justify-content: center;
        }

        .profile-hero-chip,
        .profile-hero-reaction {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            opacity 180ms ease;
        }

        .profile-hero-reaction:hover:not(:disabled),
        .profile-hero-reaction:focus-visible {
          transform: translateY(-1px);
        }

        .profile-hero-location {
          max-width: min(100%, 28rem);
        }

        .profile-hero-location .profile-hero-token-copy {
          overflow-wrap: anywhere;
        }

        .profile-hero-metrics[data-variant="corner"] .profile-hero-chip,
        .profile-hero-metrics[data-variant="corner"] .profile-hero-reaction {
          box-shadow:
            0 8px 18px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .profile-hero-metrics[data-variant="micro"] .profile-hero-chip,
        .profile-hero-metrics[data-variant="micro"] .profile-hero-reaction {
          min-height: 24px;
          padding-inline: 0;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          color: #c8d3e6;
          opacity: 0.88;
        }

        .profile-hero-metrics[data-variant="micro"] .profile-hero-reaction:hover:not(:disabled),
        .profile-hero-metrics[data-variant="micro"] .profile-hero-reaction:focus-visible {
          transform: translateY(-1px);
          color: #f3f7ff;
        }

        .profile-hero-metrics[data-variant="micro"] .profile-hero-location {
          max-width: min(100%, 20rem);
        }

        @media (max-width: 640px) {
          .profile-hero-metrics {
            gap: 7px;
          }

          .profile-hero-location {
            max-width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-hero-chip,
          .profile-hero-reaction {
            transition: none;
          }
        }
      `}</style>

      <div
        className={`profile-hero-metrics ${align === "center" ? "align-center" : ""}`}
        data-variant={variant}
      >
        <MetricChip
          label="Views"
          value={views}
          icon={<LuEye size={14} />}
          color="#dbe4f5"
          background={
            variant === "corner"
              ? "rgba(7,10,18,0.78)"
              : variant === "micro"
                ? "transparent"
                : "rgba(255,255,255,0.035)"
          }
          border={
            variant === "corner"
              ? "rgba(255,255,255,0.10)"
              : variant === "micro"
                ? "transparent"
                : "rgba(255,255,255,0.07)"
          }
          compact={variant !== "inline"}
          allowGlassEffects={allowGlassEffects}
          allowElevatedEffects={allowElevatedEffects}
        />

        <ReactionButton
          label="Likes"
          value={likes}
          icon={<LuThumbsUp size={14} />}
          onClick={() => sendReaction("like")}
          disabled={isSubmitting || preview}
          isActive={myReaction === "like"}
          accentColor={themeColor}
          background={
            variant === "corner"
              ? "rgba(9, 20, 16, 0.8)"
              : variant === "micro"
                ? "transparent"
                : "rgba(69, 212, 131, 0.06)"
          }
          border={
            variant === "corner"
              ? "rgba(69, 212, 131, 0.18)"
              : variant === "micro"
                ? "transparent"
                : "rgba(69, 212, 131, 0.14)"
          }
          compact={variant !== "inline"}
          allowGlassEffects={allowGlassEffects}
          allowElevatedEffects={allowElevatedEffects}
        />

        <ReactionButton
          label="Dislikes"
          value={dislikes}
          icon={<LuThumbsDown size={14} />}
          onClick={() => sendReaction("dislike")}
          disabled={isSubmitting || preview}
          isActive={myReaction === "dislike"}
          accentColor={themeColor}
          background={
            variant === "corner"
              ? "rgba(20, 11, 14, 0.8)"
              : variant === "micro"
                ? "transparent"
                : "rgba(248, 113, 113, 0.06)"
          }
          border={
            variant === "corner"
              ? "rgba(248, 113, 113, 0.18)"
              : variant === "micro"
                ? "transparent"
                : "rgba(248, 113, 113, 0.14)"
          }
          compact={variant !== "inline"}
          allowGlassEffects={allowGlassEffects}
          allowElevatedEffects={allowElevatedEffects}
        />

        <ActionButton
          label="Comments"
          value={commentCount}
          icon={<LuMessageSquare size={14} />}
          onClick={() => setIsCommentsOpen(true)}
          disabled={preview}
          accentColor={themeColor}
          background={
            variant === "corner"
              ? "rgba(13, 14, 24, 0.82)"
              : variant === "micro"
                ? "transparent"
                : "rgba(135, 118, 255, 0.06)"
          }
          border={
            variant === "corner"
              ? "rgba(135, 118, 255, 0.18)"
              : variant === "micro"
                ? "transparent"
                : "rgba(135, 118, 255, 0.12)"
          }
          compact={variant !== "inline"}
          allowGlassEffects={allowGlassEffects}
          allowElevatedEffects={allowElevatedEffects}
        />

        {normalizedLocationText ? (
          <MetricChip
            label="Location"
            value={normalizedLocationText}
            icon={<LuMapPin size={14} />}
            color="#edf4ff"
            background={
              variant === "corner"
                ? "rgba(7,10,18,0.78)"
                : variant === "micro"
                  ? "transparent"
                  : "rgba(255,255,255,0.035)"
            }
            border={
              variant === "corner"
                ? "rgba(255,255,255,0.10)"
                : variant === "micro"
                  ? "transparent"
                  : "rgba(255,255,255,0.07)"
            }
            className="profile-hero-location"
            compact={variant !== "inline"}
            allowGlassEffects={allowGlassEffects}
            allowElevatedEffects={allowElevatedEffects}
          />
        ) : null}
      </div>

      {isCommentsOpen ? (
        <ProfileCommentsModal
          username={username}
          commentCount={commentCount}
          canComment={canComment}
          isOwnProfile={isOwnProfile}
          open={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          onCountChange={setCommentCount}
        />
      ) : null}
    </div>
  );
}

function MetricChip({
  label,
  value,
  icon,
  color,
  background,
  border,
  className,
  compact = false,
  allowGlassEffects,
  allowElevatedEffects,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
  className?: string;
  compact?: boolean;
  allowGlassEffects: boolean;
  allowElevatedEffects: boolean;
}) {
  return (
    <div
      className={`profile-hero-chip ${className ?? ""}`.trim()}
      aria-label={`${label}: ${value}`}
      style={{
        ...chipBaseStyle(compact, allowElevatedEffects),
        color,
        background,
        border: `1px solid ${border}`,
        backdropFilter: allowGlassEffects ? "blur(10px) saturate(116%)" : "none",
        WebkitBackdropFilter: allowGlassEffects ? "blur(10px) saturate(116%)" : "none",
      }}
    >
      <span style={iconWrapStyle(compact)}>{icon}</span>
      <span className="profile-hero-token-copy" style={valueTextStyle(compact)}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

function ReactionButton({
  label,
  value,
  icon,
  onClick,
  disabled,
  isActive,
  accentColor,
  background,
  border,
  compact = false,
  allowGlassEffects,
  allowElevatedEffects,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
  isActive: boolean;
  accentColor: string;
  background: string;
  border: string;
  compact?: boolean;
  allowGlassEffects: boolean;
  allowElevatedEffects: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      className="profile-hero-reaction"
      aria-label={`${label}: ${value.toLocaleString()}`}
      style={reactionButtonStyle(
        accentColor,
        background,
        border,
        disabled,
        isActive,
        compact,
        allowGlassEffects,
        allowElevatedEffects,
      )}
    >
      <span style={iconWrapStyle(compact)}>{icon}</span>
      <span style={valueTextStyle(compact)}>{value.toLocaleString()}</span>
    </button>
  );
}

function ActionButton({
  label,
  value,
  icon,
  onClick,
  disabled,
  accentColor,
  background,
  border,
  compact = false,
  allowGlassEffects,
  allowElevatedEffects,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
  accentColor: string;
  background: string;
  border: string;
  compact?: boolean;
  allowGlassEffects: boolean;
  allowElevatedEffects: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="profile-hero-reaction"
      aria-label={`${label}: ${value.toLocaleString()}`}
      style={reactionButtonStyle(
        accentColor,
        background,
        border,
        disabled,
        false,
        compact,
        allowGlassEffects,
        allowElevatedEffects,
      )}
    >
      <span style={iconWrapStyle(compact)}>{icon}</span>
      <span style={valueTextStyle(compact)}>{value.toLocaleString()}</span>
    </button>
  );
}

function reactionButtonStyle(
  accentColor: string,
  background: string,
  border: string,
  disabled: boolean,
  isActive: boolean,
  compact: boolean,
  allowGlassEffects: boolean,
  allowElevatedEffects: boolean,
): CSSProperties {
  return {
    ...chipBaseStyle(compact, allowElevatedEffects),
    cursor: disabled ? "not-allowed" : "pointer",
    color: "#f7f9ff",
    background,
    border: `1px solid ${isActive ? `${accentColor}66` : border}`,
    boxShadow: !allowElevatedEffects
      ? "none"
      : isActive
      ? `0 0 0 1px ${accentColor}26, 0 8px 18px ${accentColor}12`
      : `0 6px 14px ${accentColor}08`,
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? "none" : "auto",
    fontFamily: "inherit",
    backdropFilter: allowGlassEffects ? "blur(10px) saturate(116%)" : "none",
    WebkitBackdropFilter: allowGlassEffects ? "blur(10px) saturate(116%)" : "none",
  };
}

function chipBaseStyle(
  compact: boolean,
  allowElevatedEffects: boolean,
): CSSProperties {
  return {
    minHeight: compact ? "28px" : "32px",
    padding: compact ? "0 9px" : "0 11px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: compact ? "6px" : "7px",
    boxShadow: allowElevatedEffects
      ? "inset 0 1px 0 rgba(255,255,255,0.04)"
      : "none",
    minWidth: 0,
    boxSizing: "border-box",
  };
}

function iconWrapStyle(compact: boolean): CSSProperties {
  return {
    width: compact ? "16px" : "18px",
    height: compact ? "16px" : "18px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

function valueTextStyle(compact: boolean): CSSProperties {
  return {
    fontSize: compact ? "11px" : "12px",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "0.01em",
    minWidth: 0,
  };
}
