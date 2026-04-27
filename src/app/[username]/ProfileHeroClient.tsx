"use client";

import { useEffect, useRef, useState } from "react";

type MyReaction = "like" | "dislike" | null;

type Props = {
  username: string;
  initialViews: number;
  initialLikes: number;
  initialDislikes: number;
  themeColor: string;
  initialMyReaction: MyReaction;
};

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

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile-view/${username}`, {
          method: "POST",
        });

        if (!res.ok) return;

        const data = await res.json().catch(() => null);

        if (data && typeof data.views === "number") {
          setViews(data.views);
        } else {
          setViews((prev) => prev + 1);
        }
      } catch {
        setViews((prev) => prev + 1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [username]);

  async function sendReaction(type: "like" | "dislike") {
    if (isSubmitting) return;

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
        } else {
          setMyReaction(type);
        }

        return;
      }
    } catch (error) {
      console.error("reaction client error", error);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 400);
    }
  }

  return (
    <div
      style={{
        marginTop: "16px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <MetricPill
        text={`👁 ${views} views`}
        color="#cbd5e1"
        bg="rgba(255,255,255,0.04)"
        border="rgba(255,255,255,0.08)"
      />

      <button
        type="button"
        onClick={() => sendReaction("like")}
        disabled={isSubmitting}
        style={reactionButtonStyle(
          themeColor,
          "rgba(74, 222, 128, 0.18)",
          "rgba(74, 222, 128, 0.28)",
          isSubmitting,
          myReaction === "like"
        )}
      >
        👍 {likes}
      </button>

      <button
        type="button"
        onClick={() => sendReaction("dislike")}
        disabled={isSubmitting}
        style={reactionButtonStyle(
          themeColor,
          "rgba(248, 113, 113, 0.16)",
          "rgba(248, 113, 113, 0.28)",
          isSubmitting,
          myReaction === "dislike"
        )}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}

function MetricPill({
  text,
  color,
  bg,
  border,
}: {
  text: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 12px",
        borderRadius: "999px",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: "13px",
        fontWeight: 900,
        backdropFilter: "blur(10px)",
      }}
    >
      {text}
    </div>
  );
}

function reactionButtonStyle(
  themeColor: string,
  bg: string,
  border: string,
  isSubmitting: boolean,
  isActive: boolean
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    borderRadius: "999px",
    backgroundColor: bg,
    border: `1px solid ${border}`,
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    backdropFilter: "blur(10px)",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    boxShadow: isActive
      ? `0 0 0 1px ${themeColor}66, 0 10px 24px ${themeColor}22`
      : `0 10px 24px ${themeColor}12`,
    opacity: isSubmitting ? 0.65 : 1,
    pointerEvents: isSubmitting ? "none" : "auto",
    transition: "opacity 0.15s ease, box-shadow 0.15s ease",
  };
}