import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

export default async function PricingPage() {
  const currentUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      plan: true,
      premiumUntil: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const premium = isPremiumPlan(user);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), #070707",
        color: "#fff",
        padding: "28px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: "42px", margin: 0 }}>Pricing</h1>
            <p style={{ color: "#a3a3a3", marginTop: "8px" }}>
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
            marginBottom: "24px",
            padding: "18px 20px",
            borderRadius: "18px",
            background: premium
              ? "linear-gradient(90deg, rgba(91,33,182,0.18), rgba(236,72,153,0.18))"
              : "linear-gradient(90deg, rgba(34,34,34,1), rgba(18,18,18,1))",
            border: premium
              ? "1px solid rgba(236,72,153,0.22)"
              : "1px solid #222",
          }}
        >
          <div style={{ fontSize: "14px", color: premium ? "#f9a8d4" : "#d4d4d4" }}>
            Plano atual
          </div>
          <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>
            {premium ? "Premium" : "Free"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <section style={planCardStyle(false)}>
            <div style={tagStyle(false)}>Starter</div>
            <h2 style={titleStyle}>Free</h2>
            <p style={descStyle}>
              Tudo que você precisa para começar a montar e divulgar seu perfil.
            </p>

            <div style={featureListStyle}>
              <div>✔ Até 5 links</div>
              <div>✔ Até 2 imagens na galeria</div>
              <div>✔ Analytics básico</div>
              <div>✔ Reações públicas</div>
              <div>✔ Layout padrão</div>
              <div>✔ Personalização básica</div>
            </div>

            <div style={{ marginTop: "24px" }}>
              {!premium ? (
                <div style={currentPlanBoxStyle}>Plano atual</div>
              ) : (
                <button id="manage-billing-free" type="button" style={secondaryButtonWideStyle}>
                  Gerenciar assinatura
                </button>
              )}
            </div>
          </section>

          <section style={planCardStyle(true)}>
            <div style={tagStyle(true)}>Mais popular</div>
            <h2 style={titleStyle}>Premium</h2>
            <p style={descStyle}>
              Libera os recursos mais fortes do seu produto e deixa o perfil com cara muito mais premium.
            </p>

            <div style={featureListStyle}>
              <div>✔ Links ilimitados</div>
              <div>✔ Galeria completa</div>
              <div>✔ Vídeo de fundo</div>
              <div>✔ Badges premium</div>
              <div>✔ Presets salvos</div>
              <div>✔ Temas avançados</div>
              <div>✔ Layouts avançados</div>
              <div>✔ Estilos extras de links</div>
            </div>

            <div style={{ marginTop: "24px" }}>
              {premium ? (
                <button id="manage-billing-premium" type="button" style={secondaryButtonWideStyle}>
                  Gerenciar assinatura
                </button>
              ) : (
                <button id="start-checkout" type="button" style={primaryButtonWideStyle}>
                  Assinar Premium
                </button>
              )}
            </div>
          </section>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              async function startCheckout() {
                const response = await fetch('/api/stripe/checkout', { method: 'POST' });
                const data = await response.json();
                if (data.url) window.location.href = data.url;
              }

              async function openPortal() {
                const response = await fetch('/api/stripe/portal', { method: 'POST' });
                const data = await response.json();
                if (data.url) window.location.href = data.url;
              }

              const checkoutBtn = document.getElementById('start-checkout');
              if (checkoutBtn) checkoutBtn.addEventListener('click', startCheckout);

              const portalFreeBtn = document.getElementById('manage-billing-free');
              if (portalFreeBtn) portalFreeBtn.addEventListener('click', openPortal);

              const portalPremiumBtn = document.getElementById('manage-billing-premium');
              if (portalPremiumBtn) portalPremiumBtn.addEventListener('click', openPortal);
            `,
          }}
        />

        <div
          style={{
            marginTop: "24px",
            padding: "18px 20px",
            borderRadius: "18px",
            backgroundColor: "#0d0d0d",
            border: "1px solid #242424",
            color: "#d4d4d4",
            lineHeight: 1.7,
          }}
        >
          Agora o Premium é iniciado pelo Stripe Checkout e gerenciado pelo Customer Portal.
        </div>
      </div>
    </main>
  );
}

function planCardStyle(featured: boolean): React.CSSProperties {
  return {
    background: featured
      ? "linear-gradient(180deg, rgba(48,16,31,1), rgba(26,12,18,1))"
      : "#101010",
    border: featured
      ? "1px solid rgba(236,72,153,0.22)"
      : "1px solid #242424",
    borderRadius: "20px",
    padding: "24px",
  };
}

function tagStyle(featured: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: featured ? "rgba(236,72,153,0.12)" : "#1a1a1a",
    border: featured ? "1px solid rgba(236,72,153,0.22)" : "1px solid #2a2a2a",
    color: featured ? "#f9a8d4" : "#d4d4d4",
    fontSize: "13px",
    fontWeight: "bold",
  };
}

const titleStyle = {
  fontSize: "34px",
  margin: "14px 0 10px 0",
} as const;

const descStyle = {
  color: "#d4d4d4",
  lineHeight: 1.7,
  margin: 0,
} as const;

const featureListStyle = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
  color: "#fff",
} as const;

const currentPlanBoxStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  textAlign: "center" as const,
  fontWeight: "bold",
} as const;

const primaryButtonWideStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#db2777",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const secondaryButtonWideStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #374151",
  backgroundColor: "#1f2937",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;