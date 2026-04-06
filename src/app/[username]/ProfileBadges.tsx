type ProfileBadgeItem = {
  id: string;
  isPinned: boolean;
  badge: {
    key: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
};

export default function ProfileBadges({
  badges,
}: {
  badges: ProfileBadgeItem[];
}) {
  if (badges.length === 0) return null;

  const sorted = [...badges].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "12px",
        marginBottom: "6px",
      }}
    >
      {sorted.map((item) => (
        <div
          key={item.id}
          title={item.badge.name}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "999px",
            backgroundColor: `${item.badge.color ?? "#ffffff"}18`,
            border: `1px solid ${item.badge.color ?? "#ffffff"}30`,
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: `0 10px 24px ${(item.badge.color ?? "#ffffff")}22`,
          }}
        >
          <span>{item.badge.icon || "🏅"}</span>
          <span>{item.badge.name}</span>
          {item.isPinned && <span>📌</span>}
        </div>
      ))}
    </div>
  );
}
