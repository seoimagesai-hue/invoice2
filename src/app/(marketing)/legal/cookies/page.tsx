import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/legal/cookies",
  "Cookie Policy",
  "How DevWiser uses cookies and similar technologies, including consent choices."
);

export default function CookiesPage() {
  return (
    <LegalDocument title="Cookie Policy" lastUpdated="17 October 2025">
      <p>
        This Cookie Policy explains how {company.legalName} uses cookies and
        similar technologies on {company.domain} and the DevWiser application.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. We also use similar
        technologies such as local storage for preferences (e.g. cookie consent
        choices).
      </p>

      <h2>2. How we use cookies</h2>
      <h3>Strictly necessary</h3>
      <p>
        Required for authentication, security, and core functionality. These do
        not require consent under UK PECR where they are essential to provide a
        service you request.
      </p>
      <h3>Preferences</h3>
      <p>
        Store choices such as cookie banner decisions in local storage under the
        key used by our cookie banner component.
      </p>
      <h3>Analytics (optional)</h3>
      <p>
        If enabled in the future, analytics cookies would help us understand usage.
        They are not loaded unless you allow them via the cookie banner.
      </p>
      <h3>Marketing (optional)</h3>
      <p>
        Marketing cookies are not loaded by default. If introduced, they would
        only run after explicit consent.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        Use the cookie banner on first visit to accept or reject non-essential
        categories. You can also adjust browser settings to block or delete
        cookies; blocking essential cookies may prevent sign-in.
      </p>

      <h2>4. Third parties</h2>
      <p>
        Payment pages may set cookies controlled by our payment provider when you
        complete checkout. Refer to their policies for details.
      </p>

      <h2>5. More information</h2>
      <p>
        See our{" "}
        <Link href="/legal/privacy" className="text-[var(--accent)] underline">
          Privacy Policy
        </Link>{" "}
        for how personal data linked to cookies is processed, or{" "}
        <Link href="/contact" className="text-[var(--accent)] underline">
          contact us
        </Link>
        .
      </p>
    </LegalDocument>
  );
}
