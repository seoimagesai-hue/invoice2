"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { apiFetch } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";
import { FileText, PoundSterling, Users } from "lucide-react";

type Stats = {
  clientCount: number;
  invoiceCount: number;
  quotationCount: number;
  invoicesByStatus: Record<string, number>;
  totalOutstandingCents: number;
  paidThisMonthCents: number;
};

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ stats: Stats }>("/api/dashboard/stats")
      .then((d) => setStats(d.stats))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load reports")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading reports…</p>;
  }

  if (error || !stats) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
    );
  }

  const statusRows = Object.entries(stats.invoicesByStatus).sort(
    (a, b) => b[1] - a[1]
  );
  const maxCount = Math.max(1, ...statusRows.map(([, c]) => c));

  const hasData =
    stats.invoiceCount > 0 ||
    stats.quotationCount > 0 ||
    stats.clientCount > 0;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Summary from your live account data"
      />

      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to report yet"
          description="Create clients and invoices to see summaries here."
          actionLabel="Go to overview"
          actionHref="/dashboard"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Outstanding"
              value={formatMoney(stats.totalOutstandingCents)}
              icon={PoundSterling}
            />
            <StatCard
              label="Collected this month"
              value={formatMoney(stats.paidThisMonthCents)}
              icon={PoundSterling}
            />
            <StatCard
              label="Invoices"
              value={String(stats.invoiceCount)}
              icon={FileText}
            />
            <StatCard
              label="Clients"
              value={String(stats.clientCount)}
              icon={Users}
            />
          </div>

          <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[var(--brand)]">Invoices by status</h2>
            {statusRows.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No invoices yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {statusRows.map(([status, count]) => (
                  <li key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">
                        {status.replace(/_/g, " ").toLowerCase()}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-6 rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[var(--brand)]">Document counts</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-[var(--surface-muted)]/50 p-4">
                <dt className="text-xs text-[var(--muted-foreground)]">Clients</dt>
                <dd className="text-xl font-semibold">{stats.clientCount}</dd>
              </div>
              <div className="rounded-lg bg-[var(--surface-muted)]/50 p-4">
                <dt className="text-xs text-[var(--muted-foreground)]">Invoices</dt>
                <dd className="text-xl font-semibold">{stats.invoiceCount}</dd>
              </div>
              <div className="rounded-lg bg-[var(--surface-muted)]/50 p-4">
                <dt className="text-xs text-[var(--muted-foreground)]">Quotations</dt>
                <dd className="text-xl font-semibold">{stats.quotationCount}</dd>
              </div>
            </dl>
          </section>
        </>
      )}
    </div>
  );
}
