import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { HomePricing } from "@/components/home/home-pricing";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/config/faq";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/",
  "Professional Invoicing Software",
  "Create professional invoices and quotations in minutes. DevWiser helps UK freelancers and small businesses manage clients, PDFs, and payments."
);

const featureCards = [
  {
    title: "Invoices & quotations",
    description:
      "Build clear, branded documents with line items, tax modes, and notes — ready to send or download as PDF.",
    href: "/features",
  },
  {
    title: "Client management",
    description:
      "Store client details in one place and reuse them across invoices and quotations within your plan limits.",
    href: "/features",
  },
  {
    title: "Quotation to invoice",
    description:
      "Convert accepted quotations into invoices on eligible plans to reduce re-entry and keep numbering consistent.",
    href: "/register",
  },
  {
    title: "Payment tracking",
    description:
      "Record payments against invoices and see outstanding balances from your dashboard overview.",
    href: "/features",
  },
];

const steps = [
  {
    step: "01",
    word: "Create",
    title: "Create your account",
    body: "Register with your business email and set up your profile during onboarding.",
  },
  {
    step: "02",
    word: "Add",
    title: "Add clients & items",
    body: "Enter client details once, then add line items with quantities, prices, and tax as needed.",
  },
  {
    step: "03",
    word: "Send",
    title: "Send invoices or quotes",
    body: "Generate PDFs, mark documents as sent, and keep statuses visible in your workspace.",
  },
  {
    step: "04",
    word: "Track",
    title: "Track payments",
    body: "Log payments to stay on top of what is paid, partially paid, or outstanding.",
  },
];

const benefits = [
  "Structured workflow for invoices and quotations in one application",
  "Plan-based limits so you can choose capacity that matches your workload",
  "PDF downloads for records you can share with clients",
  "UK company operating under England and Wales law — see our legal pages for terms",
  "No fabricated reviews or ratings on this site — product information only",
];

export default function HomePage() {
  return (
    <>
      {/* Hero — centered layout (DevWiser copy); pattern background */}
      <section className="hero-pattern fade-in relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pb-12 sm:pt-20 lg:pt-24">
          <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-[var(--brand)] sm:text-5xl lg:text-[3.25rem]">
            Create Professional Invoices and Quotations in Minutes
          </h1>
          <div className="mt-8 flex justify-center">
            <Link href="/register">
              <Button size="lg" className="min-w-[220px] rounded-full px-8 text-base">
                Create Your First Invoice
              </Button>
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            Create, customise, download, and share professional business
            documents with DevWiser. Manage your clients, track payments, and
            keep your billing organised in one place.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-1.5 text-sm font-medium text-[var(--brand)] shadow-sm backdrop-blur-sm">
            <Check className="h-4 w-4 text-[var(--success)]" aria-hidden />
            Built for freelancers, contractors, and small businesses
          </p>
        </div>

        {/* Device mockups — DevWiser dashboard on desktop + mobile */}
        <div className="relative mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
          <DashboardPreview />
        </div>
        <p className="mx-auto max-w-2xl px-4 pb-16 text-center font-display text-xl font-semibold tracking-tight text-[var(--brand)] sm:px-6 sm:pb-20 sm:text-2xl">
          Easy to create invoices and quotations, track payments, and stay
          organised.
        </p>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Built for everyday billing work
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Core tools you need to move from quote to invoice, with limits that
              scale by plan.
            </p>
          </div>
          {/* Shared SVG noise filter for feature cards (Uiverse-style) */}
          <svg
            width="0"
            height="0"
            className="absolute"
            aria-hidden="true"
            focusable="false"
          >
            <filter id="devwiser-noise">
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="noise-feature group"
              >
                <div className="noise-feature__surface" aria-hidden />
                <div className="noise-feature__content">
                  <h3 className="noise-feature__title">{card.title}</h3>
                  <div>
                    <p className="noise-feature__desc">{card.description}</p>
                    <span className="noise-feature__link">
                      Learn more
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--brand)]">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted-foreground)]">
            Four straightforward steps from sign-up to getting paid.
          </p>

          <div className="hiw-panel mt-12">
            <div className="hiw-panel__intro">
              <p className="hiw-panel__eyebrow">
                Create / Add / Send / Track
              </p>
              <p className="hiw-panel__heading">From sign-up to paid.</p>
            </div>
            <ol className="hiw-panel__grid">
              {steps.map((item) => (
                <li key={item.step} className="hiw-step">
                  <span className="hiw-step__index">{item.step}</span>
                  <h3 className="hiw-step__word" title={item.title}>
                    {item.word}
                  </h3>
                  <p className="hiw-step__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 text-center">
            <Link href="/how-it-works">
              <Button variant="outline">See the full walkthrough</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[var(--brand)]">
              Why teams choose a focused billing tool
            </h2>
            <ul className="mt-6 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-[var(--muted-foreground)]">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/about" className="noise-feature group">
            <div className="noise-feature__surface" aria-hidden />
            <div className="noise-feature__content">
              <h3 className="noise-feature__title">Transparent information</h3>
              <div>
                <p className="noise-feature__desc">
                  We do not display customer testimonials, star ratings, or
                  support phone numbers on this marketing site. Company details
                  are verified via Companies House.
                </p>
                <span className="noise-feature__link">
                  About LOCAL SEO WISER LTD
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <HomePricing />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--brand)] sm:text-4xl">
              A few good questions.
            </h2>
            <p className="mt-2 font-display text-3xl font-semibold leading-tight text-[var(--muted)] sm:text-4xl">
              Clear answers.
            </p>
            <Link
              href="/faq"
              className="mt-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Browse all FAQs →
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

      <section className="border-t border-[var(--border)] bg-[var(--brand)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">
            Ready to streamline your invoicing?
          </h2>
          <p className="mt-4 text-slate-200">
            Create your account in minutes and start within the free trial
            allowance, then upgrade when you need higher limits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create free account
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
