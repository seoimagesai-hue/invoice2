import Link from "next/link";
import { cn } from "@/lib/utils";

export function SpectBillLogo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 34, text: "text-xl" },
    lg: { icon: 42, text: "text-2xl" },
  }[size];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-[var(--brand)]",
        sizes.text,
        className
      )}
      aria-label="SpectBill home"
    >
      <svg
        width={sizes.icon}
        height={sizes.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="40" height="40" rx="10" fill="#1e3a5f" />
        <path
          d="M11 13h18v2.5H11V13zm0 5.5h12v2.5H11v-2.5zm0 5.5h18v2.5H11V24zm0 5.5h8V32h-8v-2.5z"
          fill="#ffffff"
        />
        <circle cx="29" cy="27" r="5" fill="#3b82f6" />
        <path
          d="M27.2 27.1l1.3 1.3 2.4-2.6"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        Spect<span className="text-[var(--accent)]">Bill</span>
      </span>
    </Link>
  );
}
