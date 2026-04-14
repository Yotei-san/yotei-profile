export type DashboardNavItem = {
  href: string;
  label: string;
  icon: string;
  section: "main" | "customization" | "admin";
  adminOnly?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "▣", section: "main" },
  { href: "/dashboard/decorations", label: "Decorations", icon: "✦", section: "customization" },
  { href: "/dashboard/badges", label: "Badges", icon: "🏅", section: "customization" },
  { href: "/pricing", label: "Pricing", icon: "◈", section: "main" },

  { href: "/dashboard/admin", label: "Admin", icon: "◆", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/users", label: "Users", icon: "◉", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/badges", label: "Admin Badges", icon: "✦", section: "admin", adminOnly: true },
  { href: "/dashboard/admin/audit", label: "Audit", icon: "☰", section: "admin", adminOnly: true },
  { href: "/dashboard/profile", label: "Profile", icon: "✎", section: "customization" },
  { href: "/dashboard/links", label: "Links", icon: "🔗", section: "main" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈", section: "main" },
];