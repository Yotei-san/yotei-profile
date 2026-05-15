import Link from "next/link";
import type { CSSProperties } from "react";
import DashboardOnboardingChecklist from "@/app/dashboard/components/DashboardOnboardingChecklist";
import { requireUser } from "@/app/lib/auth";
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

  if (!user) {
    throw new Error("Usuario nao encontrado.");
  }

  const totalClicks = user.links.reduce((sum, link) => sum + link._count.clicks, 0);
  const topLinks = [...user.links]
    .sort((a, b) => b._count.clicks - a._count.clicks)
    .slice(0, 5);
  const onboarding = buildDashboardOnboardingState({
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    profileLayout: user.profileLayout,
    linkCount: user.links.length,
    socialBlockCount: user.socialBlocks.length,
    templateCount: user.createdTemplates.length,
  });

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={{ display: "grid", gap: "16px", minWidth: 0 }}>
          <div style={heroBadgeStyle}>Dashboard Overview</div>
          <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
            <h1 style={heroTitleStyle}>Welcome back, {user.displayName || user.username}</h1>
            <p style={heroTextStyle}>
              Track your setup progress, finish the essentials and keep your public
              profile feeling launch ready.
            </p>
          </div>
        </div>

        <div style={heroActionsStyle}>
          <Link href={`/${user.username}`} style={primaryActionStyle} target="_blank">
            Open profile
          </Link>
          <Link href="/dashboard/profile" style={secondaryActionStyle}>
            Edit profile
          </Link>
        </div>
      </section>

      <DashboardOnboardingChecklist onboarding={onboarding} />

      <section style={statsGridStyle}>
        <StatCard title="Links" value={String(user.links.length)} hint="Clickable profile actions" />
        <StatCard title="Total clicks" value={String(totalClicks)} hint="Traffic across your links" />
        <StatCard title="Social blocks" value={String(user.socialBlocks.length)} hint="Identity blocks configured" />
        <StatCard
          title="Template activity"
          value={String(user.createdTemplates.length)}
          hint="Templates created in your studio"
        />
      </section>

      <section style={contentGridStyle}>
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>Performance</div>
              <h2 style={panelTitleStyle}>Top links</h2>
            </div>
            <Link href="/dashboard/analytics" style={panelLinkStyle}>
              Open analytics
            </Link>
          </div>

          <div style={listStyle}>
            {topLinks.length > 0 ? (
              topLinks.map((link, index) => (
                <div key={link.id} style={rowStyle}>
                  <div style={{ minWidth: 0 }}>
                    <div style={rowTitleStyle}>
                      #{index + 1} {link.title || "Untitled link"}
                    </div>
                    <div style={rowSubtleStyle}>{link.url}</div>
                  </div>
                  <div style={countPillStyle}>{link._count.clicks} clicks</div>
                </div>
              ))
            ) : (
              <div style={emptyStyle}>You do not have links with clicks yet.</div>
            )}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>Inventory</div>
              <h2 style={panelTitleStyle}>All links</h2>
            </div>
            <Link href="/dashboard/links" style={panelLinkStyle}>
              Manage links
            </Link>
          </div>

          <div style={listStyle}>
            {user.links.length > 0 ? (
              user.links.map((link) => (
                <div key={link.id} style={stackedRowStyle}>
                  <div style={rowTitleStyle}>{link.title || "Untitled link"}</div>
                  <div style={rowSubtleStyle}>{link.url}</div>
                  <div style={inlineMetaStyle}>{link._count.clicks} clicks</div>
                </div>
              ))
            ) : (
              <div style={emptyStyle}>You have not created your first link yet.</div>
            )}
          </div>
        </div>
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
  alignItems: "center",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(255,110,168,0.12), transparent 26%), radial-gradient(circle at 82% 18%, rgba(135,118,255,0.14), transparent 22%), linear-gradient(135deg, rgba(22,14,24,0.98), rgba(8,8,12,0.98))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
};

const heroBadgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.18)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "48px",
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "60ch",
  color: "#b7c1d8",
  fontSize: "15px",
  lineHeight: 1.75,
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const actionBaseStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "46px",
  padding: "0 16px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const primaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  color: "#ffffff",
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
};

const secondaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  color: "#dbe6ff",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
};

const statCardStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  minWidth: 0,
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(9,9,12,0.92)",
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

const contentGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  minWidth: 0,
  padding: "24px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(9,9,12,0.92)",
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
};

const panelEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: 1.02,
};

const panelLinkStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "40px",
  padding: "0 14px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#dbe6ff",
  fontSize: "13px",
  fontWeight: 800,
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
  minWidth: 0,
  padding: "14px 16px",
  borderRadius: "18px",
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const stackedRowStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  minWidth: 0,
  padding: "14px 16px",
  borderRadius: "18px",
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const rowTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontWeight: 800,
};

const rowSubtleStyle: CSSProperties = {
  color: "#9eabc5",
  fontSize: "13px",
  lineHeight: 1.6,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const countPillStyle: CSSProperties = {
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.18)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "12px",
  fontWeight: 800,
};

const inlineMetaStyle: CSSProperties = {
  color: "#f9a8d4",
  fontSize: "13px",
  fontWeight: 700,
};

const emptyStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "16px",
  border: "1px dashed rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#97a3bc",
};
