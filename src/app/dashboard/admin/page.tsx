import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

export default async function AdminHomePage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

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
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <section
          style={{
            background:
              "linear-gradient(135deg, rgba(25,10,18,0.98), rgba(10,10,12,0.98))",
            border: "1px solid rgba(244,114,182,0.14)",
            borderRadius: "28px",
            padding: "26px",
            marginBottom: "22px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "46px" }}>Painel Admin</h1>
          <p style={{ color: "#a3a3a3", marginTop: "10px" }}>
            Centro de controle de contas, badges, eventos e auditoria.
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          <AdminCard href="/dashboard/admin/users" title="Contas" description="Listar contas, banir, desbanir, promover e rebaixar." />
          <AdminCard href="/dashboard/admin/badges" title="Badges" description="Conceder, remover e sincronizar badges." />
          <AdminCard href="/dashboard/admin/audit" title="Audit Log" description="Ver tudo que admins fizeram no sistema." />
          <AdminCard href="/dashboard" title="Dashboard" description="Voltar para o dashboard principal." />
        </div>
      </div>
    </main>
  );
}

function AdminCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#0b0b0b",
        border: "1px solid #1f1f1f",
        borderRadius: "24px",
        padding: "22px",
        display: "grid",
        gap: "10px",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: 800 }}>{title}</div>
      <div style={{ color: "#a3a3a3", lineHeight: 1.7 }}>{description}</div>
    </Link>
  );
}
