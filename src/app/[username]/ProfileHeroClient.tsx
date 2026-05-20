"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { LuEye, LuThumbsDown, LuThumbsUp } from "react-icons/lu";

type MyReaction = "like" | "dislike" | null;

type Props = {
  username: string;
  initialViews: number;
  initialLikes: number;
  initialDislikes: number;
  themeColor: string;
  initialMyReaction: MyReaction;
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
  }, [username]);

  async function sendReaction(type: "like" | "dislike") {
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

  return (
    <div style={{ marginTop: "20px" }}>
      <style>{`
        .profile-hero-metrics {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .profile-hero-chip,
        .profile-hero-reaction {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            opacity 160ms ease;
        }

        .profile-hero-chip {
          background: rgba(255, 255, 255, 0.035);
        }

        .profile-hero-reaction:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        @media (max-width: 820px) {
          .profile-hero-metrics {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .profile-hero-metrics {
            display: grid;
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="profile-hero-metrics">
        <MetricChip
          label="Views"
          value={views}
          icon={<LuEye size={15} />}
          color="#dbe4f5"
          background="rgba(255,255,255,0.035)"
          border="rgba(255,255,255,0.07)"
        />

        <ReactionButton
          label="Like"
          value={likes}
          icon={<LuThumbsUp size={15} />}
          onClick={() => sendReaction("like")}
          disabled={isSubmitting}
          isActive={myReaction === "like"}
          accentColor={themeColor}
          background="rgba(69, 212, 131, 0.09)"
          border="rgba(69, 212, 131, 0.18)"
        />

        <ReactionButton
          label="Dislike"
          value={dislikes}
          icon={<LuThumbsDown size={15} />}
          onClick={() => sendReaction("dislike")}
          disabled={isSubmitting}
          isActive={myReaction === "dislike"}
          accentColor={themeColor}
          background="rgba(248, 113, 113, 0.08)"
          border="rgba(248, 113, 113, 0.16)"
        />
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
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
}) {
  return (
    <div
      className="profile-hero-chip"
      style={{
        ...chipBaseStyle,
        color,
        background,
        border: `1px solid ${border}`,
      }}
    >
      <span style={iconWrapStyle}>{icon}</span>
      <span style={copyWrapStyle}>
        <strong style={valueStyle}>{value}</strong>
        <span style={labelStyle}>{label}</span>
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
      style={reactionButtonStyle(
        accentColor,
        background,
        border,
        disabled,
        isActive
      )}
    >
      <span style={iconWrapStyle}>{icon}</span>
      <span style={copyWrapStyle}>
        <strong style={valueStyle}>{value}</strong>
        <span style={labelStyle}>{label}</span>
      </span>
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
      ? `0 0 0 1px ${accentColor}36, 0 12px 26px ${accentColor}16`
      : `0 10px 24px ${accentColor}0d`,
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? "none" : "auto",
    paddingRight: "18px",
    fontFamily: "inherit",
  };
}

const chipBaseStyle: CSSProperties = {
  minHeight: "52px",
  padding: "0 15px",
  borderRadius: "18px",
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const iconWrapStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "12px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  flexShrink: 0,
};

const copyWrapStyle: CSSProperties = {
  display: "grid",
  textAlign: "left",
  minWidth: 0,
};

const valueStyle: CSSProperties = {
  fontSize: "15px",
  lineHeight: 1,
  letterSpacing: "-0.03em",
};

const labelStyle: CSSProperties = {
  marginTop: "5px",
  color: "#9dabc6",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};
