"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Anmeldung fehlgeschlagen.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif-display text-center text-2xl text-[var(--color-ink)]">
          ATELIER <span className="italic text-[var(--color-terracotta-dark)]">dies &amp; das</span>
        </h1>
        <p className="mt-1 text-center text-sm text-[var(--color-ink-muted)]">Admin-Anmeldung</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[var(--color-error)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-7 py-3.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
          >
            {loading ? "Anmelden …" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
