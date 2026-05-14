"use client";

import { useState, useTransition } from "react";

type Props = {
  compact?: boolean;
};

export default function ResendVerificationButton({ compact = false }: Props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
        };

        if (!response.ok || !result.success) {
          setError(result.message || "Unable to resend verification email right now.");
          return;
        }

        setMessage(result.message || "Verification email sent.");
      } catch {
        setError("Unable to resend verification email right now.");
      }
    });
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "8px",
        minWidth: 0,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        style={{
          ...buttonStyle,
          ...(compact ? compactButtonStyle : null),
          opacity: isPending ? 0.72 : 1,
        }}
      >
        {isPending ? "Sending..." : "Resend verification email"}
      </button>

      {message ? <div style={successStyle}>{message}</div> : null}
      {error ? <div style={errorStyle}>{error}</div> : null}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  minHeight: "44px",
  padding: "0 16px",
  borderRadius: "16px",
  border: "1px solid rgba(135,118,255,0.22)",
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.18), rgba(255,110,168,0.14))",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
  transition: "transform 160ms ease, border-color 160ms ease, opacity 160ms ease",
};

const compactButtonStyle: React.CSSProperties = {
  minHeight: "40px",
  padding: "0 14px",
  fontSize: "13px",
};

const successStyle: React.CSSProperties = {
  color: "#86efac",
  fontSize: "13px",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};

const errorStyle: React.CSSProperties = {
  color: "#fca5a5",
  fontSize: "13px",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};
