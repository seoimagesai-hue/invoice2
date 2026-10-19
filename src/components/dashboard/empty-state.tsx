import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)]">
        <Icon className="h-6 w-6 text-[var(--muted)]" aria-hidden />
      </div>
      <h3 className="mt-4 font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-6">
          <Button size="sm" type="button">
            {actionLabel}
          </Button>
        </Link>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <Button className="mt-6" size="sm" type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
