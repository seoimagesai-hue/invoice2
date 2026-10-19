import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileDown,
  FileText,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/how-it-works",
  "How It Works",
  "Create a SpectBill account, add a client, create an invoice or quotation, then download or share the PDF."
);

const steps: {
  n: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  pos: "tl" | "tr" | "bl" | "br";
}[] = [
  {
    n: "01",
    title: "Create your account",
    body: "Register with your email and password, then complete your business profile — name, address, tax defaults, invoice prefixes, and optional bank details. This information appears on your documents and PDFs.",
    Icon: UserPlus,
    pos: "tl",
  },
  {
    n: "02",
    title: "Add a client",
    body: "Enter client contact and billing details once. Save the record so you can reuse it on future invoices and quotations without retyping.",
    Icon: Users,
    pos: "tr",
  },
  {
    n: "03",
    title: "Create an invoice or quotation",
    body: "Select the client, add services or products with quantities, prices, discounts, and tax, then review automatically calculated totals. Save as a draft or mark as sent when ready.",
    Icon: FileText,
    pos: "bl",
  },
  {
    n: "04",
    title: "Download or share the PDF",
    body: "Generate a professional PDF, download it for your records, or share it through supported options. Track payment status on invoices, or convert an accepted quotation into an invoice on eligible plans.",
    Icon: FileDown,
    pos: "br",
  },
];

function HubCard({
  step,
}: {
  step: (typeof steps)[number];
}) {
  const { Icon, pos } = step;
  return (
    <article className={`hiw-hub__card hiw-hub__card--${pos}`}>
      <div className="hiw-hub__card-accent" aria-hidden />
      <div className="hiw-hub__card-inner">
        <div className="hiw-hub__card-top">
          <span className="hiw-hub__card-num">{step.n}</span>
          <Icon className="hiw-hub__card-icon" strokeWidth={1.6} aria-hidden />
        </div>
        <h2 className="hiw-hub__card-title">{step.title}</h2>
        <p className="hiw-hub__card-text">{step.body}</p>
      </div>
    </article>
  );
}

function HubPipes() {
  return (
    <svg
      className="hiw-hub__pipes"
      viewBox="0 0 1100 680"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Curves from hub ring out to each card’s inner accent bar */}
      <path
        className="hiw-hub__pipe hiw-hub__pipe--tl"
        d="M470 310 C385 310 315 220 248 198"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        className="hiw-hub__pipe hiw-hub__pipe--tr"
        d="M630 310 C715 310 785 220 852 198"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        className="hiw-hub__pipe hiw-hub__pipe--bl"
        d="M470 370 C385 370 315 460 248 482"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        className="hiw-hub__pipe hiw-hub__pipe--br"
        d="M630 370 C715 370 785 460 852 482"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="fade-in bg-white">
      <section className="hero-pattern border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-24">
          <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--brand)] sm:text-5xl">
            How SpectBill{" "}
            <span className="text-[var(--accent)]">works</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            Four clear steps: create your account, add a client, create an
            invoice or quotation, then download or share the PDF.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-1.5 text-sm font-medium text-[var(--brand)] shadow-sm">
            <Check className="h-4 w-4 text-[var(--success)]" aria-hidden />
            From sign-up to a shareable document
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="hiw-hub" role="list">
            <div className="hiw-hub__stage">
              <HubPipes />

              <div className="hiw-hub__center" aria-hidden>
                <span className="hiw-hub__center-ring" />
                <span className="hiw-hub__center-label">How it works</span>
              </div>

              <div className="hiw-hub__grid">
                {steps.map((step) => (
                  <div
                    key={step.n}
                    className={`hiw-hub__cell hiw-hub__cell--${step.pos}`}
                    role="listitem"
                  >
                    <HubCard step={step} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">
            Ready to start?
          </h2>
          <p className="mt-4 text-slate-200">
            Create your account and generate your first invoice or quotation
            within the free trial allowance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create your account
                <ArrowRight className="h-4 w-4" aria-hidden />
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
