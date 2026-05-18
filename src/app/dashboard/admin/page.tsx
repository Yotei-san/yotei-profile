import type { CSSProperties } from "react";
import Link from "next/link";
import {
  DashboardPageHeader,
  dashboardAutoGridStyle,
  dashboardButtonStyle,
  dashboardMutedTextStyle,
  dashboardPageStyle,
  dashboardSurfaceStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

function AdminCard({
  href,
  title,
  description,
  accent,
  eyebrow,
}: {
  href: string;
  title: string;
  description: string;
  accent: "pink" | "violet" | "green";
  eyebrow: string;
}) {
  return (
    <Link
      href={href}
      style={{
        ...dashboardSurfaceStyle,
        textDecoration: "none",
        color: "#fff",
      }}
    >
      <div style={dashboardTagStyle(accent)}>{eyebrow}</div>
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={cardTitleStyle}>{title}</div>
        <div style={dashboardMutedTextStyle}>{description}</div>
      </div>
      <div style={cardActionStyle}>Open panel</div>
    </Link>
  );
}

export default async function AdminHomePage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  return (
    <main style={dashboardPageStyle}>
      <DashboardPageHeader
        eyebrow="Admin control center"
        title="Manage Yotei operations from one aligned surface."
        description="Access the moderation, account, badge, and audit tools that power the protected side of the platform."
        actions={
          <>
            <Link href="/dashboard" style={dashboardButtonStyle("secondary")}>
              Main dashboard
            </Link>
            <Link href="/dashboard/badges" style={dashboardButtonStyle("primary")}>
              Open badges
            </Link>
          </>
        }
      />

      <section style={dashboardAutoGridStyle(260)}>
        <AdminCard
          href="/dashboard/admin/users"
          title="Accounts"
          description="List accounts, inspect profiles, ban users, and manage admin access."
          accent="pink"
          eyebrow="Users"
        />
        <AdminCard
          href="/dashboard/admin/badges"
          title="Badges"
          description="Grant or revoke badges manually when moderation or ops requires it."
          accent="violet"
          eyebrow="Badges"
        />
        <AdminCard
          href="/dashboard/admin/audit"
          title="Audit log"
          description="Review internal admin actions and keep protected workflows traceable."
          accent="green"
          eyebrow="Audit"
        />
        <AdminCard
          href="/dashboard"
          title="Back"
          description="Return to the main dashboard workspace without leaving the admin section."
          accent="violet"
          eyebrow="Navigation"
        />
      </section>
    </main>
  );
}

const cardTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: 800,
  lineHeight: 1.05,
};

const cardActionStyle: CSSProperties = {
  color: "#dbe6ff",
  fontSize: "14px",
  fontWeight: 800,
};
