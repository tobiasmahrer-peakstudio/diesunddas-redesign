import { NextResponse } from "next/server";
import { z } from "zod";
import { isGithubWritable, writeJSON } from "@/lib/github";
import type { ContactMessage } from "@/types/database";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  // Honeypot field: real users never fill this in — bots usually do.
  website: z.string().max(0).optional().or(z.literal("")),
  consent: z.literal(true),
  turnstileToken: z.string().optional().or(z.literal("")),
});

/**
 * Verifies a Cloudflare Turnstile token server-side. A no-op (always
 * passes) when TURNSTILE_SECRET_KEY isn't configured, so the form
 * keeps working with just the honeypot + rate limit until Turnstile
 * is set up.
 */
async function isTurnstileValid(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Simple in-memory rate limit — resets on redeploy/restart, good
// enough to blunt naive spam bots without adding infrastructure.
const submissionsByIp = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte überprüfe deine Eingaben." }, { status: 400 });
  }

  // Honeypot tripped — silently pretend success so bots don't learn.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  if (!(await isTurnstileValid(parsed.data.turnstileToken ?? "", ip))) {
    return NextResponse.json(
      { error: "Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut." },
      { status: 400 }
    );
  }

  if (!isGithubWritable()) {
    return NextResponse.json(
      { error: "Das Kontaktformular ist derzeit noch nicht verbunden." },
      { status: 503 }
    );
  }

  const now = new Date();
  const message: ContactMessage = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
    created_at: now.toISOString(),
    read: false,
  };
  const filename = `${now.getTime()}-${message.id.slice(0, 8)}.json`;

  const result = await writeJSON(
    `messages/${filename}`,
    message,
    `Neue Kontaktanfrage: ${message.subject}`
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
