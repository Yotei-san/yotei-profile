import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.error("[STRIPE_CHECKOUT] Usuário não autenticado");
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        stripeCustomerId: true,
      },
    });

    if (!dbUser) {
      console.error("[STRIPE_CHECKOUT] Usuário não encontrado no banco");
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    if (!dbUser.email) {
      console.error("[STRIPE_CHECKOUT] Usuário sem email");
      return NextResponse.json({ error: "Usuário sem email." }, { status: 400 });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.NEXTAUTH_URL;

    const priceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY;

    console.log("[STRIPE_CHECKOUT] appUrl:", appUrl);
    console.log("[STRIPE_CHECKOUT] priceId:", priceId);
    console.log("[STRIPE_CHECKOUT] userId:", dbUser.id);

    if (!appUrl || !priceId) {
      return NextResponse.json(
        { error: "Configuração Stripe incompleta." },
        { status: 500 }
      );
    }

    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          userId: dbUser.id,
          username: dbUser.username,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?stripe=success`,
      cancel_url: `${appUrl}/pricing?stripe=cancel`,
      allow_promotion_codes: true,
      metadata: {
        userId: dbUser.id,
        username: dbUser.username,
      },
      subscription_data: {
        metadata: {
          userId: dbUser.id,
          username: dbUser.username,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_POST]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao criar checkout.",
      },
      { status: 500 }
    );
  }
}