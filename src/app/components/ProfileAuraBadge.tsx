import type { CSSProperties } from "react";
import { LuSparkles } from "react-icons/lu";
import {
  getAuraProgress,
  type AuraProgress,
} from "@/app/lib/aura";
import {
  getAuraRankLabel,
  getAuraRankTone,
  getAuraVisualProfile,
} from "@/app/lib/aura-visuals";

export type ProfileAuraBadgeVariant = "compact" | "hero" | "dashboard";

type Props = {
  score: number;
  rank: string;
  variant?: ProfileAuraBadgeVariant;
  auraLabel: string;
  rankLabel: string;
  nextRankLabel?: string;
  nextRankText?: string | null;
  description?: string | null;
  motivationalCopy?: string | null;
  progress?: AuraProgress;
  className?: string;
  style?: CSSProperties;
};

export default function ProfileAuraBadge({
  score,
  rank,
  variant = "hero",
  auraLabel,
  rankLabel,
  nextRankLabel,
  nextRankText,
  description,
  motivationalCopy,
  progress,
  className,
  style,
}: Props) {
  const visual = getAuraVisualProfile(rank);
  const resolvedProgress = progress ?? getAuraProgress(score);
  const scoreValue = Math.max(0, Math.floor(score));
  const accentGlow = visual.glowColor;
  const showProgress = resolvedProgress.nextRank !== null && variant !== "compact";
  const chipRadius =
    variant === "dashboard" ? 24 : variant === "hero" ? 22 : 999;
  const shellStyle: CSSProperties = {
    position: "relative",
    display: "grid",
    gap: variant === "dashboard" ? "14px" : variant === "hero" ? "10px" : "8px",
    minWidth: 0,
    padding:
      variant === "dashboard"
        ? "18px"
        : variant === "hero"
          ? "14px 15px"
          : "10px 12px",
    borderRadius: chipRadius,
    border: `1px solid ${withAlpha(visual.accentColor, variant === "compact" ? "2d" : "26")}`,
    background:
      variant === "dashboard"
        ? `radial-gradient(circle at top right, ${withAlpha(visual.accentColor, "18")} 0%, transparent 30%), linear-gradient(180deg, rgba(18,20,31,0.98), rgba(8,10,17,0.98))`
        : `linear-gradient(135deg, ${withAlpha(visual.accentColor, variant === "compact" ? "14" : "16")} 0%, rgba(255,255,255,0.03) 100%)`,
    boxShadow:
      variant === "compact"
        ? `0 10px 24px ${withAlpha(visual.accentColor, "12")}`
        : `0 18px 36px ${withAlpha(visual.accentColor, "14")}`,
    overflow: "hidden",
    isolation: "isolate",
    ...style,
  };
  const isCompact = variant === "compact";

  return (
    <div
      className={["profile-aura-badge", `variant-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      data-aura-rank={visual.rank}
      data-aura-tone={getAuraRankTone(rank)}
      style={shellStyle}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            visual.hasIdentityGlow && !isCompact
              ? `radial-gradient(circle at 12% 12%, rgba(255,255,255,0.08) 0%, transparent 20%), radial-gradient(circle at 86% 24%, ${withAlpha(
                  visual.accentColor,
                  "18",
                )} 0%, transparent 26%)`
              : `radial-gradient(circle at 86% 18%, ${withAlpha(visual.accentColor, "14")} 0%, transparent 26%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: isCompact ? "center" : "start",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: isCompact ? "wrap" : "nowrap",
        }}
      >
        <div style={{ display: "grid", gap: variant === "dashboard" ? "8px" : "6px", minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              color: "#f3f7ff",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <LuSparkles size={12} color={visual.accentColor} />
            {auraLabel}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <strong
              style={{
                color: "#ffffff",
                fontSize:
                  variant === "dashboard"
                    ? "clamp(30px, 5vw, 40px)"
                    : variant === "hero"
                      ? "20px"
                      : "15px",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.05em",
              }}
            >
              {scoreValue.toLocaleString()}
            </strong>
            <span
              style={{
                color: "#b8c4da",
                fontSize: variant === "compact" ? "11px" : "12px",
                fontWeight: 700,
              }}
            >
              {description || getAuraRankLabel(rank)}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            minWidth: isCompact ? "auto" : "104px",
            padding: variant === "compact" ? "0" : "8px 10px",
            borderRadius: isCompact ? 999 : 18,
            border: `1px solid ${withAlpha(visual.accentColor, isCompact ? "2f" : "30")}`,
            background:
              variant === "compact"
                ? withAlpha(visual.accentColor, "12")
                : `linear-gradient(180deg, ${withAlpha(visual.accentColor, "14")}, rgba(255,255,255,0.03))`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 0 18px ${accentGlow}`,
            display: "grid",
            justifyItems: "center",
            gap: variant === "compact" ? "6px" : "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AuraRankCrest rank={visual.rank} color={visual.accentColor} />
            <div style={{ display: "grid", gap: variant === "compact" ? "0" : "2px" }}>
              {variant === "compact" ? null : (
                <span
                  style={{
                    color: "#d7dfef",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {rankLabel}
                </span>
              )}
              <strong
                style={{
                  color: "#ffffff",
                  fontSize: variant === "dashboard" ? "24px" : variant === "hero" ? "20px" : "14px",
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                }}
              >
                {rank}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {showProgress ? (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {nextRankLabel ? (
              <span
                style={{
                  color: "#aebad0",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {nextRankLabel}
              </span>
            ) : null}
            {nextRankText ? (
              <span
                style={{
                  color: "#dbe5f6",
                  fontSize: variant === "dashboard" ? "13px" : "11px",
                  fontWeight: 700,
                }}
              >
                {nextRankText}
              </span>
            ) : null}
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: variant === "dashboard" ? "11px" : "8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, resolvedProgress.progressPercent))}%`,
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${withAlpha(
                  visual.softColor,
                  "f8",
                )}, ${withAlpha(visual.accentColor, "f8")})`,
                boxShadow: `0 0 20px ${accentGlow}`,
              }}
            />
          </div>
        </div>
      ) : null}

      {motivationalCopy && variant === "dashboard" ? (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: "#c3cee2",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {motivationalCopy}
        </div>
      ) : null}
    </div>
  );
}

function AuraRankCrest({
  rank,
  color,
}: {
  rank: string;
  color: string;
}) {
  const isSignature = rank === "S";

  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        width: isSignature ? "30px" : "24px",
        height: isSignature ? "30px" : "24px",
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.26) 0%, transparent 28%), ${withAlpha(
          color,
          isSignature ? "2b" : "1e",
        )}`,
        border: `1px solid ${withAlpha(color, isSignature ? "70" : "4d")}`,
        boxShadow: `0 0 16px ${withAlpha(color, "26")}`,
      }}
    >
      {isSignature ? (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
          <path
            d="M12 2.8l2.08 5.12 5.12 2.08-5.12 2.08L12 17.2l-2.08-5.12L4.8 10l5.12-2.08L12 2.8z"
            fill={color}
          />
        </svg>
      ) : (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            background: color,
            boxShadow: `0 0 12px ${withAlpha(color, "70")}`,
          }}
        />
      )}
    </span>
  );
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}
