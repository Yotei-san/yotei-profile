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
  input: DashboardOnboardingInput
): DashboardOnboardingState {
  const items: DashboardChecklistItem[] = [
    {
      id: "verify-email",
      icon: "shield",
      title: "Verify email",
      description: "Confirm your inbox so locked Yotei features can be unlocked safely.",
      href: "/verify-email",
      ctaLabel: "Verify now",
      isComplete: Boolean(input.emailVerified),
    },
    {
      id: "add-avatar",
      icon: "avatar",
      title: "Add avatar",
      description: "Give your profile a recognizable face before people land on it.",
      href: "/dashboard/profile",
      ctaLabel: "Open profile",
      isComplete: Boolean(input.avatarUrl),
    },
    {
      id: "add-banner",
      icon: "image",
      title: "Add banner",
      description: "Set the mood with a premium header image or stronger visual identity.",
      href: "/dashboard/profile",
      ctaLabel: "Upload banner",
      isComplete: Boolean(input.bannerUrl),
    },
    {
      id: "add-first-link",
      icon: "link",
      title: "Add first link",
      description: "Create the first action your visitors can actually click.",
      href: "/dashboard/links",
      ctaLabel: "Add link",
      isComplete: input.linkCount > 0,
    },
    {
      id: "choose-layout",
      icon: "layout",
      title: "Choose profile layout",
      description: "Move beyond the starter presentation and pick a layout that feels intentional.",
      href: "/dashboard/profile",
      ctaLabel: "Choose layout",
      isComplete: normalizeLayout(input.profileLayout) !== "modern",
    },
    {
      id: "add-social-block",
      icon: "social",
      title: "Add a social block",
      description: "Connect a richer identity block like Discord, GitHub, Spotify or Live.",
      href: "/dashboard/socials",
      ctaLabel: "Add social",
      isComplete: input.socialBlockCount > 0,
    },
    {
      id: "create-template",
      icon: "template",
      title: "Create or use a template",
      description: "Build your first reusable template so your profile setup can be repeated and shared.",
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
