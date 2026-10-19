"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultLineItem,
  LineItemsEditor,
} from "@/components/documents/line-items-editor";
import { apiFetch, formatDateInput } from "@/lib/client-api";
import type { FormLineItem } from "@/lib/line-items";
import { fromCents, type TaxMode } from "@/lib/money";

export type InvoiceFormValues = {
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: string;
  taxMode: TaxMode;
  notes: string;
  paymentTerms: string;
  items: FormLineItem[];
};

type ClientOption = { id: string; name: string; companyName?: string | null };

const invoiceStatuses = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

export function invoiceToForm(invoice: {
  clientId: string;
  issueDate: string | Date;
  dueDate: string | Date;
  status: string;
  taxMode: string;
  notes?: string | null;
  paymentTerms?: string | null;
  items: {
    description: string;
    quantity: number;
    unitPriceCents: number;
    discountPercent: number;
    taxRate: number;
  }[];
}): InvoiceFormValues {
  return {
    clientId: invoice.clientId,
    issueDate: formatDateInput(invoice.issueDate),
    dueDate: formatDateInput(invoice.dueDate),
    status: invoice.status,
    taxMode: invoice.taxMode as TaxMode,
    notes: invoice.notes ?? "",
    paymentTerms: invoice.paymentTerms ?? "",
    items: invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: fromCents(item.unitPriceCents),
      discountPercent: item.discountPercent,
      taxRate: item.taxRate,
    })),
  };
}

export function defaultInvoiceForm(defaultTaxRate = 20): InvoiceFormValues {
  const today = formatDateInput(new Date());
  const due = new Date();
  due.setDate(due.getDate() + 30);
  return {
    clientId: "",
    issueDate: today,
    dueDate: formatDateInput(due),
    status: "DRAFT",
    taxMode: "exclusive",
    notes: "",
    paymentTerms: "",
    items: [defaultLineItem(defaultTaxRate)],
  };
}

export function InvoiceForm({
  initial,
  invoiceId,
  onSuccess,
  onCancel,
}: {
  initial: InvoiceFormValues;
  invoiceId?: string;
  onSuccess: (invoice: { id: string }) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [currency, setCurrency] = useState("GBP");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ clients: ClientOption[] }>("/api/clients")
      .then((d) => setClients(d.clients))
      .catch(() => setClients([]));
    apiFetch<{ business: { currency: string; defaultTaxRate: number } }>(
      "/api/business"
    )
      .then((d) => {
        setCurrency(d.business.currency);
        if (!invoiceId && initial.items.length === 1 && !initial.clientId) {
          setValues((v) => ({
            ...v,
            items: [defaultLineItem(d.business.defaultTaxRate)],
          }));
        }
      })
      .catch(() => {});
  }, [invoiceId, initial.clientId, initial.items.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        clientId: values.clientId,
        issueDate: values.issueDate,
        dueDate: values.dueDate,
        status: values.status,
        taxMode: values.taxMode,
        notes: values.notes || null,
        paymentTerms: values.paymentTerms || null,
        items: values.items,
      };
      if (invoiceId) {
        const data = await apiFetch<{ invoice: { id: string } }>(
          `/api/invoices/${invoiceId}`,
          { method: "PATCH", body: JSON.stringify(payload) }
        );
        onSuccess(data.invoice);
      } else {
        const data = await apiFetch<{ invoice: { id: string } }>(
          "/api/invoices",
          { method: "POST", body: JSON.stringify(payload) }
        );
        onSuccess(data.invoice);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="inv-client">Client *</Label>
          <select
            id="inv-client"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
            value={values.clientId}
            onChange={(e) =>
              setValues((v) => ({ ...v, clientId: e.target.value }))
            }
            required
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.companyName ? ` (${c.companyName})` : ""}
              </option>
            ))}
          </select>
          {clients.length === 0 ? (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Add a client before creating an invoice.
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="inv-issue">Issue date *</Label>
          <Input
            id="inv-issue"
            type="date"
            value={values.issueDate}
            onChange={(e) =>
              setValues((v) => ({ ...v, issueDate: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="inv-due">Due date *</Label>
          <Input
            id="inv-due"
            type="date"
            value={values.dueDate}
            onChange={(e) =>
              setValues((v) => ({ ...v, dueDate: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="inv-status">Status</Label>
          <select
            id="inv-status"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value }))
            }
          >
            {invoiceStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="inv-tax-mode">Tax mode</Label>
          <select
            id="inv-tax-mode"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
            value={values.taxMode}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                taxMode: e.target.value as TaxMode,
              }))
            }
          >
            <option value="exclusive">Exclusive</option>
            <option value="inclusive">Inclusive</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="inv-notes">Notes</Label>
          <Textarea
            id="inv-notes"
            rows={3}
            value={values.notes}
            onChange={(e) =>
              setValues((v) => ({ ...v, notes: e.target.value }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="inv-terms">Payment terms</Label>
          <Textarea
            id="inv-terms"
            rows={2}
            value={values.paymentTerms}
            onChange={(e) =>
              setValues((v) => ({ ...v, paymentTerms: e.target.value }))
            }
          />
        </div>
      </div>

      <LineItemsEditor
        items={values.items}
        taxMode={values.taxMode}
        currency={currency}
        onChange={(items) => setValues((v) => ({ ...v, items }))}
        disabled={loading}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading || !values.clientId}>
          {loading ? "Saving…" : invoiceId ? "Update invoice" : "Create invoice"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
