import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

export default async function AdminBadgesPage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ color: "#fff" }}>
      <h1>Admin Badges</h1>

      <div style={{ marginTop: "20px" }}>
        {badges.map((badge) => (
          <div key={badge.id}>
            {badge.icon} {badge.name}
          </div>
        ))}
      </div>
    </main>
  );
}