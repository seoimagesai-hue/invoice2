import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  FileDown,
  FileText,
  Hash,
  LayoutDashboard,
  Link2,
  Lock,
  Palette,
  Percent,
  Receipt,
  RefreshCw,
  Search,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/config/faq";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/features",
  "Features",
  "DevWiser features for invoices, quotations, clients, PDFs, payment tracking, branding, and secure account access."
);

const gridFeatures = [
  {
    icon: FileText,
    title: "Invoice generator",
    description:
      "Create numbered invoices with dates, clients, notes, and payment terms.",
  },
  {
    icon: Receipt,
    title: "Quotations",
    description:
      "Build estimates with validity dates and track them through to acceptance.",
  },
  {
    icon: Percent,
    title: "Tax & discounts",
    description:
      "Exclusive, inclusive, or no tax — plus line discounts calculated automatically.",
  },
  {
    icon: Users,
    title: "Client management",
    description:
      "Store contacts and addresses once, then reuse them on every document.",
  },
  {
    icon: FileDown,
    title: "PDF downloads",
    description:
      "Export professional PDFs for email, print, or your own records.",
  },
  {
    icon: Wallet,
    title: "Payment tracking",
    description:
      "Record full or partial payments and keep outstanding balances accurate.",
  },
  {
    icon: RefreshCw,
    title: "Quote to invoice",
    description:
      "Convert accepted quotations without re-entering line items or clients.",
  },
  {
    icon: Link2,
    title: "Secure sharing",
    description:
      "Share documents with private tokens — not guessable public URLs.",
  },
  {
    icon: Palette,
    title: "Business branding",
    description:
      "Add business details and logo on eligible plans for consistent PDFs.",
  },
];

const invoiceBullets = [
  "Statuses from draft through paid and overdue",
  "Automatic totals with decimal-safe money math",
  "Notes, terms, and configurable invoice prefixes",
];

const quotationBullets = [
  "Validity dates and quotation status tracking",
  "Duplicate conversion protection when creating invoices",
  "Terms and notes for clear client communication",
];

const capabilityItems = [
  {
    icon: Lock,
    title: "Account security",
    description: "Hashed passwords, protected dashboard routes, session access.",
  },
  {
    icon: Shield,
    title: "Data isolation",
    description: "Users only access their own clients, invoices, and quotations.",
  },
  {
    icon: Hash,
    title: "Document numbering",
    description: "Unique invoice and quotation numbers per account with prefixes.",
  },
  {
    icon: Search,
    title: "Search & filters",
    description: "Find documents and clients quickly from the dashboard.",
  },
  {
    icon: Copy,
    title: "Duplicate documents",
    description: "Reuse prior invoices or quotations to save setup time.",
  },
  {
    icon: LayoutDashboard,
    title: "Overview & reports",
    description: "See outstanding balances, paid totals, and recent activity.",
  },
];

function MiniInvoiceMock() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--brand)]">INV-00024</p>
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
            Sample Client Ltd
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
          SENT
        </span>
      </div>
      <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-3 text-[11px]">
        <div className="flex justify-between gap-2">
          <span className="text-[var(--muted-foreground)]">Design services</span>
          <span className="font-medium">£640.00</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-[var(--muted-foreground)]">Consulting</span>
          <span className="font-medium">£320.00</span>
        </div>
        <div className="flex justify-between gap-2 border-t border-[var(--border)] pt-2 font-semibold text-[var(--brand)]">
          <span>Total</span>
          <span>£1,152.00</span>
        </div>
      </div>
    </div>
  );
}

function MiniQuoteMock() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-white">QUO-00018</p>
          <p className="mt-1 text-[11px] text-slate-300">Bright Studio</p>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          ACCEPTED
        </span>
      </div>
      <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-[11px] text-slate-200">
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">Website refresh</span>
          <span>£2,100.00</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">Valid until</span>
          <span>31 Oct 2026</span>
        </div>
        <div className="mt-2 inline-flex rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold text-white">
          Convert to invoice
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="fade-in bg-white">
      {/* Hero */}
      <section className="hero-pattern border-b border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-24">
          <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--brand)] sm:text-5xl lg:text-[3.35rem]">
            Invoicing, quotations, client management,{" "}
            <span className="text-[var(--accent)]">and payment tracking</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            DevWiser features cover professional invoices, quotations and
            estimates, reusable client records, PDF downloads, and payment
            tracking — within clear plan limits.
          </p>

          <form
            action="/register"
            method="get"
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-[var(--border)] bg-white p-1.5 shadow-sm"
          >
            <label htmlFor="features-email" className="sr-only">
              Email address
            </label>
            <input
              id="features-email"
              name="email"
              type="email"
              placeholder="Enter your work email"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
            <Button type="submit" className="shrink-0 rounded-full px-5">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </form>

          <p className="mt-8 font-display text-xl font-semibold text-[var(--brand)] sm:text-2xl">
            One workspace from quote to paid invoice
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--muted-foreground)]">
            Create, customise, share, and track — without inventing reviews,
            ratings, or unsupported claims.
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <DashboardPreview />
        </div>
      </section>

      {/* Feature list — 2-col with circular icons + row dividers */}
      <section className="border-b border-[var(--border)] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Built for everyday billing work
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              The capabilities you use most — presented clearly and accurately.
            </p>
          </div>

          <div className="feat-list mt-12">
            {Array.from(
              { length: Math.ceil(gridFeatures.length / 2) },
              (_, rowIndex) => {
                const row = gridFeatures.slice(rowIndex * 2, rowIndex * 2 + 2);
                const isLast =
                  rowIndex === Math.ceil(gridFeatures.length / 2) - 1;
                return (
                  <div
                    key={row[0].title}
                    className={`feat-list__row grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-x-14 ${
                      isLast ? "" : "border-b border-[var(--border)]"
                    }`}
                  >
                    {row.map((feature) => (
                      <article key={feature.title} className="feat-list__item">
                        <span className="feat-list__icon" aria-hidden>
                          <feature.icon
                            className="h-[1.15rem] w-[1.15rem]"
                            strokeWidth={1.85}
                          />
                        </span>
                        <div className="min-w-0">
                          <h3 className="feat-list__title">{feature.title}</h3>
                          <p className="feat-list__text">{feature.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Two large detail cards */}
      <section className="border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]/60 p-5 sm:p-6">
              <MiniInvoiceMock />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-[var(--brand)]">
                Professional invoices
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Build clear client-facing invoices with line items, tax modes,
                due dates, and payment terms — then download a PDF when you are
                ready.
              </p>
              <ul className="mt-5 space-y-2.5">
                {invoiceBullets.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-[var(--muted-foreground)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                Create an invoice
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm">
            <div className="border-b border-white/10 bg-[var(--brand-hover)]/40 p-5 sm:p-6">
              <MiniQuoteMock />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold">
                Quotations that convert
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Send estimates with validity dates and terms. When a quotation is
                accepted on an eligible plan, convert it to an invoice without
                starting from scratch.
              </p>
              <ul className="mt-5 space-y-2.5">
                {quotationBullets.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-300">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#93c5fd] hover:text-white"
              >
                Create a quotation
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Dark showcase */}
      <section className="bg-[var(--brand)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Your DevWiser dashboard
            </h2>
            <p className="mt-3 text-slate-300">
              Overview stats, recent invoices, and quotations in one place —
              desktop and mobile friendly.
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-5">
            <div className="[&_p.text-xs]:text-slate-300">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Honest trust strip (no fake logos) */}
      <section className="border-b border-[var(--border)] bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-center text-sm font-medium text-[var(--muted-foreground)] sm:px-6">
          <span>UK company · LOCAL SEO WISER LTD</span>
          <span className="hidden text-[var(--border)] sm:inline">|</span>
          <span>Company No. 17267839</span>
          <span className="hidden text-[var(--border)] sm:inline">|</span>
          <span>Plan limits published on Pricing</span>
          <span className="hidden text-[var(--border)] sm:inline">|</span>
          <span>No fabricated testimonials</span>
        </div>
      </section>

      {/* Secondary capability grid */}
      <section className="border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
                Security, structure, and control
              </h2>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Practical product safeguards and workflow tools — described as
                implemented, not overstated.
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="outline">View plans</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-white p-5"
              >
                <item.icon
                  className="h-5 w-5 text-[var(--accent)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="mt-3 font-semibold text-[var(--brand)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--brand)] sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Quick answers about DevWiser features, plans, and data.
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
            <FaqAccordion
              categories={faqCategories}
              maxItemsPerCategory={2}
              variant="minimal"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--brand)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">
            Start with DevWiser today
          </h2>
          <p className="mt-4 text-slate-200">
            Create a free account, add your first client, and generate an invoice
            or quotation within the trial allowance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create free account
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Compare pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
