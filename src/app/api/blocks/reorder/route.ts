import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const allowed = new Set(["stats", "about", "gallery", "music", "reactions", "links"]);

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const blocks = Array.isArray(body?.blocks) ? body.blocks : [];

  const normalized: string[] = Array.from(
  new Set(
    (blocks as unknown[]).map((b) => String(b).trim().toLowerCase())
  )
).filter((b) => allowed.has(b));

  if (normalized.length === 0) {
    return NextResponse.json({ error: "Ordem inválida." }, { status: 400 });
  }

  const missing = [...allowed].filter((item) => !normalized.includes(item));
  const finalOrder = [...normalized, ...missing].join(",");

  await prisma.user.update({
    where: { id: user.id },
    data: { blocksOrder: finalOrder },
  });

  return NextResponse.json({ ok: true, blocksOrder: finalOrder });
}