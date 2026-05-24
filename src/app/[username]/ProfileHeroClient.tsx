"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { LuEye, LuMapPin, LuThumbsDown, LuThumbsUp } from "react-icons/lu";

type MyReaction = "like" | "dislike" | null;

type Props = {
  username: string;
  initialViews: number;
  initialLikes: number;
  initialDislikes: number;
  themeColor: string;
  initialMyReaction: MyReaction;
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
  themeColor,
  initialMyReaction,
  locationText,
  align = "start",
  preview = false,
  variant = "inline",
}: Props) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [myReaction, setMyReaction] = useState<MyReaction>(initialMyReaction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasTrackedView = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    setViews(initialViews);
    setLikes(initialLikes);
    setDislikes(initialDislikes);
    setMyReaction(initialMyReaction);
  }, [initialViews, initialLikes, initialDislikes, initialMyReaction]);

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

  return (
    <div>
      <style>{`
        .profile-hero-metrics {
          display: flex;
          align-items: center;
          gap: 6px;
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
            0 12px 28px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.05);
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
            gap: 6px;
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
          />
        ) : null}
      </div>
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
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`profile-hero-chip ${className ?? ""}`.trim()}
      aria-label={`${label}: ${value}`}
      style={{
        ...chipBaseStyle(compact),
        color,
        background,
        border: `1px solid ${border}`,
        backdropFilter: "blur(10px) saturate(116%)",
        WebkitBackdropFilter: "blur(10px) saturate(116%)",
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
): CSSProperties {
  return {
    ...chipBaseStyle(compact),
    cursor: disabled ? "not-allowed" : "pointer",
    color: "#f7f9ff",
    background,
    border: `1px solid ${isActive ? `${accentColor}66` : border}`,
    boxShadow: isActive
      ? `0 0 0 1px ${accentColor}30, 0 12px 28px ${accentColor}14`
      : `0 10px 24px ${accentColor}0a`,
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? "none" : "auto",
    fontFamily: "inherit",
    backdropFilter: "blur(10px) saturate(116%)",
    WebkitBackdropFilter: "blur(10px) saturate(116%)",
  };
}

function chipBaseStyle(compact: boolean): CSSProperties {
  return {
    minHeight: compact ? "28px" : "30px",
    padding: compact ? "0 9px" : "0 10px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: compact ? "6px" : "7px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
