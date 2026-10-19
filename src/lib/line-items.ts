import { toCents, type LineItemInput } from "@/lib/money";
import { lineItemSchema } from "@/lib/validations";
import type { z } from "zod";

export type FormLineItem = z.infer<typeof lineItemSchema>;

export function formItemsToLineInputs(items: FormLineItem[]): LineItemInput[] {
  return items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPriceCents: toCents(item.unitPrice),
    discountPercent: item.discountPercent ?? 0,
    taxRate: item.taxRate ?? 0,
  }));
}

export function lineItemsForCreate(
  items: FormLineItem[]
): {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent: number;
  taxRate: number;
  sortOrder: number;
}[] {
  return items.map((item, index) => ({
    description: item.description,
    quantity: item.quantity,
    unitPriceCents: toCents(item.unitPrice),
    discountPercent: item.discountPercent ?? 0,
    taxRate: item.taxRate ?? 0,
    sortOrder: index,
  }));
}
