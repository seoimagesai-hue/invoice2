"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Wallet } from "lucide-react";
import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { apiFetch, formatDateInput, formatDisplayDate } from "@/lib/client-api";
import { formatMoney } from "@/lib/money";

type PaymentRow = {
  id: string;
  amountCents: number;
  paidAt: string;
  method?: string | null;
  reference?: string | null;
  invoice: { id: string; number: string };
};

type InvoiceOption = {
  id: string;
  number: string;
  totalCents: number;
  amountPaidCents: number;
  currency: string;
};

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const preselectedInvoice = searchParams.get("invoiceId") ?? "";

  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [invoiceId, setInvoiceId] = useState(preselectedInvoice);
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(formatDateInput(new Date()));
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<{ payments: PaymentRow[] }>("/api/payments")
      .then((d) => setPayments(d.payments))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load payments")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    apiFetch<{ invoices: InvoiceOption[] }>("/api/invoices")
      .then((d) => setInvoices(d.invoices))
      .catch(() => setInvoices([]));
  }, [load]);

  useEffect(() => {
    if (preselectedInvoice) setInvoiceId(preselectedInvoice);
  }, [preselectedInvoice]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);
    try {
      await apiFetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          invoiceId,
          amount: parseFloat(amount),
          paidAt,
          method: method || null,
          reference: reference || null,
          notes: notes || null,
        }),
      });
      setFormSuccess("Payment recorded.");
      setAmount("");
      setMethod("");
      setReference("");
      setNotes("");
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  const selected = invoices.find((i) => i.id === invoiceId);
  const outstanding =
    selected != null
      ? Math.max(0, selected.totalCents - selected.amountPaidCents)
      : null;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Record payments against invoices"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Card>
          <h2 className="mb-4 font-semibold text-[var(--brand)]">Record payment</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {formError ? (
              <p className="text-sm text-red-600">{formError}</p>
            ) : null}
            {formSuccess ? (
              <p className="text-sm text-emerald-700">{formSuccess}</p>
            ) : null}
            <div>
              <Label htmlFor="pay-invoice">Invoice *</Label>
              <select
                id="pay-invoice"
                className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
              >
                <option value="">Select invoice</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.number} —{" "}
                    {formatMoney(
                      Math.max(0, inv.totalCents - inv.amountPaidCents),
                      inv.currency
                    )}{" "}
                    due
                  </option>
                ))}
              </select>
              {outstanding != null ? (
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Outstanding: {formatMoney(outstanding, selected?.currency)}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="pay-amount">Amount (GBP) *</Label>
              <Input
                id="pay-amount"
                type="number"
                min={0.01}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="pay-date">Paid on *</Label>
              <Input
                id="pay-date"
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="pay-method">Method</Label>
              <Input
                id="pay-method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Bank transfer, card…"
              />
            </div>
            <div>
              <Label htmlFor="pay-ref">Reference</Label>
              <Input
                id="pay-ref"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pay-notes">Notes</Label>
              <Textarea
                id="pay-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting || !invoiceId}>
              {submitting ? "Saving…" : "Record payment"}
            </Button>
          </form>
        </Card>

        <div>
          {error ? (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {loading ? (
            <p className="text-sm text-[var(--muted-foreground)]">Loading payments…</p>
          ) : payments.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No payments recorded"
              description="Payments you log will appear here."
            />
          ) : (
            <DataTableShell>
              <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{formatDisplayDate(p.paidAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/invoices/${p.invoice.id}`}
                        className="text-[var(--accent)] hover:underline"
                      >
                        {p.invoice.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatMoney(p.amountCents)}
                    </td>
                    <td className="px-4 py-3">{p.method ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </DataTableShell>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-[var(--muted-foreground)]">Loading payments…</p>
      }
    >
      <PaymentsPageContent />
    </Suspense>
  );
}
