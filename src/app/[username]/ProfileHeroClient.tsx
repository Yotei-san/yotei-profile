"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { LuEye, LuMapPin, LuMessageSquare, LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useI18n } from "@/app/components/I18nProvider";
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
  variant?: "inline" | "corner" | "micro" | "dock";
  includeLanguageSwitcher?: boolean;
  dockSide?: "left" | "right";
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
  includeLanguageSwitcher = false,
  dockSide = "right",
}: Props) {
  const { t } = useI18n();
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
  const isDock = variant === "dock";
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

        .profile-identity-dock {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: start;
          gap: 10px;
          min-width: min(100%, 320px);
          max-width: min(92vw, 560px);
          padding: 10px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.08) 0%, transparent 36%),
            radial-gradient(circle at 82% 50%, ${themeColor}12 0%, transparent 32%),
            linear-gradient(180deg, rgba(16,18,28,0.82), rgba(9,11,18,0.9));
          box-shadow:
            0 18px 38px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: ${allowGlassEffects ? "blur(16px) saturate(118%)" : "none"};
          -webkit-backdrop-filter: ${allowGlassEffects ? "blur(16px) saturate(118%)" : "none"};
        }

        .profile-identity-dock.side-left {
          justify-self: start;
        }

        .profile-identity-dock.side-right {
          justify-self: end;
        }

        .profile-identity-dock-language {
          position: relative;
          padding-right: 10px;
        }

        .profile-identity-dock-language::after {
          content: "";
          position: absolute;
          top: 6px;
          right: 0;
          bottom: 6px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent);
        }

        .profile-hero-metrics[data-variant="dock"] {
          gap: 6px;
          justify-content: flex-start;
          max-width: 100%;
        }

        .profile-hero-metrics[data-variant="dock"] .profile-hero-chip,
        .profile-hero-metrics[data-variant="dock"] .profile-hero-reaction {
          min-height: 36px;
          border-radius: 14px;
          box-shadow:
            0 10px 18px rgba(0,0,0,0.14),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .profile-hero-metrics[data-variant="dock"] .profile-hero-location {
          max-width: min(100%, 18rem);
        }

        .profile-hero-inline-language {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .profile-hero-metrics {
            gap: 7px;
          }

          .profile-hero-location {
            max-width: 100%;
          }

          .profile-identity-dock {
            grid-template-columns: minmax(0, 1fr);
            gap: 9px;
            width: min(92vw, 420px);
          }

          .profile-identity-dock-language {
            padding-right: 0;
          }

          .profile-identity-dock-language::after {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-hero-chip,
          .profile-hero-reaction {
            transition: none;
          }
        }
      `}</style>

      {isDock ? (
        <div className={`profile-identity-dock side-${dockSide}`}>
          {includeLanguageSwitcher ? (
            <div className="profile-identity-dock-language">
              <LanguageSwitcher variant="dock" />
            </div>
          ) : null}

          {renderMetrics({
            variant,
            align,
            views,
            likes,
            dislikes,
            commentCount,
            myReaction,
            themeColor,
            normalizedLocationText,
            isSubmitting,
            preview,
            allowGlassEffects,
            allowElevatedEffects,
            onLike: () => sendReaction("like"),
            onDislike: () => sendReaction("dislike"),
            onComments: () => setIsCommentsOpen(true),
            showLanguageSwitcher: false,
            labels: {
              views: t("publicProfile.views"),
              likes: t("publicProfile.likes"),
              dislikes: t("publicProfile.dislikes"),
              comments: t("publicProfile.comments"),
              location: t("publicProfile.location"),
            },
          })}
        </div>
      ) : (
        renderMetrics({
          variant,
          align,
          views,
          likes,
          dislikes,
          commentCount,
          myReaction,
          themeColor,
          normalizedLocationText,
          isSubmitting,
          preview,
          allowGlassEffects,
          allowElevatedEffects,
          onLike: () => sendReaction("like"),
          onDislike: () => sendReaction("dislike"),
          onComments: () => setIsCommentsOpen(true),
          showLanguageSwitcher: includeLanguageSwitcher,
          labels: {
            views: t("publicProfile.views"),
            likes: t("publicProfile.likes"),
            dislikes: t("publicProfile.dislikes"),
            comments: t("publicProfile.comments"),
            location: t("publicProfile.location"),
          },
        })
      )}

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

function renderMetrics({
  variant,
  align,
  views,
  likes,
  dislikes,
  commentCount,
  myReaction,
  themeColor,
  normalizedLocationText,
  isSubmitting,
  preview,
  allowGlassEffects,
  allowElevatedEffects,
  onLike,
  onDislike,
  onComments,
  showLanguageSwitcher,
  labels,
}: {
  variant: Props["variant"];
  align: Props["align"];
  views: number;
  likes: number;
  dislikes: number;
  commentCount: number;
  myReaction: MyReaction;
  themeColor: string;
  normalizedLocationText: string;
  isSubmitting: boolean;
  preview: boolean;
  allowGlassEffects: boolean;
  allowElevatedEffects: boolean;
  onLike: () => void;
  onDislike: () => void;
  onComments: () => void;
  showLanguageSwitcher: boolean;
  labels: {
    views: string;
    likes: string;
    dislikes: string;
    comments: string;
    location: string;
  };
}) {
  const isCorner = variant === "corner";
  const isDock = variant === "dock";
  const isMicro = variant === "micro";
  const compact = variant !== "inline";

  return (
    <div
      className={`profile-hero-metrics ${align === "center" ? "align-center" : ""}`}
      data-variant={variant}
    >
      {showLanguageSwitcher ? (
        <div className="profile-hero-inline-language">
          <LanguageSwitcher variant="dock" />
        </div>
      ) : null}

      <MetricChip
        label={labels.views}
        value={views}
        icon={<LuEye size={14} />}
        color="#dbe4f5"
        background={
          isCorner
            ? "rgba(7,10,18,0.78)"
            : isDock
              ? "rgba(255,255,255,0.045)"
              : isMicro
                ? "transparent"
                : "rgba(255,255,255,0.035)"
        }
        border={
          isCorner
            ? "rgba(255,255,255,0.10)"
            : isDock
              ? "rgba(255,255,255,0.08)"
              : isMicro
                ? "transparent"
                : "rgba(255,255,255,0.07)"
        }
        compact={compact}
        variant={variant}
        allowGlassEffects={allowGlassEffects}
        allowElevatedEffects={allowElevatedEffects}
      />

      <ReactionButton
        label={labels.likes}
        value={likes}
        icon={<LuThumbsUp size={14} />}
        onClick={onLike}
        disabled={isSubmitting || preview}
        isActive={myReaction === "like"}
        accentColor={themeColor}
        background={
          isCorner
            ? "rgba(9, 20, 16, 0.8)"
            : isDock
              ? "rgba(69, 212, 131, 0.1)"
              : isMicro
                ? "transparent"
                : "rgba(69, 212, 131, 0.06)"
        }
        border={
          isCorner
            ? "rgba(69, 212, 131, 0.18)"
            : isDock
              ? "rgba(69, 212, 131, 0.18)"
              : isMicro
                ? "transparent"
                : "rgba(69, 212, 131, 0.14)"
        }
        compact={compact}
        variant={variant}
        allowGlassEffects={allowGlassEffects}
        allowElevatedEffects={allowElevatedEffects}
      />

      <ReactionButton
        label={labels.dislikes}
        value={dislikes}
        icon={<LuThumbsDown size={14} />}
        onClick={onDislike}
        disabled={isSubmitting || preview}
        isActive={myReaction === "dislike"}
        accentColor={themeColor}
        background={
          isCorner
            ? "rgba(20, 11, 14, 0.8)"
            : isDock
              ? "rgba(248, 113, 113, 0.09)"
              : isMicro
                ? "transparent"
                : "rgba(248, 113, 113, 0.06)"
        }
        border={
          isCorner
            ? "rgba(248, 113, 113, 0.18)"
            : isDock
              ? "rgba(248, 113, 113, 0.16)"
              : isMicro
                ? "transparent"
                : "rgba(248, 113, 113, 0.14)"
        }
        compact={compact}
        variant={variant}
        allowGlassEffects={allowGlassEffects}
        allowElevatedEffects={allowElevatedEffects}
      />

      <ActionButton
        label={labels.comments}
        value={commentCount}
        icon={<LuMessageSquare size={14} />}
        onClick={onComments}
        disabled={preview}
        accentColor={themeColor}
        background={
          isCorner
            ? "rgba(13, 14, 24, 0.82)"
            : isDock
              ? "rgba(135, 118, 255, 0.1)"
              : isMicro
                ? "transparent"
                : "rgba(135, 118, 255, 0.06)"
        }
        border={
          isCorner
            ? "rgba(135, 118, 255, 0.18)"
            : isDock
              ? "rgba(135, 118, 255, 0.17)"
              : isMicro
                ? "transparent"
                : "rgba(135, 118, 255, 0.12)"
        }
        compact={compact}
        variant={variant}
        allowGlassEffects={allowGlassEffects}
        allowElevatedEffects={allowElevatedEffects}
      />

      {normalizedLocationText ? (
        <MetricChip
          label={labels.location}
          value={normalizedLocationText}
          icon={<LuMapPin size={14} />}
          color="#edf4ff"
          background={
            isCorner
              ? "rgba(7,10,18,0.78)"
              : isDock
                ? "rgba(255,255,255,0.045)"
                : isMicro
                  ? "transparent"
                  : "rgba(255,255,255,0.035)"
          }
          border={
            isCorner
              ? "rgba(255,255,255,0.10)"
              : isDock
                ? "rgba(255,255,255,0.08)"
                : isMicro
                  ? "transparent"
                  : "rgba(255,255,255,0.07)"
          }
          className="profile-hero-location"
          compact={compact}
          variant={variant}
          allowGlassEffects={allowGlassEffects}
          allowElevatedEffects={allowElevatedEffects}
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
  variant,
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
  variant: Props["variant"];
  allowGlassEffects: boolean;
  allowElevatedEffects: boolean;
}) {
  return (
    <div
      className={`profile-hero-chip ${className ?? ""}`.trim()}
      aria-label={`${label}: ${value}`}
      style={{
        ...chipBaseStyle(compact, allowElevatedEffects, variant),
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
  variant,
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
  variant: Props["variant"];
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
        variant,
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
  variant,
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
  variant: Props["variant"];
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
        variant,
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
  variant: Props["variant"],
  allowGlassEffects: boolean,
  allowElevatedEffects: boolean,
): CSSProperties {
  return {
    ...chipBaseStyle(compact, allowElevatedEffects, variant),
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
  variant: Props["variant"],
): CSSProperties {
  const isDock = variant === "dock";

  return {
    minHeight: isDock ? "36px" : compact ? "28px" : "32px",
    padding: isDock ? "0 11px" : compact ? "0 9px" : "0 11px",
    borderRadius: isDock ? "14px" : "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: isDock ? "7px" : compact ? "6px" : "7px",
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
