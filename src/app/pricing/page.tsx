"use client";

import Link from "next/link";

export default function PricingPage() {
  async function handleCheckout() {
    try {
      console.log("Cliquei em Assinar Premium");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      console.log("Status checkout:", response.status);

      const data = await response.json();
      console.log("Resposta checkout:", data);

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error ?? "Não foi possível iniciar o checkout.");
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro inesperado ao iniciar checkout.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), #070707",
        color: "#ffffff",
        padding: "32px 24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "42px", margin: 0 }}>Pricing</h1>
            <p style={{ color: "#a3a3a3", marginTop: "10px" }}>
              Escolha o plano ideal para o seu perfil
            </p>
          </div>

          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              backgroundColor: "#141414",
              border: "1px solid #2a2a2a",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: "12px",
            }}
          >
            Voltar ao dashboard
          </Link>
        </div>

        <div
          style={{
            background:
              "linear-gradient(90deg, rgba(34,34,34,1), rgba(18,18,18,1))",
            border: "1px solid #222",
            borderRadius: "18px",
            padding: "18px 20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#d4d4d4" }}>Plano atual</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>
            Free
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#101010",
              border: "1px solid #242424",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#d4d4d4",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Starter
            </div>

            <h3 style={{ fontSize: "30px", margin: "12px 0 8px 0" }}>Free</h3>

            <p style={{ color: "#d4d4d4", lineHeight: 1.7, margin: 0 }}>
              Tudo que você precisa para começar a montar e divulgar seu perfil.
            </p>

            <div style={{ display: "grid", gap: "10px", marginTop: "16px", color: "#fff" }}>
              <div>✓ Até 5 links</div>
              <div>✓ Até 2 imagens na galeria</div>
              <div>✓ Analytics básico</div>
              <div>✓ Reações públicas</div>
              <div>✓ Layout padrão</div>
              <div>✓ Personalização básica</div>
            </div>

            <div
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: "18px",
              }}
            >
              Plano atual
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, rgba(48,16,31,1), rgba(26,12,18,1))",
              border: "1px solid rgba(236,72,153,0.22)",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(236,72,153,0.12)",
                border: "1px solid rgba(236,72,153,0.22)",
                color: "#f9a8d4",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Mais popular
            </div>

            <h3 style={{ fontSize: "30px", margin: "12px 0 8px 0" }}>Premium</h3>

            <p style={{ color: "#d4d4d4", lineHeight: 1.7, margin: 0 }}>
              Libera os recursos mais fortes do seu produto e deixa o perfil com cara muito mais premium.
            </p>

            <div style={{ display: "grid", gap: "10px", marginTop: "16px", color: "#fff" }}>
              <div>✓ Links ilimitados</div>
              <div>✓ Galeria completa</div>
              <div>✓ Vídeo de fundo</div>
              <div>✓ Badges premium</div>
              <div>✓ Presets salvos</div>
              <div>✓ Temas avançados</div>
              <div>✓ Layouts avançados</div>
              <div>✓ Estilos extras de links</div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#db2777",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "18px",
              }}
            >
              Assinar Premium
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}