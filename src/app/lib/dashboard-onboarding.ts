import type { TranslationKey } from "@/app/lib/i18n";

export type DashboardOnboardingInput = {
  emailVerified: Date | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  profileLayout: string | null;
  linkCount: number;
  socialBlockCount: number;
  templateCount: number;
};

export type DashboardChecklistItem = {
  id:
    | "verify-email"
    | "add-avatar"
    | "add-banner"
    | "choose-layout"
    | "add-first-link"
    | "add-social-block"
    | "create-template";
  icon:
    | "shield"
    | "avatar"
    | "image"
    | "layout"
    | "link"
    | "social"
    | "template";
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  isComplete: boolean;
};

export type DashboardOnboardingState = {
  items: DashboardChecklistItem[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  isLaunchReady: boolean;
  nextStep: DashboardChecklistItem | null;
};

export function buildDashboardOnboardingState(
  input: DashboardOnboardingInput,
  t: (key: TranslationKey, values?: Record<string, string | number | boolean | null | undefined>) => string,
): DashboardOnboardingState {
  const items: DashboardChecklistItem[] = [
    {
      id: "verify-email",
      icon: "shield",
      title: t("dashboard.onboarding.items.verifyEmail.title"),
      description: t("dashboard.onboarding.items.verifyEmail.description"),
      href: "/verify-email",
      ctaLabel: t("dashboard.onboarding.items.verifyEmail.cta"),
      isComplete: Boolean(input.emailVerified),
    },
    {
      id: "add-avatar",
      icon: "avatar",
      title: t("dashboard.onboarding.items.addAvatar.title"),
      description: t("dashboard.onboarding.items.addAvatar.description"),
      href: "/dashboard/profile",
      ctaLabel: t("dashboard.onboarding.items.addAvatar.cta"),
      isComplete: Boolean(input.avatarUrl),
    },
    {
      id: "add-banner",
      icon: "image",
      title: t("dashboard.onboarding.items.addBanner.title"),
      description: t("dashboard.onboarding.items.addBanner.description"),
      href: "/dashboard/profile",
      ctaLabel: t("dashboard.onboarding.items.addBanner.cta"),
      isComplete: Boolean(input.bannerUrl),
    },
    {
      id: "add-first-link",
      icon: "link",
      title: t("dashboard.onboarding.items.addFirstLink.title"),
      description: t("dashboard.onboarding.items.addFirstLink.description"),
      href: "/dashboard/links",
      ctaLabel: t("dashboard.onboarding.items.addFirstLink.cta"),
      isComplete: input.linkCount > 0,
    },
    {
      id: "choose-layout",
      icon: "layout",
      title: t("dashboard.onboarding.items.chooseLayout.title"),
      description: t("dashboard.onboarding.items.chooseLayout.description"),
      href: "/dashboard/profile",
      ctaLabel: t("dashboard.onboarding.items.chooseLayout.cta"),
      isComplete: normalizeLayout(input.profileLayout) !== "modern",
    },
    {
      id: "add-social-block",
      icon: "social",
      title: t("dashboard.onboarding.items.addSocialBlock.title"),
      description: t("dashboard.onboarding.items.addSocialBlock.description"),
      href: "/dashboard/socials",
      ctaLabel: t("dashboard.onboarding.items.addSocialBlock.cta"),
      isComplete: input.socialBlockCount > 0,
    },
    {
      id: "create-template",
      icon: "template",
      title: t("dashboard.onboarding.items.createTemplate.title"),
      description: t("dashboard.onboarding.items.createTemplate.description"),
      href: "/dashboard/templates",
      ctaLabel: t("dashboard.onboarding.items.createTemplate.cta"),
      isComplete: input.templateCount > 0,
    },
  ];

  const completedCount = items.filter((item) => item.isComplete).length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isLaunchReady = completedCount === totalCount;
  const nextStep = items.find((item) => !item.isComplete) ?? null;

  return {
    items,
    completedCount,
    totalCount,
    progressPercent,
    isLaunchReady,
    nextStep,
  };
}

function normalizeLayout(value: string | null) {
  const normalized = (value || "").trim().toLowerCase();
  return normalized || "modern";
}
