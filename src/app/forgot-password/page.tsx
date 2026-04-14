"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setError("Digite seu email.");
      return;
    }

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setMessage(
          "Se existir uma conta com esse email, você receberá instruções para redefinir a senha."
        );
      } catch {
        setError("Erro ao solicitar redefinição.");
      }
    });
  }

  return (
    <main style={mainStyle}>
      <section style={panelStyle}>
        <div style={badgeStyle}>Yotei Profile</div>

        <Link href="/login" style={backLinkStyle}>
          ← Voltar para login
        </Link>

        <h1 style={titleStyle}>Recuperar senha</h1>
        <p style={subtitleStyle}>
          Digite seu email para receber instruções de redefinição.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            <span style={labelTextStyle}>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Seu email"
              required
              style={inputStyle}
              autoComplete="email"
            />
          </label>

          {error ? <div style={errorStyle}>{error}</div> : null}
          {message ? <div style={successStyle}>{message}</div> : null}

          <button type="submit" disabled={isPending} style={buttonStyle}>
            {isPending ? "Enviando..." : "Enviar instruções"}
          </button>
        </form>
      </section>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "radial-gradient(circle at top, rgba(244,114,182,0.10), transparent 22%), linear-gradient(180deg, #09090b 0%, #050505 100%)",
  color: "#ffffff",
  fontFamily:
    'Inter, Arial, Helvetica, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const panelStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "460px",
  background: "linear-gradient(180deg, #111114 0%, #0a0a0d 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(244,114,182,0.16)",
  backgroundColor: "rgba(244,114,182,0.08)",
  color: "#f9a8d4",
  fontSize: "12px",
  fontWeight: 800,
  marginBottom: "16px",
};

const backLinkStyle: React.CSSProperties = {
  color: "#a1a1aa",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
  marginBottom: "18px",
  display: "inline-block",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "36px",
  fontWeight: 900,
  lineHeight: 1.05,
};

const subtitleStyle: React.CSSProperties = {
  color: "#a1a1aa",
  marginTop: "10px",
  marginBottom: "20px",
  lineHeight: 1.6,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelTextStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#e4e4e7",
};

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #27272a",
  background: "#0d0d10",
  color: "#fff",
  outline: "none",
  fontSize: "15px",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(244,114,182,0.22)",
  background:
    "linear-gradient(180deg, rgba(244,114,182,0.22), rgba(236,72,153,0.16))",
  color: "#fff",
  fontWeight: 800,
  fontSize: "15px",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  border: "1px solid rgba(239,68,68,0.24)",
  background: "rgba(127,29,29,0.18)",
  color: "#fca5a5",
  padding: "12px",
  borderRadius: "12px",
  fontSize: "14px",
};

const successStyle: React.CSSProperties = {
  border: "1px solid rgba(34,197,94,0.24)",
  background: "rgba(22,101,52,0.18)",
  color: "#86efac",
  padding: "12px",
  borderRadius: "12px",
  fontSize: "14px",
};