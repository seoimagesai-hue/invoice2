import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background)]">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-xl font-display font-semibold text-[var(--brand)]"
          >
            DevWiser
          </Link>
          <h1 className="mt-6 text-2xl font-display font-semibold text-[var(--foreground)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AuthField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      {children}
    </div>
  );
}

export const authInputClass =
  "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)]";

export function AuthButton({
  children,
  loading,
  type = "submit",
}: {
  children: ReactNode;
  loading?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function AuthAlert({ message, tone = "error" }: { message: string; tone?: "error" | "success" }) {
  const colors =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${colors}`} role="alert">
      {message}
    </div>
  );
}
