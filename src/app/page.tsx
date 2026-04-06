import Link from "next/link";

const navLinkStyle: React.CSSProperties = {
  color: "#f4f4f5",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: 500,
  opacity: 0.92,
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  textDecoration: "none",
  background:
    "linear-gradient(135deg, rgba(236,72,153,0.24), rgba(168,85,247,0.22))",
  border: "1px solid rgba(244,114,182,0.26)",
  color: "#ffe4f1",
  padding: "14px 20px",
  borderRadius: "16px",
  fontWeight: 700,
  boxShadow: "0 12px 40px rgba(236,72,153,0.14)",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#ffffff",
  padding: "14px 20px",
  borderRadius: "16px",
  fontWeight: 600,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "42px",
  lineHeight: 1.05,
  margin: 0,
  color: "#ffffff",
};

const mutedTextStyle: React.CSSProperties = {
  color: "#b4b4bd",
  lineHeight: 1.75,
  fontSize: "17px",
};

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(20,20,24,0.95), rgba(10,10,12,0.95))",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "22px",
        padding: "22px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "14px",
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(168,85,247,0.16))",
          border: "1px solid rgba(244,114,182,0.16)",
          marginBottom: "16px",
        }}
      />
      <h3 style={{ margin: 0, fontSize: "24px", color: "#fff" }}>{title}</h3>
      <p style={{ ...mutedTextStyle, fontSize: "15px", marginBottom: 0 }}>
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "22px",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "44px",
          height: "44px",
          borderRadius: "999px",
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.20))",
          color: "#ffd7ea",
          fontWeight: 800,
          marginBottom: "14px",
        }}
      >
        {step}
      </div>
      <h3 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>{title}</h3>
      <p style={{ ...mutedTextStyle, fontSize: "15px", marginBottom: 0 }}>
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  featured,
  features,
}: {
  name: string;
  price: string;
  featured?: boolean;
  features: string[];
}) {
  return (
    <div
      style={{
        background: featured
          ? "linear-gradient(180deg, rgba(48,16,31,0.98), rgba(20,10,18,0.98))"
          : "linear-gradient(180deg, rgba(18,18,20,0.98), rgba(10,10,12,0.98))",
        border: featured
          ? "1px solid rgba(244,114,182,0.20)"
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: featured
          ? "0 24px 60px rgba(236,72,153,0.16)"
          : "0 18px 40px rgba(0,0,0,0.24)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: "999px",
          backgroundColor: featured
            ? "rgba(244,114,182,0.12)"
            : "rgba(255,255,255,0.04)",
          border: featured
            ? "1px solid rgba(244,114,182,0.20)"
            : "1px solid rgba(255,255,255,0.08)",
          color: featured ? "#f9a8d4" : "#d4d4d8",
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "14px",
        }}
      >
        {featured ? "Mais popular" : "Starter"}
      </div>

      <h3 style={{ color: "#fff", fontSize: "34px", margin: "0 0 4px 0" }}>
        {name}
      </h3>
      <div style={{ color: "#f9a8d4", fontWeight: 700, marginBottom: "12px" }}>
        {price}
      </div>

      <div style={{ display: "grid", gap: "10px", color: "#f4f4f5" }}>
        {features.map((feature) => (
          <div key={feature}>• {feature}</div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.14), transparent 24%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.10), transparent 20%), linear-gradient(180deg, #14070d 0%, #08080a 38%, #050507 100%)",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.14,
          backgroundImage:
            "radial-gradient(rgba(244,114,182,0.32) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent)",
        }}
      />

      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "26px 24px 80px" }}>
        <nav
          style={{
            position: "sticky",
            top: "18px",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            padding: "16px 20px",
            marginBottom: "34px",
            borderRadius: "22px",
            backgroundColor: "rgba(14,14,18,0.72)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95))",
                boxShadow: "0 12px 30px rgba(236,72,153,0.35)",
              }}
            />
            <div style={{ fontWeight: 800, fontSize: "36px", letterSpacing: "-0.04em" }}>
              Yotei
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            <Link href="/pricing" style={navLinkStyle}>
              Pricing
            </Link>
            <Link href="/leaderboard" style={navLinkStyle}>
              Leaderboard
            </Link>
            <Link href="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link href="/register" style={primaryButtonStyle}>
              Criar perfil
            </Link>
          </div>
        </nav>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "34px",
            alignItems: "center",
            minHeight: "calc(100vh - 180px)",
            padding: "24px 0 40px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "999px",
                backgroundColor: "rgba(244,114,182,0.10)",
                border: "1px solid rgba(244,114,182,0.18)",
                color: "#fbcfe8",
                marginBottom: "18px",
                fontWeight: 700,
              }}
            >
              ✦ Seu perfil digital com cara de produto premium
            </div>

            <h1
              style={{
                fontSize: "74px",
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                margin: "0 0 18px 0",
                maxWidth: "760px",
              }}
            >
              Sua identidade
              <span
                style={{
                  display: "block",
                  background:
                    "linear-gradient(90deg, #ffffff 0%, #f9a8d4 42%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                em um único lugar.
              </span>
            </h1>

            <p style={{ ...mutedTextStyle, maxWidth: "640px", marginBottom: "22px" }}>
              Crie uma página biolink elegante, personalizável e com aparência
              realmente forte. Reúna links, mídia, badges, analytics e estilo
              premium em um perfil que parece produto real.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginBottom: "22px",
              }}
            >
              <Link href="/register" style={primaryButtonStyle}>
                Começar grátis
              </Link>
              <Link href="/pricing" style={secondaryButtonStyle}>
                Ver planos
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "320px",
                  flexWrap: "wrap",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 18px",
                    color: "#a1a1aa",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  yotei.gg/
                </div>
                <div style={{ padding: "16px 18px", color: "#ffffff" }}>seuusername</div>
              </div>

              <Link href="/register" style={primaryButtonStyle}>
                Garantir username
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "18px",
                flexWrap: "wrap",
                color: "#a1a1aa",
                fontSize: "14px",
              }}
            >
              <div>● 100% grátis para começar</div>
              <div>● Sem cartão para testar</div>
              <div>● Visual premium desde o início</div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "12% 8% auto 8%",
                height: "68%",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.22), rgba(236,72,153,0.02) 60%, transparent 80%)",
                filter: "blur(30px)",
              }}
            />

            <div
              style={{
                width: "100%",
                maxWidth: "480px",
                borderRadius: "30px",
                padding: "14px",
                background:
                  "linear-gradient(180deg, rgba(26,12,20,0.95), rgba(8,8,12,0.95))",
                border: "1px solid rgba(244,114,182,0.22)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.36)",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "240px",
                  borderRadius: "22px 22px 0 0",
                  background:
                    "linear-gradient(180deg, rgba(255,206,229,0.10), rgba(255,255,255,0.04)), url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop') center/cover",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              />

              <div
                style={{
                  marginTop: "-58px",
                  padding: "0 18px 18px",
                }}
              >
                <div
                  style={{
                    width: "116px",
                    height: "116px",
                    borderRadius: "999px",
                    background:
                      "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop') center/cover",
                    border: "4px solid rgba(15,15,18,0.96)",
                    boxShadow: "0 18px 45px rgba(236,72,153,0.22)",
                    margin: "0 auto 14px",
                  }}
                />

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "38px", fontWeight: 800 }}>Yotei</div>
                  <div style={{ color: "#a1a1aa", marginTop: "6px" }}>@yotei</div>

                  <div
                    style={{
                      display: "inline-flex",
                      gap: "8px",
                      alignItems: "center",
                      marginTop: "12px",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(244,114,182,0.10)",
                      border: "1px solid rgba(244,114,182,0.18)",
                      color: "#fbcfe8",
                      fontWeight: 700,
                    }}
                  >
                    ✦ Premium
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {["Discord", "GitHub", "TikTok", "Meu servidor"].map((item) => (
                    <div
                      key={item}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "18px",
                        padding: "16px 18px",
                        color: "#ffffff",
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    color: "#d4d4d8",
                    fontSize: "14px",
                  }}
                >
                  <span>👁 12.8k</span>
                  <span>❤ 3.1k</span>
                  <span>🔗 4 links</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "42px 0 24px" }}>
          <div style={{ maxWidth: "760px", marginBottom: "24px" }}>
            <h2 style={sectionTitleStyle}>Tudo o que seu perfil precisa para parecer grande.</h2>
            <p style={mutedTextStyle}>
              O Yotei foi pensado para deixar o seu perfil com visual premium,
              recursos úteis e liberdade para personalizar de verdade.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            <FeatureCard
              title="Visual premium"
              description="Tema escuro, glow, banners, avatar, background e layouts modernos para um perfil com presença."
            />
            <FeatureCard
              title="Links e mídia"
              description="Coloque seus links principais, galeria, badges e vídeo de fundo para destacar seu perfil."
            />
            <FeatureCard
              title="Analytics"
              description="Acompanhe views, cliques, países e dispositivos para entender como as pessoas encontram você."
            />
            <FeatureCard
              title="Conta completa"
              description="Área de settings, troca de username, display name, senha e upgrades de conta em um painel separado."
            />
          </div>
        </section>

        <section
          style={{
            padding: "58px 0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "18px",
          }}
        >
          <StepCard
            step="1"
            title="Crie sua conta"
            description="Registre seu username e tenha uma base pronta para personalizar seu perfil em minutos."
          />
          <StepCard
            step="2"
            title="Deixe com a sua cara"
            description="Escolha tema, avatar, banner, links, badges e monte um perfil com aparência realmente forte."
          />
          <StepCard
            step="3"
            title="Compartilhe"
            description="Envie seu link único e acompanhe visualizações, cliques e crescimento da sua presença online."
          />
        </section>

        <section style={{ padding: "58px 0 24px" }}>
          <div style={{ maxWidth: "720px", marginBottom: "22px" }}>
            <h2 style={sectionTitleStyle}>Planos simples, visual forte desde o começo.</h2>
            <p style={mutedTextStyle}>
              Comece grátis e evolua quando quiser liberar vídeo de fundo,
              badges, presets e layouts mais avançados.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <PricingCard
              name="Free"
              price="Grátis"
              features={[
                "Até 5 links",
                "Até 2 imagens na galeria",
                "Analytics básico",
                "Perfil com tema customizável",
              ]}
            />
            <PricingCard
              name="Premium"
              price="Upgrade mensal"
              featured
              features={[
                "Links ilimitados",
                "Vídeo de fundo",
                "Badges premium",
                "Layouts avançados",
                "Presets salvos",
                "Mais mídia e personalização",
              ]}
            />
          </div>
        </section>

        <section
          style={{
            marginTop: "54px",
            padding: "34px 28px",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.10))",
            border: "1px solid rgba(244,114,182,0.16)",
            textAlign: "center",
          }}
        >
          <h2 style={{ ...sectionTitleStyle, fontSize: "54px" }}>
            Crie seu perfil Yotei hoje.
          </h2>
          <p style={{ ...mutedTextStyle, maxWidth: "760px", margin: "14px auto 22px" }}>
            Se você quer uma home pública com visual forte, links organizados e
            presença premium, o Yotei já está pronto para isso.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={primaryButtonStyle}>
              Criar minha conta
            </Link>
            <Link href="/login" style={secondaryButtonStyle}>
              Já tenho login
            </Link>
          </div>
        </section>

        <footer
          style={{
            padding: "44px 0 12px",
            display: "flex",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
            color: "#8b8b95",
          }}
        >
          <div>© {new Date().getFullYear()} Yotei. Todos os direitos reservados.</div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/pricing" style={{ ...navLinkStyle, color: "#8b8b95" }}>
              Pricing
            </Link>
            <Link href="/leaderboard" style={{ ...navLinkStyle, color: "#8b8b95" }}>
              Leaderboard
            </Link>
            <Link href="/login" style={{ ...navLinkStyle, color: "#8b8b95" }}>
              Login
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
