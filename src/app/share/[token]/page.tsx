"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";
import { DevWiserLogo } from "@/components/brand/logo";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";

type SharePayload =
  | {
      type: "INVOICE";
      document: {
        id: string;
        number: string;
        status: string;
        issueDate: string;
        dueDate: string;
        currency: string;
        totalCents: number;
        amountPaidCents: number;
        notes?: string | null;
        paymentTerms?: string | null;
        client: { name: string; companyName?: string | null };
      };
    }
  | {
      type: "QUOTATION";
      document: {
        id: string;
        number: string;
        status: string;
        issueDate: string;
        validUntil: string;
        currency: string;
        totalCents: number;
        notes?: string | null;
        terms?: string | null;
        client: { name: string; companyName?: string | null };
      };
    };

export default function PublicSharePage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(async (res) => {
        const json = (await res.json()) as SharePayload & { error?: string };
        if (!res.ok) throw new Error(json.error ?? "Not found");
        setData(json);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Document not found")
      )
      .finally(() => setLoading(false));
  }, [token]);

  function downloadPdf() {
    window.location.href = `/api/share/${token}/pdf`;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <header className="border-b border-[var(--border)] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <DevWiserLogo href="/" size="sm" />
          <Link href="/login" className="text-sm text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {loading ? (
          <p className="text-sm text-[var(--muted-foreground)]">Loading document…</p>
        ) : error || !data ? (
          <div className="rounded-xl border border-[var(--border)] bg-white p-8 text-center">
            <h1 className="text-lg font-semibold text-[var(--brand)]">
              Document unavailable
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{error}</p>
          </div>
        ) : (
          <article className="rounded-xl border border-[var(--border)] bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  {data.type === "INVOICE" ? "Invoice" : "Quotation"}
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-[var(--brand)]">
                  {data.document.number}
                </h1>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Prepared for {data.document.client.name}
                  {data.document.client.companyName
                    ? ` · ${data.document.client.companyName}`
                    : ""}
                </p>
              </div>
              <StatusBadge status={data.document.status} />
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-[var(--muted-foreground)]">Issued</dt>
                <dd className="font-medium">
                  {formatDisplayDate(data.document.issueDate)}
                </dd>
              </div>
              {data.type === "INVOICE" ? (
                <div>
                  <dt className="text-[var(--muted-foreground)]">Due</dt>
                  <dd className="font-medium">
                    {formatDisplayDate(data.document.dueDate)}
                  </dd>
                </div>
              ) : (
                <div>
                  <dt className="text-[var(--muted-foreground)]">Valid until</dt>
                  <dd className="font-medium">
                    {formatDisplayDate(data.document.validUntil)}
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-[var(--muted-foreground)]">Total</dt>
                <dd className="text-xl font-semibold text-[var(--brand)]">
                  {formatMoney(data.document.totalCents, data.document.currency)}
                </dd>
              </div>
              {data.type === "INVOICE" &&
              data.document.amountPaidCents > 0 ? (
                <div>
                  <dt className="text-[var(--muted-foreground)]">Paid</dt>
                  <dd className="font-medium">
                    {formatMoney(
                      data.document.amountPaidCents,
                      data.document.currency
                    )}
                  </dd>
                </div>
              ) : null}
            </dl>

            {data.document.notes ? (
              <section className="mt-6 text-sm">
                <h2 className="font-medium text-[var(--brand)]">Notes</h2>
                <p className="mt-1 whitespace-pre-wrap text-[var(--muted-foreground)]">
                  {data.document.notes}
                </p>
              </section>
            ) : null}

            <Button type="button" className="mt-8" onClick={downloadPdf}>
              <Download className="h-4 w-4" aria-hidden />
              Download PDF
            </Button>
          </article>
        )}
      </main>
    </div>
  );
}
