"use client";

import Link from "next/link";
import { useState } from "react";
import {
  annualSavingsPercent,
  formatGbp,
  freeTrialNote,
  plans,
  pricingDisclaimer,
  type BillingInterval,
} from "@/config/plans";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  subscribeMode?: "register" | "billing";
  showHeader?: boolean;
};

export function PricingCards({
  subscribeMode = "register",
  showHeader = true,
}: PricingCardsProps) {
  const [interval, setInterval] = useState<BillingInterval>("year");
  const savingsHint = Math.max(...plans.map(annualSavingsPercent));

  function planHref(planId: string) {
    if (subscribeMode === "billing") {
      return `/dashboard/settings/billing?plan=${planId}&interval=${interval}`;
    }
    return `/register?plan=${planId}&interval=${interval}`;
  }

  return (
    <div>
      {showHeader ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <div
            className="inline-flex rounded-full border border-[var(--border)] bg-white p-1 shadow-sm"
            role="group"
            aria-label="Billing interval"
          >
            <button
              type="button"
              onClick={() => setInterval("month")}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
                interval === "month"
                  ? "bg-[var(--surface-muted)] text-[var(--brand)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--brand)]"
              )}
              aria-pressed={interval === "month"}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setInterval("year")}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
                interval === "year"
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--brand)]"
              )}
              aria-pressed={interval === "year"}
            >
              Yearly
            </button>
          </div>
          {interval === "year" && savingsHint > 0 ? (
            <p className="text-sm italic text-[var(--muted-foreground)]">
              save ~{savingsHint}% with annual billing
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-muted)]/80 p-3 sm:p-5",
          showHeader && "mt-8"
        )}
      >
        <div
          className="pointer-events-none absolute right-6 top-6 h-16 w-16 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-6 left-6 h-16 w-16 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
          }}
        />

        <div className="relative grid gap-3 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const yearly = interval === "year";
            const displayPrice = yearly
              ? plan.priceYearlyGbp / 12
              : plan.priceMonthlyGbp;
            const comparePrice = yearly ? plan.priceMonthlyGbp : null;
            const featured = Boolean(plan.highlighted);

            return (
              <article
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-3xl p-6 sm:p-7",
                  featured
                    ? "bg-white shadow-lg shadow-slate-200/80 ring-1 ring-black/5 lg:-my-2 lg:py-9"
                    : "bg-white/55"
                )}
              >
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
                    featured
                      ? "bg-emerald-50 text-[var(--success)]"
                      : "bg-[var(--surface-muted)] text-[var(--muted-foreground)]"
                  )}
                >
                  {plan.name} plan
                </span>

                <div className="mt-5 flex flex-wrap items-end gap-2">
                  {comparePrice !== null ? (
                    <span className="font-display text-2xl text-[var(--muted)] line-through">
                      {formatGbp(comparePrice)}
                    </span>
                  ) : null}
                  <span className="font-display text-4xl font-semibold tracking-tight text-[var(--brand)]">
                    {formatGbp(
                      Number.isInteger(displayPrice)
                        ? displayPrice
                        : Math.round(displayPrice * 100) / 100
                    )}
                  </span>
                  <span className="pb-1 text-sm text-[var(--muted-foreground)]">
                    GBP per month
                  </span>
                </div>

                {yearly ? (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="line-through opacity-60">
                      {formatGbp(plan.priceMonthlyGbp * 12)}
                    </span>{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {formatGbp(plan.priceYearlyGbp)}
                    </span>{" "}
                    billed yearly
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {plan.description}
                  </p>
                )}

                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--muted-foreground)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span
                        className="font-medium text-[var(--accent)]"
                        aria-hidden
                      >
                        +
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={planHref(plan.id)}
                  className={cn(
                    "mt-8 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition",
                    featured
                      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"
                      : "border border-[var(--border)] bg-white text-[var(--brand)] hover:bg-[var(--surface-muted)]"
                  )}
                >
                  {subscribeMode === "billing" ? "Upgrade" : "Get started"}
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
        {freeTrialNote}
      </p>
      <p className="mt-2 text-center text-xs text-[var(--muted)]">
        {pricingDisclaimer}
      </p>
    </div>
  );
}
