import type { CSSProperties, ReactNode } from "react";
import { LuArrowUpRight, LuSparkles } from "react-icons/lu";
import { getLinkPlatform } from "@/app/lib/link-icons";
import ProfileHeroClient from "./ProfileHeroClient";
import SocialPresenceSection, {
  type PublicSocialBlock,
} from "./SocialPresenceSection";

export type PublicProfileLayout = "default" | "modern" | "simplistic" | "portfolio";

type BadgeEntry = {
  id: string;
  badge: {
    name: string;
    icon: string;
    description: string | null;
    color: string | null;
  };
};

type LinkEntry = {
  id: string;
  title: string | null;
  url: string;
};

type DecorationEntry = {
  imageUrl: string;
  previewUrl: string | null;
  posterUrl: string | null;
  mediaType: string;
};

type LayoutUser = {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  selectedDecoration: DecorationEntry | null;
  links: LinkEntry[];
};

type HeroPill = {
  key: string;
  text: string;
  icon: ReactNode;
  color: string;
};

type Props = {
  layout: Exclude<PublicProfileLayout, "modern">;
  user: LayoutUser;
  displayName: string;
  themeColor: string;
  bannerKind: "image" | "video" | "unknown";
  avatarInitials: string;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  premiumBadges: BadgeEntry[];
  heroPills: HeroPill[];
  likes: number;
  dislikes: number;
  views: number;
  socialBlocks: PublicSocialBlock[];
  initialMyReaction: "like" | "dislike" | null;
};

export default function ProfileLayoutVariants(props: Props) {
  if (props.layout === "default") {
    return <DefaultLayout {...props} />;
  }

  if (props.layout === "simplistic") {
    return <SimplisticLayout {...props} />;
  }

  return <PortfolioLayout {...props} />;
}

function DefaultLayout(props: Props) {
  return (
    <main style={defaultPageStyle(props.themeColor)}>
      <section style={defaultShellStyle}>
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={260}
          roundedTop
        />

        <div style={defaultContentStyle}>
          <div style={defaultIdentityStyle}>
            <AvatarVisual
              avatarUrl={props.user.avatarUrl}
              avatarInitials={props.avatarInitials}
              themeColor={props.themeColor}
              selectedDecoration={props.user.selectedDecoration}
              decorationScale={props.decorationScale}
              decorationOffsetX={props.decorationOffsetX}
              decorationOffsetY={props.decorationOffsetY}
              size={126}
              frameInset={8}
            />

            <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
              <div style={eyebrowStyle(props.themeColor)}>Default layout</div>
              <h1 style={defaultNameStyle}>{props.displayName}</h1>
              <div style={usernameStyle}>@{props.user.username}</div>
              <PillRow pills={props.heroPills} compact />
              {props.user.bio ? <p style={defaultBioStyle}>{props.user.bio}</p> : null}
            </div>
          </div>

          <ProfileHeroClient
            username={props.user.username}
            initialViews={props.views}
            initialLikes={props.likes}
            initialDislikes={props.dislikes}
            themeColor={props.themeColor}
            initialMyReaction={props.initialMyReaction}
          />

          <BadgeRail badges={props.premiumBadges} themeColor={props.themeColor} />
          <SocialPresenceSection blocks={props.socialBlocks} themeColor={props.themeColor} compact />
          <LinksSection
            layout="default"
            links={props.user.links}
            themeColor={props.themeColor}
          />
        </div>
      </section>
    </main>
  );
}

function SimplisticLayout(props: Props) {
  return (
    <main style={simplisticPageStyle}>
      <div style={simplisticShellStyle}>
        <div style={simplisticHeaderStyle}>
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={92}
            frameInset={6}
            minimal
          />

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={simpleKickerStyle}>Simplistic</div>
            <h1 style={simplisticNameStyle}>{props.displayName}</h1>
            <div style={usernameStyle}>@{props.user.username}</div>
            {props.user.bio ? <p style={simplisticBioStyle}>{props.user.bio}</p> : null}
          </div>
        </div>

        <PillRow pills={props.heroPills} subtle />

        <div style={simplisticBannerWrapStyle}>
          <BannerSurface
            bannerUrl={props.user.bannerUrl}
            bannerKind={props.bannerKind}
            themeColor={props.themeColor}
            height={160}
          />
        </div>

        <ProfileHeroClient
          username={props.user.username}
          initialViews={props.views}
          initialLikes={props.likes}
          initialDislikes={props.dislikes}
          themeColor={props.themeColor}
          initialMyReaction={props.initialMyReaction}
        />

        <BadgeRail badges={props.premiumBadges} themeColor={props.themeColor} minimal />
        <SocialPresenceSection blocks={props.socialBlocks} themeColor={props.themeColor} compact />
        <LinksSection
          layout="simplistic"
          links={props.user.links}
          themeColor={props.themeColor}
        />
      </div>
    </main>
  );
}

function PortfolioLayout(props: Props) {
  return (
    <main style={portfolioPageStyle}>
      <div style={portfolioBannerWrapStyle}>
        <BannerSurface
          bannerUrl={props.user.bannerUrl}
          bannerKind={props.bannerKind}
          themeColor={props.themeColor}
          height={220}
        />
      </div>

      <div style={portfolioShellStyle}>
        <aside style={portfolioSidebarStyle}>
          <div style={eyebrowStyle(props.themeColor)}>Portfolio</div>
          <AvatarVisual
            avatarUrl={props.user.avatarUrl}
            avatarInitials={props.avatarInitials}
            themeColor={props.themeColor}
            selectedDecoration={props.user.selectedDecoration}
            decorationScale={props.decorationScale}
            decorationOffsetX={props.decorationOffsetX}
            decorationOffsetY={props.decorationOffsetY}
            size={108}
            frameInset={7}
          />

          <div style={{ display: "grid", gap: "8px" }}>
            <h1 style={portfolioNameStyle}>{props.displayName}</h1>
            <div style={usernameStyle}>@{props.user.username}</div>
            {props.user.bio ? <p style={portfolioBioStyle}>{props.user.bio}</p> : null}
          </div>

          <PillRow pills={props.heroPills} subtle />

          <ProfileHeroClient
            username={props.user.username}
            initialViews={props.views}
            initialLikes={props.likes}
            initialDislikes={props.dislikes}
            themeColor={props.themeColor}
            initialMyReaction={props.initialMyReaction}
          />

          <BadgeRail badges={props.premiumBadges} themeColor={props.themeColor} />
        </aside>

        <section style={portfolioMainStyle}>
          <div style={portfolioHeadingStyle}>
            <div style={simpleKickerStyle}>Featured links</div>
            <h2 style={portfolioSectionTitleStyle}>Projects, socials and contact points</h2>
            <p style={portfolioSectionTextStyle}>
              Um layout mais limpo e profissional, com foco em clareza, reputacao e
              navegacao objetiva.
            </p>
          </div>

          <SocialPresenceSection blocks={props.socialBlocks} themeColor={props.themeColor} />
          <LinksSection
            layout="portfolio"
            links={props.user.links}
            themeColor={props.themeColor}
          />
        </section>
      </div>
    </main>
  );
}

function BannerSurface({
  bannerUrl,
  bannerKind,
  themeColor,
  height,
  roundedTop = false,
}: {
  bannerUrl: string | null;
  bannerKind: "image" | "video" | "unknown";
  themeColor: string;
  height: number;
  roundedTop?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: `${height}px`,
        borderRadius: roundedTop ? "30px 30px 0 0" : "26px",
        background: `linear-gradient(135deg, ${themeColor}, rgba(15,23,42,0.82), rgba(3,7,18,0.96))`,
      }}
    >
      {bannerUrl ? (
        bannerKind === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={bannerMediaStyle}
          >
            <source src={bannerUrl} />
          </video>
        ) : (
          <img src={bannerUrl} alt="" style={bannerMediaStyle} />
        )
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,8,12,0.10), rgba(6,8,12,0.28) 48%, rgba(6,8,12,0.68) 100%)",
        }}
      />
    </div>
  );
}

function AvatarVisual({
  avatarUrl,
  avatarInitials,
  themeColor,
  selectedDecoration,
  decorationScale,
  decorationOffsetX,
  decorationOffsetY,
  size,
  frameInset,
  minimal = false,
}: {
  avatarUrl: string | null;
  avatarInitials: string;
  themeColor: string;
  selectedDecoration: DecorationEntry | null;
  decorationScale: number;
  decorationOffsetX: number;
  decorationOffsetY: number;
  size: number;
  frameInset: number;
  minimal?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      {minimal ? null : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            background: `radial-gradient(circle, ${withAlpha(themeColor, "30")} 0%, transparent 72%)`,
            filter: "blur(16px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {selectedDecoration ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${decorationOffsetX}px, ${decorationOffsetY}px)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {selectedDecoration.mediaType === "webm" ? (
            <video
              src={selectedDecoration.imageUrl}
              poster={
                selectedDecoration.posterUrl || selectedDecoration.previewUrl || undefined
              }
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: `${decorationScale}%`,
                height: `${decorationScale}%`,
                objectFit: "contain",
                filter: `drop-shadow(0 0 18px ${withAlpha(themeColor, "26")})`,
              }}
            />
          ) : (
            <img
              src={selectedDecoration.previewUrl || selectedDecoration.imageUrl}
              alt="Avatar decoration"
              style={{
                width: `${decorationScale}%`,
                height: `${decorationScale}%`,
                objectFit: "contain",
                filter: `drop-shadow(0 0 18px ${withAlpha(themeColor, "26")})`,
              }}
            />
          )}
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: `${frameInset}px`,
          overflow: "hidden",
          borderRadius: "999px",
          border: minimal
            ? "1px solid rgba(255,255,255,0.10)"
            : `1px solid ${withAlpha(themeColor, "46")}`,
          background: "linear-gradient(180deg, rgba(11,14,20,0.98), rgba(7,10,16,0.98))",
          boxShadow: minimal
            ? "0 12px 24px rgba(0,0,0,0.18)"
            : `0 18px 36px ${withAlpha(themeColor, "16")}`,
          zIndex: 1,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(145deg, ${withAlpha(themeColor, "ee")}, rgba(96,165,250,0.72))`,
              color: "#ffffff",
              fontSize: `${Math.round(size * 0.28)}px`,
              fontWeight: 900,
              letterSpacing: "-0.06em",
            }}
          >
            {avatarInitials}
          </div>
        )}
      </div>
    </div>
  );
}

function PillRow({
  pills,
  compact = false,
  subtle = false,
}: {
  pills: HeroPill[];
  compact?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {pills.map((pill) => (
        <div
          key={pill.key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            minHeight: compact ? "32px" : "34px",
            padding: compact ? "0 11px" : "0 12px",
            borderRadius: "999px",
            color: pill.color,
            background: subtle ? "rgba(255,255,255,0.04)" : withAlpha(pill.color, "14"),
            border: `1px solid ${subtle ? "rgba(255,255,255,0.08)" : withAlpha(pill.color, "24")}`,
            fontSize: compact ? "11px" : "12px",
            fontWeight: 800,
            letterSpacing: "0.02em",
          }}
        >
          {pill.icon}
          {pill.text}
        </div>
      ))}
    </div>
  );
}

function BadgeRail({
  badges,
  themeColor,
  minimal = false,
}: {
  badges: BadgeEntry[];
  themeColor: string;
  minimal?: boolean;
}) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {badges.map((item) => (
        <div
          key={item.id}
          title={item.badge.description || item.badge.name}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            minHeight: "38px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: minimal ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              background: withAlpha(item.badge.color || themeColor, "18"),
              boxShadow: `0 10px 18px ${withAlpha(item.badge.color || themeColor, "14")}`,
              fontSize: "12px",
              flexShrink: 0,
            }}
          >
            {item.badge.icon || "B"}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#f4f4f5" }}>
            {item.badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function LinksSection({
  layout,
  links,
  themeColor,
}: {
  layout: "default" | "simplistic" | "portfolio";
  links: LinkEntry[];
  themeColor: string;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={simpleKickerStyle}>
          <LuSparkles size={13} />
          Links
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: layout === "portfolio" ? "34px" : "28px",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {layout === "portfolio" ? "Selected destinations" : "Featured destinations"}
        </h2>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {links.length > 0 ? (
          links.map((link) => {
            const platform = getLinkPlatform(link.url, link.title);
            const color = platform.color || themeColor;
            const PlatformIcon = platform.icon;
            const hostname = getLinkHostname(link.url);

            return (
              <a
                key={link.id}
                href={`/go/${link.id}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...linkCardBaseStyle,
                  ...(layout === "simplistic"
                    ? simplisticLinkCardStyle
                    : layout === "portfolio"
                      ? portfolioLinkCardStyle
                      : defaultLinkCardStyle),
                  borderColor: withAlpha(color, layout === "simplistic" ? "14" : "22"),
                }}
              >
                <div
                  style={{
                    ...linkIconStyle,
                    background: withAlpha(color, layout === "simplistic" ? "12" : "16"),
                    color,
                  }}
                >
                  <PlatformIcon size={20} color={color} aria-hidden="true" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: "17px", color: "#ffffff" }}>
                      {link.title || platform.name}
                    </strong>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: "24px",
                        padding: "0 8px",
                        borderRadius: "999px",
                        border: "1px solid currentColor",
                        color,
                        background: withAlpha(color, "0f"),
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {platform.name}
                    </span>
                  </div>

                  <div style={{ color: "#a1a1aa", fontSize: "13px", marginTop: "6px" }}>
                    {hostname}
                  </div>
                  <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>
                    {link.url}
                  </div>
                </div>

                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e4e4e7",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <LuArrowUpRight size={16} />
                </div>
              </a>
            );
          })
        ) : (
          <div style={emptyLinksStyle}>No links added yet.</div>
        )}
      </div>
    </section>
  );
}

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

function getLinkHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

const bannerMediaStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const defaultPageStyle = (themeColor: string): CSSProperties => ({
  minHeight: "100vh",
  padding: "32px 16px 40px",
  color: "#ffffff",
  fontFamily: '"Space Grotesk", Inter, Arial, Helvetica, sans-serif',
  background: `linear-gradient(180deg, rgba(5,6,10,0.98), rgba(3,4,7,1)), radial-gradient(circle at top, ${withAlpha(themeColor, "16")} 0%, transparent 28%)`,
});

const defaultShellStyle: CSSProperties = {
  width: "min(1040px, 100%)",
  margin: "0 auto",
  borderRadius: "30px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(10,11,16,0.98), rgba(7,8,12,0.98))",
  boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
};

const defaultContentStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  padding: "0 26px 28px",
  marginTop: "-54px",
};

const defaultIdentityStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "18px",
  alignItems: "end",
};

const defaultNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "46px",
  lineHeight: 0.96,
  letterSpacing: "-0.06em",
};

const usernameStyle: CSSProperties = {
  color: "#9ca3af",
  fontSize: "15px",
  fontWeight: 700,
};

const defaultBioStyle: CSSProperties = {
  margin: 0,
  color: "#d4d4d8",
  lineHeight: 1.8,
  fontSize: "15px",
  whiteSpace: "pre-wrap",
};

const simplisticPageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "42px 16px",
  color: "#ffffff",
  fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  background: "#06070b",
};

const simplisticShellStyle: CSSProperties = {
  width: "min(820px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "18px",
};

const simplisticHeaderStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "18px",
  alignItems: "center",
  padding: "22px 0 4px",
};

const simplisticNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "44px",
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
};

const simplisticBioStyle: CSSProperties = {
  margin: 0,
  color: "#c4c7cf",
  lineHeight: 1.75,
  fontSize: "15px",
  whiteSpace: "pre-wrap",
};

const simplisticBannerWrapStyle: CSSProperties = {
  marginTop: "4px",
};

const portfolioPageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "26px 16px 38px",
  color: "#ffffff",
  fontFamily: '"Space Grotesk", Inter, Arial, Helvetica, sans-serif',
  background: "linear-gradient(180deg, #071018 0%, #04070d 100%)",
};

const portfolioBannerWrapStyle: CSSProperties = {
  width: "min(1160px, 100%)",
  margin: "0 auto 18px",
};

const portfolioShellStyle: CSSProperties = {
  width: "min(1160px, 100%)",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "320px minmax(0, 1fr)",
  gap: "18px",
};

const portfolioSidebarStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "18px",
  padding: "22px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(10,14,22,0.98), rgba(8,10,16,0.98))",
};

const portfolioMainStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "22px",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(10,14,22,0.98), rgba(8,10,16,0.98))",
};

const portfolioHeadingStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const portfolioNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "40px",
  lineHeight: 0.96,
  letterSpacing: "-0.05em",
};

const portfolioBioStyle: CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.8,
  fontSize: "14px",
  whiteSpace: "pre-wrap",
};

const portfolioSectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "36px",
  lineHeight: 0.98,
  letterSpacing: "-0.05em",
};

const portfolioSectionTextStyle: CSSProperties = {
  margin: 0,
  color: "#aab4c8",
  lineHeight: 1.75,
  fontSize: "14px",
  maxWidth: "62ch",
};

const simpleKickerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  minHeight: "34px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e4e4e7",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const eyebrowStyle = (themeColor: string): CSSProperties => ({
  display: "inline-flex",
  width: "fit-content",
  minHeight: "34px",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: "999px",
  color: "#f9a8d4",
  background: withAlpha(themeColor, "12"),
  border: `1px solid ${withAlpha(themeColor, "24")}`,
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const linkCardBaseStyle: CSSProperties = {
  textDecoration: "none",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "14px",
  borderRadius: "22px",
};

const defaultLinkCardStyle: CSSProperties = {
  padding: "14px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const simplisticLinkCardStyle: CSSProperties = {
  padding: "14px",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const portfolioLinkCardStyle: CSSProperties = {
  padding: "16px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.018))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const linkIconStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  flexShrink: 0,
};

const emptyLinksStyle: CSSProperties = {
  borderRadius: "22px",
  border: "1px dashed rgba(255,255,255,0.16)",
  padding: "26px 18px",
  textAlign: "center",
  color: "#a1a1aa",
  background: "rgba(255,255,255,0.02)",
};
