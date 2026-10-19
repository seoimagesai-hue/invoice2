"use client";

import { useState } from "react";
import {
  DashboardSidebar,
  MobileMenuButton,
} from "@/components/dashboard/sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--surface-muted)]">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--border)] bg-white px-4 sm:px-6">
          <MobileMenuButton onOpen={() => setMobileOpen(true)} />
          <p className="hidden text-sm font-medium text-[var(--muted-foreground)] sm:block">
            SpectBill dashboard
          </p>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
