"use client";

import Link from "next/link";

type PlanBannerActionsProps = {
  premium: boolean;
  topLinkStyle: React.CSSProperties;
  dangerButtonStyle: React.CSSProperties;
};

export default function PlanBannerActions({
  premium,
  topLinkStyle,
  dangerButtonStyle,
}: PlanBannerActionsProps) {
  async function handleManageSubscription() {
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error ?? "Não foi possível abrir o portal da assinatura.");
    } catch (error) {
      console.error("Erro ao abrir portal Stripe:", error);
      alert("Erro ao abrir portal da assinatura.");
    }
  }

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Link href="/pricing" style={topLinkStyle}>
        Ver pricing
      </Link>

      {premium ? (
        <button
          type="button"
          style={dangerButtonStyle}
          onClick={handleManageSubscription}
        >
          Gerenciar assinatura
        </button>
      ) : (
        <Link href="/pricing" style={topLinkStyle}>
          Assinar Premium
        </Link>
      )}
    </div>
  );
}
