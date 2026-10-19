import { cn } from "@/lib/utils";

export function DataTableShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-sm",
        className
      )}
    >
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}
