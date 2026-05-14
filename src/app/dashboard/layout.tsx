import { ReactNode } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import EmailVerificationBanner from "@/app/components/EmailVerificationBanner";
import { requireUser } from "@/app/lib/auth";
import { dashboardNavItems } from "@/app/lib/dashboard-nav";
import { isEmailVerified } from "@/app/lib/email-verification";
import { prisma } from "@/app/lib/prisma";

const ACTIVE_PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

type DashboardLayoutUser = {
  username: string;
  email: string;
  emailVerified: Date | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
};

function isPremiumUser(user: {
  role: string;
  plan: string;
  premiumBadge: boolean;
  premiumUntil: Date | null;
  subscriptionStatus: string | null;
}) {
  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  const hasPremiumPlan =
    user.plan === "premium" &&
    (!user.premiumUntil || new Date(user.premiumUntil) > new Date());

  return (
    hasPremiumPlan ||
    user.premiumBadge ||
    ACTIVE_PREMIUM_STATUSES.has(user.subscriptionStatus || "")
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await requireUser();

  const user = (await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      email: true,
      emailVerified: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
    } as any,
  })) as DashboardLayoutUser | null;

  if (!user) {
    throw new Error("Usuario nao encontrado.");
  }

  const verified = isEmailVerified(user);
  const lockedHrefs = verified ? [] : ["/dashboard/socials", "/dashboard/templates"];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.06), transparent 22%), #070707",
        padding: "24px",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "22px",
          alignItems: "flex-start",
          maxWidth: "1700px",
          margin: "0 auto",
        }}
      >
        <DashboardSidebar
          user={{
            username: user.username,
            displayName: user.displayName,
            role: user.role,
            avatarUrl: user.avatarUrl,
            plan: isPremiumUser(user) ? "premium" : "free",
          }}
          items={dashboardNavItems}
          lockedHrefs={lockedHrefs}
        />

        <section
          style={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gap: "18px",
          }}
        >
          {!verified ? <EmailVerificationBanner email={user.email} /> : null}
          {children}
        </section>
      </div>
    </main>
  );
}
