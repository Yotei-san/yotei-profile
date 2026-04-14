"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await registerUser(formData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar conta.";

        if (message.includes("NEXT_REDIRECT")) {
          throw err;
        }

        setError(message);
      }
    });
  }

  return (
    <main style={mainStyle}>
      <section style={panelStyle}>
        <div style={badgeStyle}>Yotei Profile</div>

        <Link href="/" style={backLinkStyle}>
          ← Voltar para a home
        </Link>

        <h1 style={titleStyle}>Criar conta</h1>
        <p style={subtitleStyle}>
          Comece seu perfil personalizável no Yotei em poucos segundos.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            <span style={labelTextStyle}>Nome de exibição</span>
            <input
              type="text"
              name="displayName"
              placeholder="Como seu nome vai aparecer"
              style={inputStyle}
              autoComplete="nickname"
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Seu username"
              required
              style={inputStyle}
              autoComplete="username"
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Seu melhor email"
              required
              style={inputStyle}
              autoComplete="email"
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Senha</span>
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha"
              required
              style={inputStyle}
              autoComplete="new-password"
            />
          </label>

          {error ? <div style={errorStyle}>{error}</div> : null}

          <button type="submit" disabled={isPending} style={buttonStyle}>
            {isPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div style={footerRowStyle}>
          <Link href="/login" style={textLinkStyle}>
            Já tenho conta
          </Link>

          <Link href="/forgot-password" style={textLinkStyle}>
            Esqueci minha senha
          </Link>
        </div>
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
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(244,114,182,0.16)",
  backgroundColor: "rgba(244,114,182,0.08)",
  color: "#f9a8d4",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.04em",
  marginBottom: "16px",
};

const backLinkStyle: React.CSSProperties = {
  color: "#a1a1aa",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
  display: "inline-block",
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: "10px",
  marginBottom: "22px",
  color: "#a1a1aa",
  fontSize: "15px",
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
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #27272a",
  backgroundColor: "#0d0d10",
  color: "#ffffff",
  outline: "none",
  fontSize: "15px",
  transition: "border-color 0.18s ease, background-color 0.18s ease",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.22)",
  background:
    "linear-gradient(180deg, rgba(244,114,182,0.22), rgba(236,72,153,0.16))",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "15px",
  marginTop: "4px",
  transition: "transform 0.16s ease, border-color 0.16s ease",
};

const errorStyle: React.CSSProperties = {
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.24)",
  backgroundColor: "rgba(127,29,29,0.18)",
  color: "#fca5a5",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: 1.5,
};

const footerRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const textLinkStyle: React.CSSProperties = {
  color: "#a1a1aa",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};