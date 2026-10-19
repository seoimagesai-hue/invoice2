"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { InvoiceDetailPanel } from "@/components/documents/invoice-detail-panel";
import { apiFetch } from "@/lib/client-api";

type InvoiceDetail = Parameters<typeof InvoiceDetailPanel>[0]["invoice"];

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ invoice: InvoiceDetail & { number: string; shareToken?: string | null } }>(
      `/api/invoices/${id}`
    )
      .then((d) => setInvoice(d.invoice))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Invoice not found")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading invoice…</p>;
  }

  if (error || !invoice) {
    return (
      <div>
        <p className="text-red-600">{error ?? "Not found"}</p>
        <Link href="/dashboard/invoices" className="mt-2 text-sm text-[var(--accent)]">
          Back to invoices
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/invoices"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)]"
        >
          ← Invoices
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--brand)]">
          {invoice.number}
        </h1>
      </div>
      <Card>
        <InvoiceDetailPanel invoice={invoice} />
      </Card>
    </div>
  );
}
