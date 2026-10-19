"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, MessageCircle, Smile } from "lucide-react";
import type { FaqCategory } from "@/config/faq";
import { cn } from "@/lib/utils";

type FaqHelpCenterProps = {
  categories: FaqCategory[];
};

export function FaqHelpCenter({ categories }: FaqHelpCenterProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const [openId, setOpenId] = useState<string | null>(null);

  const active = useMemo(
    () => categories.find((c) => c.id === activeId) ?? categories[0],
    [activeId, categories]
  );

  if (!active) return null;

  return (
    <div className="faq-help">
      <div className="faq-help__shell">
        {/* Left: category nav */}
        <nav className="faq-help__nav" aria-label="FAQ categories">
          <p className="faq-help__nav-label">Categories</p>
          <ul className="faq-help__nav-list">
            {categories.map((category) => {
              const isActive = category.id === active.id;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    className={cn(
                      "faq-help__nav-item",
                      isActive && "faq-help__nav-item--active"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setActiveId(category.id);
                      setOpenId(null);
                    }}
                  >
                    {category.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Center: questions */}
        <section
          className="faq-help__panel"
          aria-labelledby={`faq-panel-${active.id}`}
        >
          <h1 id={`faq-panel-${active.id}`} className="faq-help__title">
            {active.title}
          </h1>
          <p className="faq-help__subtitle">
            Select a question to read the answer.
          </p>

          <ul className="faq-help__list">
            {active.items.map((item, index) => {
              const id = `${active.id}-${index}`;
              const isOpen = openId === id;
              return (
                <li key={id} className="faq-help__row">
                  <button
                    type="button"
                    className="faq-help__question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : id)}
                  >
                    <span>{item.question}</span>
                    <ChevronRight
                      className={cn(
                        "faq-help__chevron",
                        isOpen && "faq-help__chevron--open"
                      )}
                      aria-hidden
                    />
                  </button>
                  {isOpen ? (
                    <div className="faq-help__answer">{item.answer}</div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Right: utility links */}
        <aside className="faq-help__aside" aria-label="Helpful links">
          <Link href="/contact" className="faq-help__aside-link">
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            Contact support
          </Link>
          <Link href="/about" className="faq-help__aside-link">
            <Smile className="h-4 w-4 shrink-0" aria-hidden />
            About SpectBill
          </Link>
        </aside>
      </div>
    </div>
  );
}
