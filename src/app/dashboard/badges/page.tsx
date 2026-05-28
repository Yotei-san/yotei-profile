import type { CSSProperties } from "react";
import BadgeFilterTabs from "@/app/dashboard/components/BadgeFilterTabs";
import BadgeMissionCard from "@/app/dashboard/components/BadgeMissionCard";
import { requireUser } from "@/app/lib/auth";
import {
  filterBadgeMissionCards,
  getBadgeMissionCollection,
  parseBadgeFilter,
  type BadgeFilter,
  type BadgeMissionCardState,
} from "@/app/lib/badge-missions";

type PageProps = {
  searchParams?: Promise<{
    filter?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function BadgesPage({ searchParams }: PageProps) {
  const sessionUser = await requireUser();
  const params = (await searchParams) ?? {};
  const activeFilter = parseBadgeFilter(params.filter);
  const collection = await getBadgeMissionCollection(sessionUser.id);
  const filteredBadges = filterBadgeMissionCards(collection.badges, activeFilter);
  const successMessage = getSuccessMessage(params.success);
  const errorMessage = getErrorMessage(params.error);
  const filterItems = buildFilterItems(collection.badges);
  const featuredRelic = pickFeaturedRelic(filteredBadges);
  const grouped = buildArmoryGroups(filteredBadges, featuredRelic?.slug ?? null);

  return (
    <main style={pageStyle}>
      <style>{`
        .badge-mission-card {
          transition:
            transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 180ms ease,
            border-color 180ms ease,
            filter 180ms ease;
        }

        .badge-action-button {
          transition:
            transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .badge-mission-card:hover {
            transform: translateY(-4px);
            filter: saturate(1.04) brightness(1.02);
          }

          .badge-mission-card:hover .badge-action-button {
            transform: translateY(-1px);
          }
        }

        @media (max-width: 920px) {
          .armory-hero {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }

          .badge-mission-card.badge-variant-featured .badge-mission-card-shell {
            grid-template-columns: 1fr !important;
          }

          .badge-mission-card.badge-variant-featured .badge-mission-card-crest {
            justify-items: start !important;
          }

          .badge-mission-card.badge-variant-featured .badge-mission-card-detail-rail {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .armory-hero {
            gap: 18px !important;
            padding: 20px !important;
          }

          .armory-hero-title {
            font-size: 38px !important;
            line-height: 0.98 !important;
          }

          .armory-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .armory-rail {
            grid-template-columns: 1fr !important;
          }

          .armory-grid-epic,
          .armory-grid-rare,
          .armory-grid-common {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section className="armory-hero" style={heroStyle}>
        <div style={{ display: "grid", gap: "16px", minWidth: 0 }}>
          <div style={eyebrowStyle}>Yotei Armory</div>
          <div style={{ display: "grid", gap: "12px", minWidth: 0 }}>
            <h1 className="armory-hero-title" style={heroTitleStyle}>
              Your profile badges, presented like a real armory.
            </h1>
            <p style={heroTextStyle}>
              See what is equipped, what is unlocked, and what still needs a mission,
              Premium, or review before it can join your public identity.
            </p>
          </div>
        </div>

        <div className="armory-summary-grid" style={heroSummaryGridStyle}>
          <SummaryCard label="Equipped" value={String(collection.claimedCount)} tone="gold" />
          <SummaryCard label="Unlocked" value={String(collection.claimableCount)} tone="violet" />
          <SummaryCard label="Needs action" value={String(collection.lockedCount)} tone="blue" />
        </div>
      </section>

      {successMessage ? <div style={successBoxStyle}>{successMessage}</div> : null}
      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

      <section style={toolbarStyle}>
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <div style={sectionEyebrowStyle}>Browse</div>
          <h2 style={sectionTitleStyle}>Filter your badge collection</h2>
        </div>

        <BadgeFilterTabs activeFilter={activeFilter} items={filterItems} />
      </section>

      {featuredRelic ? (
        <section style={featuredSectionStyle}>
          <SectionIntro
            eyebrow="Featured relic"
            title={featuredRelic.name}
            body="Your rarest badge gets the spotlight first, while the rest of the collection stays easy to compare below."
          />
          <BadgeMissionCard
            badge={featuredRelic}
            activeFilter={activeFilter}
            variant="featured"
          />
        </section>
      ) : null}

      {grouped.legendary.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Legendary collection"
            title="High-status badges with more presence"
            body="These badges stay larger and calmer, so they feel important without turning the page into a wall of cards."
          />
          <div className="armory-rail" style={legendaryRailStyle}>
            {grouped.legendary.map((badge) => (
              <BadgeMissionCard
                key={badge.slug}
                badge={badge}
                activeFilter={activeFilter}
                variant="shelf"
              />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.epic.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Epic collection"
            title="Premium badges with clear mission progress"
            body="Still collectible, but easier to scan quickly when you want to unlock or equip the next one."
          />
          <div className="armory-grid-epic" style={epicGridStyle}>
            {grouped.epic.map((badge) => (
              <BadgeMissionCard
                key={badge.slug}
                badge={badge}
                activeFilter={activeFilter}
                variant="shelf"
              />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.rare.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Rare collection"
            title="Smaller badges that still feel worth earning"
            body="Rare badges keep the collectible tone, with lighter framing so the page stays readable."
          />
          <div className="armory-grid-rare" style={rareGridStyle}>
            {grouped.rare.map((badge, index) => (
              <BadgeMissionCard
                key={badge.slug}
                badge={badge}
                activeFilter={activeFilter}
                variant={index < 2 ? "shelf" : "compact"}
              />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.common.length > 0 ? (
        <section style={sectionStyle}>
          <SectionIntro
            eyebrow="Starter badges"
            title="The first steps of your collection"
            body="Starter unlocks stay simple and easy to scan, especially on mobile."
          />
          <div className="armory-grid-common" style={commonGridStyle}>
            {grouped.common.map((badge) => (
              <BadgeMissionCard
                key={badge.slug}
                badge={badge}
                activeFilter={activeFilter}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : null}

      {!featuredRelic &&
      grouped.legendary.length === 0 &&
      grouped.epic.length === 0 &&
      grouped.rare.length === 0 &&
      grouped.common.length === 0 ? (
        <div style={emptyStyle}>
          No relics match the <strong>{labelForFilter(activeFilter)}</strong> filter right now.
        </div>
      ) : null}
    </main>
  );
}

function buildFilterItems(
  badges: Awaited<ReturnType<typeof getBadgeMissionCollection>>["badges"],
): Array<{ key: BadgeFilter; label: string; count: number }> {
  return [
    { key: "all", label: "All", count: badges.length },
    {
      key: "official",
      label: "Official",
      count: badges.filter((badge) => badge.category === "official").length,
    },
    {
      key: "premium",
      label: "Premium",
      count: badges.filter((badge) => badge.category === "premium").length,
    },
    {
      key: "achievements",
      label: "Achievements",
      count: badges.filter((badge) => badge.category === "achievement").length,
    },
    {
      key: "claimed",
      label: "Equipped",
      count: badges.filter((badge) => badge.isClaimed).length,
    },
    {
      key: "locked",
      label: "Needs action",
      count: badges.filter((badge) => !badge.isClaimed && badge.status !== "claimable").length,
    },
  ];
}

function buildArmoryGroups(badges: BadgeMissionCardState[], featuredSlug: string | null) {
  const remaining = badges.filter((badge) => badge.slug !== featuredSlug);

  return {
    legendary: remaining.filter(
      (badge) => badge.rarity === "owner" || badge.rarity === "legendary",
    ),
    epic: remaining.filter((badge) => badge.rarity === "epic"),
    rare: remaining.filter((badge) => badge.rarity === "rare"),
    common: remaining.filter((badge) => badge.rarity === "common"),
  };
}

function pickFeaturedRelic(badges: BadgeMissionCardState[]) {
  if (badges.length === 0) {
    return null;
  }

  return [...badges].sort((left, right) => getBadgeRank(right) - getBadgeRank(left))[0] ?? null;
}

function getBadgeRank(badge: BadgeMissionCardState) {
  const rarityScore =
    badge.rarity === "owner"
      ? 500
      : badge.rarity === "legendary"
        ? 420
        : badge.rarity === "epic"
          ? 320
          : badge.rarity === "rare"
            ? 220
            : 120;
  const statusScore =
    badge.status === "claimed"
      ? 42
      : badge.status === "claimable"
        ? 34
        : badge.status === "manual-review"
          ? 26
          : badge.status === "official-only"
            ? 22
            : 14;

  return rarityScore + statusScore;
}

function labelForFilter(filter: BadgeFilter) {
  if (filter === "achievements") {
    return "Achievements";
  }

  return filter.charAt(0).toUpperCase() + filter.slice(1);
}

function getSuccessMessage(code?: string) {
  if (code === "badge-claimed") {
    return "Badge equipped on your public profile.";
  }

  return "";
}

function getErrorMessage(code?: string) {
  if (code === "badge-not-found") {
    return "This badge could not be found in the armory.";
  }

  if (code === "already-claimed") {
    return "This relic is already equipped.";
  }

  if (code === "official-only") {
    return "This badge is reserved for official Yotei assignment.";
  }

  if (code === "premium-required") {
    return "Premium is still required before this badge can be unlocked.";
  }

  if (code === "manual-review") {
    return "This badge is still waiting for manual review.";
  }

  if (code === "locked") {
    return "Complete the mission requirement before equipping this badge.";
  }

  if (code === "not-available") {
    return "This badge exists, but it is not claimable yet.";
  }

  return "";
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
  tone: "gold" | "violet" | "blue";
}) {
  const accent =
    tone === "gold" ? "#f4c97a" : tone === "violet" ? "#c4b5fd" : "#7dd3fc";

  return (
    <div
      style={{
        ...summaryCardStyle,
        border: `1px solid ${accent}20`,
        boxShadow: `0 16px 30px ${accent}12`,
      }}
    >
      <div style={summaryValueStyle}>{value}</div>
      <div style={summaryLabelStyle}>{label}</div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  color: "#ffffff",
  fontFamily: '"Segoe UI", Arial, Helvetica, sans-serif',
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
  gap: "22px",
  alignItems: "end",
  padding: "30px",
  borderRadius: "34px",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "radial-gradient(circle at 10% 0%, rgba(244,201,122,0.14), transparent 28%), radial-gradient(circle at 86% 18%, rgba(124,125,255,0.15), transparent 24%), linear-gradient(180deg, rgba(14,16,24,0.98), rgba(6,8,14,0.98))",
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
  fontSize: "54px",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "62ch",
  color: "#b7c2d7",
  fontSize: "15px",
  lineHeight: 1.8,
};

const heroSummaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
  fontSize: "34px",
  lineHeight: 1,
  fontWeight: 900,
};

const summaryLabelStyle: CSSProperties = {
  color: "#99a8c4",
  fontSize: "12px",
  fontWeight: 700,
};

const successBoxStyle: CSSProperties = {
  borderRadius: "20px",
  padding: "15px 17px",
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#98f5bf",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  borderRadius: "20px",
  padding: "15px 17px",
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#f9b3b3",
  fontWeight: 700,
};

const toolbarStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "24px 26px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "linear-gradient(180deg, rgba(12,14,20,0.96), rgba(7,9,14,0.96))",
};

const featuredSectionStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};

const epicGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
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

const emptyStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "24px",
  border: "1px dashed rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#b6c0d6",
  lineHeight: 1.7,
};
