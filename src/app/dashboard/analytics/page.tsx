import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function AnalyticsPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: {
          clicks: {
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              clicks: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const totalClicks = user.links.reduce((sum, link) => sum + link._count.clicks, 0);

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
              ✦ Analytics
            </div>

            <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1 }}>
              Analytics de links
            </h1>

            <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
              Total de cliques registrados: {totalClicks}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={topLinkStyle}>
              Dashboard
            </Link>
            <Link href={`/${user.username}`} style={topLinkStyle} target="_blank">
              Ver perfil
            </Link>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        {user.links.length > 0 ? (
          user.links.map((link) => (
            <article
              key={link.id}
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1f1f1f",
                borderRadius: "24px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 900 }}>
                    {link.title || "Sem título"}
                  </div>
                  <div style={{ color: "#9ca3af", marginTop: "6px" }}>{link.url}</div>
                </div>

                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(244,114,182,0.10)",
                    border: "1px solid rgba(244,114,182,0.20)",
                    color: "#f9a8d4",
                    fontWeight: 800,
                    height: "fit-content",
                  }}
                >
                  {link._count.clicks} cliques
                </div>
              </div>

              <div style={{ marginTop: "16px", color: "#a3a3a3", fontSize: "14px" }}>
                Últimos registros:
              </div>

              <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                {link.clicks.length > 0 ? (
                  link.clicks.slice(0, 10).map((click) => (
                    <div
                      key={click.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        backgroundColor: "#101010",
                        border: "1px solid #1a1a1a",
                        color: "#d4d4d8",
                      }}
                    >
                      {new Date(click.createdAt).toLocaleString("pt-BR")}
                    </div>
                  ))
                ) : (
                  <div style={emptyStyle}>Nenhum clique ainda.</div>
                )}
              </div>
            </article>
          ))
        ) : (
          <div style={emptyStyle}>Você ainda não possui links.</div>
        )}
      </section>
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

const emptyStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "14px",
  backgroundColor: "#101010",
  border: "1px dashed #2a2a2a",
  color: "#9ca3af",
};