import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-800",
  PARTIALLY_PAID: "bg-amber-100 text-amber-900",
  PAID: "bg-emerald-100 text-emerald-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-500",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-amber-100 text-amber-900",
  CONVERTED: "bg-violet-100 text-violet-800",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        tone[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {label.toLowerCase()}
    </span>
  );
}
