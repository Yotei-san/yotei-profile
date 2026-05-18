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
import { buildDashboardOnboardingState } from "@/app/lib/dashboard-onboarding";
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
  const sessionUser = await requireUser();

  const user = (await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      displayName: true,
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
  })) as DashboardUser | null;

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const totalClicks = resolvedUser.links.reduce(
    (sum, link) => sum + link._count.clicks,
    0
  );
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
  });

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Dashboard overview"
        title={`Welcome back, ${resolvedUser.displayName || resolvedUser.username}`}
        description="Track setup progress, keep key profile systems aligned, and focus on the next actions that make your public page feel launch ready."
        actions={
          <>
            <Link
              href={`/${resolvedUser.username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
            >
              Open profile
            </Link>
            <Link href="/dashboard/profile" style={dashboardButtonStyle("secondary")}>
              Edit profile
            </Link>
          </>
        }
        aside={
          <div style={heroStatsGridStyle}>
            <StatCard
              title="Links"
              value={String(resolvedUser.links.length)}
              hint="Clickable profile actions"
            />
            <StatCard
              title="Total clicks"
              value={String(totalClicks)}
              hint="Traffic across your links"
            />
            <StatCard
              title="Social blocks"
              value={String(resolvedUser.socialBlocks.length)}
              hint="Identity blocks configured"
            />
          </div>
        }
      />

      <DashboardOnboardingChecklist onboarding={onboarding} />

      <section style={dashboardAutoGridStyle(340)}>
        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Performance"
            title="Top links"
            description="A ranked snapshot of the destinations currently getting the most clicks."
            actions={
              <Link href="/dashboard/analytics" style={dashboardButtonStyle("secondary")}>
                Open analytics
              </Link>
            }
          />

          <div style={listStyle}>
            {topLinks.length > 0 ? (
              topLinks.map((link, index) => (
                <div key={link.id} style={rowStyle}>
                  <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
                    <div style={rowTitleStyle}>
                      #{index + 1} {link.title || "Untitled link"}
                    </div>
                    <div style={dashboardMutedTextStyle}>{link.url}</div>
                  </div>
                  <div style={dashboardTagStyle("pink")}>{link._count.clicks} clicks</div>
                </div>
              ))
            ) : (
              <DashboardEmptyState
                title="No link activity yet"
                description="Your analytics panel will start filling in as soon as visitors interact with your first published links."
              />
            )}
          </div>
        </section>

        <section style={dashboardSurfaceStyle}>
          <DashboardSectionHeading
            eyebrow="Inventory"
            title="All links"
            description="A quick reference view of the destinations currently powering your profile."
            actions={
              <Link href="/dashboard/links" style={dashboardButtonStyle("secondary")}>
                Manage links
              </Link>
            }
          />

          <div style={listStyle}>
            {resolvedUser.links.length > 0 ? (
              resolvedUser.links.map((link) => (
                <div key={link.id} style={dashboardListItemStyle}>
                  <div style={rowTitleStyle}>{link.title || "Untitled link"}</div>
                  <div style={dashboardMutedTextStyle}>{link.url}</div>
                  <div style={dashboardTagStyle("violet")}>{link._count.clicks} clicks</div>
                </div>
              ))
            ) : (
              <DashboardEmptyState
                title="No links created yet"
                description="Create your first link to give visitors a clear place to click from your profile."
                action={
                  <Link href="/dashboard/links" style={dashboardButtonStyle("primary")}>
                    Create first link
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
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
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
