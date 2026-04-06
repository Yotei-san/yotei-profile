import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const ids = Array.isArray(body?.ids) ? body.ids as string[] : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "Lista inválida." }, { status: 400 });
  }

  const userLinks = await prisma.link.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const allowedIds = new Set(userLinks.map((item) => item.id));

  for (const id of ids) {
    if (!allowedIds.has(id)) {
      return NextResponse.json({ error: "Link inválido." }, { status: 400 });
    }
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.link.update({
        where: { id },
        data: { sortOrder: index + 1 },
      })
    )
  );

  return NextResponse.json({ ok: true });
}