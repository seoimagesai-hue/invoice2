import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--brand)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref}>
          <Button type="button">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}
