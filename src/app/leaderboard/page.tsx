import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

type LeaderboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

function getCount(type: "like" | "dislike", reactions: { type: string }[]) {
  return reactions.reduce(
    (total, item) => (item.type === type ? total + 1 : total),
    0
  );
}

function normalizeTab(tab?: string) {
  if (tab === "dislikes") return "dislikes";
  if (tab === "views") return "views";
  if (tab === "clicks") return "clicks";
  if (tab === "score") return "score";
  return "likes";
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeTab = normalizeTab(resolvedSearchParams.tab);

  const users = await prisma.user.findMany({
    include: {
      reactionsReceived: {
        select: {
          type: true,
        },
      },
      profileViews: true,
      links: {
        include: {
          _count: {
            select: { clicks: true },
          },
        },
      },
    },
  });

  const mapped = users.map((user) => {
    const likes = getCount("like", user.reactionsReceived);
    const dislikes = getCount("dislike", user.reactionsReceived);
    const views = user.profileViews.length;
    const clicks = user.links.reduce((acc, link) => acc + link._count.clicks, 0);

    return {
      username: user.username,
      displayName: user.displayName || user.username,
      likes,
      dislikes,
      score: likes - dislikes,
      views,
      clicks,
    };
  });

  const sorted = [...mapped].sort((a, b) => {
    if (activeTab === "dislikes") return b.dislikes - a.dislikes;
    if (activeTab === "views") return b.views - a.views;
    if (activeTab === "clicks") return b.clicks - a.clicks;
    if (activeTab === "score") return b.score - a.score;
    return b.likes - a.likes;
  });

  const titleMap: Record<string, string> = {
    likes: "Mais Likes",
    dislikes: "Mais Dislikes",
    views: "Mais Views",
    clicks: "Mais Clicks",
    score: "Melhor Score",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), #070707",
        color: "#fff",
        padding: "28px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: "42px", margin: 0 }}>Leaderboard</h1>
            <p style={{ color: "#a3a3a3", marginTop: "8px" }}>
              Ranking de perfis por engajamento e tráfego
            </p>
          </div>

          <Link href="/dashboard" style={topLinkStyle}>
            Voltar ao dashboard
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#0c0c0c",
            border: "1px solid #1f1f1f",
            borderRadius: "18px",
            padding: "16px",
            marginBottom: "24px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <TabLink label="Likes" value="likes" active={activeTab === "likes"} />
          <TabLink label="Dislikes" value="dislikes" active={activeTab === "dislikes"} />
          <TabLink label="Views" value="views" active={activeTab === "views"} />
          <TabLink label="Clicks" value="clicks" active={activeTab === "clicks"} />
          <TabLink label="Score" value="score" active={activeTab === "score"} />
        </div>

        <section
          style={{
            backgroundColor: "#0d0d0d",
            border: "1px solid #262626",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "18px", fontSize: "28px" }}>
            {titleMap[activeTab]}
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {sorted.length === 0 ? (
              <div style={emptyBoxStyle}>Sem dados ainda.</div>
            ) : (
              sorted.slice(0, 20).map((item, index) => (
                <div
                  key={`${activeTab}-${item.username}-${index}`}
                  style={{
                    background:
                      index < 3
                        ? "linear-gradient(180deg, rgba(48,16,31,1), rgba(26,12,18,1))"
                        : "#141414",
                    border:
                      index < 3
                        ? "1px solid rgba(236,72,153,0.22)"
                        : "1px solid #2a2a2a",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                      #{index + 1} {item.displayName}
                    </div>
                    <div style={{ color: "#a3a3a3", fontSize: "14px", marginTop: "4px" }}>
                      @{item.username}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <StatPill label="Likes" value={item.likes} />
                    <StatPill label="Dislikes" value={item.dislikes} />
                    <StatPill label="Views" value={item.views} />
                    <StatPill label="Clicks" value={item.clicks} />
                    <StatPill label="Score" value={item.score} highlight />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function TabLink({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <Link
      href={`/leaderboard?tab=${value}`}
      style={{
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: "12px",
        border: active ? "1px solid rgba(236,72,153,0.35)" : "1px solid #2a2a2a",
        backgroundColor: active ? "rgba(236,72,153,0.12)" : "#111111",
        color: active ? "#f9a8d4" : "#fff",
        fontWeight: "bold",
        fontSize: "14px",
      }}
    >
      {label}
    </Link>
  );
}

function StatPill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: "12px",
        backgroundColor: highlight ? "rgba(236,72,153,0.12)" : "#0f0f0f",
        border: highlight ? "1px solid rgba(236,72,153,0.28)" : "1px solid #242424",
        minWidth: "92px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "12px", color: highlight ? "#f9a8d4" : "#a3a3a3" }}>
        {label}
      </div>
      <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "4px" }}>{value}</div>
    </div>
  );
}

const topLinkStyle = {
  textDecoration: "none",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
} as const;

const emptyBoxStyle = {
  border: "1px dashed #333",
  borderRadius: "12px",
  padding: "20px",
  color: "#a3a3a3",
  textAlign: "center" as const,
};
