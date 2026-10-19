import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-white shadow-sm hover:bg-[var(--brand-hover)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--border)] hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand)] hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
