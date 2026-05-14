import Link from "next/link";
import type { CSSProperties } from "react";
import { claimBadge } from "@/app/dashboard/badges/actions";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import type { BadgeFilter, BadgeMissionCardState } from "@/app/lib/badge-missions";

type Props = {
  badge: BadgeMissionCardState;
  activeFilter: BadgeFilter;
};

export default function BadgeMissionCard({ badge, activeFilter }: Props) {
  const cardStyle = getCardStyle(badge);
  const buttonStyle = getButtonStyle(badge);

  return (
    <article
      className={`badge-mission-card badge-card-${badge.status}`}
      style={cardStyle}
    >
      <div style={topRowStyle}>
        <div
          style={{
            ...iconWrapStyle,
            background: `linear-gradient(135deg, ${badge.color}12, rgba(255,255,255,0.02))`,
            borderColor: `${badge.color}30`,
            boxShadow: `0 14px 28px ${badge.color}18`,
          }}
        >
          <BadgeVisual
            slug={badge.slug}
            color={badge.color}
            rarity={badge.rarity}
            category={badge.category}
            size={64}
          />
        </div>

        <div style={badge.status === "claimed" ? claimedStatusStyle : statusStyle(badge)}>
          {badge.statusLabel}
        </div>
      </div>

      <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
        <div style={titleStyle}>{badge.name}</div>
        <div style={descriptionStyle}>{badge.description}</div>
      </div>

      <div style={metaRowStyle}>
        <div style={metaPillStyle}>{formatCategory(badge.category)}</div>
        <div style={metaPillStyle}>{formatRarity(badge.rarity)}</div>
      </div>

      <div style={infoPanelStyle}>
        <div style={labelStyle}>Requirement</div>
        <div style={valueStyle}>{badge.requirement}</div>
      </div>

      <div style={infoPanelStyle}>
        <div style={labelStyle}>Progress</div>
        <div style={valueStyle}>{badge.progressText}</div>
      </div>

      <div style={footerStyle}>
        <div style={footerHintStyle}>
          {badge.status === "claimable"
            ? "Requirement completed and ready to claim."
            : badge.status === "claimed"
              ? "Already applied to your public profile."
              : badge.status === "premium-required"
                ? "Premium access is required before this badge can unlock."
                : badge.status === "official-only"
                  ? "Reserved for official platform assignment."
                  : badge.status === "manual-review"
                    ? "This badge requires manual proof review and is not claimable yet."
                  : badge.status === "not-available"
                    ? "This badge will unlock in a future campaign."
                    : "Progress is still incomplete."}
        </div>

        {badge.canClaim ? (
          <form action={claimBadge}>
            <input type="hidden" name="badgeSlug" value={badge.slug} />
            <input type="hidden" name="filter" value={activeFilter} />
            <button type="submit" className="badge-action-button" style={buttonStyle}>
              {badge.buttonLabel}
            </button>
          </form>
        ) : badge.status === "premium-required" ? (
          <Link href="/pricing" className="badge-action-button" style={buttonStyle}>
            {badge.buttonLabel}
          </Link>
        ) : (
          <div className="badge-action-button" style={buttonStyle}>
            {badge.buttonLabel}
          </div>
        )}
      </div>
    </article>
  );
}

function formatCategory(value: BadgeMissionCardState["category"]) {
  if (value === "achievement") {
    return "Achievement";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatRarity(value: string) {
  if (value === "owner") {
    return "Owner";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getCardStyle(badge: BadgeMissionCardState): CSSProperties {
  if (badge.status === "claimed") {
    return {
      ...cardStyle,
      border: "1px solid rgba(52,211,153,0.22)",
      background:
        "linear-gradient(180deg, rgba(11,29,22,0.96), rgba(7,15,12,0.96))",
      boxShadow: "0 22px 44px rgba(16,185,129,0.10)",
    };
  }

  if (badge.status === "premium-required") {
    return {
      ...cardStyle,
      border: "1px solid rgba(255,110,168,0.18)",
      background:
        "linear-gradient(180deg, rgba(29,15,28,0.96), rgba(15,9,17,0.96))",
    };
  }

  if (badge.status === "official-only") {
    return {
      ...cardStyle,
      border: "1px solid rgba(125,196,255,0.18)",
      background:
        "linear-gradient(180deg, rgba(12,18,28,0.96), rgba(8,11,18,0.96))",
    };
  }

  if (badge.status === "not-available") {
    return {
      ...cardStyle,
      border: "1px solid rgba(245,208,110,0.16)",
      background:
        "linear-gradient(180deg, rgba(28,22,12,0.96), rgba(16,13,9,0.96))",
    };
  }

  if (badge.status === "locked") {
    return {
      ...cardStyle,
      opacity: 0.82,
    };
  }

  if (badge.status === "manual-review") {
    return {
      ...cardStyle,
      border: "1px solid rgba(251,113,133,0.18)",
      background:
        "linear-gradient(180deg, rgba(28,14,21,0.96), rgba(15,9,14,0.96))",
    };
  }

  return cardStyle;
}

function getButtonStyle(badge: BadgeMissionCardState): CSSProperties {
  if (badge.status === "claimable") {
    return {
      ...buttonBaseStyle,
      border: "1px solid rgba(135,118,255,0.26)",
      background:
        "linear-gradient(135deg, rgba(135,118,255,0.94), rgba(255,110,168,0.9))",
      color: "#ffffff",
      cursor: "pointer",
    };
  }

  if (badge.status === "claimed") {
    return {
      ...buttonBaseStyle,
      border: "1px solid rgba(52,211,153,0.20)",
      backgroundColor: "rgba(52,211,153,0.12)",
      color: "#bbf7d0",
    };
  }

  if (badge.status === "premium-required") {
    return {
      ...buttonBaseStyle,
      border: "1px solid rgba(255,110,168,0.18)",
      backgroundColor: "rgba(255,110,168,0.10)",
      color: "#ffd7e8",
    };
  }

  if (badge.status === "manual-review") {
    return {
      ...buttonBaseStyle,
      border: "1px solid rgba(251,113,133,0.18)",
      backgroundColor: "rgba(251,113,133,0.10)",
      color: "#ffd3dc",
    };
  }

  return {
    ...buttonBaseStyle,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#c8d2e8",
  };
}

function statusStyle(badge: BadgeMissionCardState): CSSProperties {
  return {
    ...statusBaseStyle,
    border:
      badge.status === "claimable"
        ? "1px solid rgba(135,118,255,0.20)"
        : badge.status === "premium-required"
          ? "1px solid rgba(255,110,168,0.18)"
          : badge.status === "official-only"
            ? "1px solid rgba(125,196,255,0.18)"
            : "1px solid rgba(255,255,255,0.08)",
    backgroundColor:
      badge.status === "claimable"
        ? "rgba(135,118,255,0.10)"
        : badge.status === "premium-required"
          ? "rgba(255,110,168,0.10)"
          : badge.status === "manual-review"
            ? "rgba(251,113,133,0.10)"
          : badge.status === "official-only"
            ? "rgba(125,196,255,0.10)"
            : "rgba(255,255,255,0.04)",
    color:
      badge.status === "claimable"
        ? "#ddd8ff"
        : badge.status === "premium-required"
          ? "#ffd7e8"
          : badge.status === "manual-review"
            ? "#ffd1da"
          : badge.status === "official-only"
            ? "#d8efff"
            : "#d9e2f4",
  };
}

const cardStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  minWidth: 0,
  padding: "22px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(15,15,22,0.98), rgba(8,8,14,0.98))",
  boxShadow: "0 22px 44px rgba(0,0,0,0.18)",
  transition:
    "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "12px",
};

const iconWrapStyle: CSSProperties = {
  width: "84px",
  height: "84px",
  borderRadius: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#ffffff",
  flexShrink: 0,
};

const statusBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  flexShrink: 0,
};

const claimedStatusStyle: CSSProperties = {
  ...statusBaseStyle,
  border: "1px solid rgba(52,211,153,0.18)",
  backgroundColor: "rgba(52,211,153,0.10)",
  color: "#bbf7d0",
};

const titleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const descriptionStyle: CSSProperties = {
  color: "#b8c4dc",
  fontSize: "14px",
  lineHeight: 1.7,
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const metaPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#dce4f5",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const infoPanelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const labelStyle: CSSProperties = {
  color: "#8f9ab3",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const valueStyle: CSSProperties = {
  color: "#e8eefb",
  fontSize: "13px",
  lineHeight: 1.65,
};

const footerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const footerHintStyle: CSSProperties = {
  flex: 1,
  minWidth: "180px",
  color: "#8f9ab3",
  fontSize: "12px",
  lineHeight: 1.6,
};

const buttonBaseStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 16px",
  borderRadius: "14px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  transition: "transform 160ms ease, border-color 160ms ease, opacity 160ms ease",
};
