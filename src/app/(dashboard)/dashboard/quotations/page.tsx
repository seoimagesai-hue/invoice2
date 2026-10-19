"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, Search } from "lucide-react";
import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Input } from "@/components/ui/input";
import { apiFetch, formatDisplayDate } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";

type QuotationRow = {
  id: string;
  number: string;
  status: string;
  totalCents: number;
  currency: string;
  issueDate: string;
  client: { name: string; companyName?: string | null };
};

const statuses = [
  "",
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
];

export default function QuotationsListPage() {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    apiFetch<{ quotations: QuotationRow[] }>(`/api/quotations?${params}`)
      .then((d) => setQuotations(d.quotations))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Create and send quotes to clients"
        actionLabel="New quotation"
        actionHref="/dashboard/quotations/new"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            className="pl-9"
            placeholder="Search by quotation number…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          {statuses.map((s) => (
            <option key={s || "all"} value={s}>
              {s ? s.replace(/_/g, " ") : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading quotations…</p>
      ) : quotations.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No quotations found"
          description={
            q || status
              ? "Try adjusting your search or filters."
              : "Create a quotation to win work before invoicing."
          }
          actionLabel={q || status ? undefined : "Create quotation"}
          actionHref={q || status ? undefined : "/dashboard/quotations/new"}
        />
      ) : (
        <DataTableShell>
          <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {quotations.map((quo) => (
              <tr key={quo.id} className="hover:bg-[var(--surface-muted)]/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/quotations/${quo.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {quo.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{quo.client.name}</td>
                <td className="px-4 py-3">{formatDisplayDate(quo.issueDate)}</td>
                <td className="px-4 py-3 font-medium">
                  {formatMoney(quo.totalCents, quo.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={quo.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      )}
    </div>
  );
}
