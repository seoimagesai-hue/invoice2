import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/legal/privacy",
  "Privacy Policy",
  "Privacy Policy for SpectBill — UK GDPR information for data processed by SPECTBILL LTD."
);

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="17 October 2025">
      <p>
        {company.legalName} (&quot;we&quot;, company number{" "}
        {company.companyNumber}) is the controller for personal data processed
        through SpectBill at {company.domain}, unless stated otherwise. Registered
        office: {company.registeredOffice.full}.
      </p>

      <h2>1. Scope</h2>
      <p>
        This Privacy Policy explains how we collect, use, store, and share personal
        data when you visit our website, create an account, subscribe, or contact
        us. It is framed for UK GDPR and the Data Protection Act 2018.
      </p>

      <h2>2. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email, password hash, business
          profile details you enter.
        </li>
        <li>
          <strong>Client and document data:</strong> information you store about
          clients, invoices, quotations, line items, and payments.
        </li>
        <li>
          <strong>Billing data:</strong> subscription status and payment
          identifiers processed by our payment provider (we do not store full
          card numbers).
        </li>
        <li>
          <strong>Technical and usage data:</strong> IP address, browser type,
          device information, logs, and cookies as described in our{" "}
          <Link href="/legal/cookies" className="text-[var(--accent)] underline">
            Cookie Policy
          </Link>
          .
        </li>
        <li>
          <strong>Contact form:</strong> name, email, subject, and message content.
        </li>
      </ul>

      <h2>3. Purposes and lawful bases</h2>
      <ul>
        <li>
          Provide and secure the Service — contract and legitimate interests.
        </li>
        <li>Process subscriptions — contract and legal obligation (tax records).</li>
        <li>Respond to enquiries — legitimate interests or contract.</li>
        <li>
          Optional analytics or marketing cookies — consent where required (see
          Cookie Policy).
        </li>
        <li>Comply with law — legal obligation.</li>
      </ul>

      <h2>4. Recipients and processors</h2>
      <p>
        We use infrastructure and service providers (hosting, email, payments,
        database) who process data on our instructions under appropriate contracts.
        We may disclose data if required by law or to protect rights and safety.
      </p>

      <h2>5. International transfers</h2>
      <p>
        If data is transferred outside the UK, we implement appropriate safeguards
        such as UK adequacy regulations or standard contractual clauses, as
        applicable at the time of transfer.
      </p>

      <h2>6. Retention</h2>
      <p>
        We retain account and document data while your account is active and for a
        reasonable period afterward for backups, disputes, and legal compliance.
        Contact messages are retained as long as needed to handle the enquiry.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Under UK GDPR you may have rights to access, rectify, erase, restrict,
        object, and data portability, and to withdraw consent where processing is
        consent-based. You may lodge a complaint with the Information
        Commissioner&apos;s Office (ICO). Contact us via the{" "}
        <Link href="/contact" className="text-[var(--accent)] underline">
          Contact
        </Link>{" "}
        page to exercise rights.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement technical and organisational measures appropriate to the risk,
        including access controls and encryption in transit where supported. No
        method of transmission is completely secure.
      </p>

      <h2>9. Children</h2>
      <p>
        The Service is intended for business users and is not directed at children
        under 18.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this policy; the &quot;Last updated&quot; date will change
        and material changes may be notified where appropriate.
      </p>
    </LegalDocument>
  );
}
