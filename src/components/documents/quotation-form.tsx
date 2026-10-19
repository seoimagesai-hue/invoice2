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

export type QuotationFormValues = {
  clientId: string;
  issueDate: string;
  validUntil: string;
  status: string;
  taxMode: TaxMode;
  notes: string;
  terms: string;
  items: FormLineItem[];
};

type ClientOption = { id: string; name: string; companyName?: string | null };

const quotationStatuses = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
] as const;

export function quotationToForm(quotation: {
  clientId: string;
  issueDate: string | Date;
  validUntil: string | Date;
  status: string;
  taxMode: string;
  notes?: string | null;
  terms?: string | null;
  items: {
    description: string;
    quantity: number;
    unitPriceCents: number;
    discountPercent: number;
    taxRate: number;
  }[];
}): QuotationFormValues {
  return {
    clientId: quotation.clientId,
    issueDate: formatDateInput(quotation.issueDate),
    validUntil: formatDateInput(quotation.validUntil),
    status: quotation.status,
    taxMode: quotation.taxMode as TaxMode,
    notes: quotation.notes ?? "",
    terms: quotation.terms ?? "",
    items: quotation.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: fromCents(item.unitPriceCents),
      discountPercent: item.discountPercent,
      taxRate: item.taxRate,
    })),
  };
}

export function defaultQuotationForm(defaultTaxRate = 20): QuotationFormValues {
  const today = formatDateInput(new Date());
  const valid = new Date();
  valid.setDate(valid.getDate() + 30);
  return {
    clientId: "",
    issueDate: today,
    validUntil: formatDateInput(valid),
    status: "DRAFT",
    taxMode: "exclusive",
    notes: "",
    terms: "",
    items: [defaultLineItem(defaultTaxRate)],
  };
}

export function QuotationForm({
  initial,
  quotationId,
  onSuccess,
  onCancel,
  readOnly,
}: {
  initial: QuotationFormValues;
  quotationId?: string;
  onSuccess: (quotation: { id: string; status: string }) => void;
  onCancel?: () => void;
  readOnly?: boolean;
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
        if (!quotationId && initial.items.length === 1 && !initial.clientId) {
          setValues((v) => ({
            ...v,
            items: [defaultLineItem(d.business.defaultTaxRate)],
          }));
        }
      })
      .catch(() => {});
  }, [quotationId, initial.clientId, initial.items.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setError(null);
    setLoading(true);
    try {
      const payload = {
        clientId: values.clientId,
        issueDate: values.issueDate,
        validUntil: values.validUntil,
        status: values.status,
        taxMode: values.taxMode,
        notes: values.notes || null,
        terms: values.terms || null,
        items: values.items,
      };
      if (quotationId) {
        const data = await apiFetch<{ quotation: { id: string; status: string } }>(
          `/api/quotations/${quotationId}`,
          { method: "PATCH", body: JSON.stringify(payload) }
        );
        onSuccess(data.quotation);
      } else {
        const data = await apiFetch<{ quotation: { id: string; status: string } }>(
          "/api/quotations",
          { method: "POST", body: JSON.stringify(payload) }
        );
        onSuccess(data.quotation);
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
          <Label htmlFor="quo-client">Client *</Label>
          <select
            id="quo-client"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm disabled:opacity-60"
            value={values.clientId}
            onChange={(e) =>
              setValues((v) => ({ ...v, clientId: e.target.value }))
            }
            required
            disabled={readOnly}
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.companyName ? ` (${c.companyName})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="quo-issue">Issue date *</Label>
          <Input
            id="quo-issue"
            type="date"
            value={values.issueDate}
            onChange={(e) =>
              setValues((v) => ({ ...v, issueDate: e.target.value }))
            }
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="quo-valid">Valid until *</Label>
          <Input
            id="quo-valid"
            type="date"
            value={values.validUntil}
            onChange={(e) =>
              setValues((v) => ({ ...v, validUntil: e.target.value }))
            }
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="quo-status">Status</Label>
          <select
            id="quo-status"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm disabled:opacity-60"
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value }))
            }
            disabled={readOnly}
          >
            {quotationStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="quo-tax-mode">Tax mode</Label>
          <select
            id="quo-tax-mode"
            className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm disabled:opacity-60"
            value={values.taxMode}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                taxMode: e.target.value as TaxMode,
              }))
            }
            disabled={readOnly}
          >
            <option value="exclusive">Exclusive</option>
            <option value="inclusive">Inclusive</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="quo-notes">Notes</Label>
          <Textarea
            id="quo-notes"
            rows={3}
            value={values.notes}
            onChange={(e) =>
              setValues((v) => ({ ...v, notes: e.target.value }))
            }
            disabled={readOnly}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="quo-terms">Terms</Label>
          <Textarea
            id="quo-terms"
            rows={2}
            value={values.terms}
            onChange={(e) =>
              setValues((v) => ({ ...v, terms: e.target.value }))
            }
            disabled={readOnly}
          />
        </div>
      </div>

      <LineItemsEditor
        items={values.items}
        taxMode={values.taxMode}
        currency={currency}
        onChange={(items) => setValues((v) => ({ ...v, items }))}
        disabled={loading || readOnly}
      />

      {!readOnly ? (
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={loading || !values.clientId}>
            {loading
              ? "Saving…"
              : quotationId
                ? "Update quotation"
                : "Create quotation"}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
