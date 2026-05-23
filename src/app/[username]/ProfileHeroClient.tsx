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
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .profile-hero-metrics.align-center {
          justify-content: center;
        }

        .profile-hero-chip,
        .profile-hero-reaction {
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease,
            background 160ms ease,
            opacity 160ms ease;
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

      <div className={`profile-hero-metrics ${align === "center" ? "align-center" : ""}`}>
        <MetricChip
          label="Views"
          value={views}
          icon={<LuEye size={14} />}
          color="#dbe4f5"
          background="rgba(255,255,255,0.04)"
          border="rgba(255,255,255,0.08)"
        />

        <ReactionButton
          label="Likes"
          value={likes}
          icon={<LuThumbsUp size={14} />}
          onClick={() => sendReaction("like")}
          disabled={isSubmitting || preview}
          isActive={myReaction === "like"}
          accentColor={themeColor}
          background="rgba(69, 212, 131, 0.08)"
          border="rgba(69, 212, 131, 0.18)"
        />

        <ReactionButton
          label="Dislikes"
          value={dislikes}
          icon={<LuThumbsDown size={14} />}
          onClick={() => sendReaction("dislike")}
          disabled={isSubmitting || preview}
          isActive={myReaction === "dislike"}
          accentColor={themeColor}
          background="rgba(248, 113, 113, 0.08)"
          border="rgba(248, 113, 113, 0.16)"
        />

        {normalizedLocationText ? (
          <MetricChip
            label="Location"
            value={normalizedLocationText}
            icon={<LuMapPin size={14} />}
            color="#edf4ff"
            background="rgba(255,255,255,0.04)"
            border="rgba(255,255,255,0.08)"
            className="profile-hero-location"
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
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
  className?: string;
}) {
  return (
    <div
      className={`profile-hero-chip ${className ?? ""}`.trim()}
      aria-label={`${label}: ${value}`}
      style={{
        ...chipBaseStyle,
        color,
        background,
        border: `1px solid ${border}`,
      }}
    >
      <span style={iconWrapStyle}>{icon}</span>
      <span className="profile-hero-token-copy" style={valueTextStyle}>
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
        isActive
      )}
    >
      <span style={iconWrapStyle}>{icon}</span>
      <span style={valueTextStyle}>{value.toLocaleString()}</span>
    </button>
  );
}

function reactionButtonStyle(
  accentColor: string,
  background: string,
  border: string,
  disabled: boolean,
  isActive: boolean
): CSSProperties {
  return {
    ...chipBaseStyle,
    cursor: disabled ? "not-allowed" : "pointer",
    color: "#f7f9ff",
    background,
    border: `1px solid ${isActive ? `${accentColor}66` : border}`,
    boxShadow: isActive
      ? `0 0 0 1px ${accentColor}36, 0 10px 24px ${accentColor}14`
      : `0 8px 20px ${accentColor}0a`,
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? "none" : "auto",
    fontFamily: "inherit",
  };
}

const chipBaseStyle: CSSProperties = {
  minHeight: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  minWidth: 0,
  boxSizing: "border-box",
};

const iconWrapStyle: CSSProperties = {
  width: "18px",
  height: "18px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const valueTextStyle: CSSProperties = {
  fontSize: "12px",
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "0.01em",
  minWidth: 0,
};
