import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import ReactionBar from "./ReactionBar";
import ProfileTracker from "./ProfileTracker";
import ProfileBadges from "./ProfileBadges";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

type PublicLink = {
  id: string;
  title: string | null;
  url: string;
};

type SocialLinkItem = {
  label: string;
  url: string;
  symbol: string;
};

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  if (value.length === 3) {
    const r = parseInt(value[0] + value[0], 16);
    const g = parseInt(value[1] + value[1], 16);
    const b = parseInt(value[2] + value[2], 16);
    return `${r}, ${g}, ${b}`;
  }

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function getPageBackground(
  backgroundStyle: string | null | undefined,
  backgroundUrl: string | null | undefined,
  bannerUrl: string | null | undefined,
  themeColor: string
) {
  if (backgroundStyle === "solid") return "#080808";

  if (backgroundStyle === "image" && backgroundUrl) {
    return `linear-gradient(rgba(8,8,8,0.60), rgba(8,8,8,0.88)), url(${backgroundUrl}) center/cover no-repeat fixed`;
  }

  if (backgroundStyle === "banner-soft" && bannerUrl) {
    return `linear-gradient(rgba(8,8,8,0.72), rgba(8,8,8,0.92)), url(${bannerUrl}) center/cover no-repeat fixed`;
  }

  return `linear-gradient(180deg, ${themeColor}20 0%, #0a0a0a 30%, #111827 100%)`;
}

function getButtonStyle(
  linksStyle: string | null | undefined,
  buttonStyle: string | null | undefined,
  themeColor: string,
  rgb: string,
  textColor: string,
  glowIntensity: number
): React.CSSProperties {
  const radius =
    linksStyle === "square" ? "10px" : linksStyle === "pill" ? "999px" : "18px";

  if (buttonStyle === "glass") {
    return {
      display: "block",
      textDecoration: "none",
      backgroundColor: "rgba(255,255,255,0.06)",
      border: `1px solid rgba(${rgb}, 0.28)`,
      borderRadius: radius,
      padding: "20px 22px",
      color: textColor,
      fontWeight: "bold",
      textAlign: "center",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: `0 10px 30px rgba(${rgb}, ${glowIntensity / 250})`,
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
    };
  }

  if (buttonStyle === "outline") {
    return {
      display: "block",
      textDecoration: "none",
      backgroundColor: "transparent",
      border: `2px solid ${themeColor}`,
      borderRadius: radius,
      padding: "20px 22px",
      color: textColor,
      fontWeight: "bold",
      textAlign: "center",
      boxShadow: `0 10px 24px rgba(${rgb}, ${glowIntensity / 300})`,
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
    };
  }

  return {
    display: "block",
    textDecoration: "none",
    backgroundColor: themeColor,
    border: `1px solid rgba(${rgb}, 0.28)`,
    borderRadius: radius,
    padding: "20px 22px",
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: `0 12px 26px rgba(${rgb}, ${glowIntensity / 200})`,
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  };
}

function getContainerWidth(containerWidth: string | null | undefined) {
  if (containerWidth === "narrow") return "760px";
  if (containerWidth === "wide") return "1120px";
  return "900px";
}

function getAvatarWrapperStyle(position: string | null | undefined): React.CSSProperties {
  if (position === "left") return { margin: "0 auto 0 0" };
  if (position === "right") return { margin: "0 0 0 auto" };
  return { margin: "0 auto" };
}

function socialLinks(user: {
  websiteUrl: string | null;
  discordUrl: string | null;
  githubUrl: string | null;
  xUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
}): SocialLinkItem[] {
  return [
    { label: "Site", url: user.websiteUrl, symbol: "🌐" },
    { label: "Discord", url: user.discordUrl, symbol: "💬" },
    { label: "GitHub", url: user.githubUrl, symbol: "🐙" },
    { label: "X", url: user.xUrl, symbol: "𝕏" },
    { label: "Instagram", url: user.instagramUrl, symbol: "📸" },
    { label: "YouTube", url: user.youtubeUrl, symbol: "▶" },
    { label: "TikTok", url: user.tiktokUrl, symbol: "♪" },
  ].filter((item): item is SocialLinkItem => Boolean(item.url));
}

function getOrderedBlocks(blocksOrder: string | null | undefined) {
  const fallback = ["stats", "about", "gallery", "music", "reactions", "links"];
  if (!blocksOrder) return fallback;

  const parsed = blocksOrder
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const unique = [...new Set(parsed)];
  const missing = fallback.filter((item) => !unique.includes(item));

  return [...unique, ...missing];
}

function Badge({ value, premium = false }: { value: string; premium?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 12px",
        borderRadius: "999px",
        backgroundColor: premium ? "rgba(236,72,153,0.14)" : "rgba(255,255,255,0.08)",
        border: premium ? "1px solid rgba(236,72,153,0.22)" : "1px solid rgba(255,255,255,0.14)",
        fontWeight: "bold",
        fontSize: "14px",
        color: premium ? "#f9a8d4" : "#fff",
      }}
    >
      {premium ? "★" : "✦"} {value}
    </span>
  );
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      badges: {
        include: {
          badge: true,
        },
        orderBy: [{ isPinned: "desc" }, { earnedAt: "desc" }],
      },
    },
  });

  if (!user) notFound();

  const premium = isPremiumPlan(user);
  const themeColor = user.themeColor || "#2563eb";
  const textColor = user.textColor || "#ffffff";
  const cardOpacity = user.cardOpacity ?? 72;
  const cardBlur = user.cardBlur ?? 16;
  const glowIntensity = user.glowIntensity ?? 35;
  const rgb = hexToRgb(themeColor);
  const typedLinks: PublicLink[] = user.links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
  }));

  const pageBackground = getPageBackground(
    user.backgroundStyle,
    user.backgroundUrl,
    user.bannerUrl,
    themeColor
  );

  const socials = socialLinks(user);
  const stats = [
    { label: user.stat1Label, value: user.stat1Value },
    { label: user.stat2Label, value: user.stat2Value },
    { label: user.stat3Label, value: user.stat3Value },
  ].filter(
    (item): item is { label: string; value: string } => Boolean(item.label && item.value)
  );

  const pinnedBadges = user.badges.filter((item) => item.isPinned);
  const fallbackBadges = [user.badge1, user.badge2, user.badge3].filter(Boolean) as string[];

  const gallery = [
    user.gallery1,
    user.gallery2,
    user.gallery3,
    user.gallery4,
    user.gallery5,
    user.gallery6,
  ].filter(Boolean) as string[];

  const orderedBlocks = getOrderedBlocks(user.blocksOrder);

  const blockMap: Record<string, React.ReactNode> = {
    stats:
      user.showStats && stats.length > 0 ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              style={{
                backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
                backdropFilter: `blur(${cardBlur}px)`,
                WebkitBackdropFilter: `blur(${cardBlur}px)`,
                border: `1px solid rgba(${rgb}, 0.18)`,
                borderRadius: "22px",
                padding: "22px",
                textAlign: "center",
                boxShadow: `0 10px 28px rgba(${rgb}, ${glowIntensity / 520})`,
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: "bold", color: themeColor }}>
                {stat.value}
              </div>
              <div style={{ marginTop: "8px", color: "#d1d5db", fontSize: "14px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      ) : null,

    about:
      user.showAbout && (user.aboutTitle || user.aboutText) ? (
        <section
          style={{
            backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
            backdropFilter: `blur(${cardBlur}px)`,
            WebkitBackdropFilter: `blur(${cardBlur}px)`,
            border: `1px solid rgba(${rgb}, 0.18)`,
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "18px",
            boxShadow: `0 10px 28px rgba(${rgb}, ${glowIntensity / 520})`,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "14px", fontSize: "28px" }}>
            {user.aboutTitle || "Sobre"}
          </h2>
          <p style={{ margin: 0, color: textColor, lineHeight: 1.8 }}>
            {user.aboutText || ""}
          </p>
        </section>
      ) : null,

    gallery:
      user.showGallery && gallery.length > 0 ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          {gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                border: `1px solid rgba(${rgb}, 0.18)`,
                backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
                backdropFilter: `blur(${cardBlur}px)`,
                WebkitBackdropFilter: `blur(${cardBlur}px)`,
                boxShadow: `0 10px 28px rgba(${rgb}, ${glowIntensity / 520})`,
              }}
            >
              <img
                src={image}
                alt={`Galeria ${index + 1}`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </section>
      ) : null,

    music:
      user.showMusic && user.musicUrl ? (
        <section
          style={{
            backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
            backdropFilter: `blur(${cardBlur}px)`,
            WebkitBackdropFilter: `blur(${cardBlur}px)`,
            border: `1px solid rgba(${rgb}, 0.18)`,
            borderRadius: "24px",
            padding: "18px",
            marginBottom: "18px",
            boxShadow: `0 10px 28px rgba(${rgb}, ${glowIntensity / 520})`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#111827",
                flexShrink: 0,
              }}
            >
              {user.musicCoverUrl ? (
                <img
                  src={user.musicCoverUrl}
                  alt="Capa"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : null}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {user.musicTitle || "Música do perfil"}
              </div>
              <div style={{ color: "#d1d5db", marginTop: "6px" }}>
                {user.musicArtist || "Artista"}
              </div>
            </div>
          </div>

          <audio controls src={user.musicUrl} style={{ width: "100%", marginTop: "16px" }} />
        </section>
      ) : null,

    reactions:
      user.showReactions ? (
        <section
          style={{
            backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
            backdropFilter: `blur(${cardBlur}px)`,
            WebkitBackdropFilter: `blur(${cardBlur}px)`,
            border: `1px solid rgba(${rgb}, 0.18)`,
            borderRadius: "24px",
            padding: "18px",
            marginBottom: "18px",
            boxShadow: `0 10px 28px rgba(${rgb}, ${glowIntensity / 520})`,
          }}
        >
          <ReactionBar username={user.username} />
        </section>
      ) : null,

    links: (
      <div style={{ display: "grid", gap: "16px", marginBottom: "18px" }}>
        {typedLinks.length === 0 ? (
          <div
            style={{
              backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
              backdropFilter: `blur(${cardBlur}px)`,
              WebkitBackdropFilter: `blur(${cardBlur}px)`,
              border: `1px solid rgba(${rgb}, 0.16)`,
              borderRadius: "20px",
              padding: "22px",
              textAlign: "center",
              color: "#cbd5e1",
            }}
          >
            Nenhum link disponível.
          </div>
        ) : (
          typedLinks.map((link) => (
            <a
              key={link.id}
              href={`/go/${link.id}`}
              style={getButtonStyle(
                user.linksStyle,
                user.buttonStyle,
                themeColor,
                rgb,
                textColor,
                glowIntensity
              )}
            >
              {link.title || link.url}
            </a>
          ))
        )}
      </div>
    ),
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: pageBackground,
        color: textColor,
        padding: "36px 20px 60px 20px",
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
      }}
    >
      <ProfileTracker username={user.username} />

      {premium && user.videoBgUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.22,
            pointerEvents: "none",
          }}
        >
          <source src={user.videoBgUrl} />
        </video>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: getContainerWidth(user.containerWidth),
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            borderRadius: "30px",
            overflow: "hidden",
            marginBottom: "28px",
            border: `1px solid rgba(${rgb}, 0.20)`,
            boxShadow: `0 20px 70px rgba(${rgb}, ${glowIntensity / 450})`,
            backgroundColor: `rgba(10,10,10,0.45)`,
            backdropFilter: `blur(${cardBlur}px)`,
            WebkitBackdropFilter: `blur(${cardBlur}px)`,
          }}
        >
          <div
            style={{
              height: "300px",
              background: user.bannerUrl
                ? `url(${user.bannerUrl}) center/cover no-repeat`
                : `linear-gradient(135deg, ${themeColor}, #111827)`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.52))",
              }}
            />
          </div>

          <div
            style={{
              padding: "0 30px 30px 30px",
              marginTop: "-72px",
              position: "relative",
              zIndex: 2,
              textAlign:
                user.avatarPosition === "left"
                  ? "left"
                  : user.avatarPosition === "right"
                  ? "right"
                  : "center",
            }}
          >
            <div
              style={{
                width: "142px",
                height: "142px",
                borderRadius: "999px",
                overflow: "hidden",
                border: `4px solid ${themeColor}`,
                backgroundColor: "#0f172a",
                boxShadow: `0 14px 34px rgba(${rgb}, 0.18)`,
                ...getAvatarWrapperStyle(user.avatarPosition),
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "44px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {(user.displayName || user.username).slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <h1 style={{ margin: "18px 0 8px 0", fontSize: "42px", lineHeight: 1.1 }}>
              {user.displayName || user.username}
            </h1>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent:
                  user.avatarPosition === "left"
                    ? "flex-start"
                    : user.avatarPosition === "right"
                    ? "flex-end"
                    : "center",
                marginTop: "8px",
              }}
            >
              <span style={{ color: "#d1d5db" }}>@{user.username}</span>
              {premium && user.premiumBadge && <Badge value="Premium" premium />}
            </div>

            {pinnedBadges.length > 0 ? (
              <ProfileBadges badges={pinnedBadges} />
            ) : fallbackBadges.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent:
                    user.avatarPosition === "left"
                      ? "flex-start"
                      : user.avatarPosition === "right"
                      ? "flex-end"
                      : "center",
                  marginTop: "16px",
                }}
              >
                {fallbackBadges.map((badge, index) => (
                  <Badge key={`${badge}-${index}`} value={badge} />
                ))}
              </div>
            ) : null}

            <div
              style={{
                marginTop: "20px",
                backgroundColor: `rgba(15,15,15,${cardOpacity / 100})`,
                backdropFilter: `blur(${cardBlur}px)`,
                WebkitBackdropFilter: `blur(${cardBlur}px)`,
                border: `1px solid rgba(${rgb}, 0.20)` ,
                borderRadius: "24px",
                padding: "22px",
                boxShadow: "0 10px 28px rgba(0,0,0,0.24)",
              }}
            >
              <p style={{ margin: 0, lineHeight: 1.7, color: textColor }}>
                {user.bio || "Sem bio ainda."}
              </p>

              {user.showSocials && socials.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent:
                      user.avatarPosition === "left"
                        ? "flex-start"
                        : user.avatarPosition === "right"
                        ? "flex-end"
                        : "center",
                    marginTop: "18px",
                  }}
                >
                  {socials.map((item) => (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        backgroundColor: `rgba(255,255,255,0.06)`,
                        border: `1px solid rgba(${rgb}, 0.18)`,
                        color: textColor,
                        padding: "10px 14px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.symbol} {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {orderedBlocks.map((blockKey) => (
          <div key={blockKey}>{blockMap[blockKey] ?? null}</div>
        ))}
      </div>
    </main>
  );
}
