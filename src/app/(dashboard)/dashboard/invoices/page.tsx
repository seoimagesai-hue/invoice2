"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Input } from "@/components/ui/input";
import { apiFetch, formatDisplayDate } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";

type InvoiceRow = {
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
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

export default function InvoicesListPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
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
    apiFetch<{ invoices: InvoiceRow[] }>(`/api/invoices?${params}`)
      .then((d) => setInvoices(d.invoices))
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
        title="Invoices"
        description="Manage and track your invoices"
        actionLabel="New invoice"
        actionHref="/dashboard/invoices/new"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            className="pl-9"
            placeholder="Search by invoice number…"
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
        <p className="text-sm text-[var(--muted-foreground)]">Loading invoices…</p>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description={
            q || status
              ? "Try adjusting your search or filters."
              : "Create your first invoice to bill clients."
          }
          actionLabel={q || status ? undefined : "Create invoice"}
          actionHref={q || status ? undefined : "/dashboard/invoices/new"}
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
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[var(--surface-muted)]/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {inv.number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {inv.client.name}
                  {inv.client.companyName ? (
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      {inv.client.companyName}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">{formatDisplayDate(inv.issueDate)}</td>
                <td className="px-4 py-3 font-medium">
                  {formatMoney(inv.totalCents, inv.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      )}
    </div>
  );
}
