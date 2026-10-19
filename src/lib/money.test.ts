import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDocument,
  calculateLine,
  formatMoney,
  outstandingCents,
  toCents,
} from "./money";

describe("money", () => {
  it("converts major units to cents without float drift", () => {
    assert.equal(toCents(19.99), 1999);
    assert.equal(toCents("0.1"), 10);
  });

  it("calculates exclusive tax line totals", () => {
    const line = calculateLine(
      {
        description: "Design",
        quantity: 2,
        unitPriceCents: 10000,
        discountPercent: 10,
        taxRate: 20,
      },
      "exclusive"
    );
    // 2 * 100 = 200, discount 20 = 180, tax 36 = 216
    assert.equal(line.lineSubtotalCents, 18000);
    assert.equal(line.lineDiscountCents, 2000);
    assert.equal(line.lineTaxCents, 3600);
    assert.equal(line.lineTotalCents, 21600);
  });

  it("calculates inclusive tax by extracting VAT", () => {
    const line = calculateLine(
      {
        description: "Service",
        quantity: 1,
        unitPriceCents: 12000,
        discountPercent: 0,
        taxRate: 20,
      },
      "inclusive"
    );
    assert.equal(line.lineTotalCents, 12000);
    assert.equal(line.lineSubtotalCents, 10000);
    assert.equal(line.lineTaxCents, 2000);
  });

  it("aggregates document totals", () => {
    const totals = calculateDocument(
      [
        {
          description: "A",
          quantity: 1,
          unitPriceCents: 1000,
          taxRate: 0,
        },
        {
          description: "B",
          quantity: 1,
          unitPriceCents: 2000,
          taxRate: 20,
        },
      ],
      "exclusive"
    );
    assert.equal(totals.subtotalCents, 3000);
    assert.equal(totals.taxCents, 400);
    assert.equal(totals.totalCents, 3400);
  });

  it("formats GBP and outstanding balances", () => {
    assert.match(formatMoney(12345, "GBP"), /£123\.45/);
    assert.equal(outstandingCents(1000, 400), 600);
    assert.equal(outstandingCents(1000, 1500), 0);
  });
});
