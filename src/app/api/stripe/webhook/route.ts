import Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Webhook secret não configurado.", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Stripe-Signature ausente.", { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao verificar webhook.";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
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

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: "premium",
              premiumBadge: true,
              premiumUntil: premiumUntil ?? undefined,
              subscriptionStatus: "active",
            },
          });
        }

        break;
      }

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

        if (customerId) {
          const activeLikeStatuses = new Set(["active", "trialing", "past_due"]);

          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: activeLikeStatuses.has(subscription.status) ? "premium" : "free",
              premiumBadge: activeLikeStatuses.has(subscription.status),
              stripeSubscriptionId: subscription.id,
              stripePriceId: stripePriceId ?? undefined,
              subscriptionStatus: subscription.status,
              premiumUntil: currentPeriodEnd ?? undefined,
            },
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: "free",
              premiumUntil: null,
              premiumBadge: false,
              stripeSubscriptionId: null,
              stripePriceId: null,
              subscriptionStatus: subscription.status,
            },
          });
        }

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar webhook.";
    return new Response(message, { status: 500 });
  }
}