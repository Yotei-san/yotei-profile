import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

export default async function AdminAuditPage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        select: { username: true },
      },
      target: {
        select: { username: true },
      },
    },
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), #070707",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <section
          style={{
            backgroundColor: "#0b0b0b",
            border: "1px solid #1f1f1f",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "40px" }}>Audit Log</h1>
            <p style={{ color: "#a3a3a3", marginTop: "10px" }}>
              Histórico das ações administrativas do sistema.
            </p>
          </div>

          <Link href="/dashboard/admin" style={topLinkStyle}>
            Voltar ao Admin
          </Link>
        </section>

        <section style={{ display: "grid", gap: "12px" }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1f1f1f",
                borderRadius: "18px",
                padding: "16px 18px",
                display: "grid",
                gap: "8px",
              }}
            >
              <div style={{ fontWeight: 800 }}>{log.action}</div>
              <div style={{ color: "#d4d4d8", fontSize: "14px" }}>
                Admin: @{log.actor.username}
                {log.target ? ` • Alvo: @${log.target.username}` : ""}
                {log.badgeKey ? ` • Badge: ${log.badgeKey}` : ""}
                {log.ipAddress ? ` • IP: ${log.ipAddress}` : ""}
              </div>
              {log.details ? (
                <div style={{ color: "#a3a3a3", fontSize: "14px" }}>{log.details}</div>
              ) : null}
              <div style={{ color: "#71717a", fontSize: "12px" }}>
                {new Date(log.createdAt).toLocaleString("pt-BR")}
              </div>
            </div>
          ))}

          {logs.length === 0 ? (
            <div style={emptyBoxStyle}>Nenhum log ainda.</div>
          ) : null}
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

const emptyBoxStyle: React.CSSProperties = {
  border: "1px dashed #3a3a3a",
  borderRadius: "14px",
  padding: "24px",
  textAlign: "center",
  color: "#a3a3a3",
  backgroundColor: "#0b0b0b",
};
