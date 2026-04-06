import Link from "next/link";
import { loginUser } from "./actions";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0b0b",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#151515",
          border: "1px solid #2a2a2a",
          borderRadius: "18px",
          padding: "28px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px", marginBottom: "8px" }}>
          Entrar
        </h1>
        <p style={{ color: "#a3a3a3", marginBottom: "24px" }}>
          Acesse seu painel do Yotei Profile
        </p>

        <form action={loginUser} style={{ display: "grid", gap: "14px" }}>
          <input
            name="email"
            type="email"
            placeholder="Seu e-mail"
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Sua senha"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Entrar
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#a3a3a3" }}>
          Não tem conta?{" "}
          <Link href="/register" style={{ color: "#60a5fa" }}>
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #303030",
  backgroundColor: "#0f0f0f",
  color: "#fff",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};