import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders a real, optimized image when `src` is set (from the CMS),
 * or a clearly marked, non-photographic placeholder otherwise — so a
 * stand-in can never be mistaken for real product/store photography
 * and accidentally stay live.
 */
export function PlaceholderImage({
  src,
  alt,
  label,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-[var(--color-sand)]", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "content-placeholder relative flex items-center justify-center overflow-hidden",
        className
      )}
      role="img"
      aria-label={alt}
    >
      <span className="max-w-[80%] text-center text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
