import Link from "next/link";
import type { CSSProperties } from "react";
import type { DashboardOnboardingState } from "@/app/lib/dashboard-onboarding";

type Props = {
  onboarding: DashboardOnboardingState;
};

export default function DashboardOnboardingChecklist({ onboarding }: Props) {
  return (
    <section style={panelStyle}>
      <div style={headerRowStyle}>
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <div style={badgeStyle}>Yotei Onboarding</div>
          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
            <h2 style={titleStyle}>
              {onboarding.isLaunchReady
                ? "Profile launch ready"
                : "Complete your Yotei profile setup"}
            </h2>
            <p style={descriptionStyle}>
              {onboarding.isLaunchReady
                ? "Your essentials are in place. The profile is ready to feel polished, complete and public-facing."
                : "Knock out the key setup steps below so your profile looks intentional and visitors know where to click next."}
            </p>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div style={summaryValueStyle}>{onboarding.progressPercent}%</div>
          <div style={summaryLabelStyle}>
            {onboarding.completedCount} of {onboarding.totalCount} completed
          </div>
        </div>
      </div>

      <div style={progressTrackStyle} aria-hidden="true">
        <div
          style={{
            ...progressFillStyle,
            width: `${onboarding.progressPercent}%`,
          }}
        />
      </div>

      <div style={metaRowStyle}>
        <div style={metaPillStyle}>
          {onboarding.isLaunchReady
            ? "All systems ready"
            : onboarding.nextStep
              ? `Next step: ${onboarding.nextStep.title}`
              : "Checklist in sync"}
        </div>
        <div style={metaTextStyle}>
          Premium launch checklist for profile basics, identity and content setup.
        </div>
      </div>

      <div style={gridStyle}>
        {onboarding.items.map((item) => (
          <article key={item.id} style={item.isComplete ? completeCardStyle : itemCardStyle}>
            <div style={{ display: "grid", gap: "14px", minWidth: 0 }}>
              <div style={itemTopRowStyle}>
                <div style={itemTitleWrapStyle}>
                  <div style={itemTitleStyle}>{item.title}</div>
                  <div style={itemDescriptionStyle}>{item.description}</div>
                </div>

                <div style={item.isComplete ? completeBadgeStyle : incompleteBadgeStyle}>
                  {item.isComplete ? "Completed" : "Incomplete"}
                </div>
              </div>

              <div style={itemFooterStyle}>
                <div style={itemHintStyle}>
                  {item.isComplete
                    ? "This step is done."
                    : "Complete this step to improve your setup progress."}
                </div>
                <Link href={item.href} style={item.isComplete ? secondaryLinkStyle : primaryLinkStyle}>
                  {item.isComplete ? "Review" : item.ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top right, rgba(135,118,255,0.18), transparent 28%), radial-gradient(circle at left center, rgba(255,110,168,0.12), transparent 26%), linear-gradient(180deg, rgba(17,16,25,0.98), rgba(8,8,14,0.98))",
  boxShadow: "0 28px 60px rgba(0,0,0,0.24)",
};

const headerRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
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
  fontSize: "42px",
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
  minWidth: "160px",
  display: "grid",
  gap: "6px",
  justifyItems: "end",
  alignContent: "start",
  padding: "16px 18px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
};

const summaryValueStyle: CSSProperties = {
  fontSize: "38px",
  lineHeight: 0.95,
  fontWeight: 900,
  color: "#ffffff",
};

const summaryLabelStyle: CSSProperties = {
  color: "#a8b5ce",
  fontSize: "13px",
  fontWeight: 700,
  textAlign: "right",
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

const metaRowStyle: CSSProperties = {
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
  gap: "14px",
  minWidth: 0,
  padding: "18px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const completeCardStyle: CSSProperties = {
  ...itemCardStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  background:
    "linear-gradient(180deg, rgba(15,28,24,0.82), rgba(10,15,14,0.82))",
};

const itemTopRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "12px",
};

const itemTitleWrapStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  minWidth: 0,
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
