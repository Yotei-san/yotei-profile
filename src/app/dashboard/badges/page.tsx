import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  claimBadge,
  grantOwnerBadgeToCurrentUser,
  pinBadge,
  unpinAllBadges,
} from "./actions";
import { ensureDefaultBadges, syncAutomaticBadges } from "@/app/lib/badges";

const MAX_PINNED_BADGES = 5;

function rarityConfig(rarity: string | null | undefined) {
  switch (rarity) {
    case "owner":
      return {
        border: "1px solid rgba(244,63,94,0.28)",
        bg: "linear-gradient(180deg, rgba(60,10,18,0.96), rgba(22,8,12,0.96))",
        accent: "#fb7185",
        glow: "0 18px 40px rgba(244,63,94,0.18)",
        label: "OWNER",
      };
    case "legendary":
      return {
        border: "1px solid rgba(250,204,21,0.26)",
        bg: "linear-gradient(180deg, rgba(54,40,6,0.96), rgba(22,18,8,0.96))",
        accent: "#fde047",
        glow: "0 18px 40px rgba(250,204,21,0.14)",
        label: "LEGENDARY",
      };
    case "epic":
      return {
        border: "1px solid rgba(192,132,252,0.26)",
        bg: "linear-gradient(180deg, rgba(36,14,54,0.96), rgba(16,8,24,0.96))",
        accent: "#c084fc",
        glow: "0 18px 40px rgba(192,132,252,0.14)",
        label: "EPIC",
      };
    case "rare":
      return {
        border: "1px solid rgba(56,189,248,0.24)",
        bg: "linear-gradient(180deg, rgba(10,31,48,0.96), rgba(8,16,24,0.96))",
        accent: "#38bdf8",
        glow: "0 18px 40px rgba(56,189,248,0.14)",
        label: "RARE",
      };
    default:
      return {
        border: "1px solid rgba(255,255,255,0.08)",
        bg: "linear-gradient(180deg, rgba(18,18,18,0.96), rgba(10,10,10,0.96))",
        accent: "#d4d4d8",
        glow: "0 18px 40px rgba(0,0,0,0.22)",
        label: "COMMON",
      };
  }
}

function getBadgeActionText(badgeKey: string, isAutoAwarded: boolean, earned: boolean) {
  if (earned) return "Pinned / Owned";
  if (badgeKey === "premium") return "Unlock via Premium";
  if (badgeKey === "owner") return "Owner Only";
  if (isAutoAwarded) return "Auto Unlock";
  return "Claim / Event";
}

export default async function BadgesPage() {
  const sessionUser = await requireUser();

  await ensureDefaultBadges();
  await syncAutomaticBadges(sessionUser.id);

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      badges: {
        include: {
          badge: true,
        },
        orderBy: [{ isPinned: "desc" }, { earnedAt: "desc" }],
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const badges = await prisma.badge.findMany({
    orderBy: [{ rarity: "desc" }, { name: "asc" }],
  });

  const earnedMap = new Map(user.badges.map((item) => [item.badgeId, item]));
  const pinnedCount = user.badges.filter((item) => item.isPinned).length;

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
      <div style={{ maxWidth: "1420px", margin: "0 auto" }}>
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
                ✦ Status • Prestige • Progression
              </div>
              <h1 style={{ margin: 0, fontSize: "46px", lineHeight: 1 }}>
                Badges
              </h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
                Sistema avançado de badges no estilo produto premium:
                raridade, pin múltiplo, eventos, missões e status visual forte.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={topLinkStyle}>
                Dashboard
              </Link>
              <Link href={`/${user.username}`} target="_blank" style={topLinkStyle}>
                Ver perfil
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "18px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0b0b0b",
              border: "1px solid #1f1f1f",
              borderRadius: "24px",
              padding: "22px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "28px" }}>Loadout público</h2>
            <p style={{ color: "#a3a3a3", marginTop: "10px" }}>
              Você pode fixar até {MAX_PINNED_BADGES} badges no perfil público.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
              {user.badges.filter((item) => item.isPinned).length > 0 ? (
                user.badges
                  .filter((item) => item.isPinned)
                  .map((item) => {
                    const theme = rarityConfig(item.badge.rarity);
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "inline-flex",
                          gap: "10px",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderRadius: "999px",
                          background: `${item.badge.color ?? "#ffffff"}18`,
                          border: `1px solid ${item.badge.color ?? "#ffffff"}33`,
                          boxShadow: `0 10px 24px ${(item.badge.color ?? "#ffffff")}22`,
                        }}
                      >
                        <span>{item.badge.icon || "🏅"}</span>
                        <span style={{ fontWeight: 700 }}>{item.badge.name}</span>
                        <span style={{ color: theme.accent, fontSize: "12px", fontWeight: 800 }}>
                          {theme.label}
                        </span>
                      </div>
                    );
                  })
              ) : (
                <div style={{ color: "#a3a3a3" }}>Nenhuma badge fixada ainda.</div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
              <form action={unpinAllBadges}>
                <button type="submit" style={dangerButtonStyle}>
                  Desfixar todas
                </button>
              </form>

              <form action={grantOwnerBadgeToCurrentUser}>
                <button type="submit" style={secondaryButtonStyle}>
                  Garantir Owner
                </button>
              </form>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#0b0b0b",
              border: "1px solid #1f1f1f",
              borderRadius: "24px",
              padding: "22px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "28px" }}>Progressão</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              <StatRow label="Badges conquistadas" value={String(user.badges.length)} />
              <StatRow label="Badges fixadas" value={`${pinnedCount}/${MAX_PINNED_BADGES}`} />
              <StatRow
                label="Conta"
                value={user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`}
              />
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {badges.map((badge) => {
            const theme = rarityConfig(badge.rarity);
            const earned = earnedMap.get(badge.id);
            const canPinMore = pinnedCount < MAX_PINNED_BADGES || Boolean(earned?.isPinned);

            return (
              <article
                key={badge.id}
                style={{
                  border: theme.border,
                  background: theme.bg,
                  borderRadius: "26px",
                  padding: "20px",
                  boxShadow: theme.glow,
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px" }}>
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        backgroundColor: `${badge.color ?? "#ffffff"}16`,
                        border: `1px solid ${badge.color ?? "#ffffff"}30`,
                      }}
                    >
                      {badge.icon || "🏅"}
                    </div>

                    <div>
                      <div style={{ fontSize: "28px", fontWeight: 800 }}>{badge.name}</div>
                      <div style={{ color: "#a3a3a3", marginTop: "4px", lineHeight: 1.6 }}>
                        {badge.description || "Badge sem descrição."}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 11px",
                      borderRadius: "999px",
                      backgroundColor: `${badge.color ?? "#ffffff"}16`,
                      border: `1px solid ${badge.color ?? "#ffffff"}24`,
                      color: theme.accent,
                      fontWeight: 800,
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {theme.label}
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
                  <div
                    style={{
                      color: earned ? "#86efac" : "#fca5a5",
                      fontWeight: 700,
                    }}
                  >
                    {getBadgeActionText(badge.key, badge.isAutoAwarded, Boolean(earned))}
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {earned ? (
                      <form action={pinBadge}>
                        <input type="hidden" name="userBadgeId" value={earned.id} />
                        <button
                          type="submit"
                          style={earned.isPinned ? activeButtonStyle : primaryButtonStyle}
                          disabled={!canPinMore}
                        >
                          {earned.isPinned ? "Desfixar" : canPinMore ? "Fixar no perfil" : "Limite atingido"}
                        </button>
                      </form>
                    ) : (
                      <form action={claimBadge}>
                        <input type="hidden" name="badgeKey" value={badge.key} />
                        <button
                          type="submit"
                          style={secondaryButtonStyle}
                          disabled={badge.isAutoAwarded || badge.key === "owner" || badge.key === "premium" || badge.key === "top10"}
                        >
                          {badge.key === "premium"
                            ? "Premium"
                            : badge.key === "top10"
                            ? "Leaderboard"
                            : badge.key === "owner"
                            ? "Owner only"
                            : "Claim"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "#101010",
        border: "1px solid #1f1f1f",
        borderRadius: "16px",
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

const activeButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(34,197,94,0.20)",
  backgroundColor: "rgba(34,197,94,0.12)",
  color: "#86efac",
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
