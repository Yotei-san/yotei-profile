export type DashboardNavItem = {
  href: string;
  labelKey:
    | "dashboard.nav.overview"
    | "dashboard.nav.socials"
    | "dashboard.nav.templates"
    | "dashboard.nav.links"
    | "dashboard.nav.analytics"
    | "dashboard.nav.pricing"
    | "dashboard.nav.decorations"
    | "dashboard.nav.badges"
    | "dashboard.nav.profile"
    | "dashboard.nav.admin"
    | "dashboard.nav.users"
    | "dashboard.nav.adminBadges"
    | "dashboard.nav.audit";
  icon: string;
  section: "main" | "customization" | "admin";
  adminOnly?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", labelKey: "dashboard.nav.overview", icon: "[]", section: "main" },
  { href: "/dashboard/socials", labelKey: "dashboard.nav.socials", icon: "@", section: "main" },
  { href: "/dashboard/templates", labelKey: "dashboard.nav.templates", icon: "T", section: "main" },
  { href: "/dashboard/links", labelKey: "dashboard.nav.links", icon: "L", section: "main" },
  { href: "/dashboard/analytics", labelKey: "dashboard.nav.analytics", icon: "A", section: "main" },
  { href: "/pricing", labelKey: "dashboard.nav.pricing", icon: "$", section: "main" },

  { href: "/dashboard/decorations", labelKey: "dashboard.nav.decorations", icon: "*", section: "customization" },
  { href: "/dashboard/badges", labelKey: "dashboard.nav.badges", icon: "B", section: "customization" },
  { href: "/dashboard/profile", labelKey: "dashboard.nav.profile", icon: "P", section: "customization" },

  { href: "/dashboard/admin", labelKey: "dashboard.nav.admin", icon: "#", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/users", labelKey: "dashboard.nav.users", icon: "U", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/badges", labelKey: "dashboard.nav.adminBadges", icon: "!", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/audit", labelKey: "dashboard.nav.audit", icon: "=", section: "admin", adminOnly: true },
];
