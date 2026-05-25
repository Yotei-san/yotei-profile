import Link from "next/link";
import type { CSSProperties } from "react";
import {
  getLeaderboardEntries,
  normalizeLeaderboardTab,
  type LeaderboardTab,
} from "@/app/lib/leaderboard";

type LeaderboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const TAB_ITEMS: Array<{
  key: LeaderboardTab;
  label: string;
  eyebrow: string;
  description: string;
}> = [
  {
    key: "views",
    label: "Most viewed",
    eyebrow: "Reach",
    description: "Profiles pulling the most attention right now.",
  },
  {
    key: "likes",
    label: "Most liked",
    eyebrow: "Affection",
    description: "Profiles earning the strongest positive reactions.",
  },
  {
    key: "dislikes",
    label: "Most disliked",
    eyebrow: "Heat",
    description: "Profiles collecting the most negative reactions.",
  },
  {
    key: "newest",
    label: "Newest profiles",
    eyebrow: "Fresh faces",
    description: "The latest public profiles to join the Yotei board.",
  },
];

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeTab = normalizeLeaderboardTab(resolvedSearchParams.tab);
  const activeTabMeta =
    TAB_ITEMS.find((item) => item.key === activeTab) ?? TAB_ITEMS[0];
  const entries = await getLeaderboardEntries(activeTab, 50);

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroStyle}>
          <div style={{ display: "grid", gap: "14px", minWidth: 0 }}>
            <div style={eyebrowStyle}>{activeTabMeta.eyebrow}</div>
            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <h1 style={titleStyle}>Leaderboard</h1>
              <p style={descriptionStyle}>
                {activeTabMeta.description} All boards are limited to active public
                profiles and refresh from the same counts used on profile pages.
              </p>
            </div>
          </div>

          <div style={heroActionsStyle}>
            <Link href="/dashboard" style={secondaryButtonStyle}>
              Back to dashboard
            </Link>
          </div>
        </section>

        <section style={tabsShellStyle}>
          {TAB_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/leaderboard?tab=${item.key}`}
              style={tabStyle(activeTab === item.key)}
            >
              <span style={tabLabelStyle}>{item.label}</span>
              <span style={tabDescriptionStyle}>{item.description}</span>
            </Link>
          ))}
        </section>

        <section style={boardStyle}>
          <div style={boardHeadStyle}>
            <div>
              <div style={sectionEyebrowStyle}>{activeTabMeta.eyebrow}</div>
              <h2 style={sectionTitleStyle}>{activeTabMeta.label}</h2>
            </div>
            <div style={boardMetaStyle}>Top 50 active public profiles</div>
          </div>

          <div style={listStyle}>
            {entries.length === 0 ? (
              <div style={emptyStyle}>No leaderboard data is available yet.</div>
            ) : (
              entries.map((entry) => (
                <article key={`${activeTab}-${entry.id}`} style={rowStyle(entry.rank)}>
                  <div style={leftClusterStyle}>
                    <div style={rankStyle(entry.rank)}>#{entry.rank}</div>
                    <AvatarBadge
                      avatarUrl={entry.avatarUrl}
                      fallback={getInitials(entry.displayName)}
                    />
                    <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                      <div style={identityRowStyle}>
                        <div style={displayNameStyle}>{entry.displayName}</div>
                        {entry.role === "owner" ? (
                          <IndicatorPill label="Owner" tone="gold" />
                        ) : entry.role === "admin" ? (
                          <IndicatorPill label="Admin" tone="blue" />
                        ) : null}
                        {entry.isPremium ? (
                          <IndicatorPill label="Premium" tone="pink" />
                        ) : null}
                      </div>
                      <div style={usernameStyle}>@{entry.username}</div>
                    </div>
                  </div>

                  <div style={rightClusterStyle}>
                    <MetricPill label="Views" value={entry.views} highlight={activeTab === "views"} />
                    <MetricPill label="Likes" value={entry.likes} highlight={activeTab === "likes"} />
                    <MetricPill
                      label="Dislikes"
                      value={entry.dislikes}
                      highlight={activeTab === "dislikes"}
                    />
                    <MetricPill
                      label="Joined"
                      value={formatJoinedDate(entry.createdAt)}
                      highlight={activeTab === "newest"}
                      compact
                    />
                    <Link href={`/${entry.username}`} style={primaryButtonStyle} target="_blank">
                      Open profile
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AvatarBadge({
  avatarUrl,
  fallback,
}: {
  avatarUrl: string | null;
  fallback: string;
}) {
  return avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarUrl} alt="" style={avatarStyle} />
  ) : (
    <div style={avatarFallbackStyle}>{fallback}</div>
  );
}

function IndicatorPill({
  label,
  tone,
}: {
  label: string;
  tone: "gold" | "blue" | "pink";
}) {
  const palette =
    tone === "gold"
      ? { color: "#f8dd8b", background: "rgba(248,221,139,0.10)", border: "rgba(248,221,139,0.20)" }
      : tone === "blue"
        ? { color: "#b9e1ff", background: "rgba(125,196,255,0.10)", border: "rgba(125,196,255,0.18)" }
        : { color: "#ffd5e7", background: "rgba(255,140,203,0.12)", border: "rgba(255,140,203,0.20)" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: "24px",
        padding: "0 9px",
        borderRadius: "999px",
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function MetricPill({
  label,
  value,
  highlight = false,
  compact = false,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "4px",
        minWidth: compact ? "110px" : "84px",
        padding: compact ? "10px 12px" : "10px 11px",
        borderRadius: "16px",
        border: highlight
          ? "1px solid rgba(255,110,168,0.24)"
          : "1px solid rgba(255,255,255,0.07)",
        background: highlight ? "rgba(255,110,168,0.10)" : "rgba(255,255,255,0.03)",
        textAlign: "center",
      }}
    >
      <div style={metricLabelStyle}>{label}</div>
      <div style={metricValueStyle}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

function formatJoinedDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(value);
}

function getInitials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "Y"
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(255,110,168,0.14), transparent 22%), radial-gradient(circle at 88% 10%, rgba(125,196,255,0.14), transparent 20%), linear-gradient(180deg, #06070c 0%, #030408 100%)",
  color: "#ffffff",
  padding: "28px 18px 44px",
  fontFamily: '"Space Grotesk", Arial, Helvetica, sans-serif',
};

const shellStyle: CSSProperties = {
  width: "min(1220px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "18px",
};

const heroStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "18px",
  flexWrap: "wrap",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(17,20,31,0.98), rgba(8,10,17,0.98))",
  boxShadow: "0 26px 62px rgba(0,0,0,0.26)",
};

const eyebrowStyle: CSSProperties = {
  color: "#f6bed8",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "54px",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: "60ch",
  color: "#a7b4cc",
  fontSize: "15px",
  lineHeight: 1.8,
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const tabsShellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const boardStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "22px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(12,14,23,0.98), rgba(6,8,14,0.98))",
};

const boardHeadStyle: CSSProperties = {
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const sectionEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "32px",
  lineHeight: 1,
};

const boardMetaStyle: CSSProperties = {
  color: "#8290ab",
  fontSize: "13px",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const rowStyle = (rank: number): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  padding: "18px",
  borderRadius: "22px",
  border:
    rank <= 3
      ? "1px solid rgba(255,110,168,0.18)"
      : "1px solid rgba(255,255,255,0.07)",
  background:
    rank <= 3
      ? "linear-gradient(180deg, rgba(31,17,29,0.98), rgba(14,10,17,0.98))"
      : "rgba(255,255,255,0.025)",
  boxShadow:
    rank <= 3 ? "0 18px 40px rgba(255,110,168,0.08)" : "none",
});

const leftClusterStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  minWidth: 0,
  flex: "1 1 320px",
};

const rightClusterStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const rankStyle = (rank: number): CSSProperties => ({
  minWidth: "54px",
  color: rank <= 3 ? "#ffe1ef" : "#d9e2f4",
  fontSize: "24px",
  fontWeight: 900,
  letterSpacing: "-0.04em",
});

const avatarStyle: CSSProperties = {
  width: "56px",
  height: "56px",
  borderRadius: "18px",
  objectFit: "cover",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f121a",
  flexShrink: 0,
};

const avatarFallbackStyle: CSSProperties = {
  ...avatarStyle,
  display: "grid",
  placeItems: "center",
  color: "#ffffff",
  fontWeight: 900,
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.34), rgba(255,110,168,0.26))",
};

const identityRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
  minWidth: 0,
};

const displayNameStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 800,
  overflowWrap: "anywhere",
};

const usernameStyle: CSSProperties = {
  color: "#8b99b4",
  fontSize: "13px",
};

const metricLabelStyle: CSSProperties = {
  color: "#8b99b4",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const metricValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 800,
};

const primaryButtonStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 15px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
  color: "#ffffff",
  fontWeight: 800,
};

const secondaryButtonStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 15px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  fontWeight: 800,
};

const emptyStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed rgba(255,255,255,0.12)",
  color: "#98a6bf",
  textAlign: "center",
  lineHeight: 1.7,
};

const tabStyle = (active: boolean): CSSProperties => ({
  textDecoration: "none",
  display: "grid",
  gap: "6px",
  padding: "16px 18px",
  borderRadius: "22px",
  border: active
    ? "1px solid rgba(255,110,168,0.24)"
    : "1px solid rgba(255,255,255,0.08)",
  background: active
    ? "linear-gradient(180deg, rgba(39,17,32,0.98), rgba(15,10,17,0.98))"
    : "rgba(255,255,255,0.03)",
  boxShadow: active ? "0 18px 36px rgba(255,110,168,0.08)" : "none",
});

const tabLabelStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 800,
};

const tabDescriptionStyle: CSSProperties = {
  color: "#8fa0bb",
  fontSize: "12px",
  lineHeight: 1.6,
};
