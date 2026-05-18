"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logServerError } from "@/app/lib/server-log";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    logServerError("app.global-error", error, {
      digest: error.digest ?? null,
    });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background:
            "radial-gradient(circle at top, rgba(244,114,182,0.12), transparent 28%), linear-gradient(180deg, #07080d 0%, #05060a 100%)",
          color: "#ffffff",
          fontFamily:
            'Inter, Arial, Helvetica, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <main
          style={{
            width: "min(680px, 100%)",
            display: "grid",
            gap: "18px",
            padding: "30px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(18,17,28,0.98), rgba(8,8,14,0.98))",
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              minHeight: "34px",
              padding: "0 12px",
              borderRadius: "999px",
              border: "1px solid rgba(244,114,182,0.2)",
              backgroundColor: "rgba(244,114,182,0.08)",
              color: "#f9a8d4",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Yotei Stability Guard
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 8vw, 52px)",
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
            }}
          >
            Algo saiu do caminho.
          </h1>

          <p
            style={{
              margin: 0,
              color: "#b8c4dc",
              fontSize: "15px",
              lineHeight: 1.75,
            }}
          >
            O problema foi registrado de forma segura. Tente recarregar esta area ou
            volte para uma pagina estavel enquanto recuperamos a renderizacao.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: "46px",
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
              Tentar novamente
            </button>

            <Link
              href="/"
              style={{
                minHeight: "46px",
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
              Voltar para a home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
