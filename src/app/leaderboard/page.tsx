import Link from "next/link";
import type { CSSProperties } from "react";
import {
  createTranslator,
  getRequestLocale,
  toIntlLocale,
  type Locale,
} from "@/app/lib/i18n";
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

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const tabItems: Array<{
    key: LeaderboardTab;
    label: string;
    eyebrow: string;
    description: string;
  }> = [
    {
      key: "views",
      label: t("leaderboard.tabs.views.label"),
      eyebrow: t("leaderboard.tabs.views.eyebrow"),
      description: t("leaderboard.tabs.views.description"),
    },
    {
      key: "likes",
      label: t("leaderboard.tabs.likes.label"),
      eyebrow: t("leaderboard.tabs.likes.eyebrow"),
      description: t("leaderboard.tabs.likes.description"),
    },
    {
      key: "dislikes",
      label: t("leaderboard.tabs.dislikes.label"),
      eyebrow: t("leaderboard.tabs.dislikes.eyebrow"),
      description: t("leaderboard.tabs.dislikes.description"),
    },
    {
      key: "newest",
      label: t("leaderboard.tabs.newest.label"),
      eyebrow: t("leaderboard.tabs.newest.eyebrow"),
      description: t("leaderboard.tabs.newest.description"),
    },
  ];
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeTab = normalizeLeaderboardTab(resolvedSearchParams.tab);
  const activeTabMeta =
    tabItems.find((item) => item.key === activeTab) ?? tabItems[0];
  const entries = await getLeaderboardEntries(activeTab, 50);

  return (
    <main className="yotei-scrollbar-hidden leaderboard-page" style={pageStyle}>
      <style>{`
        .leaderboard-shell {
          display: grid;
          gap: 18px;
        }

        .leaderboard-hero,
        .leaderboard-board,
        .leaderboard-row,
        .leaderboard-tab,
        .leaderboard-open-profile {
          min-width: 0;
        }

        .leaderboard-tab {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .leaderboard-open-profile {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .leaderboard-tab:hover,
          .leaderboard-open-profile:hover {
            transform: translateY(-1px);
          }
        }

        @media (max-width: 920px) {
          .leaderboard-hero,
          .leaderboard-board {
            padding: 20px !important;
            border-radius: 24px !important;
          }

          .leaderboard-title {
            font-size: clamp(38px, 9vw, 48px) !important;
          }

          .leaderboard-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .leaderboard-row {
            padding: 16px !important;
          }

          .leaderboard-right-cluster {
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            justify-content: stretch !important;
          }

          .leaderboard-right-cluster > * {
            min-width: 0 !important;
          }

          .leaderboard-open-profile {
            grid-column: 1 / -1;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .leaderboard-page {
            padding: 18px 12px 30px !important;
          }

          .leaderboard-shell {
            gap: 14px;
          }

          .leaderboard-hero {
            gap: 14px !important;
          }

          .leaderboard-tabs {
            grid-template-columns: 1fr !important;
          }

          .leaderboard-row {
            gap: 12px !important;
          }

          .leaderboard-left-cluster {
            gap: 12px !important;
            flex-basis: 100% !important;
          }

          .leaderboard-rank {
            min-width: 42px !important;
            font-size: 20px !important;
          }

          .leaderboard-avatar,
          .leaderboard-avatar-fallback {
            width: 48px !important;
            height: 48px !important;
            border-radius: 16px !important;
          }

          .leaderboard-display-name {
            font-size: 16px !important;
          }

          .leaderboard-right-cluster {
            grid-template-columns: 1fr !important;
          }

          .leaderboard-metric {
            min-width: 0 !important;
          }
        }
      `}</style>
      <div className="leaderboard-shell" style={shellStyle}>
        <section className="leaderboard-hero" style={heroStyle}>
          <div style={{ display: "grid", gap: "14px", minWidth: 0 }}>
            <div style={eyebrowStyle}>{activeTabMeta.eyebrow}</div>
            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <h1 className="leaderboard-title" style={titleStyle}>{t("leaderboard.title")}</h1>
              <p style={descriptionStyle}>
                {t("leaderboard.heroDescription", {
                  description: activeTabMeta.description,
                })}
              </p>
            </div>
          </div>

          <div style={heroActionsStyle}>
            <Link href="/dashboard" style={secondaryButtonStyle}>
              {t("leaderboard.backToDashboard")}
            </Link>
          </div>
        </section>

        <section className="leaderboard-tabs" style={tabsShellStyle}>
          {tabItems.map((item) => (
            <Link
              className="leaderboard-tab"
              key={item.key}
              href={`/leaderboard?tab=${item.key}`}
              style={tabStyle(activeTab === item.key)}
            >
              <span style={tabLabelStyle}>{item.label}</span>
              <span style={tabDescriptionStyle}>{item.description}</span>
            </Link>
          ))}
        </section>

        <section className="leaderboard-board" style={boardStyle}>
          <div style={boardHeadStyle}>
            <div>
              <div style={sectionEyebrowStyle}>{activeTabMeta.eyebrow}</div>
              <h2 style={sectionTitleStyle}>{activeTabMeta.label}</h2>
            </div>
            <div style={boardMetaStyle}>{t("leaderboard.boardMeta")}</div>
          </div>

          <div style={listStyle}>
            {entries.length === 0 ? (
              <div style={emptyStyle}>{t("leaderboard.noData")}</div>
            ) : (
              entries.map((entry) => (
                <article className="leaderboard-row" key={`${activeTab}-${entry.id}`} style={rowStyle(entry.rank)}>
                  <div className="leaderboard-left-cluster" style={leftClusterStyle}>
                    <div className="leaderboard-rank" style={rankStyle(entry.rank)}>#{entry.rank}</div>
                    <AvatarBadge
                      avatarUrl={entry.avatarUrl}
                      fallback={getInitials(entry.displayName)}
                    />
                    <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                      <div style={identityRowStyle}>
                        <div className="leaderboard-display-name" style={displayNameStyle}>{entry.displayName}</div>
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

                  <div className="leaderboard-right-cluster" style={rightClusterStyle}>
                    <MetricPill
                      label={t("leaderboard.metrics.views")}
                      value={entry.views}
                      highlight={activeTab === "views"}
                    />
                    <MetricPill
                      label={t("leaderboard.metrics.likes")}
                      value={entry.likes}
                      highlight={activeTab === "likes"}
                    />
                    <MetricPill
                      label={t("leaderboard.metrics.dislikes")}
                      value={entry.dislikes}
                      highlight={activeTab === "dislikes"}
                    />
                    <MetricPill
                      label={t("leaderboard.metrics.joined")}
                      value={formatJoinedDate(entry.createdAt, locale)}
                      highlight={activeTab === "newest"}
                      compact
                    />
                    <Link
                      className="leaderboard-open-profile"
                      href={`/${entry.username}`}
                      style={primaryButtonStyle}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("leaderboard.openProfile")}
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
    <img className="leaderboard-avatar" src={avatarUrl} alt="" style={avatarStyle} />
  ) : (
    <div className="leaderboard-avatar-fallback" style={avatarFallbackStyle}>{fallback}</div>
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
      className="leaderboard-metric"
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

function formatJoinedDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
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
  fontSize: "clamp(40px, 7vw, 54px)",
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: "60ch",
  color: "#a7b4cc",
  fontSize: "15px",
  lineHeight: 1.72,
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
