import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { jsonError, jsonOk } from "@/lib/api-utils";

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): string {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "unpaid":
      return "past_due";
    default:
      return "inactive";
  }
}

async function upsertFromStripeSubscription(subscription: Stripe.Subscription) {
  const userId =
    subscription.metadata?.userId ||
    (await prisma.subscription.findFirst({
      where: { stripeCustomerId: String(subscription.customer) },
      select: { userId: true },
    }))?.userId;

  if (!userId) return;

  const planId = subscription.metadata?.planId || undefined;
  const interval = subscription.metadata?.interval || undefined;
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const periodEnd = (subscription as Stripe.Subscription & {
    current_period_end?: number;
  }).current_period_end;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      planId: planId || "free",
      status: mapStripeSubscriptionStatus(subscription.status),
      billingInterval: interval ?? null,
      stripeCustomerId: String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      ...(planId ? { planId } : {}),
      status: mapStripeSubscriptionStatus(subscription.status),
      billingInterval: interval ?? undefined,
      stripeCustomerId: String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError("Stripe is not configured", 503);
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !webhookSecret) {
    return jsonError("Stripe webhook secret is not configured", 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonError("Missing Stripe signature", 400);
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Invalid webhook signature",
      400
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription)
        );
        await upsertFromStripeSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertFromStripeSubscription(subscription);
      break;
    }
    default:
      break;
  }

  return jsonOk({ received: true });
}
