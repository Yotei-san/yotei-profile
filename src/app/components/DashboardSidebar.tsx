"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { LuMenu, LuPanelLeftClose, LuX } from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import YoteiBrandMark from "@/app/components/YoteiBrandMark";
import {
  dashboardButtonStyle,
  dashboardTagStyle,
} from "@/app/dashboard/components/DashboardUI";
import type { DashboardNavItem } from "@/app/lib/dashboard-nav";
import { useBodyScrollLock } from "@/app/components/useBodyScrollLock";

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

const panelStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  background:
    "linear-gradient(180deg, rgba(12,12,14,0.98), rgba(8,8,10,0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "28px",
  padding: "18px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const desktopPanelStyle: CSSProperties = {
  ...panelStyle,
  maxWidth: "270px",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  overscrollBehavior: "contain",
  position: "sticky",
  top: "24px",
  alignSelf: "flex-start",
};

const mobilePanelStyle: CSSProperties = {
  ...panelStyle,
  maxWidth: "none",
  maxHeight: "none",
  overflow: "visible",
};

export default function DashboardSidebar({ user, items, lockedHrefs = [] }: Props) {
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const mobileDrawerId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  const visibleItems = items.filter(
    (item) => !item.adminOnly || user.role === "admin" || user.role === "owner"
  );

  const mainItems = visibleItems.filter((item) => item.section === "main");
  const customizationItems = visibleItems.filter(
    (item) => item.section === "customization"
  );
  const adminItems = visibleItems.filter((item) => item.section === "admin");
  const isPremium = user.isPremium ?? user.plan === "premium";
  const closeMobileDrawer = () => setIsMobileDrawerOpen(false);

  useBodyScrollLock(isMobileDrawerOpen);

  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileDrawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileDrawerOpen]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 981px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileDrawerOpen(false);
      }
    };

    if (desktopMediaQuery.matches) {
      setIsMobileDrawerOpen(false);
    }

    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .dashboard-sidebar-mobile-bar {
          display: none;
        }

        .dashboard-sidebar-mobile-actions {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .dashboard-sidebar-desktop {
          width: 100%;
          max-width: 270px;
          min-width: 0;
        }

        .dashboard-sidebar-mobile-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          color: #ffffff;
          text-decoration: none;
        }

        .dashboard-sidebar-mobile-brand-mark {
          flex-shrink: 0;
        }

        .dashboard-sidebar-mobile-brand-copy {
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .dashboard-sidebar-mobile-brand-copy strong {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .dashboard-sidebar-mobile-brand-copy span {
          color: #8f9ab3;
          font-size: 11px;
          white-space: nowrap;
        }

        .dashboard-sidebar-menu-button,
        .dashboard-sidebar-close-button {
          min-width: 46px;
          min-height: 46px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
            rgba(14, 12, 20, 0.92);
          color: #f5f7ff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 16px 30px rgba(0, 0, 0, 0.22);
        }

        .dashboard-sidebar-backdrop {
          position: fixed;
          inset: 0;
          z-index: 110;
          border: 0;
          padding: 0;
          background: rgba(5, 7, 12, 0.74);
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        .dashboard-sidebar-drawer {
          position: fixed;
          top: 12px;
          left: 12px;
          bottom: 12px;
          z-index: 120;
          width: min(320px, calc(100vw - 24px));
          max-width: calc(100vw - 24px);
          display: grid;
          gap: 12px;
          overflow: hidden;
        }

        .dashboard-sidebar-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px;
        }

        .dashboard-sidebar-drawer-title {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #f5f7ff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .dashboard-sidebar-drawer-panel {
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
        }

        @media (max-width: 980px) {
          .dashboard-sidebar-mobile-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 14px 16px;
            border-radius: 24px;
            background:
              linear-gradient(180deg, rgba(12,12,14,0.98), rgba(8,8,10,0.98));
            border: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 20px 50px rgba(0,0,0,0.26);
          }

          .dashboard-sidebar-desktop {
            display: none;
          }
        }

        @media (min-width: 981px) {
          .dashboard-sidebar-backdrop,
          .dashboard-sidebar-drawer {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .dashboard-sidebar-mobile-bar {
            padding: 12px 14px;
            gap: 10px;
          }

          .dashboard-sidebar-mobile-brand {
            gap: 10px;
          }

          .dashboard-sidebar-mobile-actions {
            gap: 8px;
          }

          .dashboard-sidebar-mobile-brand-copy span {
            white-space: normal;
          }
        }

        @media (max-width: 430px) {
          .dashboard-sidebar-mobile-brand-copy span {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-sidebar-menu-button,
          .dashboard-sidebar-close-button,
          .dashboard-sidebar-backdrop,
          .dashboard-sidebar-drawer {
            transition: none !important;
          }
        }
      `}</style>

      <div className="dashboard-sidebar-mobile-bar">
        <Link href="/dashboard" className="dashboard-sidebar-mobile-brand">
          <YoteiBrandMark
            animated={false}
            className="dashboard-sidebar-mobile-brand-mark"
            intensity="calm"
            size={40}
          />
          <span className="dashboard-sidebar-mobile-brand-copy">
            <strong>Yotei Profile</strong>
            <span>{t("dashboard.sidebar.control")}</span>
          </span>
        </Link>

        <div className="dashboard-sidebar-mobile-actions">
          <LanguageSwitcher variant="compact" />

          <button
            type="button"
            className="dashboard-sidebar-menu-button"
            aria-label={
              isMobileDrawerOpen
                ? t("dashboard.sidebar.closeNavigation")
                : t("dashboard.sidebar.openNavigation")
            }
            aria-expanded={isMobileDrawerOpen}
            aria-controls={mobileDrawerId}
            onClick={() => setIsMobileDrawerOpen((current) => !current)}
          >
            {isMobileDrawerOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </div>

      <div className="dashboard-sidebar-desktop">
        <SidebarPanel
          user={user}
          pathname={pathname}
          mainItems={mainItems}
          customizationItems={customizationItems}
          adminItems={adminItems}
          lockedHrefs={lockedHrefs}
          isPremium={isPremium}
          style={desktopPanelStyle}
          t={t}
        />
      </div>

      {isMobileDrawerOpen ? (
        <>
          <button
            type="button"
            className="dashboard-sidebar-backdrop"
            aria-label={t("dashboard.sidebar.closeNavigation")}
            onClick={closeMobileDrawer}
          />

          <div
            id={mobileDrawerId}
            className="dashboard-sidebar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("dashboard.sidebar.navigation")}
          >
            <div className="dashboard-sidebar-drawer-header">
              <div className="dashboard-sidebar-drawer-title">
                <LuPanelLeftClose size={16} />
                {t("dashboard.sidebar.navigation")}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="dashboard-sidebar-close-button"
                aria-label={t("dashboard.sidebar.closeNavigation")}
                onClick={closeMobileDrawer}
              >
                <LuX size={18} />
              </button>
            </div>

            <LanguageSwitcher />

            <div className="dashboard-sidebar-drawer-panel">
              <SidebarPanel
                user={user}
                pathname={pathname}
                mainItems={mainItems}
                customizationItems={customizationItems}
                adminItems={adminItems}
                lockedHrefs={lockedHrefs}
                isPremium={isPremium}
                style={mobilePanelStyle}
                onNavigate={closeMobileDrawer}
                t={t}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

function SidebarPanel({
  user,
  pathname,
  mainItems,
  customizationItems,
  adminItems,
  lockedHrefs,
  isPremium,
  style,
  onNavigate,
  t,
}: {
  user: SidebarUser;
  pathname: string;
  mainItems: DashboardNavItem[];
  customizationItems: DashboardNavItem[];
  adminItems: DashboardNavItem[];
  lockedHrefs: string[];
  isPremium: boolean;
  style: CSSProperties;
  onNavigate?: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <aside style={style}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <YoteiBrandMark animated={false} intensity="calm" size={42} />

        <div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>
            Yotei Profile
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {t("dashboard.sidebar.control")}
          </div>
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
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName || user.username}
              style={avatarStyle}
            />
          ) : (
            <div aria-hidden="true" style={avatarFallbackStyle}>
              {getInitials(user.displayName || user.username)}
            </div>
          )}

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
            {isPremium ? t("dashboard.sidebar.premium") : t("dashboard.sidebar.free")}
          </div>
          <div
            style={{
              color: "#8f9ab3",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            {isPremium
              ? t("dashboard.sidebar.premiumActive")
              : t("dashboard.sidebar.freeReady")}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        <SidebarSection
          title="main"
          items={mainItems}
          pathname={pathname}
          lockedHrefs={lockedHrefs}
          onNavigate={onNavigate}
          t={t}
        />

        <SidebarSection
          title="customization"
          items={customizationItems}
          pathname={pathname}
          lockedHrefs={lockedHrefs}
          onNavigate={onNavigate}
          t={t}
        />

        {adminItems.length > 0 ? (
          <SidebarSection
            title="admin"
            items={adminItems}
            pathname={pathname}
            lockedHrefs={lockedHrefs}
            onNavigate={onNavigate}
            t={t}
          />
        ) : null}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <LanguageSwitcher />
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "grid",
          gap: "10px",
          paddingTop: "4px",
        }}
      >
        <Link
          href={`/${user.username}`}
          style={dashboardButtonStyle("secondary", { fullWidth: true })}
          onClick={onNavigate}
        >
          {t("dashboard.sidebar.viewPublicProfile")}
        </Link>
        <Link
          href="/dashboard/profile"
          style={dashboardButtonStyle("primary", { fullWidth: true })}
          onClick={onNavigate}
        >
          {t("dashboard.sidebar.editProfile")}
        </Link>
      </div>
    </aside>
  );
}

function getInitials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "Y"
  );
}

const avatarStyle: CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "999px",
  objectFit: "cover",
  border: "2px solid rgba(244,114,182,0.25)",
  backgroundColor: "#111",
  flexShrink: 0,
};

const avatarFallbackStyle: CSSProperties = {
  ...avatarStyle,
  display: "grid",
  placeItems: "center",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 900,
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.42), rgba(255,110,168,0.34))",
};

function SidebarSection({
  title,
  items,
  pathname,
  lockedHrefs,
  onNavigate,
  t,
}: {
  title: string;
  items: DashboardNavItem[];
  pathname: string;
  lockedHrefs: string[];
  onNavigate?: () => void;
  t: ReturnType<typeof useI18n>["t"];
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
      {groupTitle(
        title === "main"
          ? t("dashboard.sections.main")
          : title === "customization"
            ? t("dashboard.sections.customization")
            : t("dashboard.sections.admin"),
      )}
      <div style={{ display: "grid", gap: "8px" }}>
        {items.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            locked={lockedHrefs.includes(item.href)}
            onNavigate={onNavigate}
            t={t}
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
  onNavigate,
  t,
}: {
  item: DashboardNavItem;
  active: boolean;
  locked: boolean;
  onNavigate?: () => void;
  t: ReturnType<typeof useI18n>["t"];
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
      <span style={{ minWidth: 0 }}>{t(item.labelKey)}</span>
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
          {t("dashboard.sidebar.verify")}
        </span>
      ) : null}
    </>
  );

  if (locked) {
    return (
      <div
        title={t("dashboard.sidebar.verifyTooltip")}
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
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
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
