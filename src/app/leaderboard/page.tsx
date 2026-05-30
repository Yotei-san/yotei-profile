import Link from "next/link";
import type { CSSProperties } from "react";
import { getAuraVisualProfile } from "@/app/lib/aura-visuals";
import {
  createTranslator,
  getRequestLocale,
  toIntlLocale,
  type Locale,
} from "@/app/lib/i18n";
import {
  getLeaderboardEntries,
  normalizeLeaderboardTab,
  type LeaderboardEntry,
  type LeaderboardTab,
} from "@/app/lib/leaderboard";

type LeaderboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

type MetricItem = {
  label: string;
  value: number | string;
  highlight?: boolean;
};

type LeaderboardLabels = {
  auraScore: string;
  auraRank: string;
  views: string;
  likes: string;
  comments: string;
  badges: string;
  joined: string;
  legendary: string;
  rare: string;
  openProfile: string;
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
      key: "aura",
      label: t("leaderboard.tabs.aura.label"),
      eyebrow: t("leaderboard.tabs.aura.eyebrow"),
      description: t("leaderboard.tabs.aura.description"),
    },
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
      key: "comments",
      label: t("leaderboard.tabs.comments.label"),
      eyebrow: t("leaderboard.tabs.comments.eyebrow"),
      description: t("leaderboard.tabs.comments.description"),
    },
    {
      key: "collectors",
      label: t("leaderboard.tabs.collectors.label"),
      eyebrow: t("leaderboard.tabs.collectors.eyebrow"),
      description: t("leaderboard.tabs.collectors.description"),
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
  const podiumEntries = entries.slice(0, 3);
  const rankedEntries = entries.slice(3);
  const labels: LeaderboardLabels = {
    auraScore: t("leaderboard.metrics.auraScore"),
    auraRank: t("leaderboard.auraRank"),
    views: t("leaderboard.metrics.views"),
    likes: t("leaderboard.metrics.likes"),
    comments: t("leaderboard.metrics.comments"),
    badges: t("leaderboard.metrics.badges"),
    joined: t("leaderboard.metrics.joined"),
    legendary: t("leaderboard.metrics.legendary"),
    rare: t("leaderboard.metrics.rare"),
    openProfile: t("leaderboard.openProfile"),
  };

  return (
    <main className="yotei-scrollbar-hidden leaderboard-page" style={pageStyle}>
      <style>{`
        .leaderboard-shell {
          width: min(1240px, 100%);
          margin: 0 auto;
          display: grid;
          gap: 22px;
        }

        .leaderboard-hero,
        .leaderboard-tabs,
        .leaderboard-board,
        .leaderboard-podium,
        .leaderboard-list,
        .leaderboard-row,
        .leaderboard-podium-card {
          min-width: 0;
        }

        .leaderboard-hero,
        .leaderboard-board,
        .leaderboard-tab,
        .leaderboard-podium-card,
        .leaderboard-row,
        .leaderboard-open-profile {
          position: relative;
          overflow: hidden;
        }

        .leaderboard-tab,
        .leaderboard-podium-card,
        .leaderboard-row,
        .leaderboard-open-profile {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .leaderboard-tab:hover,
          .leaderboard-podium-card:hover,
          .leaderboard-row:hover,
          .leaderboard-open-profile:hover {
            transform: translateY(-2px);
          }
        }

        .leaderboard-tabs {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
        }

        .leaderboard-podium {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.18fr) minmax(0, 0.92fr);
          gap: 20px;
          align-items: end;
        }

        .leaderboard-podium-card.rank-1 {
          order: 2;
          transform: translateY(-12px);
          min-height: 100%;
        }

        .leaderboard-podium-card.rank-2 {
          order: 1;
          margin-top: 28px;
        }

        .leaderboard-podium-card.rank-3 {
          order: 3;
          margin-top: 28px;
        }

        .leaderboard-list {
          display: grid;
          gap: 14px;
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.8fr) minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
        }

        .leaderboard-identity {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .leaderboard-badge-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-width: 0;
        }

        .leaderboard-hero-metrics,
        .leaderboard-secondary-metrics,
        .leaderboard-row-meta,
        .leaderboard-row-score {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          min-width: 0;
        }

        .leaderboard-hero-metrics {
          align-items: stretch;
        }

        .leaderboard-row-score {
          justify-content: center;
        }

        .leaderboard-row-meta {
          justify-content: flex-start;
        }

        .leaderboard-podium-card .leaderboard-open-profile {
          width: 100%;
        }

        .leaderboard-row-cta {
          display: flex;
          justify-content: flex-end;
        }

        .leaderboard-row-identity-block {
          display: grid;
          gap: 10px;
          min-width: 0;
        }

        @media (max-width: 1100px) {
          .leaderboard-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .leaderboard-podium {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .leaderboard-podium-card.rank-1 {
            grid-column: 1 / -1;
            order: 1;
            transform: none;
          }

          .leaderboard-podium-card.rank-2,
          .leaderboard-podium-card.rank-3 {
            margin-top: 0;
          }

          .leaderboard-row {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }

          .leaderboard-row-meta,
          .leaderboard-row-cta {
            grid-column: 1 / -1;
          }

          .leaderboard-row-cta {
            justify-content: stretch;
          }

          .leaderboard-row-cta .leaderboard-open-profile {
            width: 100%;
          }
        }

        @media (max-width: 920px) {
          .leaderboard-page {
            padding: 20px 14px 34px !important;
          }

          .leaderboard-hero,
          .leaderboard-board {
            padding: 22px !important;
            border-radius: 26px !important;
          }

          .leaderboard-title {
            font-size: clamp(38px, 10vw, 50px) !important;
          }

          .leaderboard-podium {
            grid-template-columns: 1fr;
          }

          .leaderboard-podium-card.rank-1,
          .leaderboard-podium-card.rank-2,
          .leaderboard-podium-card.rank-3 {
            order: initial;
            margin-top: 0;
          }

          .leaderboard-row {
            grid-template-columns: 1fr;
          }

          .leaderboard-row-score {
            justify-content: flex-start;
          }

          .leaderboard-row-cta,
          .leaderboard-row-meta {
            grid-column: auto;
          }
        }

        @media (max-width: 640px) {
          .leaderboard-shell {
            gap: 14px;
          }

          .leaderboard-tabs {
            grid-template-columns: 1fr;
          }

          .leaderboard-hero {
            gap: 16px !important;
          }

          .leaderboard-row,
          .leaderboard-podium-card {
            padding: 16px !important;
          }

          .leaderboard-open-profile {
            width: 100%;
          }

          .leaderboard-identity {
            align-items: flex-start;
          }

          .leaderboard-rank-badge {
            min-width: 48px !important;
          }

          .leaderboard-avatar,
          .leaderboard-avatar-fallback {
            width: 52px !important;
            height: 52px !important;
            border-radius: 16px !important;
          }

          .leaderboard-hero-metrics {
            flex-direction: column;
          }

          .leaderboard-secondary-metrics,
          .leaderboard-row-meta,
          .leaderboard-row-score {
            gap: 8px;
          }
        }
      `}</style>

      <div className="leaderboard-shell">
        <section style={heroStyle} className="leaderboard-hero">
          <div style={{ display: "grid", gap: "14px", minWidth: 0 }}>
            <div style={eyebrowStyle}>{activeTabMeta.eyebrow}</div>
            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <h1 className="leaderboard-title" style={titleStyle}>
                {t("leaderboard.title")}
              </h1>
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

        <section className="leaderboard-tabs">
          {tabItems.map((item) => (
            <Link
              key={item.key}
              className="leaderboard-tab"
              href={`/leaderboard?tab=${item.key}`}
              style={tabStyle(activeTab === item.key)}
            >
              <span style={tabEyebrowStyle}>{item.eyebrow}</span>
              <span style={tabLabelStyle}>{item.label}</span>
              <span style={tabDescriptionStyle}>{item.description}</span>
            </Link>
          ))}
        </section>

        <section style={boardStyle} className="leaderboard-board">
          <header style={boardHeadStyle}>
            <div>
              <div style={sectionEyebrowStyle}>{activeTabMeta.eyebrow}</div>
              <h2 style={sectionTitleStyle}>{activeTabMeta.label}</h2>
            </div>
            <div style={boardMetaStyle}>{t("leaderboard.boardMeta")}</div>
          </header>

          {entries.length === 0 ? (
            <div style={emptyStyle}>{t("leaderboard.noData")}</div>
          ) : (
            <>
              <section className="leaderboard-podium">
                {podiumEntries.map((entry) => (
                  <LeaderboardHeroCard
                    key={`${activeTab}-podium-${entry.id}`}
                    entry={entry}
                    tab={activeTab}
                    locale={locale}
                    labels={labels}
                  />
                ))}
              </section>

              {rankedEntries.length > 0 ? (
                <section className="leaderboard-list">
                  {rankedEntries.map((entry) => (
                    <LeaderboardRankRow
                      key={`${activeTab}-${entry.id}`}
                      entry={entry}
                      tab={activeTab}
                      locale={locale}
                      labels={labels}
                    />
                  ))}
                </section>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function LeaderboardHeroCard({
  entry,
  tab,
  locale,
  labels,
}: {
  entry: LeaderboardEntry;
  tab: LeaderboardTab;
  locale: Locale;
  labels: LeaderboardLabels;
}) {
  const aura = getAuraVisualProfile(entry.auraRank);
  const highlightMetrics = getPodiumHighlightMetrics(entry, tab, locale, labels);
  const supportMetrics = getPodiumSupportMetrics(entry, tab, locale, labels);
  const showBadgeStrip = tab === "aura" || tab === "collectors";

  return (
    <article
      className={`leaderboard-podium-card rank-${entry.rank}`}
      data-aura-rank={entry.auraRank}
      style={podiumCardStyle(entry.rank, aura)}
    >
      <div style={podiumGlowStyle(aura)} />
      <div style={podiumSecondaryGlowStyle(aura)} />

      <div style={{ position: "relative", display: "grid", gap: "16px" }}>
        <div style={podiumHeaderStyle}>
          <div className="leaderboard-rank-badge" style={topRankBadgeStyle(entry.rank, aura)}>
            #{entry.rank}
          </div>
          <AuraRankPill
            auraRank={entry.auraRank}
            label={labels.auraRank}
            elevated={entry.rank === 1}
          />
        </div>

        <div style={leaderIdentityStackStyle}>
          <div className="leaderboard-identity">
            <AvatarBadge
              avatarUrl={entry.avatarUrl}
              fallback={getInitials(entry.displayName)}
              size={entry.rank === 1 ? 72 : 64}
            />
            <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
              <div style={identityRowStyle}>
                <div style={podiumNameStyle(entry.rank, aura)}>{entry.displayName}</div>
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

          {showBadgeStrip && entry.featuredBadges.length > 0 ? (
            <BadgeShowcase
              badges={entry.featuredBadges}
              extraCount={entry.extraBadgeCount}
              accentColor={aura.accentColor}
            />
          ) : null}
        </div>

        <div className="leaderboard-hero-metrics">
          {highlightMetrics.map((metric, index) => (
            <SpotlightMetric
              key={`${entry.id}-${metric.label}`}
              label={metric.label}
              value={metric.value}
              highlight={metric.highlight}
              size={index === 0 ? (entry.rank === 1 ? "hero" : "feature") : "feature"}
            />
          ))}
        </div>

        {supportMetrics.length > 0 ? (
          <div className="leaderboard-secondary-metrics">
            {supportMetrics.map((metric) => (
              <CompactMetricPill
                key={`${entry.id}-support-${metric.label}`}
                label={metric.label}
                value={metric.value}
                highlight={metric.highlight}
              />
            ))}
          </div>
        ) : null}

        <Link
          className="leaderboard-open-profile"
          href={`/${entry.username}`}
          style={primaryButtonStyle}
          target="_blank"
          rel="noreferrer"
        >
          {labels.openProfile}
        </Link>
      </div>
    </article>
  );
}

function LeaderboardRankRow({
  entry,
  tab,
  locale,
  labels,
}: {
  entry: LeaderboardEntry;
  tab: LeaderboardTab;
  locale: Locale;
  labels: LeaderboardLabels;
}) {
  const aura = getAuraVisualProfile(entry.auraRank);
  const rowHeroMetrics = getRowHeroMetrics(entry, labels);
  const rowMetaMetrics = getRowMetaMetrics(entry, tab, locale, labels);
  const showBadgeStrip = tab === "aura" || tab === "collectors";

  return (
    <article
      className="leaderboard-row"
      data-aura-rank={entry.auraRank}
      style={rowStyle(aura)}
    >
      <div className="leaderboard-row-identity-block">
        <div className="leaderboard-identity">
          <div className="leaderboard-rank-badge" style={rankBadgeStyle(aura)}>
            #{entry.rank}
          </div>
          <AvatarBadge
            avatarUrl={entry.avatarUrl}
            fallback={getInitials(entry.displayName)}
            size={56}
          />
          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
            <div style={identityRowStyle}>
              <div style={displayNameStyle}>{entry.displayName}</div>
              {entry.isPremium ? <IndicatorPill label="Premium" tone="pink" /> : null}
            </div>
            <div style={usernameStyle}>@{entry.username}</div>
          </div>
        </div>

        {showBadgeStrip && entry.featuredBadges.length > 0 ? (
          <BadgeShowcase
            badges={entry.featuredBadges}
            extraCount={entry.extraBadgeCount}
            accentColor={aura.accentColor}
          />
          ) : null}
      </div>

      <div className="leaderboard-row-score">
        {rowHeroMetrics.map((metric) => (
          <CompactMetricPill
            key={`${entry.id}-hero-${metric.label}`}
            label={metric.label}
            value={metric.value}
            highlight={metric.highlight}
            emphasis="strong"
          />
        ))}
      </div>

      <div className="leaderboard-row-meta">
        {rowMetaMetrics.map((metric) => (
          <CompactMetricPill
            key={`${entry.id}-${metric.label}`}
            label={metric.label}
            value={metric.value}
            highlight={metric.highlight}
          />
        ))}
      </div>

      <div className="leaderboard-row-cta">
        <Link
          className="leaderboard-open-profile"
          href={`/${entry.username}`}
          style={primaryButtonStyle}
          target="_blank"
          rel="noreferrer"
        >
          {labels.openProfile}
        </Link>
      </div>
    </article>
  );
}

function AvatarBadge({
  avatarUrl,
  fallback,
  size,
}: {
  avatarUrl: string | null;
  fallback: string;
  size: number;
}) {
  const sharedStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: size >= 64 ? 22 : 18,
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0f121a",
    flexShrink: 0,
  };

  return avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="leaderboard-avatar" src={avatarUrl} alt="" style={sharedStyle} />
  ) : (
    <div className="leaderboard-avatar-fallback" style={avatarFallbackStyle(sharedStyle)}>
      {fallback}
    </div>
  );
}

function AuraRankPill({
  auraRank,
  label,
  elevated = false,
}: {
  auraRank: string;
  label: string;
  elevated?: boolean;
}) {
  const aura = getAuraVisualProfile(auraRank);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        minHeight: elevated ? "30px" : "28px",
        padding: elevated ? "0 12px" : "0 10px",
        borderRadius: "999px",
        border: `1px solid ${elevated ? aura.glowColor : aura.surfaceColor}`,
        background: `linear-gradient(135deg, ${aura.surfaceColor}, rgba(255,255,255,0.04))`,
        color: aura.softColor,
        fontSize: elevated ? "12px" : "11px",
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: elevated ? "10px" : "8px",
          height: elevated ? "10px" : "8px",
          borderRadius: "999px",
          background: aura.accentColor,
          boxShadow: `0 0 18px ${aura.glowColor}`,
          flexShrink: 0,
        }}
      />
      {label} {auraRank}
    </span>
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
      ? {
          color: "#f8dd8b",
          background: "rgba(248,221,139,0.10)",
          border: "rgba(248,221,139,0.20)",
        }
      : tone === "blue"
        ? {
            color: "#b9e1ff",
            background: "rgba(125,196,255,0.10)",
            border: "rgba(125,196,255,0.18)",
          }
        : {
            color: "#ffd5e7",
            background: "rgba(255,140,203,0.12)",
            border: "rgba(255,140,203,0.20)",
          };

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

function BadgeShowcase({
  badges,
  extraCount,
  accentColor,
}: {
  badges: LeaderboardEntry["featuredBadges"];
  extraCount: number;
  accentColor: string;
}) {
  return (
    <div className="leaderboard-badge-strip">
      {badges.map((badge) => (
        <span
          key={badge.id}
          title={badge.name}
          style={badgeChipStyle(badge.color || accentColor, badge.rarity)}
        >
          <span style={badgeMonogramStyle}>{getBadgeMonogram(badge.icon || badge.name)}</span>
        </span>
      ))}
      {extraCount > 0 ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "32px",
            minHeight: "32px",
            padding: "0 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.045)",
            color: "#d5deef",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          +{extraCount}
        </span>
      ) : null}
    </div>
  );
}

function SpotlightMetric({
  label,
  value,
  highlight = false,
  size = "feature",
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
  size?: "hero" | "feature";
}) {
  const isHero = size === "hero";

  return (
    <div
      style={{
        display: "grid",
        gap: isHero ? "8px" : "6px",
        minWidth: 0,
        flex: isHero ? "1 1 220px" : "1 1 160px",
        padding: isHero ? "18px 18px" : "14px 14px",
        borderRadius: isHero ? "24px" : "20px",
        border: highlight
          ? "1px solid rgba(255,193,122,0.22)"
          : "1px solid rgba(255,255,255,0.08)",
        background: highlight
          ? "linear-gradient(180deg, rgba(255,191,120,0.12), rgba(255,255,255,0.04))"
          : "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
        boxShadow: isHero ? "0 20px 40px rgba(0,0,0,0.22)" : "0 12px 24px rgba(0,0,0,0.14)",
      }}
    >
      <div style={spotlightMetricLabelStyle}>{label}</div>
      <div style={spotlightMetricValueStyle(isHero)}>
        {formatMetricValue(value)}
      </div>
    </div>
  );
}

function CompactMetricPill({
  label,
  value,
  highlight = false,
  emphasis = "default",
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
  emphasis?: "default" | "strong";
}) {
  const isStrong = emphasis === "strong";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        padding: isStrong ? "11px 14px" : "9px 12px",
        borderRadius: "999px",
        border: highlight
          ? "1px solid rgba(255,181,113,0.20)"
          : "1px solid rgba(255,255,255,0.08)",
        background: highlight
          ? "rgba(255,181,113,0.10)"
          : isStrong
            ? "rgba(255,255,255,0.055)"
            : "rgba(255,255,255,0.03)",
        boxShadow: isStrong ? "0 10px 24px rgba(0,0,0,0.14)" : "none",
      }}
    >
      <span style={compactMetricLabelStyle}>{label}</span>
      <span style={compactMetricValueStyle(isStrong)}>{formatMetricValue(value)}</span>
    </div>
  );
}

function getPodiumHighlightMetrics(
  entry: LeaderboardEntry,
  tab: LeaderboardTab,
  locale: Locale,
  labels: LeaderboardLabels,
) {
  const metrics = getLeaderboardMetrics(entry, tab, locale, labels);
  const primaryMetric: MetricItem = {
    label: labels.auraScore,
    value: entry.auraScore,
    highlight: true,
  };

  const secondaryMetric =
    metrics.find((metric) => metric.label !== labels.auraScore) ?? null;

  return dedupeMetrics([primaryMetric, secondaryMetric].filter(Boolean) as MetricItem[]);
}

function getPodiumSupportMetrics(
  entry: LeaderboardEntry,
  tab: LeaderboardTab,
  locale: Locale,
  labels: LeaderboardLabels,
) {
  const hiddenLabels = new Set(
    getPodiumHighlightMetrics(entry, tab, locale, labels).map((metric) => metric.label),
  );

  return getLeaderboardMetrics(entry, tab, locale, labels)
    .filter((metric) => !hiddenLabels.has(metric.label))
    .slice(0, entry.rank === 1 ? 3 : 2);
}

function getRowHeroMetrics(entry: LeaderboardEntry, labels: LeaderboardLabels) {
  return [
    { label: labels.auraScore, value: entry.auraScore, highlight: true },
    { label: labels.auraRank, value: entry.auraRank },
  ];
}

function getRowMetaMetrics(
  entry: LeaderboardEntry,
  tab: LeaderboardTab,
  locale: Locale,
  labels: LeaderboardLabels,
) {
  return getLeaderboardMetrics(entry, tab, locale, labels)
    .filter((metric) => metric.label !== labels.auraScore && metric.label !== labels.auraRank)
    .slice(0, 3);
}

function dedupeMetrics(metrics: MetricItem[]) {
  const seen = new Set<string>();

  return metrics.filter((metric) => {
    if (seen.has(metric.label)) {
      return false;
    }

    seen.add(metric.label);
    return true;
  });
}

function formatMetricValue(value: number | string) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function getBadgeMonogram(value: string) {
  const cleaned = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");

  if (cleaned.length >= 2) {
    return cleaned;
  }

  const fallback = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();
  return fallback || "BD";
}

function getLeaderboardMetrics(
  entry: LeaderboardEntry,
  tab: LeaderboardTab,
  locale: Locale,
  labels: LeaderboardLabels,
): MetricItem[] {
  if (tab === "aura") {
    return [
      { label: labels.auraScore, value: entry.auraScore, highlight: true },
      { label: labels.views, value: entry.views },
      { label: labels.likes, value: entry.likes },
      { label: labels.comments, value: entry.comments },
    ];
  }

  if (tab === "likes") {
    return [
      { label: labels.likes, value: entry.likes, highlight: true },
      { label: labels.views, value: entry.views },
      { label: labels.comments, value: entry.comments },
      { label: labels.auraScore, value: entry.auraScore },
    ];
  }

  if (tab === "comments") {
    return [
      { label: labels.comments, value: entry.comments, highlight: true },
      { label: labels.likes, value: entry.likes },
      { label: labels.views, value: entry.views },
      { label: labels.auraScore, value: entry.auraScore },
    ];
  }

  if (tab === "collectors") {
    return [
      { label: labels.badges, value: entry.badgeCount, highlight: true },
      { label: labels.legendary, value: entry.legendaryBadgeCount },
      { label: labels.rare, value: entry.rareBadgeCount },
      { label: labels.auraScore, value: entry.auraScore },
    ];
  }

  if (tab === "newest") {
    return [
      { label: labels.joined, value: formatJoinedDate(entry.createdAt, locale), highlight: true },
      { label: labels.auraScore, value: entry.auraScore },
      { label: labels.views, value: entry.views },
      { label: labels.likes, value: entry.likes },
    ];
  }

  return [
    { label: labels.views, value: entry.views, highlight: true },
    { label: labels.likes, value: entry.likes },
    { label: labels.comments, value: entry.comments },
    { label: labels.auraScore, value: entry.auraScore },
  ];
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

function podiumCardStyle(
  rank: number,
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  return {
    padding: rank === 1 ? "28px" : "22px",
    borderRadius: rank === 1 ? "30px" : "26px",
    border: `1px solid ${rank === 1 ? aura.glowColor : `${aura.surfaceColor}cc`}`,
    background:
      rank === 1
        ? `linear-gradient(180deg, rgba(28,23,19,0.98), rgba(11,11,16,0.98))`
        : `linear-gradient(180deg, rgba(18,20,30,0.96), rgba(7,9,14,0.98))`,
    boxShadow:
      rank === 1
        ? `0 32px 70px rgba(0,0,0,0.34), 0 0 48px ${aura.glowColor}`
        : `0 22px 46px rgba(0,0,0,0.22), 0 0 30px ${aura.surfaceColor}22`,
  };
}

function rowStyle(
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  return {
    padding: "18px 20px",
    borderRadius: "24px",
    border: `1px solid ${aura.surfaceColor}aa`,
    background:
      "linear-gradient(180deg, rgba(15,17,27,0.98), rgba(8,9,14,0.98))",
    boxShadow: `0 18px 34px rgba(0,0,0,0.15)`,
  };
}

function topRankBadgeStyle(
  rank: number,
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  const premiumColor = rank === 1 ? "#fff2c2" : aura.softColor;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: rank === 1 ? "62px" : "56px",
    minHeight: rank === 1 ? "42px" : "38px",
    padding: "0 14px",
    borderRadius: "999px",
    border: `1px solid ${aura.glowColor}`,
    background:
      rank === 1
        ? `linear-gradient(135deg, ${aura.surfaceColor}, rgba(255,226,145,0.14))`
        : `linear-gradient(135deg, ${aura.surfaceColor}, rgba(255,255,255,0.04))`,
    color: premiumColor,
    fontSize: rank === 1 ? "16px" : "15px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    boxShadow: `0 0 26px ${aura.glowColor}`,
  };
}

function rankBadgeStyle(
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "54px",
    minHeight: "40px",
    padding: "0 12px",
    borderRadius: "999px",
    border: `1px solid ${aura.surfaceColor}`,
    background: `linear-gradient(135deg, ${aura.surfaceColor}, rgba(255,255,255,0.03))`,
    color: aura.softColor,
    fontSize: "15px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  };
}

function badgeChipStyle(color: string, rarity: string | null): CSSProperties {
  const opacity =
    rarity === "legendary" || rarity === "owner"
      ? "32"
      : rarity === "rare"
        ? "24"
        : "18";

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
    height: "32px",
    padding: "0 9px",
    borderRadius: "999px",
    border: `1px solid ${color}55`,
    background: `${color}${opacity}`,
    color: "#ffffff",
    boxShadow: `0 0 18px ${color}22`,
  };
}

function avatarFallbackStyle(sharedStyle: CSSProperties): CSSProperties {
  return {
    ...sharedStyle,
    display: "grid",
    placeItems: "center",
    color: "#ffffff",
    fontWeight: 900,
    background:
      "linear-gradient(135deg, rgba(135,118,255,0.34), rgba(255,110,168,0.26))",
  };
}

function podiumNameStyle(
  rank: number,
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  return {
    color: "#ffffff",
    fontSize: rank === 1 ? "28px" : "22px",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    overflowWrap: "anywhere",
    textShadow: rank === 1 ? `0 0 30px ${aura.glowColor}` : undefined,
  };
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 50% 0%, rgba(255,173,94,0.15), transparent 24%), radial-gradient(circle at 88% 10%, rgba(125,196,255,0.14), transparent 20%), radial-gradient(circle at 14% 16%, rgba(255,110,168,0.12), transparent 18%), linear-gradient(180deg, #06070c 0%, #030408 100%)",
  color: "#ffffff",
  padding: "28px 18px 44px",
  fontFamily: '"Space Grotesk", Arial, Helvetica, sans-serif',
};

const heroStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "18px",
  flexWrap: "wrap",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.07)",
  background:
    "linear-gradient(180deg, rgba(16,18,29,0.98), rgba(8,10,17,0.98))",
  boxShadow: "0 28px 62px rgba(0,0,0,0.28)",
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

const boardStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  padding: "26px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.07)",
  background:
    "linear-gradient(180deg, rgba(11,13,22,0.98), rgba(5,7,12,0.98))",
  boxShadow: "0 24px 54px rgba(0,0,0,0.24)",
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

const tabEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

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

const podiumHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
};

const leaderIdentityStackStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  minWidth: 0,
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
  fontSize: "19px",
  fontWeight: 800,
  overflowWrap: "anywhere",
};

const usernameStyle: CSSProperties = {
  color: "#8b99b4",
  fontSize: "13px",
};

const spotlightMetricLabelStyle: CSSProperties = {
  color: "#90a0bb",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const spotlightMetricValueStyle = (hero: boolean): CSSProperties => ({
  color: "#ffffff",
  fontSize: hero ? "clamp(28px, 4vw, 36px)" : "22px",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.05em",
});

const compactMetricLabelStyle: CSSProperties = {
  color: "#8190ac",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const compactMetricValueStyle = (strong: boolean): CSSProperties => ({
  color: "#ffffff",
  fontSize: strong ? "14px" : "13px",
  fontWeight: 800,
  lineHeight: 1,
});

const badgeMonogramStyle: CSSProperties = {
  fontSize: "10px",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "0.12em",
};

const primaryButtonStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "44px",
  padding: "0 16px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, rgba(255,173,94,0.96), rgba(255,110,168,0.9))",
  color: "#ffffff",
  fontWeight: 800,
  whiteSpace: "nowrap",
  boxShadow: "0 14px 32px rgba(255,110,168,0.18)",
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

const podiumGlowStyle = (
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties => ({
  position: "absolute",
  inset: "-24% auto auto -6%",
  width: "64%",
  height: "62%",
  background: `radial-gradient(circle, ${aura.glowColor} 0%, transparent 70%)`,
  pointerEvents: "none",
});

const podiumSecondaryGlowStyle = (
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties => ({
  position: "absolute",
  inset: "auto -10% -22% auto",
  width: "48%",
  height: "46%",
  background: `radial-gradient(circle, ${aura.surfaceColor} 0%, transparent 72%)`,
  pointerEvents: "none",
});
