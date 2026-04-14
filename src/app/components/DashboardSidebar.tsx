"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "@/app/lib/dashboard-nav";

type SidebarUser = {
  username: string;
  displayName?: string | null;
  role: string;
  plan?: string;
  avatarUrl?: string | null;
};

type Props = {
  user: SidebarUser;
  items: DashboardNavItem[];
};

function groupTitle(label: string) {
  return (
    <div
      style={{
        color: "#6b7280",
        fontSize: "12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "10px",
        fontWeight: 800,
      }}
    >
      {label}
    </div>
  );
}

export default function DashboardSidebar({ user, items }: Props) {
  const pathname = usePathname();

  const visibleItems = items.filter((item) => !item.adminOnly || user.role === "admin" || user.role === "owner");

  const mainItems = visibleItems.filter((item) => item.section === "main");
  const customizationItems = visibleItems.filter((item) => item.section === "customization");
  const adminItems = visibleItems.filter((item) => item.section === "admin");

  const plan = user.plan || "free";

  return (
    <aside
      style={{
        width: "270px",
        minWidth: "270px",
        background:
          "linear-gradient(180deg, rgba(12,12,14,0.98), rgba(8,8,10,0.98))",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "28px",
        padding: "18px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        height: "calc(100vh - 48px)",
        position: "sticky",
        top: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(244,114,182,0.28), rgba(168,85,247,0.22))",
            border: "1px solid rgba(244,114,182,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            color: "#f9a8d4",
          }}
        >
          Y
        </div>

        <div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>yotei profile</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            dashboard control
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: "18px",
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={user.avatarUrl || "https://placehold.co/100x100?text=Y"}
          alt={user.displayName || user.username}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "999px",
            objectFit: "cover",
            border: "2px solid rgba(244,114,182,0.25)",
            backgroundColor: "#111",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.displayName || user.username}
          </div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>@{user.username}</div>
          <div
            style={{
              display: "inline-flex",
              marginTop: "6px",
              padding: "4px 8px",
              borderRadius: "999px",
              backgroundColor:
                plan === "premium"
                  ? "rgba(236,72,153,0.12)"
                  : "rgba(255,255,255,0.06)",
              border:
                plan === "premium"
                  ? "1px solid rgba(236,72,153,0.22)"
                  : "1px solid rgba(255,255,255,0.08)",
              color: plan === "premium" ? "#f9a8d4" : "#d1d5db",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {plan === "premium" ? "PREMIUM" : "FREE"}
          </div>
        </div>
      </div>

      <div style={{ overflowY: "auto", paddingRight: "4px" }}>
        <div style={{ marginBottom: "18px" }}>
          {groupTitle("main")}
          <div style={{ display: "grid", gap: "8px" }}>
            {mainItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "18px" }}>
          {groupTitle("customization")}
          <div style={{ display: "grid", gap: "8px" }}>
            {customizationItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>
        </div>

        {adminItems.length > 0 ? (
          <div style={{ marginBottom: "18px" }}>
            {groupTitle("admin")}
            <div style={{ display: "grid", gap: "8px" }}>
              {adminItems.map((item) => (
                <SidebarLink key={item.href} item={item} active={pathname === item.href} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "grid",
          gap: "10px",
        }}
      >
        <Link href={`/${user.username}`} style={footerButtonStyle("#38bdf8")}>
          Ver perfil público
        </Link>
        <Link href="/dashboard/profile" style={footerButtonStyle("#f472b6")}>
          Editar perfil
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: DashboardNavItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      style={{
        textDecoration: "none",
        color: active ? "#ffffff" : "#c7c9d1",
        background: active
          ? "linear-gradient(135deg, rgba(236,72,153,0.16), rgba(168,85,247,0.12))"
          : "transparent",
        border: active
          ? "1px solid rgba(244,114,182,0.22)"
          : "1px solid transparent",
        borderRadius: "16px",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: active ? 800 : 700,
      }}
    >
      <span
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          fontSize: "13px",
        }}
      >
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

function footerButtonStyle(accent: string): React.CSSProperties {
  return {
    textDecoration: "none",
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: "16px",
    border: `1px solid ${accent}22`,
    backgroundColor: `${accent}10`,
    color: accent,
    fontWeight: 800,
  };
}