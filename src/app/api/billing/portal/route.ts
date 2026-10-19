import { prisma } from "@/lib/db";
import {
  getStripe,
  isStripeConfigured,
  stripeSetupMessage,
} from "@/lib/stripe";
import { jsonError, jsonOk, requireAuthUserId } from "@/lib/api-utils";

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

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    return jsonError(
      "No Stripe customer on file. Start a subscription checkout first.",
      400
    );
  }

  const origin =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin;

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/dashboard/billing`,
  });

  return jsonOk({ url: portal.url });
}
