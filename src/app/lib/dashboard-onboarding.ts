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
  input: DashboardOnboardingInput
): DashboardOnboardingState {
  const items: DashboardChecklistItem[] = [
    {
      id: "verify-email",
      title: "Verify email",
      description: "Confirm your inbox so locked Yotei features can be unlocked safely.",
      href: "/verify-email",
      ctaLabel: "Verify now",
      isComplete: Boolean(input.emailVerified),
    },
    {
      id: "add-avatar",
      title: "Add avatar",
      description: "Give your profile a recognizable face before people land on it.",
      href: "/dashboard/profile",
      ctaLabel: "Open profile",
      isComplete: Boolean(input.avatarUrl),
    },
    {
      id: "add-banner",
      title: "Add banner",
      description: "Set the mood with a premium header image or stronger visual identity.",
      href: "/dashboard/profile",
      ctaLabel: "Upload banner",
      isComplete: Boolean(input.bannerUrl),
    },
    {
      id: "add-first-link",
      title: "Add first link",
      description: "Create the first action your visitors can actually click.",
      href: "/dashboard/links",
      ctaLabel: "Add link",
      isComplete: input.linkCount > 0,
    },
    {
      id: "choose-layout",
      title: "Choose profile layout",
      description: "Switch from the default layout to a presentation that feels like you.",
      href: "/dashboard/profile",
      ctaLabel: "Choose layout",
      isComplete: normalizeLayout(input.profileLayout) !== "modern",
    },
    {
      id: "add-social-block",
      title: "Add a social block",
      description: "Connect a richer identity block like Discord, GitHub, Spotify or Live.",
      href: "/dashboard/socials",
      ctaLabel: "Add social",
      isComplete: input.socialBlockCount > 0,
    },
    {
      id: "create-template",
      title: "Create or use a template",
      description: "Save your profile as a reusable template and start building launch-ready presets.",
      href: "/dashboard/templates",
      ctaLabel: "Open templates",
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
