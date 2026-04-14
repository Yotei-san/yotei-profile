import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function BadgesPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return (
    <main style={{ color: "#fff", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "36px" }}>Suas badges</h1>

      <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {user.badges.length > 0 ? (
          user.badges.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                backgroundColor: "rgba(244,114,182,0.10)",
                border: "1px solid rgba(244,114,182,0.20)",
                color: "#f9a8d4",
                fontWeight: 700,
              }}
            >
              {item.badge.icon} {item.badge.name}
            </div>
          ))
        ) : (
          <div style={{ color: "#9ca3af" }}>
            Você ainda não possui badges.
          </div>
        )}
      </div>
    </main>
  );
}