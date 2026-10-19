"use client";

import type { BillingInterval } from "@/config/plans";
import { cn } from "@/lib/utils";

type PricingToggleProps = {
  interval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  annualBadge?: string;
};

export function PricingToggle({
  interval,
  onChange,
  annualBadge = "Save ~17%",
}: PricingToggleProps) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white p-1 shadow-sm"
      role="group"
      aria-label="Billing interval"
    >
      <button
        type="button"
        onClick={() => onChange("month")}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition",
          interval === "month"
            ? "bg-[var(--brand)] text-white shadow-sm"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
        aria-pressed={interval === "month"}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("year")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
          interval === "year"
            ? "bg-[var(--brand)] text-white shadow-sm"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
        aria-pressed={interval === "year"}
      >
        Annual
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            interval === "year"
              ? "bg-white/20 text-white"
              : "bg-[var(--surface-muted)] text-[var(--accent)]"
          )}
        >
          {annualBadge}
        </span>
      </button>
    </div>
  );
}
