import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  claimBadge,
  grantOwnerBadgeToCurrentUser,
  pinBadge,
  unpinAllBadges,
} from "./actions";
import { ensureDefaultBadges, getBadgeGlow, syncAutomaticBadges } from "@/app/lib/badges";

function getActionLabel(
  badge: {
    key: string;
    category: string | null;
    isAutoAwarded: boolean;
  },
  earned: boolean
) {
  if (earned) return "Conquistada";
  if (badge.key === "premium") return "Assinar";
  if (badge.key === "owner") return "Exclusiva";
  if (badge.isAutoAwarded) return "Automática";
  if (badge.category === "event") return "Evento";
  if (badge.category === "manual") return "Manual";
  return "Bloqueada";
}

function getStatusStyle(earned: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: "12px",
    border: earned ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(239,68,68,0.16)",
    backgroundColor: earned ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.08)",
    color: earned ? "#86efac" : "#fca5a5",
    fontWeight: "bold",
    fontSize: "14px",
  };
}

export default async function BadgesPage() {
  const sessionUser = await requireUser();

  await ensureDefaultBadges();
  await syncAutomaticBadges(sessionUser.id);

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const [badges, userBadges] = await Promise.all([
    prisma.badge.findMany({
      orderBy: [{ rarity: "desc" }, { name: "asc" }],
    }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      include: {
        badge: true,
      },
      orderBy: [{ isPinned: "desc" }, { earnedAt: "desc" }],
    }),
  ]);

  const earnedMap = new Map(userBadges.map((item) => [item.badgeId, item]));
  const pinnedBadge = userBadges.find((item) => item.isPinned);

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
      <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#0b0b0b",
            border: "1px solid #1f1f1f",
            borderRadius: "22px",
            padding: "20px 22px",
            marginBottom: "24px",
          }}
        >
          <div style={{ color: "#f9a8d4", fontSize: "14px", marginBottom: "8px" }}>
            Dashboard &gt; Socials &gt; Badges
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "40px" }}>Badges</h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
                Conquiste badges por missões, premium, eventos e marcos do produto.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={topLinkStyle}>
                Voltar ao dashboard
              </Link>
              <Link href={`/${user.username}`} target="_blank" style={topLinkStyle}>
                Ver perfil
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#0b0b0b",
            border: "1px solid #1f1f1f",
            borderRadius: "22px",
            padding: "18px 20px",
            marginBottom: "22px",
          }}
        >
          <div style={{ color: "#d4d4d4", marginBottom: "12px" }}>
            Usuário: <strong>{user.displayName || user.username}</strong> • @{user.username}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ color: "#f9a8d4", fontWeight: "bold" }}>
              Badge fixada:
            </div>
            {pinnedBadge ? (
              <div
                style={{
                  display: "inline-flex",
                  gap: "10px",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span>{pinnedBadge.badge.icon || "🏅"}</span>
                <span>{pinnedBadge.badge.name}</span>
              </div>
            ) : (
              <span style={{ color: "#a3a3a3" }}>Nenhuma badge fixada.</span>
            )}

            <form action={unpinAllBadges}>
              <button type="submit" style={dangerButtonStyle}>
                Desfixar todas
              </button>
            </form>

            <form action={grantOwnerBadgeToCurrentUser}>
              <button type="submit" style={secondaryButtonStyle}>
                Garantir Owner no meu usuário
              </button>
            </form>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {badges.map((badge) => {
            const earned = earnedMap.get(badge.id);

            return (
              <section
                key={badge.id}
                style={{
                  backgroundColor: "#090909",
                  border: "1px solid #1f1f1f",
                  borderRadius: "22px",
                  padding: "18px",
                  display: "grid",
                  gap: "14px",
                  boxShadow: getBadgeGlow(badge.color),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    alignItems: "start",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px" }}>
                    <div
                      style={{
                        width: "54px",
                        height: "54px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "26px",
                        backgroundColor: `${badge.color ?? "#ffffff"}18`,
                        border: `1px solid ${badge.color ?? "#ffffff"}33`,
                      }}
                    >
                      {badge.icon || "🏅"}
                    </div>

                    <div>
                      <div style={{ fontSize: "28px", color: "#fff", fontWeight: 700 }}>
                        {badge.name}
                      </div>
                      <div style={{ color: "#a3a3a3", marginTop: "4px" }}>
                        {badge.description || "Badge sem descrição."}
                      </div>
                    </div>
                  </div>

                  <div style={getStatusStyle(Boolean(earned))}>
                    {getActionLabel(
                      {
                        key: badge.key,
                        category: badge.category,
                        isAutoAwarded: badge.isAutoAwarded,
                      },
                      Boolean(earned)
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ color: "#d4d4d4", fontSize: "14px" }}>
                    Categoria: {badge.category || "general"} • Raridade: {badge.rarity || "common"}
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {earned ? (
                      <form action={pinBadge}>
                        <input type="hidden" name="userBadgeId" value={earned.id} />
                        <button type="submit" style={primaryButtonStyle}>
                          {earned.isPinned ? "Fixada" : "Fixar no perfil"}
                        </button>
                      </form>
                    ) : (
                      <form action={claimBadge}>
                        <input type="hidden" name="badgeKey" value={badge.key} />
                        <button
                          type="submit"
                          style={secondaryButtonStyle}
                          disabled={badge.isAutoAwarded || badge.key === "owner"}
                        >
                          {badge.key === "premium" ? "Liberar via Premium" : "Em breve"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
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

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(244,114,182,0.20)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#141414",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(239,68,68,0.18)",
  backgroundColor: "rgba(239,68,68,0.10)",
  color: "#fca5a5",
  cursor: "pointer",
  fontWeight: "bold",
};
