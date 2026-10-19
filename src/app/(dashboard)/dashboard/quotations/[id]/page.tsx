"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { QuotationDetailPanel } from "@/components/documents/quotation-detail-panel";
import { apiFetch } from "@/lib/client-api";

type QuotationDetail = Parameters<typeof QuotationDetailPanel>[0]["quotation"];

export default function QuotationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ quotation: QuotationDetail & { number: string } }>(
      `/api/quotations/${id}`
    )
      .then((d) => setQuotation(d.quotation))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Quotation not found")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">Loading quotation…</p>
    );
  }

  if (error || !quotation) {
    return (
      <div>
        <p className="text-red-600">{error ?? "Not found"}</p>
        <Link href="/dashboard/quotations" className="mt-2 text-sm text-[var(--accent)]">
          Back to quotations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/quotations"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)]"
        >
          ← Quotations
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--brand)]">
          {quotation.number}
        </h1>
      </div>
      <Card>
        <QuotationDetailPanel quotation={quotation} />
      </Card>
    </div>
  );
}
