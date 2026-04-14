import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

function AdminCard({
  href,
  title,
  description,
  accent,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#fff",
        background:
          "linear-gradient(135deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
        border: `1px solid ${accent}22`,
        borderRadius: "24px",
        padding: "22px",
        display: "grid",
        gap: "12px",
        boxShadow: `0 18px 40px ${accent}18`,
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          backgroundColor: `${accent}14`,
          border: `1px solid ${accent}33`,
        }}
      >
        {icon}
      </div>

      <div style={{ fontSize: "28px", fontWeight: 800 }}>{title}</div>
      <div style={{ color: "#a3a3a3", lineHeight: 1.7 }}>{description}</div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: accent,
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        Abrir painel →
      </div>
    </Link>
  );
}

export default async function AdminHomePage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.06), transparent 22%), #070707",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <section
          style={{
            background:
              "linear-gradient(135deg, rgba(25,10,18,0.98), rgba(10,10,12,0.98))",
            border: "1px solid rgba(244,114,182,0.14)",
            borderRadius: "28px",
            padding: "26px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  gap: "8px",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(244,114,182,0.08)",
                  border: "1px solid rgba(244,114,182,0.14)",
                  color: "#f9a8d4",
                  fontWeight: 700,
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                ✦ Admin • Control Center • Haunt UI
              </div>

              <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
                Painel Admin
              </h1>

              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
                Centro de controle premium para contas, badges, auditoria e moderação.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={topLinkStyle}>
                Dashboard
              </Link>
              <Link href="/dashboard/badges" style={topLinkStyle}>
                Badges
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          <AdminCard
            href="/dashboard/admin/users"
            title="Contas"
            description="Listar contas, visualizar perfis, banir, desbanir e promover admins."
            accent="#f472b6"
            icon="👥"
          />
          <AdminCard
            href="/dashboard/admin/badges"
            title="Badges"
            description="Conceder e remover badges manualmente com controle avançado."
            accent="#c084fc"
            icon="🏅"
          />
          <AdminCard
            href="/dashboard/admin/audit"
            title="Audit Log"
            description="Monitorar tudo que os admins fizeram dentro do sistema."
            accent="#38bdf8"
            icon="📜"
          />
          <AdminCard
            href="/dashboard"
            title="Voltar"
            description="Retornar ao dashboard principal do projeto."
            accent="#fde047"
            icon="↩️"
          />
        </section>
      </div>
    </main>
  );
}

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
};
