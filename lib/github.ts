import { readFile } from "fs/promises";
import path from "path";

/**
 * "GitHub as a database": every piece of CMS content lives as a JSON
 * (or image) file under content/ in this same repo.
 *
 * Reads go straight to raw.githubusercontent.com — a free CDN, no
 * rate-limit concerns for a small site — so admin edits show up on
 * the live site within seconds, without waiting for Cloudflare to
 * rebuild. Writes go through the GitHub Contents API using a
 * server-only Personal Access Token and create a real commit.
 *
 * Without GITHUB_OWNER/GITHUB_REPO configured, reads fall back to the
 * JSON files bundled in this repo at content/ — so local development
 * and a first deploy work with zero setup, using the same placeholder
 * data the admin would otherwise be editing.
 */

const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;
  return { owner, repo, branch, token };
}

/** True once a target repo is configured — reads work without a token, writes need one too. */
export function isGithubConfigured(): boolean {
  const { owner, repo } = githubConfig();
  return Boolean(owner && repo);
}

/** True once writes (admin editing) are possible — needs a token with repo contents write access. */
export function isGithubWritable(): boolean {
  const { owner, repo, token } = githubConfig();
  return Boolean(owner && repo && token);
}

function rawUrl(contentPath: string): string {
  const { owner, repo, branch } = githubConfig();
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/${contentPath}`;
}

function apiUrl(contentPath: string): string {
  const { owner, repo } = githubConfig();
  return `${GITHUB_API}/repos/${owner}/${repo}/contents/content/${contentPath}`;
}

async function readLocalFallback<T>(contentPath: string): Promise<T | null> {
  try {
    const filePath = path.join(process.cwd(), "content", contentPath);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Reads and parses a JSON file from content/<contentPath>. Tries the
 * live GitHub copy first (revalidated every 20s so a save shows up
 * quickly without refetching on every request), then falls back to
 * the locally bundled copy.
 */
export async function readJSON<T>(contentPath: string): Promise<T | null> {
  if (isGithubConfigured()) {
    try {
      const res = await fetch(rawUrl(contentPath), { next: { revalidate: 20 } });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // fall through to local copy
    }
  }
  return readLocalFallback<T>(contentPath);
}

type GithubFileMeta = { sha: string } | null;

async function getFileSha(contentPath: string): Promise<string | null> {
  const { token } = githubConfig();
  const res = await fetch(apiUrl(contentPath), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as GithubFileMeta;
  return data?.sha ?? null;
}

async function putFile(
  contentPath: string,
  base64Content: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const { token, branch } = githubConfig();
  if (!token) return { ok: false, error: "GitHub-Token fehlt." };

  const sha = await getFileSha(contentPath);

  const res = await fetch(apiUrl(contentPath), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `GitHub-Fehler (${res.status}): ${body.slice(0, 300)}` };
  }
  return { ok: true };
}

/** Writes (creates or replaces) a JSON file at content/<contentPath>. */
export async function writeJSON(
  contentPath: string,
  data: unknown,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const base64 = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");
  return putFile(contentPath, base64, message);
}

/** Writes a binary file (image) at content/<contentPath> from a base64 string (no data: prefix). */
export async function writeBinaryFile(
  contentPath: string,
  base64Content: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  return putFile(contentPath, base64Content, message);
}

/** Deletes a file at content/<contentPath>. */
export async function deleteFile(
  contentPath: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const { token, branch } = githubConfig();
  if (!token) return { ok: false, error: "GitHub-Token fehlt." };

  const sha = await getFileSha(contentPath);
  if (!sha) return { ok: true }; // already gone

  const res = await fetch(apiUrl(contentPath), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sha, branch }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `GitHub-Fehler (${res.status}): ${body.slice(0, 300)}` };
  }
  return { ok: true };
}

/** Lists file names in a content/<dirPath> directory (used for contact messages). */
export async function listDir(dirPath: string): Promise<string[]> {
  const { token } = githubConfig();
  if (!isGithubConfigured()) return [];

  try {
    const res = await fetch(apiUrl(dirPath), {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { name: string; type: string }[];
    if (!Array.isArray(data)) return [];
    return data.filter((entry) => entry.type === "file").map((entry) => entry.name);
  } catch {
    return [];
  }
}

/** The public URL an uploaded image is reachable at once committed. */
export function contentFileUrl(contentPath: string): string {
  return rawUrl(contentPath);
}
