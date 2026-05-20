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
        { error: "You need to sign in first." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account was found for this profile." },
        { status: 400 }
      );
    }

    const appUrl = getStripeAppUrl();

    if (!appUrl) {
      logServerError(
        "stripe.portal.config",
        new Error("Stripe portal return URL is missing.")
      );
      return NextResponse.json(
        { error: "Billing portal is not available right now." },
        { status: 503 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logServerError("stripe.portal", error);
    return NextResponse.json(
      { error: "Unable to open the billing portal right now." },
      { status: 500 }
    );
  }
}
