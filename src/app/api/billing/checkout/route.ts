import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  getStripe,
  getStripePriceId,
  isStripeConfigured,
  stripeSetupMessage,
} from "@/lib/stripe";
import type { BillingInterval, PlanId } from "@/config/plans";
import {
  jsonError,
  jsonOk,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";

const checkoutSchema = z.object({
  planId: z.enum(["starter", "professional", "business"]),
  interval: z.enum(["month", "year"]),
});

export async function POST(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  if (!isStripeConfigured()) {
    return jsonError(stripeSetupMessage(), 503);
  }

  const stripe = getStripe();
  if (!stripe) {
    return jsonError(stripeSetupMessage(), 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const priceId = getStripePriceId(
    parsed.data.planId as PlanId,
    parsed.data.interval as BillingInterval
  );
  if (!priceId) {
    return jsonError(
      "Stripe price ID is not configured for the selected plan.",
      503
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!user) {
    return jsonError("Account not found", 404);
  }

  let customerId = user.subscription?.stripeCustomerId ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: customerId,
        status: "inactive",
        planId: "free",
      },
      update: { stripeCustomerId: customerId },
    });
  }

  const origin =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?checkout=success`,
    cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
    metadata: {
      userId,
      planId: parsed.data.planId,
      interval: parsed.data.interval,
    },
    subscription_data: {
      metadata: {
        userId,
        planId: parsed.data.planId,
        interval: parsed.data.interval,
      },
    },
  });

  if (!session.url) {
    return jsonError("Unable to create checkout session", 500);
  }

  return jsonOk({ url: session.url, sessionId: session.id });
}
