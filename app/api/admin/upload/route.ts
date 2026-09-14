import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { contentFileUrl, isGithubWritable, writeBinaryFile } from "@/lib/github";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BASE64_LENGTH = 6_000_000; // ~4.5MB decoded — keeps commits small and fast

/**
 * Accepts a base64-encoded image (client reads the File via
 * FileReader before sending — avoids multipart parsing) and commits
 * it to content/uploads/<folder>/<file> in the repo. The returned
 * URL is the raw.githubusercontent.com address, live immediately.
 */
export async function POST(request: Request) {
  if (!(await isRequestAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!isGithubWritable()) {
    return NextResponse.json(
      { error: "GitHub ist noch nicht verbunden. Siehe README." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const folder = typeof body?.folder === "string" ? body.folder : "";
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  const base64 = typeof body?.base64 === "string" ? body.base64 : "";

  if (!folder || !/^[a-z0-9-]+$/.test(folder)) {
    return NextResponse.json({ error: "Ungültiger Ordner." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Nicht unterstütztes Bildformat." }, { status: 400 });
  }
  if (!base64 || base64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "Bild fehlt oder ist zu gross (max. ca. 4 MB)." },
      { status: 400 }
    );
  }

  const extension = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1];
  const filename = `${crypto.randomUUID()}.${extension}`;
  const contentPath = `uploads/${folder}/${filename}`;

  const result = await writeBinaryFile(contentPath, base64, `Bild hochgeladen: ${contentPath}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Upload fehlgeschlagen." }, { status: 500 });
  }

  return NextResponse.json({ url: contentFileUrl(contentPath) });
}
