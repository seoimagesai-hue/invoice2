import Link from "next/link";
import { SpectBillLogo } from "@/components/brand/logo";
import { company, getSupportEmail } from "@/config/company";

const productLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/register", label: "Get Started" },
  { href: "/login", label: "Log In" },
];

const resourceLinks = [
  { href: "/features", label: "Invoice generator" },
  { href: "/features", label: "Quotation generator" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Plans & billing" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/refunds", label: "Refund & Cancellation" },
];

export function SiteFooter() {
  const supportEmail = getSupportEmail();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-14 sm:px-6 sm:pb-32 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <SpectBillLogo href="/" size="sm" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
              Professional invoice and quotation software for freelancers,
              contractors, and small businesses.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Product
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-[var(--brand)]">
              {productLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="hover:text-[var(--accent)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Resources
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-[var(--brand)]">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[var(--accent)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Company
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-[var(--brand)]">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[var(--accent)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Legal
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-[var(--brand)]">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[var(--accent)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted-foreground)] md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-1 text-xs sm:text-sm">
            <p>
              © {year} {company.legalName}. Company number {company.companyNumber}.
            </p>
            <p>Registered office: {company.registeredOffice.full}</p>
            <p>
              <a
                href={company.companiesHouseUrl}
                className="underline hover:text-[var(--brand)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Companies House record
              </a>
            </p>
          </div>
          <div className="text-xs sm:text-sm md:text-right">
            {supportEmail ? (
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-[var(--brand)] hover:text-[var(--accent)]"
              >
                {supportEmail}
              </a>
            ) : (
              <span>Support email: configure SUPPORT_EMAIL before launch</span>
            )}
            <p className="mt-1 text-[var(--muted)]">
              {company.domain.replace("https://", "")}
            </p>
          </div>
        </div>
      </div>

      {/* Large brand watermark — static, no animation */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex select-none items-end justify-center overflow-hidden pb-0"
        aria-hidden
      >
        <div className="flex items-end gap-3 opacity-[0.12] sm:gap-5">
          <svg
            width="72"
            height="72"
            viewBox="0 0 40 40"
            fill="none"
            className="mb-2 hidden h-14 w-14 text-[var(--brand)] sm:mb-3 sm:block sm:h-20 sm:w-20 md:h-24 md:w-24"
          >
            <rect width="40" height="40" rx="10" fill="currentColor" />
            <path
              d="M11 13h18v2.5H11V13zm0 5.5h12v2.5H11v-2.5zm0 5.5h18v2.5H11V24zm0 5.5h8V32h-8v-2.5z"
              fill="#ffffff"
            />
            <circle cx="29" cy="27" r="5" fill="#3b82f6" />
          </svg>
          <span className="font-display text-[clamp(3.5rem,14vw,9rem)] font-bold leading-none tracking-tight text-[var(--brand)]">
            SpectBill
          </span>
        </div>
      </div>
    </footer>
  );
}
