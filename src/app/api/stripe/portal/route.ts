import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!dbUser?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Cliente Stripe não encontrado." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return NextResponse.json({ error: "APP URL não configurada." }, { status: 500 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}