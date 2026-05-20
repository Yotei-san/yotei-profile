"use client";

import { useState, useTransition } from "react";

type Props = {
  isSignedIn: boolean;
  hasPremiumAccess: boolean;
};

export default function PricingActions({
  isSignedIn,
  hasPremiumAccess,
}: Props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openStripeFlow(endpoint: "/api/stripe/checkout" | "/api/stripe/portal") {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch(endpoint, { method: "POST" });
        const data = (await response.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;

        if (!response.ok || !data?.url) {
          setError(
            data?.error ||
              (endpoint === "/api/stripe/portal"
                ? "Unable to open the billing portal right now."
                : "Unable to start premium checkout right now.")
          );
          return;
        }

        setMessage(
          endpoint === "/api/stripe/portal"
            ? "Opening billing portal..."
            : "Redirecting to Stripe checkout..."
        );
        window.location.href = data.url;
      } catch {
        setError(
          endpoint === "/api/stripe/portal"
            ? "Unable to open the billing portal right now."
            : "Unable to start premium checkout right now."
        );
      }
    });
  }

  if (!isSignedIn) {
    return (
      <div style={{ display: "grid", gap: "10px" }}>
        <a href="/login" style={primaryButtonStyle}>
          Sign in to upgrade
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {hasPremiumAccess ? (
        <button
          type="button"
          onClick={() => openStripeFlow("/api/stripe/portal")}
          disabled={isPending}
          style={{
            ...secondaryButtonStyle,
            opacity: isPending ? 0.72 : 1,
            cursor: isPending ? "wait" : "pointer",
          }}
        >
          {isPending ? "Opening portal..." : "Manage subscription"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => openStripeFlow("/api/stripe/checkout")}
          disabled={isPending}
          style={{
            ...primaryButtonStyle,
            opacity: isPending ? 0.72 : 1,
            cursor: isPending ? "wait" : "pointer",
          }}
        >
          {isPending ? "Starting checkout..." : "Start premium test checkout"}
        </button>
      )}

      {message ? <div style={successStyle}>{message}</div> : null}
      {error ? <div style={errorStyle}>{error}</div> : null}
    </div>
  );
}

const buttonBaseStyle: React.CSSProperties = {
  minHeight: "48px",
  width: "100%",
  padding: "0 18px",
  borderRadius: "16px",
  fontSize: "14px",
  fontWeight: 800,
  textAlign: "center",
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(244,114,182,0.18)",
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
  color: "#ffffff",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#dbe6ff",
};

const successStyle: React.CSSProperties = {
  color: "#86efac",
  fontSize: "13px",
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  color: "#fca5a5",
  fontSize: "13px",
  lineHeight: 1.5,
};
