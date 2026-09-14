export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="h-display text-3xl text-[var(--color-ink)]">{title}</h1>
      {description && <p className="mt-2 text-[var(--color-ink-soft)]">{description}</p>}
    </div>
  );
}
