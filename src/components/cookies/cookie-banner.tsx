"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "spectbill_cookie_consent";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(analytics: boolean, marketing: boolean) {
    const consent: Consent = {
      essential: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
    // Non-essential scripts must only load after consent — none are loaded by default.
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--border)] bg-white p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl text-sm text-[var(--muted-foreground)]">
          <p className="font-medium text-[var(--foreground)]">Cookie preferences</p>
          <p className="mt-1">
            We use essential cookies to keep you signed in and secure the
            service. Analytics and marketing cookies are optional and are not
            loaded unless you choose to allow them. See our{" "}
            <Link href="/legal/cookies" className="text-[var(--accent)] underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => save(false, false)}
          >
            Essential only
          </Button>
          <Button size="sm" onClick={() => save(true, false)}>
            Allow analytics
          </Button>
          <Button size="sm" onClick={() => save(true, true)}>
            Allow all
          </Button>
        </div>
      </div>
    </div>
  );
}
