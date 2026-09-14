import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { isGithubWritable, readJSON, writeJSON } from "@/lib/github";

/**
 * Generic read/write endpoint for a single content/<file>.json —
 * every admin list/record editor (CollectionEditor, RecordEditor,
 * WeeklyHoursEditor) talks to this one route instead of a bespoke
 * endpoint per content type.
 */

function filePath(segments: string[]): string {
  return `${segments.join("/")}.json`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  const { file } = await params;
  const data = await readJSON(filePath(file));
  return NextResponse.json({ data: data ?? null });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!isGithubWritable()) {
    return NextResponse.json(
      { error: "GitHub ist noch nicht verbunden. Siehe README." },
      { status: 503 }
    );
  }

  const { file } = await params;
  const body = await request.json().catch(() => null);
  if (body === null) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const path = filePath(file);
  const result = await writeJSON(path, body, `Inhalt aktualisiert: ${file.join("/")}`);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Speichern fehlgeschlagen." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
