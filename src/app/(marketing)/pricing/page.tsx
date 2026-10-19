import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/config/faq";
import { formatGbp, plans } from "@/config/plans";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/pricing",
  "Pricing",
  "SpectBill pricing: Starter, Professional, and Business plans with monthly or annual GBP billing, cancellation details, and published plan limits."
);

const comparisonRows = [
  {
    label: "Clients",
    values: plans.map((p) =>
      p.limits.maxClients === null ? "Unlimited" : `Up to ${p.limits.maxClients}`
    ),
  },
  {
    label: "Invoices / month",
    values: plans.map((p) =>
      p.limits.maxInvoicesPerMonth === null
        ? "Unlimited"
        : `Up to ${p.limits.maxInvoicesPerMonth}`
    ),
  },
  {
    label: "Quotations / month",
    values: plans.map((p) =>
      p.limits.maxQuotationsPerMonth === null
        ? "Unlimited"
        : `Up to ${p.limits.maxQuotationsPerMonth}`
    ),
  },
  {
    label: "PDF downloads",
    values: ["Yes", "Yes", "Yes"],
  },
  {
    label: "Payment tracking",
    values: plans.map((p) => (p.limits.paymentTracking ? "Yes" : "—")),
  },
  {
    label: "Quote → invoice",
    values: plans.map((p) => (p.limits.quotationToInvoice ? "Yes" : "—")),
  },
  {
    label: "Custom branding on PDFs",
    values: plans.map((p) => (p.limits.customBranding ? "Yes" : "—")),
  },
  {
    label: "Advanced reporting",
    values: plans.map((p) => (p.limits.advancedReporting ? "Yes" : "—")),
  },
  {
    label: "Team access",
    values: plans.map((p) => (p.limits.teamAccess ? "When enabled" : "—")),
  },
];

const pricingFaq = faqCategories.filter((c) =>
  ["billing", "security", "support"].includes(c.id)
);

export default function PricingPage() {
  return (
    <div className="fade-in bg-white">
      {/* Hero */}
      <section className="hero-pattern border-b border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-24">
          <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--brand)] sm:text-5xl">
            Simple pricing for{" "}
            <span className="text-[var(--accent)]">invoices and quotations</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            Three subscription plans with monthly or annual billing in GBP.
            Compare limits, choose a plan, and cancel from your dashboard when
            you need to.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8">
                Start free trial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Talk to us
              </Button>
            </Link>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-1.5 text-sm font-medium text-[var(--brand)] shadow-sm">
            <Check className="h-4 w-4 text-[var(--success)]" aria-hidden />
            Proposed launch pricing · limits enforced by plan
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Choose your plan
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Starter, Professional, and Business — switch billing frequency any
              time before checkout.
            </p>
          </div>
          <PricingCards subscribeMode="register" />
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-b border-[var(--border)] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Plan comparison
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Feature and limit differences across SpectBill plans.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[var(--surface-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[var(--brand)] sm:px-5">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-4 py-3 font-semibold text-[var(--brand)] sm:px-5"
                    >
                      {plan.name}
                      <div className="mt-1 text-xs font-normal text-[var(--muted-foreground)]">
                        from {formatGbp(plan.priceMonthlyGbp)}/mo
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-[var(--border)]"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--foreground)] sm:px-5">
                      {row.label}
                    </td>
                    {row.values.map((value, i) => (
                      <td
                        key={`${row.label}-${i}`}
                        className="px-4 py-3 text-[var(--muted-foreground)] sm:px-5"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Billing details — 2x2 dark cards left, payments copy right */}
      <section className="border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Billing, renewal, and cancellation
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Clear rules for how SpectBill subscriptions work.
            </p>
          </div>

          <svg
            width="0"
            height="0"
            className="absolute"
            aria-hidden="true"
            focusable="false"
          >
            <filter id="spectbill-noise">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.9"
                numOctaves="2"
                seed="1"
                stitchTiles="stitch"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Monthly billing",
                  body: "Charged each month while your subscription stays active. You can cancel before the next renewal date.",
                },
                {
                  title: "Annual billing",
                  body: "Charged once per year. Annual plans usually cost less than twelve separate monthly payments.",
                },
                {
                  title: "Renewal",
                  body: "Subscriptions renew automatically at the end of each paid period until you cancel in the dashboard.",
                },
                {
                  title: "Cancellation",
                  body: "Cancel from Subscription & Billing. Access typically continues until the current period ends.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="noise-feature noise-feature--compact billing-card-anim group"
                >
                  <div className="noise-feature__surface" aria-hidden />
                  <div className="noise-feature__content">
                    <h3 className="noise-feature__title">{item.title}</h3>
                    <p className="noise-feature__desc">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:self-center">
              <h3 className="font-display text-2xl font-semibold text-[var(--brand)]">
                Payments and refunds
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                <li className="flex gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                    aria-hidden
                  />
                  <span>
                    Card payments for SpectBill subscriptions are processed by
                    Stripe when credentials are configured — we never store raw
                    card details.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                    aria-hidden
                  />
                  <span>
                    If Stripe is not configured, checkout shows a clear setup
                    requirement instead of a fake successful payment.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                    aria-hidden
                  />
                  <span>
                    Refund eligibility and consumer rights are described in the{" "}
                    <Link
                      href="/legal/refunds"
                      className="font-medium text-[var(--accent)] underline"
                    >
                      Refund &amp; Cancellation Policy
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[var(--border)] bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--brand)] sm:text-4xl">
              Pricing questions
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Subscriptions, cancellation, refunds, and data security.
            </p>
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Browse all FAQs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div>
            <FaqAccordion categories={pricingFaq} variant="minimal" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--brand)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">
            Ready to pick a plan?
          </h2>
          <p className="mt-4 text-slate-200">
            Create an account, start within the free trial allowance, then upgrade
            when you need higher limits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create free account
              </Button>
            </Link>
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Explore features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
