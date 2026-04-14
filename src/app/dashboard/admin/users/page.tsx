import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

type UsersPageProps = {
  searchParams?: Promise<{
    q?: string;
    error?: string;
  }>;
};

function pill(label: string, color: string) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        backgroundColor: `${color}14`,
        border: `1px solid ${color}33`,
        color,
        fontWeight: 800,
        fontSize: "12px",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  );
}

function statusColor(status: string) {
  if (status === "banned") return "#fca5a5";
  if (status === "active") return "#86efac";
  return "#d4d4d8";
}

function roleColor(role: string) {
  if (role === "admin") return "#fb7185";
  return "#d4d4d8";
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const params = (await searchParams) ?? {};
  const q = String(params.q || "").trim().toLowerCase();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { username: { contains: q } },
            { email: { contains: q } },
            { displayName: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          badges: true,
          links: true,
        },
      },
    },
  });

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
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
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
                ✦ Admin • Accounts • Haunt UI
              </div>
              <h1 style={{ margin: 0, fontSize: "46px", lineHeight: 1 }}>
                Admin Users
              </h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
                Pesquise contas, monitore status e abra a ficha completa de cada usuário.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard/admin" style={topLinkStyle}>
                Admin Home
              </Link>
              <Link href="/dashboard/admin/audit" style={topLinkStyle}>
                Audit Log
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            backgroundColor: "#0b0b0b",
            border: "1px solid #1f1f1f",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "18px",
          }}
        >
          <form
            method="get"
            action="/dashboard/admin/users"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "12px",
            }}
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="buscar por username, email ou display name"
              style={inputStyle}
            />
            <button type="submit" style={primaryButtonStyle}>
              Buscar
            </button>
          </form>
        </section>

        <section
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/dashboard/admin/users/${user.username}`}
              style={{
                textDecoration: "none",
                color: "#fff",
                background:
                  "linear-gradient(135deg, rgba(18,18,22,0.96), rgba(10,10,14,0.96))",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "24px",
                padding: "20px",
                display: "grid",
                gap: "14px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.20)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800 }}>
                    {user.displayName || user.username}
                    <span style={{ color: "#a3a3a3", marginLeft: "8px" }}>
                      @{user.username}
                    </span>
                  </div>
                  <div style={{ color: "#a3a3a3", marginTop: "8px" }}>
                    {user.email}
                  </div>
                  <div style={{ color: "#71717a", marginTop: "8px", fontSize: "13px" }}>
                    Criado em {new Date(user.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {pill(user.role.toUpperCase(), roleColor(user.role))}
                  {pill(user.status.toUpperCase(), statusColor(user.status))}
                  {pill(`${user._count.badges} BADGES`, "#c084fc")}
                  {pill(`${user._count.links} LINKS`, "#38bdf8")}
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#f9a8d4",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Abrir ficha completa →
              </div>
            </Link>
          ))}

          {users.length === 0 ? (
            <div style={emptyBoxStyle}>Nenhum usuário encontrado.</div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

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
