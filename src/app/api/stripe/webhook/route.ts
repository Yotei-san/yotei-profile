import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";
import { getStripe } from "@/app/lib/stripe";

const ACTIVE_PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

function isPremiumSubscriptionStatus(status: string) {
  return ACTIVE_PREMIUM_STATUSES.has(status);
}

async function syncPremiumByCustomerId(input: {
  customerId: string | null;
  subscriptionId?: string | null;
  stripePriceId?: string | null;
  subscriptionStatus: string;
  premiumUntil?: Date | null;
}) {
  if (!input.customerId) {
    return;
  }

  await prisma.user.updateMany({
    where: { stripeCustomerId: input.customerId },
    data: {
      plan: isPremiumSubscriptionStatus(input.subscriptionStatus) ? "premium" : "free",
      premiumBadge: isPremiumSubscriptionStatus(input.subscriptionStatus),
      stripeSubscriptionId:
        input.subscriptionId === undefined ? undefined : input.subscriptionId,
      stripePriceId: input.stripePriceId === undefined ? undefined : input.stripePriceId,
      subscriptionStatus: input.subscriptionStatus,
      premiumUntil: input.premiumUntil === undefined ? undefined : input.premiumUntil,
    },
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    logServerError(
      "stripe.webhook.config",
      new Error("STRIPE_WEBHOOK_SECRET is missing.")
    );
    return new Response("Webhook is not configured.", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Stripe signature is missing.", { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    logServerError("stripe.webhook.signature", error);
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;
        const userId = session.metadata?.userId ?? null;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "premium",
              premiumBadge: true,
              stripeCustomerId: customerId ?? undefined,
              stripeSubscriptionId: subscriptionId ?? undefined,
              subscriptionStatus: "active",
            },
          });
        }

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : null;

        let premiumUntil: Date | null = null;
        const lines = invoice.lines?.data ?? [];
        const firstLine = lines[0];

        if (firstLine?.period?.end) {
          premiumUntil = new Date(firstLine.period.end * 1000);
        }

        await syncPremiumByCustomerId({
          customerId,
          subscriptionStatus: "active",
          premiumUntil,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        const currentPeriodEnd =
          "current_period_end" in subscription &&
          typeof subscription.current_period_end === "number"
            ? new Date(subscription.current_period_end * 1000)
            : null;

        const firstItem = subscription.items.data[0];
        const stripePriceId = firstItem?.price?.id ?? null;

        await syncPremiumByCustomerId({
          customerId,
          subscriptionId: subscription.id,
          stripePriceId,
          subscriptionStatus: subscription.status,
          premiumUntil: currentPeriodEnd,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        await syncPremiumByCustomerId({
          customerId,
          subscriptionId: null,
          stripePriceId: null,
          subscriptionStatus: subscription.status,
          premiumUntil: null,
        });

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    logServerError("stripe.webhook.process", error);
    return new Response("Webhook processing failed.", { status: 500 });
  }
}
