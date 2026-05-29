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
          gap: 18px;
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
          grid-template-columns: 1.25fr 1fr 1fr;
          gap: 14px;
        }

        .leaderboard-podium-card.rank-1 {
          transform: translateY(-6px);
        }

        .leaderboard-list {
          display: grid;
          gap: 12px;
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(250px, 1fr) auto;
          gap: 16px;
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

        .leaderboard-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .leaderboard-podium .leaderboard-metric-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
          }

          .leaderboard-row {
            grid-template-columns: 1fr;
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

          .leaderboard-podium-card.rank-1 {
            transform: none;
          }

          .leaderboard-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .leaderboard-metric-grid {
            grid-template-columns: 1fr;
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
  const metrics = getLeaderboardMetrics(entry, tab, locale, labels);

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

          {entry.featuredBadges.length > 0 ? (
            <BadgeShowcase
              badges={entry.featuredBadges}
              extraCount={entry.extraBadgeCount}
              accentColor={aura.accentColor}
            />
          ) : null}
        </div>

        <div className="leaderboard-metric-grid">
          {metrics.map((metric) => (
            <MetricPill
              key={`${entry.id}-${metric.label}`}
              label={metric.label}
              value={metric.value}
              highlight={metric.highlight}
            />
          ))}
        </div>

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
  const metrics = getLeaderboardMetrics(entry, tab, locale, labels);
  const showBadgeStrip = tab === "aura" || tab === "collectors";

  return (
    <article
      className="leaderboard-row"
      data-aura-rank={entry.auraRank}
      style={rowStyle(aura)}
    >
      <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
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
              <AuraRankPill auraRank={entry.auraRank} label={labels.auraRank} />
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

      <div className="leaderboard-metric-grid">
        {metrics.map((metric) => (
          <MetricPill
            key={`${entry.id}-${metric.label}`}
            label={metric.label}
            value={metric.value}
            highlight={metric.highlight}
          />
        ))}
      </div>

      <Link
        className="leaderboard-open-profile"
        href={`/${entry.username}`}
        style={primaryButtonStyle}
        target="_blank"
        rel="noreferrer"
      >
        {labels.openProfile}
      </Link>
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
          <span style={{ fontSize: "15px", lineHeight: 1 }}>{badge.icon}</span>
        </span>
      ))}
      {extraCount > 0 ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "34px",
            minHeight: "34px",
            padding: "0 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#d5deef",
            fontSize: "12px",
            fontWeight: 800,
          }}
        >
          +{extraCount}
        </span>
      ) : null}
    </div>
  );
}

function MetricPill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "5px",
        minWidth: 0,
        padding: "11px 12px",
        borderRadius: "16px",
        border: highlight
          ? "1px solid rgba(255,110,168,0.24)"
          : "1px solid rgba(255,255,255,0.07)",
        background: highlight ? "rgba(255,110,168,0.10)" : "rgba(255,255,255,0.035)",
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
    padding: rank === 1 ? "22px" : "20px",
    borderRadius: "26px",
    border: `1px solid ${rank === 1 ? aura.glowColor : aura.surfaceColor}`,
    background:
      rank === 1
        ? `linear-gradient(180deg, rgba(26,20,18,0.98), rgba(10,10,14,0.98))`
        : `linear-gradient(180deg, rgba(18,19,28,0.98), rgba(8,10,15,0.98))`,
    boxShadow:
      rank === 1
        ? `0 26px 60px rgba(0,0,0,0.28), 0 0 0 1px ${aura.surfaceColor}`
        : `0 18px 42px rgba(0,0,0,0.24)`,
  };
}

function rowStyle(
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties {
  return {
    padding: "17px",
    borderRadius: "22px",
    border: `1px solid ${aura.surfaceColor}`,
    background:
      "linear-gradient(180deg, rgba(17,19,29,0.98), rgba(9,10,15,0.98))",
    boxShadow: `0 14px 34px rgba(0,0,0,0.16)`,
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
    width: "34px",
    height: "34px",
    borderRadius: "14px",
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
    "radial-gradient(circle at top, rgba(255,110,168,0.14), transparent 22%), radial-gradient(circle at 88% 10%, rgba(125,196,255,0.16), transparent 20%), linear-gradient(180deg, #06070c 0%, #030408 100%)",
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
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
  color: "#ffffff",
  fontWeight: 800,
  whiteSpace: "nowrap",
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
  inset: "-24% auto auto -10%",
  width: "58%",
  height: "58%",
  background: `radial-gradient(circle, ${aura.glowColor} 0%, transparent 70%)`,
  pointerEvents: "none",
});

const podiumSecondaryGlowStyle = (
  aura: ReturnType<typeof getAuraVisualProfile>,
): CSSProperties => ({
  position: "absolute",
  inset: "auto -12% -24% auto",
  width: "42%",
  height: "42%",
  background: `radial-gradient(circle, ${aura.surfaceColor} 0%, transparent 72%)`,
  pointerEvents: "none",
});
