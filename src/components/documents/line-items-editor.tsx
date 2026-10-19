"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormLineItem } from "@/lib/line-items";
import {
  calculateDocument,
  formatMoney,
  type TaxMode,
} from "@/lib/money";
import { formItemsToLineInputs } from "@/lib/line-items";

export function defaultLineItem(taxRate = 20): FormLineItem {
  return {
    description: "",
    quantity: 1,
    unitPrice: 0,
    discountPercent: 0,
    taxRate,
  };
}

export function LineItemsEditor({
  items,
  taxMode,
  currency,
  onChange,
  disabled,
}: {
  items: FormLineItem[];
  taxMode: TaxMode;
  currency: string;
  onChange: (items: FormLineItem[]) => void;
  disabled?: boolean;
}) {
  const totals = calculateDocument(formItemsToLineInputs(items), taxMode);

  function updateItem(index: number, patch: Partial<FormLineItem>) {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    );
    onChange(next);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, defaultLineItem(items[0]?.taxRate ?? 20)]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label>Line items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add line
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30 p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                Line {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-red-600 hover:bg-red-50"
                onClick={() => removeItem(index)}
                disabled={disabled || items.length <= 1}
                aria-label={`Remove line ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor={`desc-${index}`}>Description</Label>
                <Input
                  id={`desc-${index}`}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, { description: e.target.value })
                  }
                  disabled={disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`qty-${index}`}>Quantity</Label>
                <Input
                  id={`qty-${index}`}
                  type="number"
                  min={0.01}
                  step="any"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, {
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`price-${index}`}>Unit price</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, {
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`disc-${index}`}>Discount %</Label>
                <Input
                  id={`disc-${index}`}
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={item.discountPercent ?? 0}
                  onChange={(e) =>
                    updateItem(index, {
                      discountPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <div>
                <Label htmlFor={`tax-${index}`}>Tax rate %</Label>
                <Input
                  id={`tax-${index}`}
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={item.taxRate ?? 0}
                  onChange={(e) =>
                    updateItem(index, {
                      taxRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={disabled || taxMode === "none"}
                />
              </div>
            </div>
            <p className="mt-2 text-right text-sm text-[var(--muted-foreground)]">
              Line total:{" "}
              <span className="font-medium text-[var(--foreground)]">
                {formatMoney(
                  totals.lines[index]?.lineTotalCents ?? 0,
                  currency
                )}
              </span>
            </p>
          </div>
        ))}
      </div>

      <dl className="ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
          <dd>{formatMoney(totals.subtotalCents, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted-foreground)]">Discount</dt>
          <dd>{formatMoney(totals.discountCents, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted-foreground)]">Tax</dt>
          <dd>{formatMoney(totals.taxCents, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatMoney(totals.totalCents, currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
