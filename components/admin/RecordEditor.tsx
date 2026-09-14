"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { NotConnectedNotice } from "@/components/admin/NotConnectedNotice";

type ItemField = { key: string; label: string; type: "text" | "textarea" | "image"; folder?: string };

type FieldConfig =
  | { key: string; label: string; type: "text"; help?: string }
  | { key: string; label: string; type: "textarea"; help?: string }
  | { key: string; label: string; type: "image"; folder: string }
  | { key: string; label: string; type: "checkbox" }
  | { key: string; label: string; type: "list"; itemLabel: string; itemFields: ItemField[] };

type Row = Record<string, unknown>;

/**
 * Editor for a single content/<file>.json object (Startseite-Inhalte,
 * Einstellungen, Kontakt & Standort, Atelier-Seite). Saves the whole
 * object in one PUT to /api/admin/content/<file>. Supports a "list"
 * field type for small repeatable groups embedded in the same file
 * (e.g. the Atelier page's extra sections) — no separate collection
 * file needed for something that small.
 */
export function RecordEditor({ file, fields }: { file: string; fields: FieldConfig[] }) {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/admin/content/${file}`);
      if (res.status === 401) {
        setNotConnected(true);
        setLoading(false);
        return;
      }
      const body = await res.json();
      setRow((body.data as Row) ?? {});
      setLoading(false);
    }
    load();
  }, [file]);

  async function handleSave() {
    if (!row) return;
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/content/${file}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    if (res.status === 503) {
      setNotConnected(true);
      setSaving(false);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Speichern fehlgeschlagen.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (notConnected) return <NotConnectedNotice />;
  if (loading || !row) return <p className="text-[var(--color-ink-muted)]">Wird geladen …</p>;

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <div key={field.key}>
          {field.type === "image" ? (
            <ImageUploadField
              label={field.label}
              folder={field.folder}
              value={(row[field.key] as string) ?? null}
              onChange={(url) => setRow({ ...row, [field.key]: url })}
            />
          ) : field.type === "textarea" ? (
            <>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                {field.label}
              </label>
              <textarea
                rows={5}
                value={(row[field.key] as string) ?? ""}
                onChange={(e) => setRow({ ...row, [field.key]: e.target.value })}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
              />
            </>
          ) : field.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                checked={Boolean(row[field.key])}
                onChange={(e) => setRow({ ...row, [field.key]: e.target.checked })}
                className="h-4 w-4"
              />
              {field.label}
            </label>
          ) : field.type === "list" ? (
            <ListField
              field={field}
              items={(row[field.key] as Row[]) ?? []}
              onChange={(items) => setRow({ ...row, [field.key]: items })}
            />
          ) : (
            <>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                {field.label}
              </label>
              <input
                type="text"
                value={(row[field.key] as string) ?? ""}
                onChange={(e) => setRow({ ...row, [field.key]: e.target.value })}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
              />
            </>
          )}
          {"help" in field && field.help && (
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{field.help}</p>
          )}
        </div>
      ))}

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
        >
          {saving ? "Speichert …" : "Änderungen veröffentlichen"}
        </button>
        {saved && <span className="text-sm text-[var(--color-sage-dark)]">Gespeichert.</span>}
      </div>
    </div>
  );
}

function ListField({
  field,
  items,
  onChange,
}: {
  field: { key: string; label: string; itemLabel: string; itemFields: ItemField[] };
  items: Row[];
  onChange: (items: Row[]) => void;
}) {
  function addItem() {
    const item: Row = { id: crypto.randomUUID() };
    for (const f of field.itemFields) item[f.key] = "";
    onChange([...items, item]);
  }

  function updateItem(id: string, patch: Row) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(index: number, direction: "up" | "down") {
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= items.length) return;
    const next = [...items];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {field.label}
      </label>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div
            key={item.id as string}
            className="rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                {field.itemLabel} {i + 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveItem(i, "up")}
                  disabled={i === 0}
                  aria-label="Nach oben"
                  className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => moveItem(i, "down")}
                  disabled={i === items.length - 1}
                  aria-label="Nach unten"
                  className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => removeItem(item.id as string)}
                  aria-label="Entfernen"
                  className="text-[var(--color-ink-soft)] hover:text-[var(--color-error)]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {field.itemFields.map((itemField) =>
                itemField.type === "image" ? (
                  <ImageUploadField
                    key={itemField.key}
                    label={itemField.label}
                    folder={itemField.folder ?? "gallery"}
                    value={(item[itemField.key] as string) ?? null}
                    onChange={(url) => updateItem(item.id as string, { [itemField.key]: url })}
                  />
                ) : itemField.type === "textarea" ? (
                  <div key={itemField.key}>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-ink)]">
                      {itemField.label}
                    </label>
                    <textarea
                      rows={3}
                      value={(item[itemField.key] as string) ?? ""}
                      onChange={(e) =>
                        updateItem(item.id as string, { [itemField.key]: e.target.value })
                      }
                      className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-cream)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
                    />
                  </div>
                ) : (
                  <div key={itemField.key}>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-ink)]">
                      {itemField.label}
                    </label>
                    <input
                      type="text"
                      value={(item[itemField.key] as string) ?? ""}
                      onChange={(e) =>
                        updateItem(item.id as string, { [itemField.key]: e.target.value })
                      }
                      className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-cream)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-beige)] px-4 py-2 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-terracotta)]"
      >
        <Plus size={15} /> {field.itemLabel} hinzufügen
      </button>
    </div>
  );
}
