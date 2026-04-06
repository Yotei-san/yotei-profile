"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  username: string;
};

type ReactionState = {
  likes: number;
  dislikes: number;
  score: number;
};

export default function ReactionBar({ username }: Props) {
  const [state, setState] = useState<ReactionState>({
    likes: 0,
    dislikes: 0,
    score: 0,
  });
  const [loading, setLoading] = useState(false);

  const storageKey = useMemo(() => `reaction:${username}`, [username]);
  const reactedType =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/profile-reaction/${username}`);
      const data = await response.json();

      if (response.ok) {
        setState(data);
      }
    }

    void load();
  }, [username]);

  async function sendReaction(type: "like" | "dislike") {
    if (loading) return;

    const already = localStorage.getItem(storageKey);
    if (already) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/profile-reaction/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();

      if (response.ok) {
        setState(data);
        localStorage.setItem(storageKey, type);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => sendReaction("like")}
          disabled={loading || !!reactedType}
          style={btnStyle(reactedType === "like")}
        >
          👍 Like {state.likes}
        </button>

        <button
          type="button"
          onClick={() => sendReaction("dislike")}
          disabled={loading || !!reactedType}
          style={btnStyle(reactedType === "dislike")}
        >
          👎 Dislike {state.dislikes}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#d1d5db",
          fontSize: "14px",
        }}
      >
        Score: <strong>{state.score}</strong>
      </div>
    </div>
  );
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    backgroundColor: active ? "rgba(236, 72, 153, 0.22)" : "rgba(255,255,255,0.08)",
    border: active ? "1px solid rgba(236, 72, 153, 0.45)" : "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: "140px",
  };
}