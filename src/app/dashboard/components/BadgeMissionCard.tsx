import Link from "next/link";
import type { CSSProperties } from "react";
import FormActionButton from "@/app/components/FormActionButton";
import { claimBadge } from "@/app/dashboard/badges/actions";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";
import type { BadgeFilter, BadgeMissionCardState } from "@/app/lib/badge-missions";

type Props = {
  badge: BadgeMissionCardState;
  activeFilter: BadgeFilter;
  variant?: "featured" | "shelf" | "compact";
};

export default function BadgeMissionCard({
  badge,
  activeFilter,
  variant = "shelf",
}: Props) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const titleText = badge.name;
  const subtitleText = badge.description;

  return (
    <article
      className={`badge-mission-card badge-card-${badge.status} badge-variant-${variant}`}
      style={getCardStyle(badge, variant)}
    >
      <div style={shellGlowStyle(badge)} aria-hidden="true" />
      <div className="badge-mission-card-shell" style={shellGridStyle(variant)}>
        <div className="badge-mission-card-crest" style={crestColumnStyle(variant)}>
          <div style={iconWrapStyle(badge, variant)}>
            <div style={artifactHaloStyle(badge)} aria-hidden="true" />
            <BadgeVisual
              slug={badge.slug}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              color={badge.color}
              rarity={badge.rarity}
              category={badge.category}
              size={isFeatured ? 108 : isCompact ? 56 : 74}
              compact={!isFeatured}
              animated={variant !== "compact"}
              equipped={badge.isClaimed}
            />
          </div>

          <div style={artifactMetaStyle}>
            <div style={statusStyle(badge, variant)}>{badge.statusLabel}</div>
            {isCompact ? null : (
              <div style={tagRowStyle}>
                <div style={metaTagStyle(badge.color)}>{formatCategory(badge.category)}</div>
                <div style={metaTagStyle(badge.color)}>{formatRarity(badge.rarity)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="badge-mission-card-content" style={contentColumnStyle(variant)}>
          <div style={{ display: "grid", gap: isFeatured ? "10px" : "8px", minWidth: 0 }}>
            <div style={eyebrowStyle}>{getCollectionLabel(badge)}</div>
            <h3 style={titleStyle(variant)}>{titleText}</h3>
            <p style={descriptionStyle(variant)}>{subtitleText}</p>
          </div>

          {isCompact ? (
            <div style={compactProgressStyle}>{badge.progressText}</div>
          ) : (
            <div className="badge-mission-card-detail-rail" style={detailRailStyle(variant)}>
              <InfoStrip label="How to unlock" value={badge.requirement} color={badge.color} />
              <InfoStrip label="Progress" value={badge.progressText} color={badge.color} />
            </div>
          )}

          <div style={footerStyle(variant)}>
            <div style={footerHintStyle(variant)}>{getFooterHint(badge)}</div>
            {renderAction(badge, activeFilter)}
          </div>
        </div>
      </div>
    </article>
  );
}

function renderAction(badge: BadgeMissionCardState, activeFilter: BadgeFilter) {
  const buttonStyle = getButtonStyle(badge);

  if (badge.canClaim) {
    return (
      <form action={claimBadge}>
        <input type="hidden" name="badgeSlug" value={badge.slug} />
        <input type="hidden" name="filter" value={activeFilter} />
        <FormActionButton
          className="badge-action-button"
          idleLabel={badge.buttonLabel}
          pendingLabel="Equipping badge..."
          style={buttonStyle}
        />
      </form>
    );
  }

  if (badge.status === "premium-required") {
    return (
      <Link href="/pricing" className="badge-action-button" style={buttonStyle}>
        {badge.buttonLabel}
      </Link>
    );
  }

  return (
    <div className="badge-action-button" style={buttonStyle}>
      {badge.buttonLabel}
    </div>
  );
}

function InfoStrip({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "7px",
        minWidth: 0,
        padding: "14px 15px",
        borderRadius: "18px",
        border: `1px solid ${color}18`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
      }}
    >
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
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

function getCollectionLabel(badge: BadgeMissionCardState) {
  if (badge.rarity === "owner") {
    return "Founder relic";
  }

  if (badge.rarity === "legendary") {
    return "Legendary relic";
  }

  if (badge.rarity === "epic") {
    return "Epic relic";
  }

  if (badge.rarity === "rare") {
    return "Rare relic";
  }

  return "Starter relic";
}

function getFooterHint(badge: BadgeMissionCardState) {
  if (badge.status === "claimable") {
    return "You unlocked this badge. Equip it to show it on your public profile.";
  }

  if (badge.status === "claimed") {
    return "This badge is already equipped on your public profile.";
  }

  if (badge.status === "premium-required") {
    return "Premium is required before this badge can be unlocked.";
  }

  if (badge.status === "official-only") {
    return "This badge is reserved for official Yotei assignment.";
  }

  if (badge.status === "manual-review") {
    return "Complete the requirement above, then wait for manual review.";
  }

  if (badge.status === "not-available") {
    return "This badge exists, but it is not claimable yet.";
  }

  return "Complete the mission above to unlock this badge.";
}

function getCardStyle(
  badge: BadgeMissionCardState,
  variant: "featured" | "shelf" | "compact",
): CSSProperties {
  const basePadding =
    variant === "featured" ? "24px" : variant === "compact" ? "16px" : "18px";

  const background =
    badge.rarity === "owner"
      ? "linear-gradient(180deg, rgba(33,22,9,0.98), rgba(9,8,7,0.98))"
      : badge.rarity === "legendary"
        ? "linear-gradient(180deg, rgba(27,20,10,0.98), rgba(10,9,8,0.98))"
        : badge.rarity === "epic"
          ? "linear-gradient(180deg, rgba(21,14,28,0.98), rgba(8,8,16,0.98))"
          : badge.rarity === "rare"
            ? "linear-gradient(180deg, rgba(12,18,28,0.98), rgba(7,10,18,0.98))"
            : "linear-gradient(180deg, rgba(16,18,24,0.98), rgba(8,9,14,0.98))";

  return {
    position: "relative",
    display: "grid",
    minWidth: 0,
    overflow: "hidden",
    padding: basePadding,
    borderRadius: variant === "featured" ? "34px" : variant === "compact" ? "24px" : "28px",
    border: `1px solid ${badge.color}24`,
    background,
    boxShadow:
      variant === "featured"
        ? `0 34px 74px ${badge.color}18`
        : `0 20px 44px ${badge.color}12`,
    isolation: "isolate",
  };
}

function shellGlowStyle(badge: BadgeMissionCardState): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 14% 16%, ${badge.color}18, transparent 26%),
      radial-gradient(circle at 88% 88%, ${badge.color}10, transparent 28%),
      linear-gradient(180deg, rgba(255,255,255,0.06), transparent 22%)
    `,
    pointerEvents: "none",
  };
}

function shellGridStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  if (variant === "featured") {
    return {
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "minmax(118px, 148px) minmax(0, 1fr)",
      gap: "24px",
      alignItems: "center",
    };
  }

  if (variant === "compact") {
    return {
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
      gap: "14px",
      alignItems: "center",
    };
  }

  return {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gap: "18px",
  };
}

function crestColumnStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    display: "grid",
    gap: variant === "featured" ? "16px" : "12px",
    justifyItems: variant === "featured" ? "center" : "start",
    alignContent: "start",
    minWidth: 0,
  };
}

const artifactMetaStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  justifyItems: "start",
  minWidth: 0,
};

function iconWrapStyle(
  badge: BadgeMissionCardState,
  variant: "featured" | "shelf" | "compact",
): CSSProperties {
  const size = variant === "featured" ? 148 : variant === "compact" ? 74 : 92;

  return {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: variant === "featured" ? "38px" : "28px",
    border: `1px solid ${badge.color}20`,
    background:
      "radial-gradient(circle at 50% 12%, rgba(255,255,255,0.08), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    boxShadow: `0 18px 34px ${badge.color}12`,
    overflow: "hidden",
  };
}

function artifactHaloStyle(badge: BadgeMissionCardState): CSSProperties {
  return {
    position: "absolute",
    inset: "12px",
    borderRadius: "999px",
    background: `radial-gradient(circle, ${badge.color}18 0%, transparent 70%)`,
    filter: "blur(8px)",
    pointerEvents: "none",
  };
}

function statusStyle(
  badge: BadgeMissionCardState,
  variant: "featured" | "shelf" | "compact",
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    minHeight: variant === "compact" ? "28px" : "32px",
    padding: variant === "compact" ? "0 10px" : "0 12px",
    borderRadius: "999px",
    border: `1px solid ${badge.color}28`,
    backgroundColor: `${badge.color}12`,
    color: "#f7fbff",
    fontSize: variant === "compact" ? "10px" : "11px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    boxShadow: `0 0 0 1px ${badge.color}08`,
  };
}

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

function metaTagStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    border: `1px solid ${color}18`,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#d9e3f3",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

function contentColumnStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    display: "grid",
    gap: variant === "compact" ? "10px" : "16px",
    minWidth: 0,
    alignContent: "start",
  };
}

const eyebrowStyle: CSSProperties = {
  color: "#8da3ca",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function titleStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    margin: 0,
    color: "#ffffff",
    fontSize:
      variant === "featured" ? "30px" : variant === "compact" ? "18px" : "24px",
    lineHeight: variant === "featured" ? 1.02 : 1.06,
    letterSpacing: variant === "featured" ? "-0.05em" : "-0.04em",
    fontWeight: 900,
  };
}

function descriptionStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    margin: 0,
    color: "#b7c3d7",
    fontSize: variant === "compact" ? "12px" : "14px",
    lineHeight: variant === "featured" ? 1.75 : 1.68,
    maxWidth: variant === "featured" ? "58ch" : undefined,
  };
}

function detailRailStyle(variant: "featured" | "shelf"): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns:
      variant === "featured" ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
    gap: "12px",
  };
}

const compactProgressStyle: CSSProperties = {
  color: "#c9d4e6",
  fontSize: "12px",
  lineHeight: 1.55,
};

function footerStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    display: "flex",
    alignItems: variant === "compact" ? "center" : "end",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  };
}

function footerHintStyle(variant: "featured" | "shelf" | "compact"): CSSProperties {
  return {
    flex: 1,
    minWidth: variant === "compact" ? "120px" : "180px",
    color: "#8f9ab3",
    fontSize: variant === "compact" ? "11px" : "12px",
    lineHeight: 1.6,
  };
}

function getButtonStyle(badge: BadgeMissionCardState): CSSProperties {
  if (badge.status === "claimable") {
    return {
      ...buttonBaseStyle,
      border: `1px solid ${badge.color}38`,
      background: `linear-gradient(135deg, ${badge.color}, rgba(255,255,255,0.18))`,
      color: "#07101d",
      cursor: "pointer",
      boxShadow: `0 12px 24px ${badge.color}26`,
    };
  }

  if (badge.status === "claimed") {
    return {
      ...buttonBaseStyle,
      border: `1px solid ${badge.color}24`,
      backgroundColor: `${badge.color}10`,
      color: "#f8fbff",
    };
  }

  if (badge.status === "premium-required") {
    return {
      ...buttonBaseStyle,
      border: `1px solid ${badge.color}24`,
      backgroundColor: `${badge.color}0e`,
      color: "#ffe6f3",
    };
  }

  return {
    ...buttonBaseStyle,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#c8d2e8",
  };
}

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
  lineHeight: 1.6,
};

const buttonBaseStyle: CSSProperties = {
  textDecoration: "none",
  minHeight: "42px",
  padding: "0 16px",
  borderRadius: "15px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  transition: "transform 160ms ease, border-color 160ms ease, opacity 160ms ease",
};
