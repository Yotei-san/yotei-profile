import Link from "next/link";
import type { CSSProperties } from "react";
import {
  LuImage,
  LuLayoutTemplate,
  LuLink,
  LuMailCheck,
  LuSparkles,
  LuUserRound,
  LuWaypoints,
} from "react-icons/lu";
import type {
  DashboardChecklistItem,
  DashboardOnboardingState,
} from "@/app/lib/dashboard-onboarding";
import { createTranslator, type Locale } from "@/app/lib/i18n";

type Props = {
  onboarding: DashboardOnboardingState;
  locale: Locale;
};

export default function DashboardOnboardingChecklist({ onboarding, locale }: Props) {
  const t = createTranslator(locale);

  return (
    <section style={panelStyle}>
      <div style={headerRowStyle}>
        <div style={{ display: "grid", gap: "12px", minWidth: 0 }}>
          <div style={badgeStyle}>{t("dashboard.onboarding.badge")}</div>
          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
            <h2 style={titleStyle}>
              {onboarding.isLaunchReady
                ? t("dashboard.onboarding.readyTitle")
                : t("dashboard.onboarding.pendingTitle")}
            </h2>
            <p style={descriptionStyle}>
              {onboarding.isLaunchReady
                ? t("dashboard.onboarding.readyDescription")
                : t("dashboard.onboarding.pendingDescription")}
            </p>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryKickerStyle}>{t("dashboard.onboarding.completion")}</div>
          <div style={summaryValueStyle}>{onboarding.progressPercent}%</div>
          <div style={summaryLabelStyle}>
            {t("dashboard.onboarding.completedSummary", {
              completed: onboarding.completedCount,
              total: onboarding.totalCount,
            })}
          </div>
        </div>
      </div>

      <div style={progressShellStyle}>
        <div style={progressTrackStyle} aria-hidden="true">
          <div
            style={{
              ...progressFillStyle,
              width: `${onboarding.progressPercent}%`,
            }}
          />
        </div>

        <div style={progressMetaRowStyle}>
          <div style={metaPillStyle}>
            {onboarding.isLaunchReady
              ? t("dashboard.onboarding.allComplete")
              : onboarding.nextStep
                ? t("dashboard.onboarding.next", {
                    title: onboarding.nextStep.title,
                  })
                : t("dashboard.onboarding.synced")}
          </div>
          <div style={metaTextStyle}>
            {onboarding.isLaunchReady
              ? t("dashboard.onboarding.readyTitle")
              : t("dashboard.onboarding.progressLabel")}
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {onboarding.items.map((item, index) => (
          <article
            key={item.id}
            style={item.isComplete ? completeCardStyle : itemCardStyle}
          >
            <div style={cardTopRowStyle}>
              <div
                style={
                  item.isComplete
                    ? completeStepPillStyle
                    : incompleteStepPillStyle
                }
              >
                {t("dashboard.onboarding.step", { index: index + 1 })}
              </div>

              <div
                style={
                  item.isComplete ? completeBadgeStyle : incompleteBadgeStyle
                }
              >
                {item.isComplete
                  ? t("dashboard.onboarding.completed")
                  : t("dashboard.onboarding.incomplete")}
              </div>
            </div>

            <div style={itemHeaderStyle}>
              <div
                style={
                  item.isComplete ? completeIconWrapStyle : iconWrapStyle
                }
              >
                <ChecklistIcon item={item} />
              </div>

              <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
                <div style={itemTitleStyle}>{item.title}</div>
                <div style={itemDescriptionStyle}>{item.description}</div>
              </div>
            </div>

            <div style={itemFooterStyle}>
              <div style={itemHintStyle}>
                {item.isComplete
                  ? t("dashboard.onboarding.completeHint")
                  : t("dashboard.onboarding.incompleteHint")}
              </div>

              <Link
                href={item.href}
                style={item.isComplete ? secondaryLinkStyle : primaryLinkStyle}
              >
                {item.isComplete ? t("dashboard.onboarding.review") : item.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChecklistIcon({ item }: { item: DashboardChecklistItem }) {
  if (item.icon === "shield") {
    return <LuMailCheck size={18} />;
  }

  if (item.icon === "avatar") {
    return <LuUserRound size={18} />;
  }

  if (item.icon === "image") {
    return <LuImage size={18} />;
  }

  if (item.icon === "layout") {
    return <LuLayoutTemplate size={18} />;
  }

  if (item.icon === "link") {
    return <LuLink size={18} />;
  }

  if (item.icon === "social") {
    return <LuWaypoints size={18} />;
  }

  return <LuSparkles size={18} />;
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  padding: "clamp(20px, 3vw, 28px)",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(135,118,255,0.18), transparent 28%), radial-gradient(circle at left center, rgba(255,110,168,0.12), transparent 26%), linear-gradient(180deg, rgba(17,16,25,0.98), rgba(8,8,14,0.98))",
  boxShadow: "0 28px 60px rgba(0,0,0,0.24)",
};

const headerRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  alignItems: "start",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,110,168,0.2)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 42px)",
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: "62ch",
  color: "#b8c4dc",
  fontSize: "15px",
  lineHeight: 1.75,
};

const summaryCardStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: "8px",
  alignContent: "start",
  justifyItems: "start",
  padding: "18px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
};

const summaryKickerStyle: CSSProperties = {
  color: "#91a1c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const summaryValueStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: 0.95,
  fontWeight: 900,
  color: "#ffffff",
};

const summaryLabelStyle: CSSProperties = {
  color: "#a8b5ce",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: 1.6,
};

const progressShellStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: "12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.06)",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.06)",
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg, rgba(135,118,255,0.98), rgba(255,110,168,0.94))",
};

const progressMetaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const metaPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(135,118,255,0.18)",
  backgroundColor: "rgba(135,118,255,0.08)",
  color: "#dcd7ff",
  fontSize: "12px",
  fontWeight: 800,
};

const metaTextStyle: CSSProperties = {
  color: "#8f9ab3",
  fontSize: "13px",
  lineHeight: 1.6,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "14px",
};

const itemCardStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  minWidth: 0,
  padding: "18px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
};

const completeCardStyle: CSSProperties = {
  ...itemCardStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  background:
    "linear-gradient(180deg, rgba(15,28,24,0.82), rgba(10,15,14,0.82))",
};

const cardTopRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const stepPillBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const incompleteStepPillStyle: CSSProperties = {
  ...stepPillBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#d6def0",
};

const completeStepPillStyle: CSSProperties = {
  ...stepPillBaseStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  backgroundColor: "rgba(52,211,153,0.10)",
  color: "#bbf7d0",
};

const statusBadgeBaseStyle: CSSProperties = {
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const completeBadgeStyle: CSSProperties = {
  ...statusBadgeBaseStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  backgroundColor: "rgba(52,211,153,0.10)",
  color: "#bbf7d0",
};

const incompleteBadgeStyle: CSSProperties = {
  ...statusBadgeBaseStyle,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#d6def0",
};

const itemHeaderStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "14px",
  alignItems: "start",
};

const iconWrapStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.05)",
  color: "#f7f9ff",
  flexShrink: 0,
};

const completeIconWrapStyle: CSSProperties = {
  ...iconWrapStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  backgroundColor: "rgba(52,211,153,0.10)",
  color: "#bbf7d0",
};

const itemTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 800,
  lineHeight: 1.2,
};

const itemDescriptionStyle: CSSProperties = {
  color: "#aebad1",
  fontSize: "13px",
  lineHeight: 1.65,
};

const itemFooterStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const itemHintStyle: CSSProperties = {
  color: "#8f9ab3",
  fontSize: "12px",
  lineHeight: 1.6,
  maxWidth: "28ch",
};

const linkBaseStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "40px",
  padding: "0 14px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const primaryLinkStyle: CSSProperties = {
  ...linkBaseStyle,
  color: "#ffffff",
  background:
    "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
};

const secondaryLinkStyle: CSSProperties = {
  ...linkBaseStyle,
  color: "#dbe6ff",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};
