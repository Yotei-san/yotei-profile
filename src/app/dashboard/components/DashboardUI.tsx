import type { CSSProperties, ReactNode } from "react";

type NoticeTone = "success" | "error";
type ActionVariant = "primary" | "secondary" | "danger";

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section style={dashboardHeroStyle}>
      <div style={{ display: "grid", gap: "16px", minWidth: 0 }}>
        <div style={dashboardBadgeStyle}>{eyebrow}</div>
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <h1 style={dashboardHeroTitleStyle}>{title}</h1>
          <p style={dashboardHeroTextStyle}>{description}</p>
        </div>
        {actions ? <div style={dashboardActionRowStyle}>{actions}</div> : null}
      </div>

      {aside ? <div style={{ minWidth: 0 }}>{aside}</div> : null}
    </section>
  );
}

export function DashboardSectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div style={dashboardPanelHeaderStyle}>
      <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
        <div style={dashboardEyebrowStyle}>{eyebrow}</div>
        <h2 style={dashboardSectionTitleStyle}>{title}</h2>
        {description ? <p style={dashboardSectionTextStyle}>{description}</p> : null}
      </div>
      {actions ? <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>{actions}</div> : null}
    </div>
  );
}

export function DashboardNotice({
  tone,
  children,
}: {
  tone: NoticeTone;
  children: ReactNode;
}) {
  return <div style={dashboardNoticeStyle(tone)}>{children}</div>;
}

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div style={dashboardEmptyStateStyle}>
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={dashboardEmptyTitleStyle}>{title}</div>
        <p style={dashboardEmptyTextStyle}>{description}</p>
      </div>
      {action ? <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>{action}</div> : null}
    </div>
  );
}

export const dashboardInlinePillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

export function dashboardButtonStyle(
  variant: ActionVariant,
  options?: {
    fullWidth?: boolean;
  }
): CSSProperties {
  const base: CSSProperties = {
    minHeight: "46px",
    padding: "0 16px",
    borderRadius: "16px",
    display: options?.fullWidth ? "inline-flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: options?.fullWidth ? "100%" : undefined,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 800,
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid transparent",
  };

  if (variant === "secondary") {
    return {
      ...base,
      color: "#dbe6ff",
      border: "1px solid rgba(255,255,255,0.08)",
      backgroundColor: "rgba(255,255,255,0.04)",
    };
  }

  if (variant === "danger") {
    return {
      ...base,
      color: "#fca5a5",
      border: "1px solid rgba(239,68,68,0.18)",
      backgroundColor: "rgba(239,68,68,0.10)",
    };
  }

  return {
    ...base,
    color: "#ffffff",
    border: "1px solid rgba(244,114,182,0.18)",
    background:
      "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
    boxShadow: "0 16px 34px rgba(116,95,255,0.16)",
  };
}

export function dashboardTagStyle(color: "pink" | "violet" | "green" = "pink"): CSSProperties {
  if (color === "green") {
    return {
      ...dashboardInlinePillStyle,
      border: "1px solid rgba(52,211,153,0.18)",
      backgroundColor: "rgba(52,211,153,0.10)",
      color: "#bbf7d0",
    };
  }

  if (color === "violet") {
    return {
      ...dashboardInlinePillStyle,
      border: "1px solid rgba(135,118,255,0.18)",
      backgroundColor: "rgba(135,118,255,0.08)",
      color: "#ddd6ff",
    };
  }

  return {
    ...dashboardInlinePillStyle,
    border: "1px solid rgba(255,110,168,0.18)",
    backgroundColor: "rgba(255,110,168,0.08)",
    color: "#ffd7e8",
  };
}

export function dashboardAutoGridStyle(minWidth = 300): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minWidth}px), 1fr))`,
    gap: "18px",
  };
}

export const dashboardPageStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  minWidth: 0,
};

export const dashboardHeroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "18px",
  alignItems: "start",
  padding: "28px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "radial-gradient(circle at top left, rgba(255,110,168,0.12), transparent 26%), radial-gradient(circle at 82% 18%, rgba(135,118,255,0.14), transparent 22%), linear-gradient(135deg, rgba(22,14,24,0.98), rgba(8,8,12,0.98))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
  minWidth: 0,
};

export const dashboardBadgeStyle: CSSProperties = {
  ...dashboardInlinePillStyle,
  width: "fit-content",
  minHeight: "32px",
  padding: "0 12px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "1px solid rgba(255,110,168,0.18)",
  backgroundColor: "rgba(255,110,168,0.08)",
  color: "#ffd7e8",
};

export const dashboardHeroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(34px, 5vw, 48px)",
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
};

export const dashboardHeroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "60ch",
  color: "#b7c1d8",
  fontSize: "15px",
  lineHeight: 1.75,
};

export const dashboardActionRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

export const dashboardSurfaceStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  minWidth: 0,
  padding: "24px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(9,9,12,0.92)",
  boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
};

export const dashboardSoftSurfaceStyle: CSSProperties = {
  ...dashboardSurfaceStyle,
  padding: "18px",
  borderRadius: "22px",
  backgroundColor: "rgba(255,255,255,0.03)",
  boxShadow: "none",
};

export const dashboardPanelHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
};

export const dashboardEyebrowStyle: CSSProperties = {
  color: "#8ea0c9",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export const dashboardSectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 4vw, 32px)",
  lineHeight: 1.02,
};

export const dashboardSectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#a3acc2",
  fontSize: "14px",
  lineHeight: 1.7,
  maxWidth: "58ch",
};

export const dashboardFieldGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

export const dashboardLabelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#d4dbe7",
  fontSize: "13px",
  fontWeight: 700,
  minWidth: 0,
};

export const dashboardInputStyle: CSSProperties = {
  width: "100%",
  minHeight: "48px",
  padding: "12px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#ffffff",
  outline: "none",
  minWidth: 0,
};

export const dashboardTextareaStyle: CSSProperties = {
  ...dashboardInputStyle,
  minHeight: "136px",
  resize: "vertical",
  paddingTop: "14px",
  paddingBottom: "14px",
};

export const dashboardListItemStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  minWidth: 0,
  padding: "16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

export const dashboardMutedTextStyle: CSSProperties = {
  color: "#9eabc5",
  fontSize: "13px",
  lineHeight: 1.65,
  minWidth: 0,
  overflowWrap: "anywhere",
};

export const dashboardEmptyStateStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  padding: "20px",
  borderRadius: "22px",
  border: "1px dashed rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#b4bfd5",
};

export const dashboardEmptyTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 800,
};

export const dashboardEmptyTextStyle: CSSProperties = {
  margin: 0,
  color: "#9eabc5",
  fontSize: "14px",
  lineHeight: 1.7,
  maxWidth: "52ch",
};

export function dashboardNoticeStyle(tone: NoticeTone): CSSProperties {
  if (tone === "error") {
    return {
      borderRadius: "18px",
      padding: "14px 16px",
      backgroundColor: "rgba(239,68,68,0.10)",
      border: "1px solid rgba(239,68,68,0.22)",
      color: "#fca5a5",
      fontWeight: 700,
    };
  }

  return {
    borderRadius: "18px",
    padding: "14px 16px",
    backgroundColor: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.22)",
    color: "#86efac",
    fontWeight: 700,
  };
}
