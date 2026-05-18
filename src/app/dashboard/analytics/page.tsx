import type { CSSProperties } from "react";
import Link from "next/link";
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
import { prisma } from "@/app/lib/prisma";

export default async function AnalyticsPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: {
          clicks: {
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              clicks: true,
            },
          },
        },
      },
    },
  });

  const resolvedUser = user ?? (await redirectWithClearedSession());
  const totalClicks = resolvedUser.links.reduce(
    (sum, link) => sum + link._count.clicks,
    0
  );
  const activeLinks = resolvedUser.links.filter((link) => link._count.clicks > 0).length;

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Link analytics"
        title="See which profile actions get attention."
        description="Review click totals, spot your best-performing destinations, and keep your profile optimized without leaving the dashboard."
        actions={
          <>
            <Link href="/dashboard/links" style={dashboardButtonStyle("secondary")}>
              Manage links
            </Link>
            <Link
              href={`/${resolvedUser.username}`}
              style={dashboardButtonStyle("primary")}
              target="_blank"
            >
              Open profile
            </Link>
          </>
        }
        aside={
          <div style={heroStatsStyle}>
            <div style={heroStatCardStyle}>
              <div style={heroStatValueStyle}>{totalClicks}</div>
              <div style={heroStatLabelStyle}>Total clicks</div>
            </div>
            <div style={heroStatCardStyle}>
              <div style={heroStatValueStyle}>{resolvedUser.links.length}</div>
              <div style={heroStatLabelStyle}>Tracked links</div>
            </div>
            <div style={heroStatCardStyle}>
              <div style={heroStatValueStyle}>{activeLinks}</div>
              <div style={heroStatLabelStyle}>Active links</div>
            </div>
          </div>
        }
      />

      <section style={dashboardAutoGridStyle(320)}>
        {resolvedUser.links.length > 0 ? (
          resolvedUser.links.map((link) => (
            <article key={link.id} style={dashboardSurfaceStyle}>
              <div style={headerRowStyle}>
                <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                  <DashboardSectionHeading
                    eyebrow="Tracked link"
                    title={link.title || "Untitled link"}
                    description={link.url}
                  />
                </div>

                <div style={dashboardTagStyle("pink")}>{link._count.clicks} clicks</div>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <div style={recentLabelStyle}>Recent activity</div>
                {link.clicks.length > 0 ? (
                  <div style={recentGridStyle}>
                    {link.clicks.slice(0, 10).map((click) => (
                      <div key={click.id} style={dashboardListItemStyle}>
                        <div style={recentTimeStyle}>
                          {new Date(click.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DashboardEmptyState
                    title="No clicks yet"
                    description="This link is live, but it has not received tracked clicks yet."
                  />
                )}
              </div>
            </article>
          ))
        ) : (
          <section style={dashboardSurfaceStyle}>
            <DashboardEmptyState
              title="No links to analyze yet"
              description="Create your first dashboard link and click tracking will begin automatically as visitors interact with your profile."
              action={
                <Link href="/dashboard/links" style={dashboardButtonStyle("primary")}>
                  Create first link
                </Link>
              }
            />
          </section>
        )}
      </section>
    </main>
  );
}

const heroStatsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
};

const heroStatCardStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "16px",
  gap: "8px",
};

const heroStatValueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: 900,
  lineHeight: 1,
};

const heroStatLabelStyle: CSSProperties = {
  color: "#95a0b7",
  fontSize: "12px",
  fontWeight: 700,
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const recentLabelStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const recentGridStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const recentTimeStyle: CSSProperties = {
  ...dashboardMutedTextStyle,
  color: "#d4dbe7",
  fontSize: "14px",
  fontWeight: 700,
};
