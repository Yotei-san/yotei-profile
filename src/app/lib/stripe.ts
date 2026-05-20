import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getStripeAppUrl() {
  const appUrl =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  return appUrl ? appUrl.replace(/\/+$/, "") : null;
}
