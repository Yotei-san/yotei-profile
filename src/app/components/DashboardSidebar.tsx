"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  dashboardButtonStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import type { DashboardNavItem } from "@/app/lib/dashboard-nav";

type SidebarUser = {
  username: string;
  displayName?: string | null;
  role: string;
  plan?: string;
  avatarUrl?: string | null;
  isPremium?: boolean;
};

type Props = {
  user: SidebarUser;
  items: DashboardNavItem[];
  lockedHrefs?: string[];
};

function groupTitle(label: string) {
  return (
    <div
      style={{
        color: "#7f8aa3",
        fontSize: "12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "12px",
        fontWeight: 800,
      }}
    >
      {label}
    </div>
  );
}

export default function DashboardSidebar({ user, items, lockedHrefs = [] }: Props) {
  const pathname = usePathname();

  const visibleItems = items.filter(
    (item) => !item.adminOnly || user.role === "admin" || user.role === "owner"
  );

  const mainItems = visibleItems.filter((item) => item.section === "main");
  const customizationItems = visibleItems.filter(
    (item) => item.section === "customization"
  );
  const adminItems = visibleItems.filter((item) => item.section === "admin");
  const isPremium = user.isPremium ?? user.plan === "premium";

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: "100%",
        maxWidth: "270px",
        minWidth: 0,
        overflow: "hidden",
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
      <style jsx>{`
        @media (max-width: 980px) {
          .dashboard-sidebar {
            max-width: none;
            height: auto;
            position: static;
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 8px 16px",
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
            flexShrink: 0,
          }}
        >
          Y
        </div>

        <div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>
            yotei profile
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>dashboard control</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px",
          borderRadius: "22px",
          background:
            "radial-gradient(circle at top left, rgba(255,110,168,0.12), transparent 42%), rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <img
            src={user.avatarUrl || "https://placehold.co/100x100?text=Y"}
            alt={user.displayName || user.username}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "999px",
              objectFit: "cover",
              border: "2px solid rgba(244,114,182,0.25)",
              backgroundColor: "#111",
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0, display: "grid", gap: "4px" }}>
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
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={dashboardTagStyle(isPremium ? "pink" : "violet")}>
            {isPremium ? "Premium" : "Free"}
          </div>
          <div
            style={{
              color: "#8f9ab3",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            {isPremium ? "Premium profile active" : "Upgrade-ready workspace"}
          </div>
        </div>
      </div>

      <div
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
          display: "grid",
          gap: "18px",
        }}
      >
        <SidebarSection
          title="main"
          items={mainItems}
          pathname={pathname}
          lockedHrefs={lockedHrefs}
        />

        <SidebarSection
          title="customization"
          items={customizationItems}
          pathname={pathname}
          lockedHrefs={lockedHrefs}
        />

        {adminItems.length > 0 ? (
          <SidebarSection
            title="admin"
            items={adminItems}
            pathname={pathname}
            lockedHrefs={lockedHrefs}
          />
        ) : null}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "grid",
          gap: "10px",
          paddingTop: "4px",
        }}
      >
        <Link href={`/${user.username}`} style={dashboardButtonStyle("secondary", { fullWidth: true })}>
          View public profile
        </Link>
        <Link href="/dashboard/profile" style={dashboardButtonStyle("primary", { fullWidth: true })}>
          Edit profile
        </Link>
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  items,
  pathname,
  lockedHrefs,
}: {
  title: string;
  items: DashboardNavItem[];
  pathname: string;
  lockedHrefs: string[];
}) {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
        backgroundColor: "rgba(255,255,255,0.02)",
        padding: "14px",
      }}
    >
      {groupTitle(title)}
      <div style={{ display: "grid", gap: "8px" }}>
        {items.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            locked={lockedHrefs.includes(item.href)}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  locked,
}: {
  item: DashboardNavItem;
  active: boolean;
  locked: boolean;
}) {
  const content = (
    <>
      <span
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
          fontSize: "13px",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      <span style={{ minWidth: 0 }}>{item.label}</span>
      {locked ? (
        <span
          style={{
            marginLeft: "auto",
            minHeight: "24px",
            padding: "0 8px",
            borderRadius: "999px",
            border: "1px solid rgba(255,110,168,0.2)",
            backgroundColor: "rgba(255,110,168,0.08)",
            color: "#ffd7e8",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          Verify
        </span>
      ) : null}
    </>
  );

  if (locked) {
    return (
      <div
        title="Verify your email to unlock this area."
        style={{
          color: "#8d93a2",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: "18px",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 700,
          cursor: "not-allowed",
          minWidth: 0,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      style={{
        textDecoration: "none",
        color: active ? "#ffffff" : "#c7c9d1",
        background: active
          ? "linear-gradient(135deg, rgba(236,72,153,0.16), rgba(168,85,247,0.12))"
          : "rgba(255,255,255,0.02)",
        border: active
          ? "1px solid rgba(244,114,182,0.22)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: "18px",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        fontWeight: active ? 800 : 700,
        boxShadow: active ? "0 12px 30px rgba(244,114,182,0.12)" : "none",
      }}
    >
      {content}
    </Link>
  );
}
