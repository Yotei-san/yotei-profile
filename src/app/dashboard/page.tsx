import type { CSSProperties } from "react";
import Link from "next/link";
import DashboardOnboardingChecklist from "@/app/dashboard/components/DashboardOnboardingChecklist";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSectionHeading,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardListItemStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { redirectWithClearedSession, requireUser } from "@/app/lib/auth";
import { getAuraProgress, getAuraRank } from "@/app/lib/aura";
import { buildDashboardOnboardingState } from "@/app/lib/dashboard-onboarding";
import { createTranslator, getRequestLocale } from "@/app/lib/i18n";
import { getDashboardRankingSummary } from "@/app/lib/leaderboard";
import { prisma } from "@/app/lib/prisma";

type DashboardLink = {
  id: string;
  title: string | null;
  url: string;
  _count: {
    clicks: number;
  };
};

type DashboardUser = {
  username: string;
  displayName: string | null;
  auraScore: number;
  auraRank: string;
  emailVerified: Date | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  profileLayout: string;
  links: DashboardLink[];
  badges: Array<{ id: string }>;
  selectedDecoration: { id: string } | null;
  socialBlocks: Array<{ id: string }>;
  createdTemplates: Array<{ id: string }>;
};

export default async function DashboardPage() {
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const sessionUser = await requireUser();

  const [user, rankingSummary] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        username: true,
        displayName: true,
        auraScore: true,
        auraRank: true,
        emailVerified: true,
        avatarUrl: true,
        bannerUrl: true,
        profileLayout: true,
        links: {
          orderBy: [{ position: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            title: true,
            url: true,
            _count: {
              select: {
                clicks: true,
              },
            },
          },
        },
        badges: {
          select: {
            id: true,
          },
        },
        selectedDecoration: {
          select: {
            id: true,
          },
        },
        socialBlocks: {
          select: {
            id: true,
          },
        },
        createdTemplates: {
          select: {
            id: true,
          },
        },
      } as any,
    }) as Promise<DashboardUser | null>,
    getDashboardRankingSummary(sessionUser.id),
  ]);

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const totalClicks = resolvedUser.links.reduce(
    (sum, link) => sum + link._count.clicks,
    0
  );
  const resolvedAuraRank = resolvedUser.auraRank || getAuraRank(resolvedUser.auraScore);
  const auraProgress = getAuraProgress(resolvedUser.auraScore);
  const topLinks = [...resolvedUser.links]
    .sort((a, b) => b._count.clicks - a._count.clicks)
    .slice(0, 5);
  const onboarding = buildDashboardOnboardingState({
    emailVerified: resolvedUser.emailVerified,
    avatarUrl: resolvedUser.avatarUrl,
    bannerUrl: resolvedUser.bannerUrl,
    profileLayout: resolvedUser.profileLayout,
    linkCount: resolvedUser.links.length,
    socialBlockCount: resolvedUser.socialBlocks.length,
    templateCount: resolvedUser.createdTemplates.length,
  }, t);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow={t("dashboard.overview.eyebrow")}
        title={t("dashboard.overview.title", {
          name: resolvedUser.displayName || resolvedUser.username,
        })}
        description={t("dashboard.overview.description")}
        actions={
          <>
            <Link
              href={`/${resolvedUser.username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
              rel="noreferrer"
            >
              {t("dashboard.overview.openProfile")}
            </Link>
            <Link href="/dashboard/profile" style={dashboardButtonStyle("secondary")}>
              {t("dashboard.overview.editProfile")}
            </Link>
          </>
        }
        aside={
          <div style={heroStatsGridStyle}>
            <StatCard
              title={t("dashboard.overview.links")}
              value={String(resolvedUser.links.length)}
              hint={t("dashboard.overview.clickableActions")}
            />
            <StatCard
              title={t("dashboard.overview.totalClicks")}
              value={String(totalClicks)}
              hint={t("dashboard.overview.linkTraffic")}
            />
            <StatCard
              title={t("dashboard.overview.socialBlocks")}
              value={String(resolvedUser.socialBlocks.length)}
              hint={t("dashboard.overview.identityBlocks")}
            />
          </div>
        }
      />

      <DashboardOnboardingChecklist onboarding={onboarding} locale={locale} />

      <section style={dashboardSurfaceStyle}>
        <DashboardSectionHeading
          eyebrow={t("dashboard.overview.auraEyebrow")}
          title={t("dashboard.overview.auraTitle")}
          description={t("dashboard.overview.auraDescription")}
        />

        <AuraProgressCard
          score={resolvedUser.auraScore}
          rank={resolvedAuraRank}
          progressPercent={auraProgress.progressPercent}
          progressLabel={t("dashboard.overview.auraProgress")}
          scoreLabel={t("dashboard.overview.auraScore")}
          rankLabel={t("dashboard.overview.auraRank")}
          nextLabel={
            auraProgress.nextRank
              ? t("dashboard.overview.auraPointsToNext", {
                  count: auraProgress.pointsToNextRank,
                  rank: auraProgress.nextRank,
                })
              : t("dashboard.overview.auraMaxRank")
          }
        />
      </section>

      {rankingSummary ? (
        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow={t("dashboard.overview.leaderboardEyebrow")}
            title={t("dashboard.overview.rankingTitle")}
            description={t("dashboard.overview.rankingDescription")}
            actions={
              <Link href="/leaderboard" style={dashboardButtonStyle("secondary")}>
                {t("dashboard.overview.openLeaderboard")}
              </Link>
            }
          />

          <div style={heroStatsGridStyle}>
            <StatCard
              title={t("dashboard.overview.viewsRank")}
              value={`#${rankingSummary.viewsRank}`}
              hint={t("dashboard.overview.viewsHint")}
            />
            <StatCard
              title={t("dashboard.overview.likesRank")}
              value={`#${rankingSummary.likesRank}`}
              hint={t("dashboard.overview.likesHint")}
            />
            <StatCard
              title={t("dashboard.overview.comments")}
              value={String(rankingSummary.commentCount)}
              hint={t("dashboard.overview.commentsHint")}
            />
          </div>
        </section>
      ) : null}

      <section style={dashboardAutoGridStyle(340)}>
        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow={t("dashboard.overview.performanceEyebrow")}
            title={t("dashboard.overview.topLinks")}
            description={t("dashboard.overview.topLinksDescription")}
            actions={
              <Link href="/dashboard/analytics" style={dashboardButtonStyle("secondary")}>
                {t("dashboard.overview.openAnalytics")}
              </Link>
            }
          />

          <div style={listStyle}>
            {topLinks.length > 0 ? (
              topLinks.map((link, index) => (
                <div key={link.id} style={rowStyle}>
                  <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
                    <div style={rowTitleStyle}>
                      #{index + 1} {link.title || t("dashboard.overview.untitledLink")}
                    </div>
                    <div style={dashboardMutedTextStyle}>{link.url}</div>
                  </div>
                  <div style={dashboardTagStyle("pink")}>
                    {t("dashboard.overview.clicks", { count: link._count.clicks })}
                  </div>
                </div>
              ))
            ) : (
              <DashboardEmptyState
                title={t("dashboard.overview.noLinkActivityTitle")}
                description={t("dashboard.overview.noLinkActivityDescription")}
              />
            )}
          </div>
        </section>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow={t("dashboard.overview.inventoryEyebrow")}
            title={t("dashboard.overview.allLinks")}
            description={t("dashboard.overview.allLinksDescription")}
            actions={
              <Link href="/dashboard/links" style={dashboardButtonStyle("secondary")}>
                {t("dashboard.overview.manageLinks")}
              </Link>
            }
          />

          <div style={listStyle}>
            {resolvedUser.links.length > 0 ? (
              resolvedUser.links.map((link) => (
                <div key={link.id} style={dashboardListItemStyle}>
                  <div style={rowTitleStyle}>
                    {link.title || t("dashboard.overview.untitledLink")}
                  </div>
                  <div style={dashboardMutedTextStyle}>{link.url}</div>
                  <div style={dashboardTagStyle("violet")}>
                    {t("dashboard.overview.clicks", { count: link._count.clicks })}
                  </div>
                </div>
              ))
            ) : (
              <DashboardEmptyState
                title={t("dashboard.overview.noLinksTitle")}
                description={t("dashboard.overview.noLinksDescription")}
                action={
                  <Link href="/dashboard/links" style={dashboardButtonStyle("primary")}>
                    {t("dashboard.overview.createFirstLink")}
                  </Link>
                }
              />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <article style={statCardStyle}>
      <div style={statTitleStyle}>{title}</div>
      <div style={statValueStyle}>{value}</div>
      <div style={statHintStyle}>{hint}</div>
    </article>
  );
}

function AuraProgressCard({
  score,
  rank,
  progressPercent,
  progressLabel,
  scoreLabel,
  rankLabel,
  nextLabel,
}: {
  score: number;
  rank: string;
  progressPercent: number;
  progressLabel: string;
  scoreLabel: string;
  rankLabel: string;
  nextLabel: string;
}) {
  return (
    <article style={auraCardStyle}>
      <div style={auraHeaderRowStyle}>
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <div style={auraScoreLabelStyle}>{scoreLabel}</div>
          <div style={auraScoreValueStyle}>{score.toLocaleString()}</div>
        </div>
        <div style={auraRankChipStyle}>
          <span style={auraRankLabelStyle}>{rankLabel}</span>
          <strong style={auraRankValueStyle}>{rank}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        <div style={auraProgressLabelStyle}>{progressLabel}</div>
        <div style={auraProgressTrackStyle}>
          <div
            style={{
              ...auraProgressFillStyle,
              width: `${Math.max(0, Math.min(100, progressPercent))}%`,
            }}
          />
        </div>
        <div style={statHintStyle}>{nextLabel}</div>
      </div>
    </article>
  );
}

const heroStatsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
  gap: "12px",
};

const statCardStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "18px",
  gap: "10px",
};

const statTitleStyle: CSSProperties = {
  color: "#95a0b7",
  fontSize: "13px",
  fontWeight: 700,
};

const statValueStyle: CSSProperties = {
  fontSize: "34px",
  lineHeight: 1,
  fontWeight: 900,
  color: "#ffffff",
};

const statHintStyle: CSSProperties = {
  color: "#7f8aa3",
  fontSize: "12px",
  lineHeight: 1.6,
};

const auraCardStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(255,110,168,0.12), transparent 28%), linear-gradient(180deg, rgba(20,23,34,0.98), rgba(10,12,19,0.98))",
};

const auraHeaderRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const auraScoreLabelStyle: CSSProperties = {
  color: "#f2bfd7",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const auraScoreValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "clamp(34px, 6vw, 44px)",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.05em",
};

const auraRankChipStyle: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gap: "6px",
  minWidth: "108px",
  padding: "14px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,110,168,0.18)",
  background: "rgba(255,110,168,0.08)",
};

const auraRankLabelStyle: CSSProperties = {
  color: "#efb7cf",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const auraRankValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  lineHeight: 1,
  fontWeight: 900,
};

const auraProgressLabelStyle: CSSProperties = {
  color: "#b9c5da",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const auraProgressTrackStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  height: "12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const auraProgressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg, rgba(125,196,255,0.94), rgba(255,110,168,0.94))",
  boxShadow: "0 0 24px rgba(255,110,168,0.18)",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  padding: "16px",
  borderRadius: "20px",
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const rowTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontWeight: 800,
  overflowWrap: "anywhere",
};
