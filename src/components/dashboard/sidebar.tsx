"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Receipt,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { SpectBillLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/quotations", label: "Quotations", icon: Receipt },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings/business", label: "Business Settings", icon: Building2 },
  {
    href: "/dashboard/settings/billing",
    label: "Subscription & Billing",
    icon: CreditCard,
  },
  { href: "/dashboard/settings/account", label: "Account Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "dash-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active ? "dash-nav-link--active" : "dash-nav-link--idle"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--brand)] md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <SpectBillLogo href="/dashboard" className="dash-sidebar-logo" />
        </div>
        <NavLinks />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[var(--brand)] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <SpectBillLogo href="/dashboard" className="dash-sidebar-logo" size="sm" />
              <button
                type="button"
                className="rounded-lg p-2 text-white hover:bg-white/10"
                aria-label="Close navigation"
                onClick={onMobileClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={onMobileClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function MobileMenuButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-[var(--border)] p-2 md:hidden"
      aria-label="Open navigation"
      onClick={onOpen}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
