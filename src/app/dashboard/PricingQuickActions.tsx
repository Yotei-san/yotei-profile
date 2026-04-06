"use client";

import Link from "next/link";

type PricingQuickActionsProps = {
  premium: boolean;
  topLinkStyle: React.CSSProperties;
  secondaryButtonWideStyle: React.CSSProperties;
  currentPlanBoxStyle: React.CSSProperties;
};

export default function PricingQuickActions({
  premium,
  topLinkStyle,
  secondaryButtonWideStyle,
  currentPlanBoxStyle,
}: PricingQuickActionsProps) {
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
    <>
      <div style={{ marginTop: "18px" }}>
        {!premium ? (
          <div style={currentPlanBoxStyle}>Plano atual</div>
        ) : (
          <button
            type="button"
            style={secondaryButtonWideStyle}
            onClick={handleManageSubscription}
          >
            Gerenciar plano
          </button>
        )}
      </div>

      <div style={{ marginTop: "18px" }}>
        {premium ? (
          <div style={currentPlanBoxStyle}>Plano atual</div>
        ) : (
          <Link
            href="/pricing"
            style={{ ...topLinkStyle, display: "block", textAlign: "center" }}
          >
            Assinar Premium
          </Link>
        )}
      </div>
    </>
  );
}