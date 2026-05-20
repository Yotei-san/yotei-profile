import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";
import { getStripe, getStripeAppUrl } from "@/app/lib/stripe";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You need to sign in before starting checkout." },
        { status: 401 }
      );
    }

    const appUrl = getStripeAppUrl();
    const priceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY?.trim();

    if (!appUrl || !priceId) {
      logServerError(
        "stripe.checkout.config",
        new Error("Stripe checkout configuration is incomplete.")
      );
      return NextResponse.json(
        { error: "Premium checkout is not available right now." },
        { status: 503 }
      );
    }

    const stripe = getStripe();
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logServerError("stripe.checkout", error);
    return NextResponse.json(
      { error: "Unable to start premium checkout right now." },
      { status: 500 }
    );
  }
}
