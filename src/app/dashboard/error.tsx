"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logServerError } from "@/app/lib/server-log";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    logServerError("dashboard.error", error, {
      digest: error.digest ?? null,
    });
  }, [error]);

  return (
    <main
      style={{
        display: "grid",
        gap: "18px",
        padding: "28px",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(18,17,28,0.98), rgba(8,8,14,0.98))",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          width: "fit-content",
          minHeight: "32px",
          padding: "0 12px",
          borderRadius: "999px",
          border: "1px solid rgba(244,114,182,0.2)",
          backgroundColor: "rgba(244,114,182,0.08)",
          color: "#f9a8d4",
          fontSize: "11px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Dashboard Recovery
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(30px, 6vw, 44px)",
            lineHeight: 0.98,
            letterSpacing: "-0.05em",
          }}
        >
          Esta area do dashboard falhou ao carregar.
        </h1>
        <p
          style={{
            margin: 0,
            color: "#b8c4dc",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          Seus dados nao foram expostos. Tente renderizar a pagina novamente ou volte
          para o painel principal.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={reset}
          style={{
            minHeight: "44px",
            padding: "0 16px",
            borderRadius: "16px",
            border: "1px solid rgba(244,114,182,0.2)",
            background:
              "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
            color: "#ffffff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Recarregar area
        </button>

        <Link
          href="/dashboard"
          style={{
            minHeight: "44px",
            padding: "0 16px",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.04)",
            color: "#dbe6ff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  );
}
