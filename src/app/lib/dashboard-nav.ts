export type DashboardNavItem = {
  href: string;
  label: string;
  icon: string;
  section: "main" | "customization" | "admin";
  adminOnly?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "[]", section: "main" },
  { href: "/dashboard/socials", label: "Socials", icon: "@", section: "main" },
  { href: "/dashboard/templates", label: "Templates", icon: "T", section: "main" },
  { href: "/dashboard/links", label: "Links", icon: "L", section: "main" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "A", section: "main" },
  { href: "/pricing", label: "Pricing", icon: "$", section: "main" },

  { href: "/dashboard/decorations", label: "Decorations", icon: "*", section: "customization" },
  { href: "/dashboard/badges", label: "Badges", icon: "B", section: "customization" },
  { href: "/dashboard/profile", label: "Profile", icon: "P", section: "customization" },

  { href: "/dashboard/admin", label: "Admin", icon: "#", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/users", label: "Users", icon: "U", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/badges", label: "Admin Badges", icon: "!", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/audit", label: "Audit", icon: "=", section: "admin", adminOnly: true },
];
