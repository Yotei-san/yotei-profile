import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    linkId: string;
  }>;
};

export async function GET(_: Request, { params }: Props) {
  const { linkId } = await params;

  const link = await prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    return new NextResponse("Link não encontrado", { status: 404 });
  }

  await prisma.click.create({
    data: {
      linkId: link.id,
    },
  });

  return NextResponse.redirect(link.url);
}