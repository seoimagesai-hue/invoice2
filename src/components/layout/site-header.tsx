"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { SpectBillLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const announcements = [
  { text: "Create professional invoices and quotations in minutes", href: "/register" },
  { text: "Proposed launch plans from £9/month — view pricing", href: "/pricing" },
  { text: "SPECTBILL LTD · Company No. 16395245", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcement = announcements[announcementIndex];

  function prevAnnouncement() {
    setAnnouncementIndex((i) => (i === 0 ? announcements.length - 1 : i - 1));
  }

  function nextAnnouncement() {
    setAnnouncementIndex((i) => (i === announcements.length - 1 ? 0 : i + 1));
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top announcement bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={prevAnnouncement}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--brand)]"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <Link
            href={announcement.href}
            className="min-w-0 truncate text-center text-xs font-medium text-[var(--brand)] transition hover:text-[var(--accent)] sm:text-sm"
          >
            {announcement.text}
            <span className="ml-1.5 inline-block text-[var(--accent)]" aria-hidden>
              →
            </span>
          </Link>
          <button
            type="button"
            onClick={nextAnnouncement}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--brand)]"
            aria-label="Next announcement"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Main navigation: logo | centered links | icons */}
      <div className="border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="relative z-10 shrink-0">
            <SpectBillLogo size="sm" />
          </div>

          <nav
            className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pointer-events-auto rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--brand)]",
                  pathname === link.href &&
                    "bg-[var(--surface-muted)] text-[var(--brand)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <Link href="/login" className="hidden lg:inline-flex">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register" className="hidden lg:inline-flex">
              <Button size="sm">Get Started</Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] text-[var(--brand)] transition hover:bg-[var(--surface-muted)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-nav"
            className="border-t border-[var(--border)] bg-white px-4 py-4 lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium",
                    pathname === link.href
                      ? "bg-[var(--surface-muted)] text-[var(--brand)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
