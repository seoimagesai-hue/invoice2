import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export type TaxMode = "exclusive" | "inclusive" | "none";

export interface LineItemInput {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent?: number;
  taxRate?: number;
}

export interface LineTotals {
  lineSubtotalCents: number;
  lineDiscountCents: number;
  lineTaxCents: number;
  lineTotalCents: number;
}

export interface DocumentTotals {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  lines: LineTotals[];
}

/** Convert major currency units (e.g. 12.50) to integer cents */
export function toCents(amount: number | string): number {
  return new Decimal(amount || 0).mul(100).round().toNumber();
}

/** Convert cents to major units */
export function fromCents(cents: number): number {
  return new Decimal(cents || 0).div(100).toNumber();
}

export function formatMoney(
  cents: number,
  currency = "GBP",
  locale = "en-GB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(fromCents(cents));
}

export function calculateLine(
  item: LineItemInput,
  taxMode: TaxMode
): LineTotals {
  const qty = new Decimal(item.quantity || 0);
  const unit = new Decimal(item.unitPriceCents || 0);
  const discountPct = new Decimal(item.discountPercent || 0).div(100);
  const taxRate = new Decimal(taxMode === "none" ? 0 : item.taxRate || 0).div(
    100
  );

  const gross = qty.mul(unit);
  const discount = gross.mul(discountPct);
  const afterDiscount = gross.minus(discount);

  let lineTax = new Decimal(0);
  let lineTotal = afterDiscount;
  let lineSubtotal = afterDiscount;

  if (taxMode === "exclusive") {
    lineTax = afterDiscount.mul(taxRate);
    lineTotal = afterDiscount.plus(lineTax);
  } else if (taxMode === "inclusive") {
    // afterDiscount includes tax
    lineSubtotal = afterDiscount.div(taxRate.plus(1));
    lineTax = afterDiscount.minus(lineSubtotal);
    lineTotal = afterDiscount;
  }

  return {
    lineSubtotalCents: lineSubtotal.round().toNumber(),
    lineDiscountCents: discount.round().toNumber(),
    lineTaxCents: lineTax.round().toNumber(),
    lineTotalCents: lineTotal.round().toNumber(),
  };
}

export function calculateDocument(
  items: LineItemInput[],
  taxMode: TaxMode
): DocumentTotals {
  const lines = items.map((item) => calculateLine(item, taxMode));

  const subtotalCents = lines.reduce((s, l) => s + l.lineSubtotalCents, 0);
  const discountCents = lines.reduce((s, l) => s + l.lineDiscountCents, 0);
  const taxCents = lines.reduce((s, l) => s + l.lineTaxCents, 0);
  const totalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);

  return { subtotalCents, discountCents, taxCents, totalCents, lines };
}

export function outstandingCents(
  totalCents: number,
  amountPaidCents: number
): number {
  return Math.max(0, totalCents - amountPaidCents);
}
