"use client";

import { useState, useTransition } from "react";
import { useI18n } from "@/app/components/I18nProvider";

type Props = {
  isSignedIn: boolean;
  hasPremiumAccess: boolean;
};

export default function PricingActions({
  isSignedIn,
  hasPremiumAccess,
}: Props) {
  const { t } = useI18n();
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
                ? t("pricing.openPortalError")
                : t("pricing.startCheckoutError"))
          );
          return;
        }

        setMessage(
          endpoint === "/api/stripe/portal"
            ? t("pricing.openingBillingPortal")
            : t("pricing.redirectingCheckout")
        );
        window.location.href = data.url;
      } catch {
        setError(
          endpoint === "/api/stripe/portal"
            ? t("pricing.openPortalError")
            : t("pricing.startCheckoutError")
        );
      }
    });
  }

  if (!isSignedIn) {
    return (
      <div style={{ display: "grid", gap: "10px" }}>
        <a href="/login" style={primaryButtonStyle}>
          {t("pricing.signInToUpgrade")}
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
          {isPending ? t("pricing.openingPortal") : t("pricing.manageSubscription")}
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
          {isPending ? t("pricing.startingCheckout") : t("pricing.startCheckout")}
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
