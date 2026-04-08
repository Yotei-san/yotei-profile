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
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "40px" }}>Contas</h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px" }}>
                Pesquise contas, veja status e abra a ficha completa.
              </p>
            </div>

            <Link href="/dashboard/admin" style={topLinkStyle}>
              Voltar ao Admin
            </Link>
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
          <form method="get" action="/dashboard/admin/users" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="buscar por username, email ou display name"
              style={inputStyle}
            />
            <button type="submit" style={primaryButtonStyle}>Buscar</button>
          </form>
        </section>

        <section
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/dashboard/admin/users/${user.username}`}
              style={{
                textDecoration: "none",
                color: "#fff",
                backgroundColor: "#0b0b0b",
                border: "1px solid #1f1f1f",
                borderRadius: "18px",
                padding: "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "20px" }}>
                  {user.displayName || user.username} <span style={{ color: "#a3a3a3" }}>@{user.username}</span>
                </div>
                <div style={{ color: "#a3a3a3", marginTop: "6px" }}>{user.email}</div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Pill label={user.role.toUpperCase()} color={user.role === "admin" ? "#fb7185" : "#d4d4d8"} />
                <Pill label={user.status.toUpperCase()} color={user.status === "banned" ? "#fca5a5" : "#86efac"} />
                <Pill label={`${user._count.badges} BADGES`} color="#c084fc" />
                <Pill label={`${user._count.links} LINKS`} color="#38bdf8" />
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

function Pill({ label, color }: { label: string; color: string }) {
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
      }}
    >
      {label}
    </div>
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
};
