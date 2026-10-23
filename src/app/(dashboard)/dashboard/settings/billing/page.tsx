"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  freeTrialNote,
  plans,
  pricingDisclaimer,
  formatGbp,
  type BillingInterval,
  type PlanId,
} from "@/config/plans";
import { apiFetch } from "@/lib/client-api";

type SubscriptionInfo = {
  planId: string;
  status: string;
  billingInterval?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
};

function BillingSettingsContent() {
  const searchParams = useSearchParams();
  const checkoutNotice = searchParams.get("checkout");

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [checkoutLoading, setCheckoutLoading] = useState<PlanId | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripePublishableConfigured = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_")
  );

  useEffect(() => {
    apiFetch<{
      user: { subscription: SubscriptionInfo | null };
    }>("/api/account")
      .then((d) => setSubscription(d.user.subscription))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load account")
      )
      .finally(() => setLoading(false));
  }, []);

  async function startCheckout(planId: PlanId) {
    setCheckoutLoading(planId);
    setError(null);
    try {
      const data = await apiFetch<{ url: string }>("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ planId, interval }),
      });
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout unavailable");
      setCheckoutLoading(null);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ url: string }>("/api/billing/portal", {
        method: "POST",
      });
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Portal unavailable");
      setPortalLoading(false);
    }
  }

  const currentPlanId = subscription?.planId ?? "free";
  const currentPlan =
    plans.find((p) => p.id === currentPlanId) ??
    (currentPlanId === "free"
      ? null
      : plans.find((p) => p.id === "starter"));

  return (
    <div>
      <PageHeader
        title="Subscription & billing"
        description="Manage your DevWiser plan"
      />

      {checkoutNotice === "success" ? (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Checkout completed. Your subscription will update once Stripe confirms
          payment (usually within a minute).
        </p>
      ) : null}
      {checkoutNotice === "cancelled" ? (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Checkout was cancelled. No charge was made.
        </p>
      ) : null}

      {!stripePublishableConfigured ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Stripe is not fully configured in this environment (missing or invalid{" "}
          <code className="text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>).
          Checkout and billing portal buttons will call the API and show the
          server error until Stripe keys and price IDs are set.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Card className="mb-6">
        <h2 className="font-semibold text-[var(--brand)]">Current plan</h2>
        {loading ? (
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Loading…</p>
        ) : (
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-[var(--muted-foreground)]">Plan</dt>
              <dd className="font-medium capitalize">
                {currentPlanId === "free"
                  ? "Free trial allowance"
                  : currentPlan?.name ?? currentPlanId}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[var(--muted-foreground)]">Status</dt>
              <dd className="font-medium capitalize">
                {subscription?.status ?? "inactive"}
              </dd>
            </div>
            {subscription?.billingInterval ? (
              <div className="flex gap-2">
                <dt className="text-[var(--muted-foreground)]">Billing</dt>
                <dd className="font-medium capitalize">
                  {subscription.billingInterval}ly
                </dd>
              </div>
            ) : null}
          </dl>
        )}
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">{freeTrialNote}</p>
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={openPortal}
            disabled={portalLoading}
          >
            {portalLoading ? "Opening…" : "Manage billing in Stripe"}
          </Button>
        </div>
      </Card>

      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={interval === "month" ? "primary" : "outline"}
          size="sm"
          onClick={() => setInterval("month")}
        >
          Monthly
        </Button>
        <Button
          type="button"
          variant={interval === "year" ? "primary" : "outline"}
          size="sm"
          onClick={() => setInterval("year")}
        >
          Yearly
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const price =
            interval === "month" ? plan.priceMonthlyGbp : plan.priceYearlyGbp;
          return (
            <Card
              key={plan.id}
              className={
                plan.highlighted ? "ring-2 ring-[var(--accent)]" : undefined
              }
            >
              <h3 className="text-lg font-semibold text-[var(--brand)]">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {plan.description}
              </p>
              <p className="mt-4 font-display text-2xl font-semibold">
                {formatGbp(price)}
                <span className="text-sm font-normal text-[var(--muted-foreground)]">
                  /{interval}
                </span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-[var(--muted-foreground)]">
                {plan.features.slice(0, 5).map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Button
                type="button"
                className="mt-6 w-full"
                variant={plan.highlighted ? "primary" : "outline"}
                disabled={checkoutLoading !== null}
                onClick={() => startCheckout(plan.id)}
              >
                {checkoutLoading === plan.id
                  ? "Redirecting…"
                  : currentPlanId === plan.id
                    ? "Switch plan"
                    : "Subscribe"}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-[var(--muted-foreground)]">
        {pricingDisclaimer}
      </p>
    </div>
  );
}

export default function BillingSettingsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted-foreground)]">Loading…</p>}>
      <BillingSettingsContent />
    </Suspense>
  );
}
