import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function DashboardPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: {
          _count: {
            select: {
              clicks: true,
            },
          },
        },
      },
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      selectedDecoration: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const totalClicks = user.links.reduce(
    (sum, link) => sum + link._count.clicks,
    0
  );

  const topLinks = [...user.links]
    .sort((a, b) => b._count.clicks - a._count.clicks)
    .slice(0, 5);

  return (
    <main style={{ color: "#fff", fontFamily: "Arial, Helvetica, sans-serif" }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
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
              ✦ Dashboard • Analytics Overview
            </div>

            <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
              Olá, {user.displayName || user.username}
            </h1>

            <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
              Veja como seus links estão performando.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href={`/${user.username}`} style={topLinkStyle} target="_blank">
              Ver perfil
            </Link>
            <Link href="/dashboard/links" style={topLinkStyle}>
              Gerenciar links
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "22px",
        }}
      >
        <StatCard title="Links" value={String(user.links.length)} />
        <StatCard title="Cliques totais" value={String(totalClicks)} />
        <StatCard title="Badges" value={String(user.badges.length)} />
        <StatCard title="Moldura ativa" value={user.selectedDecoration ? "Sim" : "Não"} />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "18px",
        }}
      >
        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Ranking de links</h2>

          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {topLinks.length > 0 ? (
              topLinks.map((link, index) => (
                <div
                  key={link.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "16px",
                    backgroundColor: "#101010",
                    border: "1px solid #1f1f1f",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800 }}>
                      #{index + 1} {link.title || "Sem título"}
                    </div>
                    <div
                      style={{
                        color: "#9ca3af",
                        marginTop: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {link.url}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(244,114,182,0.10)",
                      border: "1px solid rgba(244,114,182,0.20)",
                      color: "#f9a8d4",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {link._count.clicks} cliques
                  </div>
                </div>
              ))
            ) : (
              <div style={emptyStyle}>Você ainda não possui links com cliques.</div>
            )}
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={panelTitleStyle}>Todos os links</h2>

          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {user.links.length > 0 ? (
              user.links.map((link) => (
                <div
                  key={link.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "16px",
                    backgroundColor: "#101010",
                    border: "1px solid #1f1f1f",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{link.title || "Sem título"}</div>
                  <div style={{ color: "#9ca3af", marginTop: "6px" }}>{link.url}</div>
                  <div style={{ color: "#f9a8d4", marginTop: "10px", fontWeight: 700 }}>
                    {link._count.clicks} cliques
                  </div>
                </div>
              ))
            ) : (
              <div style={emptyStyle}>Você ainda não criou links.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "#0b0b0b",
        border: "1px solid #1f1f1f",
        borderRadius: "24px",
        padding: "22px",
      }}
    >
      <div style={{ color: "#9ca3af", fontSize: "14px" }}>{title}</div>
      <div style={{ marginTop: "10px", fontSize: "34px", fontWeight: 900 }}>{value}</div>
    </div>
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

const panelStyle: React.CSSProperties = {
  backgroundColor: "#0b0b0b",
  border: "1px solid #1f1f1f",
  borderRadius: "28px",
  padding: "22px",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "28px",
};

const emptyStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "14px",
  backgroundColor: "#101010",
  border: "1px dashed #2a2a2a",
  color: "#9ca3af",
};