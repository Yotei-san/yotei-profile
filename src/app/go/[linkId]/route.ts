import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteProps = {
  params: Promise<{
    linkId: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteProps) {
  const { linkId } = await params;

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    select: {
      id: true,
      url: true,
    },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
  }

  await prisma.linkClick.create({
    data: {
      linkId: link.id,
    },
  });

  return NextResponse.redirect(link.url);
}