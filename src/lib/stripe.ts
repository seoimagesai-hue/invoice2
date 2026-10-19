import Stripe from "stripe";
import { plans, type BillingInterval, type PlanId } from "@/config/plans";

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY.startsWith("sk_")
  );
}

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-09-30.endive",
    typescript: true,
  });
}

export function getStripePriceId(
  planId: PlanId,
  interval: BillingInterval
): string | null {
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return null;
  const envKey =
    interval === "month" ? plan.stripePriceEnvMonthly : plan.stripePriceEnvYearly;
  const value = process.env[envKey]?.trim();
  return value || null;
}

export function stripeSetupMessage(): string {
  return [
    "Stripe is not fully configured. Set the following environment variables before accepting real payments:",
    "STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,",
    "STRIPE_PRICE_STARTER_MONTHLY, STRIPE_PRICE_STARTER_YEARLY,",
    "STRIPE_PRICE_PROFESSIONAL_MONTHLY, STRIPE_PRICE_PROFESSIONAL_YEARLY,",
    "STRIPE_PRICE_BUSINESS_MONTHLY, STRIPE_PRICE_BUSINESS_YEARLY.",
  ].join(" ");
}
