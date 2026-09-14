"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
      consent: formData.get("consent") === "on",
      // Populated automatically by the Turnstile widget script, if configured.
      turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? "Etwas ist schiefgelaufen.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-sage)] bg-[var(--color-paper)] p-8 text-center">
        <p className="h-display text-2xl text-[var(--color-ink)]">
          Vielen Dank für deine Nachricht.
        </p>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Wir melden uns so schnell wie möglich bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {turnstileSiteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}

      {/* Honeypot — hidden from real visitors via CSS, not display:none, so
          screen readers correctly skip it while simple bots still fill it in. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="E-Mail" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Telefon (optional)" name="phone" type="tel" autoComplete="tel" />
        <Field label="Betreff" name="subject" required />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[var(--color-ink-soft)]">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
        <span>
          Ich habe die{" "}
          <a href="/datenschutz" className="underline underline-offset-2">
            Datenschutzerklärung
          </a>{" "}
          gelesen und bin mit der Verarbeitung meiner Daten einverstanden.
        </span>
      </label>

      {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />}

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-[var(--color-error)]">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-7 py-3.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
      >
        {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
      />
    </div>
  );
}
