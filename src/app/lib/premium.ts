const ACTIVE_PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

type PremiumStateInput = {
  role?: string | null;
  plan?: string | null;
  premiumBadge?: boolean | null;
  premiumUntil?: Date | null;
  subscriptionStatus?: string | null;
};

export function hasActivePremiumPlan(
  user: Pick<PremiumStateInput, "plan" | "premiumUntil">
) {
  if (user.plan !== "premium") {
    return false;
  }

  if (!user.premiumUntil) {
    return true;
  }

  return new Date(user.premiumUntil) > new Date();
}

export function hasPremiumAccess(user: PremiumStateInput) {
  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  return (
    hasActivePremiumPlan(user) ||
    Boolean(user.premiumBadge) ||
    ACTIVE_PREMIUM_STATUSES.has(user.subscriptionStatus || "")
  );
}
