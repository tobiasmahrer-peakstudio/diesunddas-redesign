"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the "data:image/jpeg;base64," prefix — the API wants raw base64
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, contentType: file.type, base64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bild konnte nicht hochgeladen werden.");
        setUploading(false);
        return;
      }
      onChange(data.url);
    } catch {
      setError("Bild konnte nicht hochgeladen werden.");
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">{label}</label>

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-beige)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-square w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Bild entfernen"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)]/80 text-[var(--color-cream)]"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-stone)] text-sm text-[var(--color-ink-muted)] hover:border-[var(--color-terracotta)]"
        >
          <Upload size={20} />
          {uploading ? "Wird hochgeladen …" : "Bild hochladen"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
