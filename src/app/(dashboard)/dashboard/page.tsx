"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, PoundSterling, Receipt, Users } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { apiFetch, formatDisplayDate } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";

type Stats = {
  clientCount: number;
  invoiceCount: number;
  quotationCount: number;
  invoicesByStatus: Record<string, number>;
  totalOutstandingCents: number;
  paidThisMonthCents: number;
};

type InvoiceRow = {
  id: string;
  number: string;
  status: string;
  totalCents: number;
  currency: string;
  issueDate: string;
  client: { name: string };
};

type QuotationRow = {
  id: string;
  number: string;
  status: string;
  totalCents: number;
  currency: string;
  issueDate: string;
  client: { name: string };
};

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ stats: Stats }>("/api/dashboard/stats"),
      apiFetch<{ invoices: InvoiceRow[] }>("/api/invoices"),
      apiFetch<{ quotations: QuotationRow[] }>("/api/quotations"),
    ])
      .then(([statsRes, invRes, quoRes]) => {
        setStats(statsRes.stats);
        setInvoices(invRes.invoices.slice(0, 5));
        setQuotations(quoRes.quotations.slice(0, 5));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">Loading overview…</p>
    );
  }

  if (error || !stats) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error ?? "Unable to load stats"}
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your business at a glance"
        actionLabel="New invoice"
        actionHref="/dashboard/invoices/new"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={formatMoney(stats.totalOutstandingCents)}
          icon={PoundSterling}
          hint="Unpaid sent & overdue invoices"
        />
        <StatCard
          label="Paid this month"
          value={formatMoney(stats.paidThisMonthCents)}
          icon={PoundSterling}
        />
        <StatCard
          label="Clients"
          value={String(stats.clientCount)}
          icon={Users}
        />
        <StatCard
          label="Documents"
          value={`${stats.invoiceCount} inv · ${stats.quotationCount} quo`}
          icon={FileText}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-[var(--brand)]">Recent invoices</h2>
            <Link
              href="/dashboard/invoices"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          {invoices.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Create your first invoice to start getting paid."
              actionLabel="Create invoice"
              actionHref="/dashboard/invoices/new"
            />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {invoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-[var(--surface-muted)]/50"
                  >
                    <div>
                      <p className="font-medium">{inv.number}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {inv.client.name} · {formatDisplayDate(inv.issueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formatMoney(inv.totalCents, inv.currency)}
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-[var(--brand)]">Recent quotations</h2>
            <Link
              href="/dashboard/quotations"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          {quotations.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No quotations yet"
              description="Send a quotation before you invoice."
              actionLabel="Create quotation"
              actionHref="/dashboard/quotations/new"
            />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {quotations.map((quo) => (
                <li key={quo.id}>
                  <Link
                    href={`/dashboard/quotations/${quo.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-[var(--surface-muted)]/50"
                  >
                    <div>
                      <p className="font-medium">{quo.number}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {quo.client.name} · {formatDisplayDate(quo.issueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formatMoney(quo.totalCents, quo.currency)}
                      </span>
                      <StatusBadge status={quo.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
