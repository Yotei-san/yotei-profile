import type { CSSProperties } from "react";
import Link from "next/link";
import ProfileAuraBadge from "@/app/components/ProfileAuraBadge";
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
  const auraLevelCopy = getAuraLevelCopy(t, resolvedAuraRank);
  const auraNextRankText = auraProgress.nextRank
    ? `${auraProgress.pointsToNextRank.toLocaleString()} ${t("common.untilRank", {
        rank: auraProgress.nextRank,
      })}`
    : t("dashboard.overview.auraMaxRank");
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

        <ProfileAuraBadge
          score={resolvedUser.auraScore}
          rank={resolvedAuraRank}
          variant="dashboard"
          auraLabel={t("common.aura")}
          rankLabel={t("common.rank")}
          nextRankLabel={t("common.nextRank")}
          nextRankText={auraNextRankText}
          description={auraLevelCopy.name}
          motivationalCopy={auraLevelCopy.description}
          progress={auraProgress}
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

function getAuraLevelCopy(
  t: ReturnType<typeof createTranslator>,
  rank: string,
) {
  switch (rank) {
    case "S":
      return {
        name: t("auraLevels.S.name"),
        description: t("auraLevels.S.description"),
      };
    case "A":
      return {
        name: t("auraLevels.A.name"),
        description: t("auraLevels.A.description"),
      };
    case "B":
      return {
        name: t("auraLevels.B.name"),
        description: t("auraLevels.B.description"),
      };
    case "C":
      return {
        name: t("auraLevels.C.name"),
        description: t("auraLevels.C.description"),
      };
    case "D":
      return {
        name: t("auraLevels.D.name"),
        description: t("auraLevels.D.description"),
      };
    default:
      return {
        name: t("auraLevels.E.name"),
        description: t("auraLevels.E.description"),
      };
  }
}
