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
import { getUserAuraQuestProgressSummary } from "@/app/lib/aura-quests-server";
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

  const [user, rankingSummary, questProgress] = await Promise.all([
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
    getUserAuraQuestProgressSummary(sessionUser.id),
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

      <section style={dashboardSurfaceStyle}>
        <DashboardSectionHeading
          eyebrow={t("common.profileProgress")}
          title={t("common.questCompletion")}
          description={t("dashboard.overview.questProgressDescription")}
        />

        <QuestProgressCard
          completionPercent={questProgress.completionPercent}
          completedCount={questProgress.completedCount}
          remainingCount={questProgress.remainingCount}
          totalCount={questProgress.totalCount}
          currentObjective={
            questProgress.currentQuestProgress
              ? getQuestTitle(t, questProgress.currentQuestProgress.quest.id)
              : null
          }
          currentProgress={
            questProgress.currentQuestProgress
              ? `${questProgress.currentQuestProgress.current.toLocaleString()} / ${questProgress.currentQuestProgress.target.toLocaleString()}`
              : null
          }
          nextReward={
            questProgress.currentQuestProgress
              ? `+${questProgress.currentQuestProgress.nextAuraReward.toLocaleString()} ${t("common.aura")}`
              : null
          }
          completionLabel={t("common.questCompletion")}
          completedLabel={t("common.completed")}
          remainingLabel={t("common.remaining")}
          rewardLabel={t("common.reward")}
          milestoneLabel={t("common.milestone")}
          progressLabel={t("common.progress")}
          completeStateLabel={t("dashboard.overview.allAuraQuestsComplete")}
          maxStateLabel={t("dashboard.overview.maxProgress")}
          allRewardsClaimedLabel={t("dashboard.overview.allRewardsClaimed")}
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

function QuestProgressCard({
  completionPercent,
  completedCount,
  remainingCount,
  totalCount,
  currentObjective,
  currentProgress,
  nextReward,
  completionLabel,
  completedLabel,
  remainingLabel,
  rewardLabel,
  milestoneLabel,
  progressLabel,
  completeStateLabel,
  maxStateLabel,
  allRewardsClaimedLabel,
}: {
  completionPercent: number;
  completedCount: number;
  remainingCount: number;
  totalCount: number;
  currentObjective: string | null;
  currentProgress: string | null;
  nextReward: string | null;
  completionLabel: string;
  completedLabel: string;
  remainingLabel: string;
  rewardLabel: string;
  milestoneLabel: string;
  progressLabel: string;
  completeStateLabel: string;
  maxStateLabel: string;
  allRewardsClaimedLabel: string;
}) {
  return (
    <article style={questCardStyle}>
      <div style={questHeaderStyle}>
        <div style={{ display: "grid", gap: "6px", minWidth: 0 }}>
          <div style={questKickerStyle}>{completionLabel}</div>
          <div style={questCompletionValueStyle}>
            {completedCount} / {totalCount}
          </div>
        </div>
        <div style={questPercentChipStyle}>{completionPercent}%</div>
      </div>

      <div style={questProgressTrackStyle}>
        <div
          style={{
            ...questProgressFillStyle,
            width: `${Math.max(0, Math.min(100, completionPercent))}%`,
          }}
        />
      </div>

      <div style={heroStatsGridStyle}>
        <StatCard
          title={completedLabel}
          value={completedCount.toLocaleString()}
          hint={progressLabel}
        />
        <StatCard
          title={remainingLabel}
          value={remainingCount.toLocaleString()}
          hint={milestoneLabel}
        />
      </div>

      <div style={questMetaGridStyle}>
        <div style={questMetaItemStyle}>
          <div style={questMetaLabelStyle}>{milestoneLabel}</div>
          <div style={questMetaValueStyle}>
            {currentObjective ?? completeStateLabel}
          </div>
        </div>
        <div style={questMetaItemStyle}>
          <div style={questMetaLabelStyle}>{progressLabel}</div>
          <div style={questMetaValueStyle}>{currentProgress ?? maxStateLabel}</div>
        </div>
        <div style={questMetaItemStyle}>
          <div style={questMetaLabelStyle}>{rewardLabel}</div>
          <div style={questMetaValueStyle}>{nextReward ?? allRewardsClaimedLabel}</div>
        </div>
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

const questCardStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(125,211,252,0.12), transparent 28%), linear-gradient(180deg, rgba(14,18,28,0.98), rgba(8,10,17,0.98))",
};

const questHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const questKickerStyle: CSSProperties = {
  color: "#9fdcff",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const questCompletionValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "clamp(30px, 5vw, 42px)",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.05em",
};

const questPercentChipStyle: CSSProperties = {
  minWidth: "78px",
  minHeight: "42px",
  padding: "0 14px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(125,211,252,0.18)",
  background: "rgba(125,211,252,0.09)",
  color: "#eef8ff",
  fontSize: "16px",
  fontWeight: 900,
};

const questProgressTrackStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  height: "12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const questProgressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg, rgba(125,211,252,0.98), rgba(244,114,182,0.92))",
  boxShadow: "0 0 24px rgba(125,211,252,0.24)",
};

const questMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: "12px",
};

const questMetaItemStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const questMetaLabelStyle: CSSProperties = {
  color: "#90a0bb",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const questMetaValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 800,
  lineHeight: 1.5,
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

function getQuestTitle(
  t: ReturnType<typeof createTranslator>,
  questId: string,
) {
  switch (questId) {
    case "addAvatar":
      return t("quests.items.addAvatar.title");
    case "addBanner":
      return t("quests.items.addBanner.title");
    case "writeBio":
      return t("quests.items.writeBio.title");
    case "addFirstLink":
      return t("quests.items.addFirstLink.title");
    case "addSpotify":
      return t("quests.items.addSpotify.title");
    case "addDiscord":
      return t("quests.items.addDiscord.title");
    case "firstLike":
      return t("quests.items.firstLike.title");
    case "tenLikes":
      return t("quests.items.tenLikes.title");
    case "firstComment":
      return t("quests.items.firstComment.title");
    case "fiveComments":
      return t("quests.items.fiveComments.title");
    case "oneHundredViews":
      return t("quests.items.oneHundredViews.title");
    case "oneThousandViews":
      return t("quests.items.oneThousandViews.title");
    case "firstBadge":
      return t("quests.items.firstBadge.title");
    case "rareBadge":
      return t("quests.items.rareBadge.title");
    case "legendaryBadge":
      return t("quests.items.legendaryBadge.title");
    default:
      return questId;
  }
}
