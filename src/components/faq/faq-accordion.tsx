"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import type { FaqCategory } from "@/config/faq";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  categories: FaqCategory[];
  /** Limit items per category for preview sections */
  maxItemsPerCategory?: number;
  /** default = category groups; minimal = flat +/x list for homepage */
  variant?: "default" | "minimal";
};

export function FaqAccordion({
  categories,
  maxItemsPerCategory,
  variant = "default",
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (variant === "minimal") {
    const items = categories.flatMap((category) => {
      const sliced = maxItemsPerCategory
        ? category.items.slice(0, maxItemsPerCategory)
        : category.items;
      return sliced.map((item, index) => ({
        id: `${category.id}-${index}`,
        ...item,
      }));
    });

    return (
      <ul className="border-y border-[var(--border)]">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id} className="border-b border-[var(--border)] last:border-b-0">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="text-base font-semibold text-[var(--brand)] sm:text-lg">
                  {item.question}
                </span>
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-[var(--muted-foreground)]"
                  aria-hidden
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              {isOpen ? (
                <p className="pb-5 pr-10 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-[0.95rem]">
                  {item.answer}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const items = maxItemsPerCategory
          ? category.items.slice(0, maxItemsPerCategory)
          : category.items;

        return (
          <section key={category.id} aria-labelledby={`faq-${category.id}`}>
            <h2
              id={`faq-${category.id}`}
              className="font-display text-xl font-semibold text-[var(--brand)]"
            >
              {category.title}
            </h2>
            <ul className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white">
              {items.map((item, index) => {
                const id = `${category.id}-${index}`;
                const isOpen = openId === id;

                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-muted)]/60"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(isOpen ? null : id)}
                    >
                      {item.question}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-[var(--muted)] transition",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {item.answer}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
