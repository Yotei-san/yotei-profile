import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId } from "@/app/lib/admin-auth";

export default async function AdminAuditPage() {
  const sessionUser = await requireUser();
  await requireAdminByUserId(sessionUser.id);

  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actorUser: {
        select: { username: true },
      },
      targetUser: {
        select: { username: true },
      },
    },
  });

  return (
    <main style={{ color: "#fff" }}>
      <h1>Audit Logs</h1>

      <div style={{ marginTop: "20px" }}>
        {logs.map((log) => (
          <div key={log.id} style={{ marginBottom: "12px" }}>
            <strong>{log.actorUser?.username}</strong> → {log.action}
          </div>
        ))}
      </div>
    </main>
  );
}