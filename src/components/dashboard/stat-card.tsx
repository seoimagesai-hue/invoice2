import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[var(--brand)]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
          <Icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
        </div>
      </div>
    </div>
  );
}
