import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";
import BadgeVisual from "@/app/dashboard/components/BadgeVisual";

export default async function AdminBadgesPage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ color: "#fff", display: "grid", gap: "20px" }}>
      <h1 style={{ margin: 0 }}>Admin Badges</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 18px",
              borderRadius: "20px",
              border: `1px solid ${(badge.color ?? "#ffffff")}2e`,
              background:
                "linear-gradient(180deg, rgba(16,18,27,0.98), rgba(9,11,18,0.98))",
              boxShadow: `0 18px 34px ${(badge.color ?? "#ffffff")}14`,
            }}
          >
            <BadgeVisual
              slug={badge.slug}
              icon={badge.icon}
              name={badge.name}
              color={badge.color}
              rarity={badge.rarity}
              category={badge.category}
              size={52}
            />
            <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
              <div style={{ fontWeight: 800 }}>{badge.name}</div>
              <div style={{ color: "#9aa6bf", fontSize: "12px" }}>{badge.slug}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
