import { ReactNode } from "react";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { dashboardNavItems } from "@/app/lib/dashboard-nav";

const ACTIVE_PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

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

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      plan: true,
      premiumBadge: true,
      premiumUntil: true,
      subscriptionStatus: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

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
            ...user,
            plan: isPremiumUser(user) ? "premium" : "free",
          }}
          items={dashboardNavItems}
        />

        <section
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
