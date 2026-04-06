import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

function detectDeviceType(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod/i.test(ua)) {
    return "Mobile";
  }

  if (/ipad|tablet/i.test(ua)) {
    return "Tablet";
  }

  return "Desktop";
}

function detectCountry(request: Request) {
  const headers = request.headers;

  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "Unknown"
  );
}

export async function POST(request: Request, { params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const deviceType = detectDeviceType(userAgent);
  const country = detectCountry(request);

  await prisma.profileView.create({
    data: {
      userId: user.id,
      country,
      deviceType,
    },
  });

  return NextResponse.json({ ok: true });
}