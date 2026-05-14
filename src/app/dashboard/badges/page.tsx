import type { CSSProperties } from "react";
import BadgeFilterTabs from "@/app/dashboard/components/BadgeFilterTabs";
import BadgeMissionCard from "@/app/dashboard/components/BadgeMissionCard";
import { requireUser } from "@/app/lib/auth";
import {
  filterBadgeMissionCards,
  getBadgeMissionCollection,
  parseBadgeFilter,
  type BadgeFilter,
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

  return (
    <main style={pageStyle}>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .badge-mission-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 28px 50px rgba(0, 0, 0, 0.24);
          }

          .badge-mission-card:hover .badge-action-button {
            transform: translateY(-1px);
          }
        }
      `}</style>

      <section style={heroStyle}>
        <div style={{ display: "grid", gap: "16px", minWidth: 0 }}>
          <div style={badgeStyle}>Badge Missions</div>
          <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
            <h1 style={heroTitleStyle}>Claim badges and build your Yotei identity.</h1>
            <p style={heroTextStyle}>
              Track mission progress, understand locked requirements and claim
              eligible badges directly from your dashboard.
            </p>
          </div>
        </div>

        <div style={heroSummaryGridStyle}>
          <SummaryCard label="Claimed" value={String(collection.claimedCount)} />
          <SummaryCard label="Ready now" value={String(collection.claimableCount)} />
          <SummaryCard label="Remaining" value={String(collection.lockedCount)} />
        </div>
      </section>

      {successMessage ? <div style={successBoxStyle}>{successMessage}</div> : null}
      {errorMessage ? <div style={errorBoxStyle}>{errorMessage}</div> : null}

      <section style={toolbarStyle}>
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <div style={sectionEyebrowStyle}>Filters</div>
          <h2 style={sectionTitleStyle}>Browse badge groups</h2>
        </div>

        <BadgeFilterTabs activeFilter={activeFilter} items={filterItems} />
      </section>

      <section style={gridStyle}>
        {filteredBadges.length > 0 ? (
          filteredBadges.map((badge) => (
            <BadgeMissionCard
              key={badge.slug}
              badge={badge}
              activeFilter={activeFilter}
            />
          ))
        ) : (
          <div style={emptyStyle}>
            No badges match the <strong>{labelForFilter(activeFilter)}</strong> filter right
            now.
          </div>
        )}
      </section>
    </main>
  );
}

function buildFilterItems(
  badges: Awaited<ReturnType<typeof getBadgeMissionCollection>>["badges"]
): Array<{ key: BadgeFilter; label: string; count: number }> {
  return [
    {
      key: "all",
      label: "All",
      count: badges.length,
    },
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
      label: "Claimed",
      count: badges.filter((badge) => badge.isClaimed).length,
    },
    {
      key: "locked",
      label: "Locked",
      count: badges.filter((badge) => !badge.isClaimed && badge.status !== "claimable").length,
    },
  ];
}

function labelForFilter(filter: BadgeFilter) {
  if (filter === "achievements") {
    return "Achievements";
  }

  return filter.charAt(0).toUpperCase() + filter.slice(1);
}

function getSuccessMessage(code?: string) {
  if (code === "badge-claimed") {
    return "Badge claimed and applied to your profile.";
  }

  return "";
}

function getErrorMessage(code?: string) {
  if (code === "badge-not-found") {
    return "This badge could not be found.";
  }

  if (code === "already-claimed") {
    return "You already claimed this badge.";
  }

  if (code === "official-only") {
    return "This badge is official-only and cannot be claimed by regular users.";
  }

  if (code === "premium-required") {
    return "Premium access is required before this badge can be claimed.";
  }

  if (code === "manual-review") {
    return "Streamer badge requires manual review and cannot be claimed automatically.";
  }

  if (code === "locked") {
    return "Mission requirement is not complete yet.";
  }

  if (code === "not-available") {
    return "This badge is not available for claim in this phase.";
  }

  return "";
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryValueStyle}>{value}</div>
      <div style={summaryLabelStyle}>{label}</div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: "18px",
  alignItems: "start",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(255,110,168,0.14), transparent 26%), radial-gradient(circle at 84% 16%, rgba(135,118,255,0.16), transparent 24%), linear-gradient(135deg, rgba(21,16,29,0.98), rgba(8,8,13,0.98))",
  boxShadow: "0 28px 64px rgba(0,0,0,0.24)",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.20)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "50px",
  lineHeight: 0.94,
  letterSpacing: "-0.05em",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "62ch",
  color: "#b7c1d8",
  fontSize: "15px",
  lineHeight: 1.8,
};

const heroSummaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
  gap: "12px",
};

const summaryCardStyle: CSSProperties = {
  minWidth: "120px",
  padding: "16px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  display: "grid",
  gap: "8px",
};

const summaryValueStyle: CSSProperties = {
  fontSize: "32px",
  lineHeight: 1,
  fontWeight: 900,
};

const summaryLabelStyle: CSSProperties = {
  color: "#9eabc5",
  fontSize: "12px",
  fontWeight: 700,
};

const successBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  fontWeight: 700,
};

const errorBoxStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "14px 16px",
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  fontWeight: 700,
};

const toolbarStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "24px 26px",
  borderRadius: "26px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(8,8,12,0.9)",
};

const sectionEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.02,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
};

const emptyStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "24px",
  border: "1px dashed rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#b6c0d6",
  lineHeight: 1.7,
};
