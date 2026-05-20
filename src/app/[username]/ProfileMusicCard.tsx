import type { CSSProperties } from "react";
import { LuArrowUpRight, LuMusic4, LuRadio } from "react-icons/lu";
import {
  getProfileMusicArtist,
  getProfileMusicCtaLabel,
  getProfileMusicProviderLabel,
  getProfileMusicTitle,
  shouldRenderProfileMusic,
  type ProfileMusicData,
} from "@/app/lib/profile-music";

type Props = {
  music: ProfileMusicData;
  themeColor: string;
  accentColor: string;
  contrastColor: string;
  softColor: string;
  compact?: boolean;
  showPlaceholder?: boolean;
};

export default function ProfileMusicCard({
  music,
  themeColor,
  accentColor,
  contrastColor,
  softColor,
  compact = false,
  showPlaceholder = false,
}: Props) {
  if (!shouldRenderProfileMusic(music)) {
    if (!showPlaceholder) {
      return null;
    }

    return (
      <section style={cardStyle(themeColor, accentColor, contrastColor, compact)}>
        <div style={placeholderWrapStyle}>
          <div style={placeholderHeaderStyle}>
            <span style={iconBadgeStyle(themeColor)}>
              <LuMusic4 size={14} />
            </span>
            <div style={{ display: "grid", gap: "4px" }}>
              <strong style={placeholderTitleStyle}>Profile music preview</strong>
              <span style={placeholderTextStyle}>
                Enable profile music and add a title, artist, or link to show the
                compact public player.
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={cardStyle(themeColor, accentColor, contrastColor, compact)}>
      <style>{`
        .profile-music-card-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
        }

        .profile-music-eq {
          display: inline-flex;
          align-items: end;
          gap: 4px;
          min-width: 26px;
          height: 28px;
        }

        .profile-music-eq span {
          width: 4px;
          border-radius: 999px;
          background: linear-gradient(180deg, ${softColor}, ${accentColor});
          box-shadow: 0 0 12px ${withAlpha(accentColor, "20")};
          transform-origin: bottom center;
          animation: profile-music-bar 1.35s ease-in-out infinite;
        }

        .profile-music-eq span:nth-child(1) {
          height: 12px;
          animation-delay: 0s;
        }

        .profile-music-eq span:nth-child(2) {
          height: 22px;
          animation-delay: 0.18s;
        }

        .profile-music-eq span:nth-child(3) {
          height: 16px;
          animation-delay: 0.36s;
        }

        .profile-music-eq span:nth-child(4) {
          height: 24px;
          animation-delay: 0.54s;
        }

        @keyframes profile-music-bar {
          0%, 100% {
            opacity: 0.55;
            transform: scaleY(0.45);
          }

          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @media (max-width: 640px) {
          .profile-music-card-row {
            grid-template-columns: minmax(0, 1fr);
            align-items: start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-music-eq span {
            animation: none;
            opacity: 0.9;
            transform: scaleY(0.7);
          }
        }
      `}</style>

      <div style={glowStyle(accentColor, contrastColor)} />

      <div className="profile-music-card-row" style={contentWrapStyle}>
        <div style={leadingWrapStyle}>
          <span style={iconBadgeStyle(accentColor)}>
            <LuRadio size={compact ? 14 : 15} />
          </span>
          <div className="profile-music-eq" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div style={copyWrapStyle}>
          <div style={badgeRowStyle}>
            <span style={providerBadgeStyle(accentColor)}>
              {getProfileMusicProviderLabel(music.provider)}
            </span>
            <span style={statusBadgeStyle(contrastColor)}>Atmosphere</span>
          </div>

          <strong style={titleStyle(compact)}>{getProfileMusicTitle(music)}</strong>
          <div style={artistStyle}>{getProfileMusicArtist(music)}</div>
        </div>

        {music.url ? (
          <a
            href={music.url}
            target="_blank"
            rel="noreferrer"
            style={ctaStyle(accentColor, contrastColor)}
          >
            {getProfileMusicCtaLabel(music.provider)}
            <LuArrowUpRight size={15} />
          </a>
        ) : (
          <span style={disabledCtaStyle}>Link not set</span>
        )}
      </div>
    </section>
  );
}

function cardStyle(
  themeColor: string,
  accentColor: string,
  contrastColor: string,
  compact: boolean,
): CSSProperties {
  return {
    position: "relative",
    overflow: "hidden",
    display: "grid",
    minWidth: 0,
    padding: compact ? "16px" : "18px",
    borderRadius: compact ? "22px" : "24px",
    border: `1px solid ${withAlpha(accentColor, "26")}`,
    background: `
      radial-gradient(circle at top left, ${withAlpha(themeColor, "18")} 0%, transparent 34%),
      radial-gradient(circle at 84% 16%, ${withAlpha(contrastColor, "14")} 0%, transparent 24%),
      linear-gradient(180deg, rgba(18, 20, 30, 0.96), rgba(10, 11, 18, 0.98))
    `,
    boxShadow: `0 20px 38px ${withAlpha(accentColor, "14")}`,
  };
}

const contentWrapStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
};

function glowStyle(accentColor: string, contrastColor: string): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `
      linear-gradient(120deg, rgba(255,255,255,0.05), transparent 18%),
      radial-gradient(circle at 14% 22%, ${withAlpha(accentColor, "18")} 0%, transparent 28%),
      radial-gradient(circle at 82% 22%, ${withAlpha(contrastColor, "14")} 0%, transparent 26%)
    `,
  };
}

const leadingWrapStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
};

function iconBadgeStyle(color: string): CSSProperties {
  return {
    width: "40px",
    height: "40px",
    borderRadius: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    background: `linear-gradient(180deg, ${withAlpha(color, "28")}, ${withAlpha(color, "14")})`,
    border: `1px solid ${withAlpha(color, "30")}`,
    boxShadow: `0 14px 28px ${withAlpha(color, "18")}`,
    flexShrink: 0,
  };
}

const copyWrapStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  minWidth: 0,
};

const badgeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

function providerBadgeStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "24px",
    padding: "0 10px",
    borderRadius: "999px",
    color: "#ffffff",
    background: withAlpha(color, "18"),
    border: `1px solid ${withAlpha(color, "30")}`,
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

function statusBadgeStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "24px",
    padding: "0 10px",
    borderRadius: "999px",
    color: "#d8e0f2",
    background: withAlpha(color, "14"),
    border: `1px solid ${withAlpha(color, "24")}`,
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.04em",
  };
}

function titleStyle(compact: boolean): CSSProperties {
  return {
    color: "#ffffff",
    fontSize: compact ? "16px" : "17px",
    lineHeight: 1.25,
    letterSpacing: "-0.03em",
    overflowWrap: "anywhere",
  };
}

const artistStyle: CSSProperties = {
  color: "#abb8d3",
  fontSize: "13px",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
};

function ctaStyle(accentColor: string, contrastColor: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "40px",
    padding: "0 14px",
    borderRadius: "14px",
    color: "#ffffff",
    textDecoration: "none",
    background: `linear-gradient(135deg, ${withAlpha(accentColor, "f2")}, ${withAlpha(contrastColor, "d8")})`,
    border: `1px solid ${withAlpha(accentColor, "38")}`,
    boxShadow: `0 16px 28px ${withAlpha(accentColor, "18")}`,
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  };
}

const disabledCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "0 14px",
  borderRadius: "14px",
  color: "#8b97b0",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const placeholderWrapStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
};

const placeholderHeaderStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const placeholderTitleStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
  lineHeight: 1.3,
};

const placeholderTextStyle: CSSProperties = {
  color: "#a6b3cd",
  fontSize: "13px",
  lineHeight: 1.7,
};

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}
