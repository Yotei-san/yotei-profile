import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getLinkPlatform } from "@/app/lib/link-icons";
import ProfileHeroClient from "./ProfileHeroClient";
import { getCurrentUser } from "@/app/lib/auth";

type Props = {
  params: Promise<{ username: string }>;
};

function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

type MyReaction = "like" | "dislike" | null;

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      themeColor: true,
      status: true,
      role: true,

      selectedDecorationScale: true,
      selectedDecorationOffsetX: true,
      selectedDecorationOffsetY: true,
      selectedDecoration: {
        select: {
          imageUrl: true,
          previewUrl: true,
          posterUrl: true,
          mediaType: true,
        },
      },

      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          url: true,
        },
      },

      reactionsReceived: {
        select: {
          type: true,
        },
      },

      profileViews: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user || user.status === "banned") {
    notFound();
  }

  let initialMyReaction: MyReaction = null;

  if (currentUser && currentUser.id !== user.id) {
    const myReaction = await prisma.reaction.findFirst({
      where: {
        fromUserId: currentUser.id,
        toUserId: user.id,
      },
      select: {
        type: true,
      },
    });

    if (myReaction?.type === "like" || myReaction?.type === "dislike") {
      initialMyReaction = myReaction.type;
    }
  }

  const themeColor = user.themeColor || "#f472b6";
  const decorationScale = user.selectedDecorationScale ?? 165;
  const decorationOffsetX = user.selectedDecorationOffsetX ?? 0;
  const decorationOffsetY = user.selectedDecorationOffsetY ?? 0;

  const premiumBadges = user.badges.slice(0, 4);

  const likes = user.reactionsReceived.reduce(
    (acc, item) => (item.type === "like" ? acc + 1 : acc),
    0
  );

  const dislikes = user.reactionsReceived.reduce(
    (acc, item) => (item.type === "dislike" ? acc + 1 : acc),
    0
  );

  const views = user.profileViews.length;

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
        paddingBottom: "80px",
        background: user.bannerUrl
          ? `linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.86)), url(${user.bannerUrl}) center/cover no-repeat`
          : `radial-gradient(circle at top, ${withAlpha(
              themeColor,
              "20"
            )}, transparent 20%), #040404`,
      }}
    >
      <style>{`
        .yotei-profile-shell {
          animation: fadeUp 420ms ease;
        }

        .hg-avatar {
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .hg-avatar:hover {
          transform: translateY(-2px) scale(1.02);
        }

        .hg-link-card {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .hg-link-card:hover {
          transform: translateY(-3px);
        }

        .hg-link-arrow {
          transition: transform 180ms ease, opacity 180ms ease;
          opacity: 0.72;
        }

        .hg-link-card:hover .hg-link-arrow {
          transform: translateX(4px);
          opacity: 1;
        }

        .hg-top-pill {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .hg-top-pill:hover {
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{ height: "220px" }} />

      <div
        className="yotei-profile-shell"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          marginTop: "-96px",
          padding: "0 16px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,14,0.42), rgba(6,6,8,0.60))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "28px",
            padding: "22px 22px 26px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.34)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            {user.role === "owner" ? (
              <TopPill text="👑 Owner" color="#facc15" />
            ) : null}

            {user.role === "admin" ? (
              <TopPill text="🛡️ Admin" color="#60a5fa" />
            ) : null}

            <TopPill
              text={user.status === "active" ? "● Active" : user.status}
              color={user.status === "active" ? "#4ade80" : "#a1a1aa"}
            />

            {user.selectedDecoration ? (
              <TopPill text="✦ Decorated" color={themeColor} />
            ) : null}

            {premiumBadges.length > 0 ? (
              <TopPill
                text={`🏅 ${premiumBadges.length} Badge${
                  premiumBadges.length > 1 ? "s" : ""
                }`}
                color="#c084fc"
              />
            ) : null}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="hg-avatar"
              style={{
                width: "146px",
                height: "146px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.selectedDecoration ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 3,
                    transform: `translate(${decorationOffsetX}px, ${decorationOffsetY}px)`,
                  }}
                >
                  {user.selectedDecoration.mediaType === "webm" ? (
                    <video
                      src={user.selectedDecoration.imageUrl}
                      poster={
                        user.selectedDecoration.posterUrl ||
                        user.selectedDecoration.previewUrl ||
                        undefined
                      }
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: `${decorationScale}%`,
                        height: `${decorationScale}%`,
                        objectFit: "contain",
                        filter: `drop-shadow(0 0 18px ${withAlpha(
                          themeColor,
                          "30"
                        )})`,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        user.selectedDecoration.previewUrl ||
                        user.selectedDecoration.imageUrl
                      }
                      alt="Avatar decoration"
                      style={{
                        width: `${decorationScale}%`,
                        height: `${decorationScale}%`,
                        objectFit: "contain",
                        filter: `drop-shadow(0 0 18px ${withAlpha(
                          themeColor,
                          "30"
                        )})`,
                      }}
                    />
                  )}
                </div>
              ) : null}

              <div
                style={{
                  width: "146px",
                  height: "146px",
                  borderRadius: "999px",
                  overflow: "hidden",
                  border: `5px solid ${themeColor}`,
                  boxShadow: `
                    0 0 0 10px rgba(0,0,0,0.55),
                    0 22px 60px ${withAlpha(themeColor, "55")},
                    0 0 40px ${withAlpha(themeColor, "30")}
                  `,
                  backgroundColor: "#000",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <img
                  src={user.avatarUrl || "https://placehold.co/300x300?text=Y"}
                  alt={user.username}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                textShadow: "0 10px 30px rgba(0,0,0,0.45)",
              }}
            >
              {user.displayName || user.username}
            </h1>

            <div
              style={{
                marginTop: "8px",
                color: "#cbd5e1",
                fontSize: "16px",
              }}
            >
              @{user.username}
            </div>
          </div>

          <ProfileHeroClient
            username={user.username}
            initialViews={views}
            initialLikes={likes}
            initialDislikes={dislikes}
            themeColor={themeColor}
            initialMyReaction={initialMyReaction}
          />

          {premiumBadges.length > 0 ? (
            <div
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {premiumBadges.map((item) => (
                <div
                  key={item.id}
                  className="hg-top-pill"
                  title={item.badge.description || item.badge.name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {item.badge.icon || "🏅"}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#f3f4f6",
                    }}
                  >
                    {item.badge.name}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {user.bio ? (
            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
                color: "#e5e7eb",
                lineHeight: 1.75,
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "18px",
                padding: "16px 18px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {user.bio}
            </div>
          ) : null}
        </section>

        <section
          style={{
            marginTop: "18px",
            display: "grid",
            gap: "14px",
          }}
        >
          {user.links.length > 0 ? (
            user.links.map((link) => {
              const platform = getLinkPlatform(link.url, link.title);
              const color = platform.color || themeColor;

              return (
                <a
                  key={link.id}
                  href={`/go/${link.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hg-link-card"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px",
                    borderRadius: "22px",
                    background: `
                      linear-gradient(180deg, rgba(14,14,18,0.74), rgba(8,8,12,0.86)),
                      radial-gradient(circle at left, ${withAlpha(
                        color,
                        "18"
                      )}, transparent 56%)
                    `,
                    border: `1px solid ${withAlpha(color, "2e")}`,
                    boxShadow: `
                      0 14px 32px ${withAlpha(color, "12")},
                      inset 0 1px 0 rgba(255,255,255,0.03)
                    `,
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(180deg, ${withAlpha(
                        color,
                        "22"
                      )}, ${withAlpha(color, "10")})`,
                      border: `1px solid ${withAlpha(color, "40")}`,
                      boxShadow: `0 10px 24px ${withAlpha(color, "18")}`,
                      flexShrink: 0,
                    }}
                  >
                    {platform.svg ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill={color}
                        aria-hidden="true"
                      >
                        <path d={platform.svg} />
                      </svg>
                    ) : (
                      <span style={{ fontSize: "20px" }}>🔗</span>
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: "18px",
                          color: "#fff",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {link.title || platform.name}
                      </span>

                      <span
                        style={{
                          fontSize: "11px",
                          color,
                          backgroundColor: withAlpha(color, "16"),
                          border: `1px solid ${withAlpha(color, "26")}`,
                          borderRadius: "999px",
                          padding: "4px 8px",
                          fontWeight: 800,
                        }}
                      >
                        {platform.name}
                      </span>
                    </div>

                    <div
                      style={{
                        color: "#b6bec9",
                        fontSize: "13px",
                        marginTop: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {link.url}
                    </div>
                  </div>

                  <div
                    className="hg-link-arrow"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "#d4d4d8",
                      flexShrink: 0,
                      fontSize: "16px",
                    }}
                  >
                    ↗
                  </div>
                </a>
              );
            })
          ) : (
            <div
              style={{
                border: "1px dashed #333",
                borderRadius: "18px",
                padding: "24px",
                textAlign: "center",
                color: "#8a8f98",
                backgroundColor: "rgba(10,10,12,0.56)",
                backdropFilter: "blur(14px)",
              }}
            >
              Nenhum link adicionado.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TopPill({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="hg-top-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 12px",
        borderRadius: "999px",
        backgroundColor: withAlpha(color, "14"),
        border: `1px solid ${withAlpha(color, "2a")}`,
        color,
        fontSize: "13px",
        fontWeight: 900,
        backdropFilter: "blur(10px)",
        boxShadow: `0 10px 24px ${withAlpha(color, "12")}`,
      }}
    >
      {text}
    </div>
  );
}