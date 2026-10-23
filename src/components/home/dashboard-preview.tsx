import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  PoundSterling,
  Receipt,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Invoices", icon: FileText },
  { label: "Quotations", icon: Receipt },
  { label: "Clients", icon: Users },
  { label: "Payments", icon: Wallet },
  { label: "Reports", icon: BarChart3 },
  { label: "Business Settings", icon: Building2 },
  { label: "Subscription & Billing", icon: CreditCard },
  { label: "Account Settings", icon: Settings },
];

const sampleInvoices = [
  { number: "INV-00012", client: "Sample Client Ltd", amount: "£1,240.00", status: "SENT" },
  { number: "INV-00011", client: "Example Studio", amount: "£680.50", status: "PAID" },
  { number: "INV-00010", client: "Demo Services Co.", amount: "£320.00", status: "DRAFT" },
];

const sampleQuotations = [
  { number: "QUO-00008", client: "Northline Co.", amount: "£2,100.00", status: "SENT" },
  { number: "QUO-00007", client: "Bright Studio", amount: "£890.00", status: "ACCEPTED" },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-700",
    SENT: "bg-blue-50 text-blue-700",
    DRAFT: "bg-slate-100 text-slate-600",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
    OVERDUE: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function StatMini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof PoundSterling;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-1">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-1 font-display text-sm font-semibold text-[var(--brand)]">
            {value}
          </p>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]/10">
          <Icon className="h-3 w-3 text-[var(--accent)]" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[var(--background)] text-left">
      {!compact && (
        <aside className="flex w-[132px] shrink-0 flex-col bg-[var(--brand)]">
          <div className="border-b border-white/10 px-3 py-3">
            <p className="text-[11px] font-semibold tracking-tight text-white">
              Dev<span className="text-blue-300">Wiser</span>
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-hidden px-1.5 py-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] font-medium ${
                  item.active
                    ? "bg-white/15 text-white"
                    : "text-slate-300"
                }`}
              >
                <item.icon className="h-2.5 w-2.5 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>
      )}
      <div className="min-w-0 flex-1 overflow-hidden p-2.5 sm:p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-xs font-semibold text-[var(--brand)] sm:text-sm">
              Overview
            </p>
            <p className="text-[9px] text-[var(--muted-foreground)]">
              Your business at a glance
            </p>
          </div>
          <span className="rounded-md bg-[var(--brand)] px-2 py-1 text-[9px] font-medium text-white">
            New invoice
          </span>
        </div>

        <div
          className={`grid gap-1.5 ${compact ? "grid-cols-2" : "grid-cols-4"}`}
        >
          <StatMini label="Outstanding" value="£1,920.50" icon={PoundSterling} />
          <StatMini label="Paid this month" value="£3,480.00" icon={PoundSterling} />
          {!compact && <StatMini label="Clients" value="12" icon={Users} />}
          {!compact && (
            <StatMini label="Documents" value="8 inv · 5 quo" icon={FileText} />
          )}
        </div>

        <div
          className={`mt-2.5 grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-2"}`}
        >
          <div className="rounded-lg border border-[var(--border)] bg-white p-2 shadow-sm">
            <p className="mb-1.5 text-[10px] font-semibold text-[var(--brand)]">
              Recent invoices
            </p>
            <ul className="space-y-1">
              {sampleInvoices.slice(0, compact ? 2 : 3).map((row) => (
                <li
                  key={row.number}
                  className="flex items-center justify-between gap-1 border-t border-[var(--border)] pt-1 text-[9px]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--foreground)]">
                      {row.number}
                    </p>
                    <p className="truncate text-[var(--muted-foreground)]">
                      {row.client}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-medium">{row.amount}</p>
                    <StatusPill status={row.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {!compact && (
            <div className="rounded-lg border border-[var(--border)] bg-white p-2 shadow-sm">
              <p className="mb-1.5 text-[10px] font-semibold text-[var(--brand)]">
                Recent quotations
              </p>
              <ul className="space-y-1">
                {sampleQuotations.map((row) => (
                  <li
                    key={row.number}
                    className="flex items-center justify-between gap-1 border-t border-[var(--border)] pt-1 text-[9px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.number}</p>
                      <p className="truncate text-[var(--muted-foreground)]">
                        {row.client}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium">{row.amount}</p>
                      <StatusPill status={row.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Desktop laptop + mobile phone mockup of the DevWiser dashboard UI */
export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        Sample dashboard preview — illustrative data only
      </p>

      <div className="relative mx-auto flex items-end justify-center px-2 sm:px-6">
        {/* Laptop */}
        <div className="relative z-10 w-full max-w-[720px]">
          <div className="overflow-hidden rounded-t-xl border border-slate-300 bg-slate-800 shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-center border-b border-slate-700 bg-slate-800 py-1.5">
              <div className="h-1.5 w-16 rounded-full bg-slate-600" />
            </div>
            <div className="aspect-[16/10] bg-white">
              <DashboardScreen />
            </div>
          </div>
          <div className="h-3 rounded-b-md bg-slate-300" />
          <div className="mx-auto h-2 w-[28%] rounded-b-lg bg-slate-400" />
        </div>

        {/* Phone */}
        <div className="absolute bottom-2 right-0 z-20 w-[38%] max-w-[200px] sm:right-[4%] sm:w-[32%] md:right-[2%]">
          <div className="overflow-hidden rounded-[1.35rem] border-[3px] border-slate-800 bg-slate-900 shadow-2xl shadow-slate-900/30">
            <div className="flex justify-center bg-slate-900 pb-1 pt-2">
              <div className="h-1.5 w-12 rounded-full bg-slate-700" />
            </div>
            <div className="aspect-[9/16] overflow-hidden bg-white">
              <DashboardScreen compact />
            </div>
            <div className="flex justify-center bg-slate-900 py-2">
              <div className="h-1 w-10 rounded-full bg-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
