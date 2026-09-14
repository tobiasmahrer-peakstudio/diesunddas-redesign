"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MissingContentBadge } from "@/components/admin/MissingContentBadge";
import { NotConnectedNotice } from "@/components/admin/NotConnectedNotice";
import { isPlaceholder } from "@/lib/placeholders/content";

type FieldConfig =
  | { key: string; label: string; type: "text"; required?: boolean }
  | { key: string; label: string; type: "textarea"; required?: boolean }
  | { key: string; label: string; type: "number" }
  | { key: string; label: string; type: "image"; folder: string }
  | { key: string; label: string; type: "checkbox" }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[] };

type Row = Record<string, unknown> & { id: string };

/**
 * Generic list + form editor for content/<file>.json arrays
 * (Kategorien, Inspiration, Geschenke, Aktuelles, Galerie, Labels,
 * Team, …). Every action (add, edit, delete, reorder, publish
 * toggle) rewrites the whole array in one commit via
 * /api/admin/content/<file> — small collections, so this stays fast
 * and each save is one clear commit in the repo's history.
 */
export function CollectionEditor({
  file,
  fields,
  titleKey,
  subtitleKey,
  hasActive = true,
  hasSortOrder = true,
  emptyLabel = "Noch keine Einträge vorhanden.",
  addLabel = "Neuer Eintrag",
}: {
  file: string;
  fields: FieldConfig[];
  titleKey: string;
  subtitleKey?: string;
  hasActive?: boolean;
  hasSortOrder?: boolean;
  emptyLabel?: string;
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/content/${file}`);
    if (res.status === 401) {
      setNotConnected(true);
      setLoading(false);
      return;
    }
    const body = await res.json();
    const data: Row[] = Array.isArray(body.data) ? body.data : [];
    setRows(
      hasSortOrder
        ? [...data].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
        : data
    );
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- admin-only client fetch-on-mount, not perf sensitive
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  async function persist(next: Row[]): Promise<boolean> {
    const res = await fetch(`/api/admin/content/${file}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (res.status === 503) {
      setNotConnected(true);
      return false;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Speichern fehlgeschlagen.");
      return false;
    }
    return true;
  }

  function emptyRow(): Row {
    const row: Row = { id: crypto.randomUUID() };
    for (const f of fields) row[f.key] = f.type === "number" ? null : "";
    if (hasActive) row.active = true;
    if (hasSortOrder) row.sort_order = rows.length + 1;
    return row;
  }

  async function handleDelete(row: Row) {
    if (!confirm(`„${String(row[titleKey] ?? "Eintrag")}“ wirklich löschen?`)) return;
    const next = rows.filter((r) => r.id !== row.id);
    setRows(next);
    await persist(next);
  }

  async function handleToggleActive(row: Row) {
    const next = rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r));
    setRows(next);
    await persist(next);
  }

  async function handleMove(row: Row, direction: "up" | "down") {
    const index = rows.findIndex((r) => r.id === row.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    const next = reordered.map((r, i) => ({ ...r, sort_order: i + 1 }));
    setRows(next);
    await persist(next);
  }

  async function handleSave(row: Row) {
    setSaving(true);
    setError(null);

    const exists = rows.some((r) => r.id === row.id);
    const next = exists ? rows.map((r) => (r.id === row.id ? row : r)) : [...rows, row];

    const ok = await persist(next);
    setSaving(false);
    if (!ok) return;

    setRows(next);
    setEditing(null);
  }

  if (notConnected) return <NotConnectedNotice />;
  if (loading) return <p className="text-[var(--color-ink-muted)]">Wird geladen …</p>;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setEditing(emptyRow())}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)]"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-4"
            >
              {hasSortOrder && (
                <div className="flex shrink-0 flex-col">
                  <button
                    onClick={() => handleMove(row, "up")}
                    disabled={i === 0}
                    aria-label="Nach oben"
                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(row, "down")}
                    disabled={i === rows.length - 1}
                    aria-label="Nach unten"
                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-[var(--color-ink)]">
                    {String(row[titleKey] || "Ohne Titel")}
                  </p>
                  <MissingContentBadge value={String(row[titleKey] ?? "")} />
                </div>
                {(() => {
                  const subtitle = subtitleKey ? String(row[subtitleKey] ?? "") : "";
                  if (!subtitle || isPlaceholder(subtitle)) return null;
                  return (
                    <p className="truncate text-sm text-[var(--color-ink-muted)]">{subtitle}</p>
                  );
                })()}
              </div>

              {hasActive && (
                <button
                  onClick={() => handleToggleActive(row)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    row.active
                      ? "bg-[var(--color-sage)]/20 text-[var(--color-sage-dark)]"
                      : "bg-[var(--color-stone)]/30 text-[var(--color-ink-muted)]"
                  }`}
                >
                  {row.active ? "Veröffentlicht" : "Entwurf"}
                </button>
              )}

              <button
                onClick={() => setEditing(row)}
                aria-label="Bearbeiten"
                className="shrink-0 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                <Pencil size={17} />
              </button>
              <button
                onClick={() => handleDelete(row)}
                aria-label="Löschen"
                className="shrink-0 text-[var(--color-ink-soft)] hover:text-[var(--color-error)]"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditModal
          fields={fields}
          row={editing}
          saving={saving}
          error={error}
          hasActive={hasActive}
          onCancel={() => setEditing(null)}
          onChange={setEditing}
          onSave={() => handleSave(editing)}
        />
      )}
    </div>
  );
}

function EditModal({
  fields,
  row,
  saving,
  error,
  hasActive,
  onCancel,
  onChange,
  onSave,
}: {
  fields: FieldConfig[];
  row: Row;
  saving: boolean;
  error: string | null;
  hasActive: boolean;
  onCancel: () => void;
  onChange: (row: Row) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--color-ink)]/40 p-4 py-10">
      <div className="w-full max-w-xl rounded-[var(--radius-lg)] bg-[var(--color-cream)] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="h-display text-2xl text-[var(--color-ink)]">
            {row.id ? "Eintrag bearbeiten" : "Neuer Eintrag"}
          </h2>
          <button onClick={onCancel} aria-label="Schliessen" className="text-[var(--color-ink-soft)]">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "image" ? (
                <ImageUploadField
                  label={field.label}
                  folder={field.folder}
                  value={(row[field.key] as string) ?? null}
                  onChange={(url) => onChange({ ...row, [field.key]: url })}
                />
              ) : field.type === "textarea" ? (
                <>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                    {field.label}
                  </label>
                  <textarea
                    rows={4}
                    required={field.required}
                    value={(row[field.key] as string) ?? ""}
                    onChange={(e) => onChange({ ...row, [field.key]: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
                  />
                </>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                  <input
                    type="checkbox"
                    checked={Boolean(row[field.key])}
                    onChange={(e) => onChange({ ...row, [field.key]: e.target.checked })}
                    className="h-4 w-4"
                  />
                  {field.label}
                </label>
              ) : field.type === "select" ? (
                <>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                    {field.label}
                  </label>
                  <select
                    value={(row[field.key] as string) ?? ""}
                    onChange={(e) => onChange({ ...row, [field.key]: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                    {field.label}
                  </label>
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    required={"required" in field ? field.required : undefined}
                    value={(row[field.key] as string | number) ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...row,
                        [field.key]:
                          field.type === "number"
                            ? e.target.value === ""
                              ? null
                              : Number(e.target.value)
                            : e.target.value,
                      })
                    }
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
                  />
                </>
              )}
            </div>
          ))}

          {hasActive && (
            <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                checked={Boolean(row.active)}
                onChange={(e) => onChange({ ...row, active: e.target.checked })}
                className="h-4 w-4"
              />
              Veröffentlicht
            </label>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-[var(--color-error)]">{error}</p>}

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-[var(--radius-sm)] border border-[var(--color-beige)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink-soft)]"
          >
            Abbrechen
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
          >
            {saving ? "Speichert …" : "Änderungen veröffentlichen"}
          </button>
        </div>
      </div>
    </div>
  );
}
