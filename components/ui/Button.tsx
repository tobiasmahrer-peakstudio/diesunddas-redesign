import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "light-outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)]",
  /* For use on dark/image backgrounds, e.g. the hero. */
  light:
    "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-terracotta)] hover:text-[var(--color-cream)]",
  "light-outline":
    "bg-transparent border border-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-[var(--radius-sm)]";

export function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  onClick,
  ...props
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(baseClasses, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
