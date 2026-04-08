import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";
import { banUser, unbanUser, promoteAdmin, demoteAdmin } from "@/app/dashboard/admin/actions";

type UserDetailPageProps = {
  params: Promise<{
    username: string;
  }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getMessage(type: "success" | "error", code?: string) {
  if (!code) return null;

  if (type === "success") {
    if (code === "user-banned") return "Usuário banido com sucesso.";
    if (code === "user-unbanned") return "Usuário desbanido com sucesso.";
    if (code === "promoted-admin") return "Usuário promovido para admin.";
    if (code === "demoted-admin") return "Usuário rebaixado para user.";
    return "Ação concluída.";
  }

  if (code === "admin-protected") return "Você não pode banir um admin por essa tela.";
  if (code === "self-demote-blocked") return "Você não pode remover seu próprio admin por essa tela.";
  return "Não foi possível concluir a ação.";
}

export default async function AdminUserDetailPage({ params, searchParams }: UserDetailPageProps) {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);
  const { username } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      badges: {
        include: {
          badge: true,
        },
        orderBy: [{ isPinned: "desc" }, { earnedAt: "desc" }],
      },
      ipLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: {
        select: {
          links: true,
          badges: true,
          profileViews: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

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
              <h1 style={{ margin: 0, fontSize: "40px" }}>
                {user.displayName || user.username} <span style={{ color: "#a3a3a3" }}>@{user.username}</span>
              </h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px" }}>{user.email}</p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard/admin/users" style={topLinkStyle}>
                Voltar às contas
              </Link>
              <Link href={`/${user.username}`} target="_blank" style={topLinkStyle}>
                Ver perfil público
              </Link>
            </div>
          </div>
        </section>

        {getMessage("success", resolvedSearchParams.success) ? (
          <div style={successBoxStyle}>{getMessage("success", resolvedSearchParams.success)}</div>
        ) : null}

        {getMessage("error", resolvedSearchParams.error) ? (
          <div style={errorBoxStyle}>{getMessage("error", resolvedSearchParams.error)}</div>
        ) : null}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: "18px",
            marginBottom: "18px",
          }}
        >
          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>Resumo</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Status" value={user.status} />
              <InfoRow label="Links" value={String(user._count.links)} />
              <InfoRow label="Badges" value={String(user._count.badges)} />
              <InfoRow label="Views" value={String(user._count.profileViews)} />
              <InfoRow label="Criado em" value={new Date(user.createdAt).toLocaleString("pt-BR")} />
              <InfoRow label="Ban reason" value={user.banReason || "-"} />
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>Ações</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {user.status === "banned" ? (
                <form action={unbanUser} style={{ display: "grid", gap: "12px" }}>
                  <input type="hidden" name="username" value={user.username} readOnly />
                  <button type="submit" style={secondaryButtonStyle}>Desbanir usuário</button>
                </form>
              ) : (
                <form action={banUser} style={{ display: "grid", gap: "12px" }}>
                  <input type="hidden" name="username" value={user.username} readOnly />
                  <textarea
                    name="reason"
                    placeholder="Motivo do ban"
                    rows={4}
                    style={inputStyle}
                  />
                  <button type="submit" style={dangerButtonStyle}>Banir usuário</button>
                </form>
              )}

              {user.role === "admin" ? (
                <form action={demoteAdmin}>
                  <input type="hidden" name="username" value={user.username} readOnly />
                  <button type="submit" style={dangerButtonStyle}>Remover admin</button>
                </form>
              ) : (
                <form action={promoteAdmin}>
                  <input type="hidden" name="username" value={user.username} readOnly />
                  <button type="submit" style={primaryButtonStyle}>Promover para admin</button>
                </form>
              )}

              <Link href={`/dashboard/admin/badges?username=${user.username}`} style={topLinkStyle}>
                Abrir painel de badges desse usuário
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>IPs recentes</h2>
            {user.ipLogs.length === 0 ? (
              <div style={emptyBoxStyle}>Nenhum IP logado ainda.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {user.ipLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      backgroundColor: "#101010",
                      border: "1px solid #1f1f1f",
                      borderRadius: "16px",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{log.ipAddress}</div>
                    <div style={{ color: "#a3a3a3", fontSize: "14px", marginTop: "6px" }}>
                      Route: {log.route || "-"}
                    </div>
                    <div style={{ color: "#71717a", fontSize: "12px", marginTop: "6px" }}>
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>Badges</h2>
            {user.badges.length === 0 ? (
              <div style={emptyBoxStyle}>Esse usuário ainda não possui badges.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {user.badges.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#101010",
                      border: "1px solid #1f1f1f",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>
                        {item.badge.icon || "🏅"} {item.badge.name} {item.isPinned ? "📌" : ""}
                      </div>
                      <div style={{ color: "#a3a3a3", fontSize: "14px", marginTop: "6px" }}>
                        {item.badge.category || "general"} • {(item.badge.rarity || "common").toUpperCase()}
                      </div>
                    </div>

                    <div style={{ color: "#71717a", fontSize: "12px" }}>
                      {new Date(item.earnedAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "#101010",
        border: "1px solid #1f1f1f",
        borderRadius: "14px",
        padding: "14px 16px",
      }}
    >
      <div style={{ color: "#f9a8d4", fontSize: "13px", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ color: "#ffffff" }}>{value}</div>
    </div>
  );
}

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

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
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

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#141414",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
  cursor: "pointer",
  fontWeight: "bold",
};

const successBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};

const errorBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};

const emptyBoxStyle: React.CSSProperties = {
  border: "1px dashed #3a3a3a",
  borderRadius: "14px",
  padding: "24px",
  textAlign: "center",
  color: "#a3a3a3",
};
