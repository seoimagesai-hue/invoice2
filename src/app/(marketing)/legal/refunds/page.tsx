import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/legal/refunds",
  "Refund & Cancellation",
  "Refund and cancellation information for DevWiser subscriptions from LOCAL SEO WISER LTD."
);

export default function RefundsPage() {
  return (
    <LegalDocument title="Refund & Cancellation Policy" lastUpdated="17 October 2025">
      <p>
        This policy describes how cancellations and refunds work for paid
        subscriptions to DevWiser provided by {company.legalName} (Company No.{" "}
        {company.companyNumber}). It should be read with our{" "}
        <Link href="/legal/terms" className="text-[var(--accent)] underline">
          Terms of Service
        </Link>
        .
      </p>

      <h2>1. Free trial</h2>
      <p>
        New accounts may use a free trial allowance as described on the Pricing
        page. No payment is required during the trial unless you subscribe to a
        paid plan.
      </p>

      <h2>2. Subscriptions</h2>
      <p>
        Paid plans renew automatically each billing period (monthly or annual)
        until cancelled through your account billing settings or by contacting
        support. You remain responsible for fees accrued before cancellation
        takes effect.
      </p>

      <h2>3. Cancellation</h2>
      <p>
        You may cancel renewal at any time before the next billing date. Access to
        paid features typically continues until the end of the current paid
        period unless otherwise stated at checkout or in your account.
      </p>

      <h2>4. Refunds</h2>
      <p>
        Unless required by applicable consumer law, subscription fees are
        generally non-refundable once a billing period has started. If you believe
        you were charged in error (duplicate charge, wrong plan), contact us
        promptly via the{" "}
        <Link href="/contact" className="text-[var(--accent)] underline">
          Contact
        </Link>{" "}
        page with transaction details. We will review good-faith billing errors and
        respond in line with our payment provider&apos;s rules.
      </p>

      <h2>5. Consumer rights (UK)</h2>
      <p>
        If you are a consumer, statutory rights may apply to distance contracts,
        including cancellation rights for certain digital services where
        applicable. Nothing in this policy limits non-waivable consumer rights.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        If you dispute a charge with your bank, we may suspend the account while
        the dispute is investigated. Contact us first so we can resolve billing
        issues quickly.
      </p>

      <h2>7. Contact</h2>
      <p>
        {company.registeredOffice.full}. Use{" "}
        <Link href="/contact" className="text-[var(--accent)] underline">
          Contact
        </Link>{" "}
        or the support email in the site footer when configured.
      </p>
    </LegalDocument>
  );
}
