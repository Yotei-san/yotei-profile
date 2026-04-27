import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";
import { getReportLabel, getReportStatusColor } from "@/app/lib/moderation";
import { markReportReviewing } from "./actions";

type PageProps = {
  searchParams?: Promise<{ status?: string; success?: string; error?: string }>;
};

function pill(label: string, color: string) {
  return (
    <div style={{ padding: "8px 12px", borderRadius: "999px", backgroundColor: `${color}14`, border: `1px solid ${color}33`, color, fontWeight: 800, fontSize: "12px" }}>
      {label}
    </div>
  );
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const params = (await searchParams) ?? {};
  const status = String(params.status || "").trim();

  const reports = await prisma.report.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      createdByUser: { select: { username: true } },
      targetUser: { select: { username: true } },
    },
  });

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.06), transparent 22%), #070707", color: "#ffffff", padding: "24px", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <section style={{ background: "linear-gradient(135deg, rgba(25,10,18,0.98), rgba(10,10,12,0.98))", border: "1px solid rgba(244,114,182,0.14)", borderRadius: "28px", padding: "26px", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", marginBottom: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", gap: "8px", alignItems: "center", padding: "8px 12px", borderRadius: "999px", backgroundColor: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.14)", color: "#f9a8d4", fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                ✦ Admin • Reports • Moderation
              </div>
              <h1 style={{ margin: 0, fontSize: "46px", lineHeight: 1 }}>Reports</h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>Fila de denúncias da plataforma.</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/dashboard/admin" style={topLinkStyle}>Admin Home</Link>
              <Link href="/dashboard/admin/audit" style={topLinkStyle}>Audit</Link>
            </div>
          </div>
        </section>

        <section style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
          <Link href="/dashboard/admin/reports" style={filterLink(status === "")}>Todas</Link>
          <Link href="/dashboard/admin/reports?status=pending" style={filterLink(status === "pending")}>Pending</Link>
          <Link href="/dashboard/admin/reports?status=reviewing" style={filterLink(status === "reviewing")}>Reviewing</Link>
          <Link href="/dashboard/admin/reports?status=resolved" style={filterLink(status === "resolved")}>Resolved</Link>
          <Link href="/dashboard/admin/reports?status=rejected" style={filterLink(status === "rejected")}>Rejected</Link>
        </section>

        <section style={{ display: "grid", gap: "14px" }}>
          {reports.map((report) => (
            <article key={report.id} style={{ background: "linear-gradient(135deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "20px", display: "grid", gap: "14px", boxShadow: "0 16px 40px rgba(0,0,0,0.20)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>
                  {getReportLabel(report)}
                  <span style={{ color: "#a3a3a3", marginLeft: "8px" }}>#{report.id.slice(0, 8)}</span>
                </div>
                {pill(report.status.toUpperCase(), getReportStatusColor(report.status))}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {pill(`DENUNCIANTE: @${report.createdByUser.username}`, "#38bdf8")}
                {report.targetUser ? pill(`ALVO: @${report.targetUser.username}`, "#f9a8d4") : null}
                {pill(new Date(report.createdAt).toLocaleString("pt-BR"), "#d4d4d8")}
              </div>

              <div style={{ color: "#d4d4d8", lineHeight: 1.7, backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "14px 16px" }}>
                {report.reason}
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href={`/dashboard/admin/reports/${report.id}`} style={topLinkStyle}>Abrir detalhe</Link>
                {report.status === "pending" ? (
                  <form action={markReportReviewing}>
                    <input type="hidden" name="reportId" value={report.id} readOnly />
                    <button type="submit" style={primaryButtonStyle}>Marcar reviewing</button>
                  </form>
                ) : null}
              </div>
            </article>
          ))}
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

function filterLink(active: boolean): React.CSSProperties {
  return {
    textDecoration: "none",
    backgroundColor: active ? "rgba(236,72,153,0.12)" : "#141414",
    border: active ? "1px solid rgba(244,114,182,0.20)" : "1px solid #2a2a2a",
    color: active ? "#f9a8d4" : "#fff",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: 700,
  };
}

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};
