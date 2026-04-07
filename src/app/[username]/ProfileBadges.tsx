type ProfileBadgeItem = {
  id: string;
  isPinned: boolean;
  badge: {
    key: string;
    name: string;
    icon: string | null;
    color: string | null;
    rarity?: string | null;
  };
};

function badgeStyle(rarity: string | null | undefined, color: string | null | undefined) {
  switch (rarity) {
    case "owner":
      return {
        background: "linear-gradient(135deg, rgba(244,63,94,0.18), rgba(190,24,93,0.18))",
        border: `1px solid ${color ?? "#f43f5e"}44`,
      };
    case "legendary":
      return {
        background: "linear-gradient(135deg, rgba(250,204,21,0.16), rgba(245,158,11,0.16))",
        border: `1px solid ${color ?? "#facc15"}44`,
      };
    case "epic":
      return {
        background: "linear-gradient(135deg, rgba(192,132,252,0.16), rgba(168,85,247,0.16))",
        border: `1px solid ${color ?? "#c084fc"}44`,
      };
    case "rare":
      return {
        background: "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(14,165,233,0.16))",
        border: `1px solid ${color ?? "#38bdf8"}44`,
      };
    default:
      return {
        background: `${color ?? "#ffffff"}18`,
        border: `1px solid ${color ?? "#ffffff"}30`,
      };
  }
}

export default function ProfileBadges({
  badges,
}: {
  badges: ProfileBadgeItem[];
}) {
  if (badges.length === 0) return null;

  const sorted = [...badges]
    .filter((item) => item.isPinned)
    .sort((a, b) => a.badge.name.localeCompare(b.badge.name));

  if (sorted.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "16px",
        marginBottom: "6px",
      }}
    >
      {sorted.map((item) => {
        const style = badgeStyle(item.badge.rarity, item.badge.color);

        return (
          <div
            key={item.id}
            title={item.badge.name}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 13px",
              borderRadius: "999px",
              background: style.background,
              border: style.border,
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 800,
              boxShadow: `0 10px 24px ${(item.badge.color ?? "#ffffff")}22`,
              letterSpacing: "0.01em",
            }}
          >
            <span>{item.badge.icon || "🏅"}</span>
            <span>{item.badge.name}</span>
          </div>
        );
      })}
    </div>
  );
}
