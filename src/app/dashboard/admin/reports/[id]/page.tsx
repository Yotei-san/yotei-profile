import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";
import { getReportLabel, getReportStatusColor } from "@/app/lib/moderation";
import { markReportReviewing, rejectReport, resolveReport } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function pill(label: string, color: string) {
  return (
    <div style={{ padding: "8px 12px", borderRadius: "999px", backgroundColor: `${color}14`, border: `1px solid ${color}33`, color, fontWeight: 800, fontSize: "12px" }}>
      {label}
    </div>
  );
}

export default async function AdminReportDetailPage({ params }: PageProps) {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      reporterUser: { select: { username: true, email: true } },
      targetUser: { select: { username: true, email: true, status: true, role: true } },
      reviewedBy: { select: { username: true } },
      decoration: { select: { id: true, name: true, slug: true } },
      link: { select: { id: true, title: true, url: true } },
    },
  });

  if (!report) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.06), transparent 22%), #070707", color: "#ffffff", padding: "24px", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <section style={{ background: "linear-gradient(135deg, rgba(25,10,18,0.98), rgba(10,10,12,0.98))", border: "1px solid rgba(244,114,182,0.14)", borderRadius: "28px", padding: "26px", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", marginBottom: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", gap: "8px", alignItems: "center", padding: "8px 12px", borderRadius: "999px", backgroundColor: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.14)", color: "#f9a8d4", fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                ✦ Report Detail
              </div>
              <h1 style={{ margin: 0, fontSize: "42px", lineHeight: 1 }}>
                {getReportLabel(report.type)} #{report.id.slice(0, 8)}
              </h1>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard/admin/reports" style={topLinkStyle}>Voltar</Link>
              {pill(report.status.toUpperCase(), getReportStatusColor(report.status))}
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>Detalhes</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              <InfoRow label="Tipo" value={getReportLabel(report.type)} />
              <InfoRow label="Status" value={report.status} />
              <InfoRow label="Denunciante" value={`@${report.reporterUser.username} • ${report.reporterUser.email}`} />
              <InfoRow label="Alvo" value={report.targetUser ? `@${report.targetUser.username} • ${report.targetUser.email}` : "-"} />
              <InfoRow label="Criada em" value={new Date(report.createdAt).toLocaleString("pt-BR")} />
              <InfoRow label="Review feita por" value={report.reviewedBy ? `@${report.reviewedBy.username}` : "-"} />
              <InfoRow label="Review em" value={report.reviewedAt ? new Date(report.reviewedAt).toLocaleString("pt-BR") : "-"} />
              <InfoRow label="Decoration" value={report.decoration ? `${report.decoration.name} (${report.decoration.slug})` : "-"} />
              <InfoRow label="Link" value={report.link ? `${report.link.title || report.link.url}` : "-"} />
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>Motivo</h2>
            <div style={reasonBox}>{report.reason}</div>

            <h2 style={{ ...panelTitleStyle, marginTop: "18px" }}>Ações</h2>

            {report.status === "pending" ? (
              <form action={markReportReviewing} style={{ marginTop: "14px" }}>
                <input type="hidden" name="reportId" value={report.id} readOnly />
                <button type="submit" style={primaryButtonStyle}>Marcar reviewing</button>
              </form>
            ) : null}

            <form action={resolveReport} style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
              <input type="hidden" name="reportId" value={report.id} readOnly />
              <textarea name="adminNote" rows={4} placeholder="Nota administrativa ao resolver" style={inputStyle} />
              <button type="submit" style={successButton}>Resolver report</button>
            </form>

            <form action={rejectReport} style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
              <input type="hidden" name="reportId" value={report.id} readOnly />
              <textarea name="adminNote" rows={4} placeholder="Nota administrativa ao rejeitar" style={inputStyle} />
              <button type="submit" style={dangerButton}>Rejeitar report</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ backgroundColor: "#101010", border: "1px solid #1f1f1f", borderRadius: "14px", padding: "14px 16px" }}>
      <div style={{ color: "#f9a8d4", fontSize: "13px", marginBottom: "6px" }}>{label}</div>
      <div style={{ color: "#ffffff" }}>{value}</div>
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
  borderRadius: "24px",
  padding: "22px",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "28px",
};

const reasonBox: React.CSSProperties = {
  color: "#d4d4d8",
  lineHeight: 1.7,
  backgroundColor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: "16px",
  padding: "14px 16px",
  marginTop: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  outline: "none",
  resize: "vertical",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

const successButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(34,197,94,0.22)",
  backgroundColor: "rgba(34,197,94,0.10)",
  color: "#86efac",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
  cursor: "pointer",
  fontWeight: "bold",
};
