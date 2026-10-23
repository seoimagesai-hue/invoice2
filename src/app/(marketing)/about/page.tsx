import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/about",
  "About Us",
  "About LOCAL SEO WISER LTD — UK software company (Company No. 17267839) providing DevWiser invoice and quotation software."
);

const facts = [
  { label: "Legal name", value: company.legalName },
  { label: "Company number", value: company.companyNumber },
  { label: "Company type", value: company.companyType },
  { label: "Status", value: company.companyStatus },
  { label: "Incorporated", value: company.incorporatedOn },
  { label: "Jurisdiction", value: company.jurisdiction },
  { label: "Nature of business (SIC)", value: company.natureOfBusiness },
  {
    label: "Website",
    value: company.domain.replace("https://", ""),
    href: company.domain,
  },
];

export default function AboutPage() {
  return (
    <div className="about-page fade-in bg-white">
      <section className="hero-pattern border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-24">
          <p className="about-page__eyebrow">About us</p>
          <h1 className="about-page__hero-title font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--brand)] sm:text-5xl">
            About{" "}
            <span className="text-[var(--accent)]">{company.tradingName}</span>
          </h1>
          <p className="about-page__hero-text mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            {company.tradingName} is trading software operated by{" "}
            {company.legalName}, a private limited company registered in England
            and Wales.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--background)] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="about-page__intro grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="about-page__card about-page__card--wide">
              <div className="about-page__icon-wrap" aria-hidden>
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--brand)]">
                What we build
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-[0.95rem]">
                We build focused invoicing and quotation software for freelancers,
                contractors, and small businesses. We do not publish team
                biographies, customer testimonials, or unverified claims on this
                site.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button>
                    Contact us
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">Explore features</Button>
                </Link>
              </div>
            </article>

            <article className="about-page__card about-page__card--accent">
              <div className="about-page__icon-wrap about-page__icon-wrap--light" aria-hidden>
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="about-page__office-title mt-4 font-display text-xl font-semibold">
                Registered office
              </h2>
              <address className="about-page__office mt-3 not-italic text-sm leading-relaxed">
                {company.legalName}
                <br />
                {company.registeredOffice.full}
              </address>
              <a
                href={company.companiesHouseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-page__office-link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                View Companies House record
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="about-page__icon-wrap mx-auto" aria-hidden>
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--brand)]">
              Company details
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Verified identity from UK Companies House — Company No.{" "}
              {company.companyNumber}.
            </p>
          </div>

          <dl className="about-page__facts mt-10 grid gap-4 sm:grid-cols-2">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className="about-page__fact"
                style={{ animationDelay: `${0.05 + index * 0.04}s` }}
              >
                <dt>{fact.label}</dt>
                <dd>
                  {"href" in fact && fact.href ? (
                    <a
                      href={fact.href}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="about-page__trust mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--muted-foreground)]">
            <ShieldCheck
              className="h-4 w-4 text-[var(--success)]"
              aria-hidden
            />
            <span>Active UK company · England and Wales</span>
            <span className="hidden text-[var(--border)] sm:inline">·</span>
            <span>No fabricated testimonials</span>
          </div>
        </div>
      </section>
    </div>
  );
}
