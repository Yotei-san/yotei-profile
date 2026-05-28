import type { CSSProperties } from "react";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";
import { ensureDefaultBadges } from "@/app/lib/badges";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";

type AdminBadge = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string | null;
  color: string | null;
  category: string | null;
  rarity: string | null;
};

export default async function AdminBadgesPage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);
  await ensureDefaultBadges();

  const badges = await loadBadges();
  const featuredRelic = badges[0] ?? null;
  const grouped = {
    legendary: badges.filter((badge) => badge.rarity === "owner" || badge.rarity === "legendary"),
    epic: badges.filter((badge) => badge.rarity === "epic"),
    rare: badges.filter((badge) => badge.rarity === "rare"),
    common: badges.filter((badge) => badge.rarity === "common"),
  };

  return (
    <main style={pageStyle}>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .armory-vault-tile:hover {
            transform: translateY(-4px);
            filter: saturate(1.04) brightness(1.02);
          }
        }

        @media (max-width: 920px) {
          .vault-hero {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }

          .featured-relic-shell {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .vault-hero {
            gap: 18px !important;
            padding: 20px !important;
          }

          .vault-hero-title {
            font-size: 38px !important;
            line-height: 0.98 !important;
          }

          .vault-summary-grid,
          .vault-legendary-rail,
          .vault-epic-grid,
          .vault-rare-grid,
          .vault-common-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section className="vault-hero" style={heroStyle}>
        <div style={{ display: "grid", gap: "14px", minWidth: 0 }}>
          <div style={eyebrowStyle}>Yotei Armory</div>
          <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
            <h1 className="vault-hero-title" style={heroTitleStyle}>
              Admin vault for the full badge collection.
            </h1>
            <p style={heroBodyStyle}>
              Review the full catalog with the same rarity hierarchy players see,
              but in a cleaner admin view that stays readable on smaller screens.
            </p>
          </div>
        </div>

        <div className="vault-summary-grid" style={summaryGridStyle}>
          <SummaryCard label="Total relics" value={String(badges.length)} tone="#f4c97a" />
          <SummaryCard label="Legendary" value={String(grouped.legendary.length)} tone="#ffb88e" />
          <SummaryCard label="Epic" value={String(grouped.epic.length)} tone="#c4b5fd" />
          <SummaryCard label="Rare" value={String(grouped.rare.length)} tone="#7dd3fc" />
        </div>
      </section>

      {featuredRelic ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Featured relic"
            title={featuredRelic.name}
            body="The rarest badge opens the catalog, but the rest of the collection still stays easy to compare."
          />

          <article style={featuredRelicStyle(featuredRelic)} className="armory-vault-tile">
            <div className="featured-relic-shell" style={featuredRelicShellStyle}>
              <div style={featuredEmblemStyle(featuredRelic.color ?? "#f4c97a")}>
                <BadgeVisual
                  slug={featuredRelic.slug}
                  icon={featuredRelic.icon}
                  name={featuredRelic.name}
                  description={featuredRelic.description}
                  color={featuredRelic.color}
                  rarity={featuredRelic.rarity}
                  category={featuredRelic.category}
                  size={140}
                  animated
                  equipped
                />
              </div>

              <div style={{ display: "grid", gap: "16px", minWidth: 0 }}>
                <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
                  <div style={artifactEyebrowStyle}>Ceremonial centerpiece</div>
                  <h2 style={featuredTitleStyle}>{featuredRelic.name}</h2>
                  <p style={featuredBodyStyle}>{featuredRelic.description}</p>
                </div>

                <div style={detailGridStyle}>
                  <DetailStrip label="Slug" value={featuredRelic.slug} color={featuredRelic.color} />
                  <DetailStrip label="Rarity" value={formatRarity(featuredRelic.rarity)} color={featuredRelic.color} />
                  <DetailStrip label="Category" value={formatCategory(featuredRelic.category)} color={featuredRelic.color} />
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {grouped.legendary.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Legendary collection"
            title="Top-tier badges with more breathing room"
            body="Founder and legendary pieces stay prominent without making the catalog feel overcrowded."
          />
          <div className="vault-legendary-rail" style={legendaryRailStyle}>
            {grouped.legendary.map((badge) => (
              <VaultTile key={badge.id} badge={badge} variant="hero" />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.epic.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Epic collection"
            title="Epic badges with clearer scan rhythm"
            body="Important enough to stand out, compact enough to review quickly."
          />
          <div className="vault-epic-grid" style={epicGridStyle}>
            {grouped.epic.map((badge) => (
              <VaultTile key={badge.id} badge={badge} variant="shelf" />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.rare.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Rare archive"
            title="Rare badges in a lighter archive"
            body="Still collectible, but presented with less visual pressure."
          />
          <div className="vault-rare-grid" style={rareGridStyle}>
            {grouped.rare.map((badge) => (
              <VaultTile key={badge.id} badge={badge} variant="shelf" />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.common.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Starter badges"
            title="Calmer slots for the earliest unlocks"
            body="The common tier stays visible, but never competes with the upper armory."
          />
          <div className="vault-common-grid" style={commonGridStyle}>
            {grouped.common.map((badge) => (
              <VaultTile key={badge.id} badge={badge} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

async function loadBadges(): Promise<AdminBadge[]> {
  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: "desc" },
  });

  return [...badges].sort((left, right) => getBadgeRank(right) - getBadgeRank(left));
}

function VaultTile({
  badge,
  variant,
}: {
  badge: AdminBadge;
  variant: "hero" | "shelf" | "compact";
}) {
  const isCompact = variant === "compact";
  const isHero = variant === "hero";

  return (
    <article className="armory-vault-tile" style={vaultTileStyle(badge, variant)}>
      <div style={{ display: "grid", gap: isCompact ? "12px" : "16px", minWidth: 0 }}>
        <div style={vaultTileTopStyle(variant)}>
          <div style={vaultVisualWrapStyle(badge.color ?? "#ffffff", variant)}>
            <BadgeVisual
              slug={badge.slug}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              color={badge.color}
              rarity={badge.rarity}
              category={badge.category}
              size={isHero ? 88 : isCompact ? 54 : 68}
              compact={!isHero}
              animated={!isCompact}
              equipped
            />
          </div>

          <div style={tagStyle(badge.color ?? "#ffffff")}>{formatRarity(badge.rarity)}</div>
        </div>

        <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
          <div style={vaultTileTitleStyle(variant)}>{badge.name}</div>
          <div style={vaultTileBodyStyle(variant)}>{badge.description}</div>
        </div>

        <div style={vaultMetaStyle(variant)}>
          <div style={metaChipStyle(badge.color ?? "#ffffff")}>{formatCategory(badge.category)}</div>
          <div style={metaChipStyle(badge.color ?? "#ffffff")}>{badge.slug}</div>
        </div>
      </div>
    </article>
  );
}

function DetailStrip({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string | null;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "7px",
        minWidth: 0,
        padding: "14px 15px",
        borderRadius: "18px",
        border: `1px solid ${(color ?? "#ffffff")}18`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
      }}
    >
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
      <div style={sectionEyebrowStyle}>{eyebrow}</div>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <p style={sectionBodyStyle}>{body}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div
      style={{
        ...summaryCardStyle,
        border: `1px solid ${tone}20`,
        boxShadow: `0 16px 28px ${tone}12`,
      }}
    >
      <div style={summaryValueStyle}>{value}</div>
      <div style={summaryLabelStyle}>{label}</div>
    </div>
  );
}

function getBadgeRank(badge: Pick<AdminBadge, "rarity">) {
  return badge.rarity === "owner"
    ? 500
    : badge.rarity === "legendary"
      ? 420
      : badge.rarity === "epic"
        ? 320
        : badge.rarity === "rare"
          ? 220
          : 120;
}

function formatRarity(value: string | null) {
  if (value === "owner") {
    return "Owner";
  }

  if (!value) {
    return "Unknown";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCategory(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  if (value === "achievement") {
    return "Achievement";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function featuredRelicStyle(badge: AdminBadge): CSSProperties {
  return {
    padding: "26px",
    borderRadius: "34px",
    border: `1px solid ${(badge.color ?? "#ffffff")}20`,
    background:
      badge.rarity === "owner"
        ? "linear-gradient(180deg, rgba(35,24,10,0.98), rgba(9,8,7,0.98))"
        : "linear-gradient(180deg, rgba(18,15,24,0.98), rgba(7,8,14,0.98))",
    boxShadow: `0 34px 76px ${(badge.color ?? "#ffffff")}16`,
  };
}

const featuredRelicShellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(140px, 180px) minmax(0, 1fr)",
  gap: "26px",
  alignItems: "center",
};

function featuredEmblemStyle(color: string): CSSProperties {
  return {
    position: "relative",
    width: "168px",
    height: "168px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "42px",
    border: `1px solid ${color}20`,
    background:
      "radial-gradient(circle at 50% 14%, rgba(255,255,255,0.08), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    boxShadow: `0 26px 44px ${color}12`,
    overflow: "hidden",
  };
}

const artifactEyebrowStyle: CSSProperties = {
  color: "#90a2c7",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const featuredTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "36px",
  lineHeight: 1.02,
  letterSpacing: "-0.05em",
};

const featuredBodyStyle: CSSProperties = {
  margin: 0,
  color: "#b7c2d8",
  fontSize: "15px",
  lineHeight: 1.8,
  maxWidth: "58ch",
};

const detailGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
};

function vaultTileStyle(
  badge: AdminBadge,
  variant: "hero" | "shelf" | "compact",
): CSSProperties {
  return {
    padding: variant === "compact" ? "16px" : "18px",
    borderRadius: variant === "compact" ? "24px" : "28px",
    border: `1px solid ${(badge.color ?? "#ffffff")}18`,
    background:
      badge.rarity === "owner" || badge.rarity === "legendary"
        ? "linear-gradient(180deg, rgba(24,18,10,0.98), rgba(9,8,7,0.98))"
        : badge.rarity === "epic"
          ? "linear-gradient(180deg, rgba(19,14,28,0.98), rgba(8,8,14,0.98))"
          : badge.rarity === "rare"
            ? "linear-gradient(180deg, rgba(12,18,28,0.98), rgba(7,10,18,0.98))"
            : "linear-gradient(180deg, rgba(16,18,24,0.98), rgba(8,9,14,0.98))",
    boxShadow: `0 20px 44px ${(badge.color ?? "#ffffff")}12`,
    transition:
      "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease, filter 180ms ease",
  };
}

function vaultTileTopStyle(variant: "hero" | "shelf" | "compact"): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: variant === "compact" ? "nowrap" : "wrap",
  };
}

function vaultVisualWrapStyle(color: string, variant: "hero" | "shelf" | "compact"): CSSProperties {
  const size = variant === "hero" ? 104 : variant === "compact" ? 66 : 84;

  return {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: variant === "compact" ? "24px" : "30px",
    border: `1px solid ${color}18`,
    background:
      "radial-gradient(circle at 50% 14%, rgba(255,255,255,0.08), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    boxShadow: `0 18px 30px ${color}10`,
  };
}

function tagStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "30px",
    padding: "0 10px",
    borderRadius: "999px",
    border: `1px solid ${color}20`,
    backgroundColor: `${color}10`,
    color: "#f8fbff",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

function vaultTileTitleStyle(variant: "hero" | "shelf" | "compact"): CSSProperties {
  return {
    color: "#ffffff",
    fontSize: variant === "hero" ? "24px" : variant === "compact" ? "18px" : "21px",
    lineHeight: 1.06,
    letterSpacing: "-0.04em",
    fontWeight: 900,
  };
}

function vaultTileBodyStyle(variant: "hero" | "shelf" | "compact"): CSSProperties {
  return {
    color: "#b5c0d7",
    fontSize: variant === "compact" ? "12px" : "13px",
    lineHeight: 1.65,
  };
}

function vaultMetaStyle(variant: "hero" | "shelf" | "compact"): CSSProperties {
  return {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: variant === "compact" ? "2px" : "4px",
  };
}

function metaChipStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    border: `1px solid ${color}16`,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#d9e3f4",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.08em",
  };
}

const labelStyle: CSSProperties = {
  color: "#8f9ab3",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const valueStyle: CSSProperties = {
  color: "#e8eefb",
  fontSize: "13px",
  lineHeight: 1.6,
};

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  color: "#ffffff",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
  gap: "22px",
  alignItems: "end",
  padding: "30px",
  borderRadius: "34px",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "radial-gradient(circle at 10% 0%, rgba(244,201,122,0.14), transparent 28%), radial-gradient(circle at 84% 16%, rgba(125,196,255,0.14), transparent 24%), linear-gradient(180deg, rgba(14,16,24,0.98), rgba(6,8,14,0.98))",
  boxShadow: "0 32px 70px rgba(0,0,0,0.24)",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "34px",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(244,201,122,0.18)",
  backgroundColor: "rgba(244,201,122,0.08)",
  color: "#ffe9b9",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "52px",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
};

const heroBodyStyle: CSSProperties = {
  margin: 0,
  color: "#b7c2d7",
  fontSize: "15px",
  lineHeight: 1.8,
  maxWidth: "60ch",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const summaryCardStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  minWidth: 0,
  padding: "16px",
  borderRadius: "22px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
};

const summaryValueStyle: CSSProperties = {
  fontSize: "32px",
  lineHeight: 1,
  fontWeight: 900,
};

const summaryLabelStyle: CSSProperties = {
  color: "#99a8c4",
  fontSize: "12px",
  fontWeight: 700,
};

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
};

const sectionEyebrowStyle: CSSProperties = {
  color: "#8ea2ca",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.04,
  letterSpacing: "-0.04em",
};

const sectionBodyStyle: CSSProperties = {
  margin: 0,
  color: "#aeb9cf",
  fontSize: "14px",
  lineHeight: 1.75,
  maxWidth: "64ch",
};

const legendaryRailStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};

const epicGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
};

const rareGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const commonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};
