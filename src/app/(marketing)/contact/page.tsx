import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { company, getSupportEmail } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/contact",
  "Contact",
  "Contact SPECTBILL LTD about SpectBill invoicing software. Registered office in Bristol; support email from site configuration."
);

export default function ContactPage() {
  const supportEmail = getSupportEmail();

  return (
    <div className="contact-page fade-in bg-white">
      <section className="hero-pattern border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-24">
          <p className="contact-page__eyebrow">Get in touch</p>
          <h1 className="contact-page__hero-title font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--brand)] sm:text-5xl">
            Contact{" "}
            <span className="text-[var(--accent)]">{company.tradingName}</span>
          </h1>
          <p className="contact-page__hero-text mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            Send us a message about SpectBill, your account, or billing. We
            respond by email when support is available.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--background)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:gap-10">
          <div className="contact-page__form-wrap lg:col-span-3">
            <div className="contact-page__panel">
              <div className="contact-page__panel-head">
                <h2 className="font-display text-2xl font-semibold text-[var(--brand)]">
                  Message us
                </h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Fields marked required must be completed. Do not include card
                  numbers or passwords.
                </p>
              </div>
              <div className="relative mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="contact-page__aside lg:col-span-2">
            <article
              className="contact-page__info"
              style={{ animationDelay: "0.08s" }}
            >
              <span className="contact-page__info-icon" aria-hidden>
                <MapPin className="h-4 w-4" />
              </span>
              <h2 className="contact-page__info-title">Registered office</h2>
              <address className="mt-2 not-italic text-sm leading-relaxed text-[var(--muted-foreground)]">
                {company.legalName}
                <br />
                {company.registeredOffice.line1}
                <br />
                {company.registeredOffice.line2}
                <br />
                {company.registeredOffice.city}
                <br />
                {company.registeredOffice.country}
                <br />
                {company.registeredOffice.postcode}
              </address>
            </article>

            <article
              className="contact-page__info"
              style={{ animationDelay: "0.14s" }}
            >
              <span className="contact-page__info-icon" aria-hidden>
                <Mail className="h-4 w-4" />
              </span>
              <h2 className="contact-page__info-title">Support email</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {supportEmail ? (
                  <a
                    href={`mailto:${supportEmail}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {supportEmail}
                  </a>
                ) : (
                  <>
                    Configure the{" "}
                    <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-xs">
                      SUPPORT_EMAIL
                    </code>{" "}
                    environment variable before launch to display the support
                    address here.
                  </>
                )}
              </p>
            </article>

            <article
              className="contact-page__info"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="contact-page__info-icon" aria-hidden>
                <Clock3 className="h-4 w-4" />
              </span>
              <h2 className="contact-page__info-title">Response times</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                We aim to reply by email during UK business hours when support is
                staffed. Account-specific questions may need you to be signed in.
              </p>
            </article>

            <article
              className="contact-page__info contact-page__info--soft"
              style={{ animationDelay: "0.26s" }}
            >
              <span className="contact-page__info-icon" aria-hidden>
                <Building2 className="h-4 w-4" />
              </span>
              <h2 className="contact-page__info-title">Company</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {company.legalName} · Company No. {company.companyNumber}
              </p>
              <Link
                href="/about"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                About us
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          </aside>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="contact-page__note mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <span className="contact-page__info-icon" aria-hidden>
            <Shield className="h-4 w-4" />
          </span>
          <p className="text-sm text-[var(--muted-foreground)]">
            Prefer self-serve answers first? Check the{" "}
            <Link
              href="/faq"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              FAQ
            </Link>{" "}
            for plans, billing, and product questions.
          </p>
          <Link href="/faq" className="shrink-0 sm:ml-auto">
            <Button variant="outline" size="sm">
              Browse FAQ
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
