import { isPlaceholder } from "@/lib/placeholders/content";

/** Flags a field still holding placeholder copy — see section 40 of the brief. */
export function MissingContentBadge({ value }: { value: string | null | undefined }) {
  if (!isPlaceholder(value)) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-terracotta)]/15 px-2.5 py-1 text-xs font-medium text-[var(--color-terracotta-dark)]">
      ⚠ Inhalt noch nicht ausgefüllt
    </span>
  );
}
