import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { deleteFile, isGithubWritable, listDir, readJSON, writeJSON } from "@/lib/github";
import type { ContactMessage } from "@/types/database";

export async function GET() {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const files = await listDir("messages");
  const messages = (
    await Promise.all(
      files
        .filter((name) => name.endsWith(".json"))
        .map(async (name) => {
          const data = await readJSON<ContactMessage>(`messages/${name}`);
          return data ? { ...data, _file: name } : null;
        })
    )
  ).filter((m): m is ContactMessage & { _file: string } => m !== null);

  messages.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return NextResponse.json({ data: messages });
}

export async function PATCH(request: Request) {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!isGithubWritable()) {
    return NextResponse.json({ error: "GitHub ist noch nicht verbunden." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const file = typeof body?.file === "string" ? body.file : "";
  const read = Boolean(body?.read);
  if (!file) return NextResponse.json({ error: "Datei fehlt." }, { status: 400 });

  const existing = await readJSON<ContactMessage>(`messages/${file}`);
  if (!existing) return NextResponse.json({ error: "Nachricht nicht gefunden." }, { status: 404 });

  const result = await writeJSON(
    `messages/${file}`,
    { ...existing, read },
    `Nachricht ${read ? "gelesen" : "ungelesen"}: ${file}`
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Speichern fehlgeschlagen." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!isGithubWritable()) {
    return NextResponse.json({ error: "GitHub ist noch nicht verbunden." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  if (!file) return NextResponse.json({ error: "Datei fehlt." }, { status: 400 });

  const result = await deleteFile(`messages/${file}`, `Nachricht gelöscht: ${file}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Löschen fehlgeschlagen." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
