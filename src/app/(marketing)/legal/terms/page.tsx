import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/legal/terms",
  "Terms of Service",
  "Terms of Service for SpectBill software provided by SPECTBILL LTD (Company No. 16395245)."
);

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" lastUpdated="17 October 2025">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern access to and use of the
        SpectBill web application and related services (the &quot;Service&quot;)
        operated by {company.legalName} (&quot;we&quot;, &quot;us&quot;), company
        number {company.companyNumber}, with registered office at{" "}
        {company.registeredOffice.full}.
      </p>

      <h2>1. Acceptance</h2>
      <p>
        By creating an account, subscribing, or using the Service, you agree to
        these Terms and our{" "}
        <Link href="/legal/privacy" className="text-[var(--accent)] underline">
          Privacy Policy
        </Link>
        . If you use the Service on behalf of a business, you confirm you have
        authority to bind that business.
      </p>

      <h2>2. The Service</h2>
      <p>
        SpectBill provides tools to create and manage invoices, quotations,
        clients, PDF exports, and payment records within plan limits described on
        our Pricing page. Features may change as we develop the product; material
        reductions to paid features will be communicated where reasonably
        practicable.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You must provide accurate registration information and keep credentials
        secure. You are responsible for activity under your account. Notify us
        promptly via the Contact page if you suspect unauthorised access.
      </p>

      <h2>4. Subscriptions and payment</h2>
      <p>
        Paid plans are billed in GBP through our payment provider (e.g. Stripe)
        on a monthly or annual cycle you select at checkout. Prices, limits, and
        trial allowances are described on the marketing site and in your account.
        Taxes may apply where required. Failure to pay may suspend or terminate
        access to paid features.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service unlawfully or to send fraudulent invoices;</li>
        <li>Attempt to bypass security, rate limits, or plan restrictions;</li>
        <li>Upload malware or interfere with other users or infrastructure;</li>
        <li>Reverse engineer the Service except where permitted by law.</li>
      </ul>

      <h2>6. Your content</h2>
      <p>
        You retain ownership of data you enter (client details, line items, etc.).
        You grant us a limited licence to host, process, and display that data
        solely to provide and improve the Service, subject to the Privacy Policy.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        We own the Service, branding, and software. These Terms do not grant you
        rights to our trademarks or code except as needed to use the Service.
      </p>

      <h2>8. Availability and support</h2>
      <p>
        We aim to keep the Service available but do not guarantee uninterrupted
        access. Support is provided by email when configured; we do not guarantee
        response times unless agreed in writing.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, we are not liable for
        indirect or consequential loss, loss of profit, or loss of data except
        where liability cannot be excluded (including death or personal injury
        caused by negligence, or fraud). Our total liability for claims relating
        to the Service in any twelve-month period is limited to the fees you paid
        us for the Service in that period, except where a higher minimum is
        required by law.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may close your account according to in-product options or by
        contacting us. We may suspend or terminate access for breach of these
        Terms or non-payment. Provisions that should survive termination (e.g.
        liability limits, governing law) continue to apply.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of {company.jurisdiction}. Courts
        of England and Wales have exclusive jurisdiction, subject to mandatory
        consumer protections where applicable.
      </p>

      <h2>12. Contact</h2>
      <p>
        {company.legalName}, {company.registeredOffice.full}. Use our{" "}
        <Link href="/contact" className="text-[var(--accent)] underline">
          Contact
        </Link>{" "}
        page or the support email shown in the footer when available.
      </p>
    </LegalDocument>
  );
}
