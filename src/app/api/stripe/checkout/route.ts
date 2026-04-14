import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY não configurada.");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Você precisa estar logado." },
        { status: 401 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const priceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY;

    console.log("[CHECKOUT] user:", {
      id: user.id,
      email: user.email,
      username: user.username,
      stripeCustomerId: user.stripeCustomerId,
    });

    console.log("[CHECKOUT] env:", {
      appUrl,
      priceId,
      hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    });

    if (!appUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL não configurada." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_PREMIUM_MONTHLY não configurada." },
        { status: 500 }
      );
    }

    let customerId = user.stripeCustomerId ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          username: user.username,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_POST]", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido no checkout.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}