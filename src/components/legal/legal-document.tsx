import { company } from "@/config/company";

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalDocument({
  title,
  lastUpdated,
  children,
}: LegalDocumentProps) {
  return (
    <article className="fade-in mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-[var(--accent)]">Legal</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[var(--brand)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Last updated: {lastUpdated} · {company.legalName} (Company No.{" "}
        {company.companyNumber})
      </p>
      <div className="prose-legal mt-8">{children}</div>
    </article>
  );
}
