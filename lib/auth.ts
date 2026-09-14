import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Minimal single-admin auth: one shared password (env var), a signed
 * JWT session cookie (HMAC, via `jose` — works on both Node and the
 * Cloudflare Workers runtime). No user table, no external service —
 * this is a small boutique's single admin account, not a multi-user
 * system.
 */

export const SESSION_COOKIE = "atelier_admin_session";
const SESSION_DURATION = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET ist nicht gesetzt. Siehe README für die Einrichtung des Admin-Logins."
    );
  }
  return new TextEncoder().encode(secret);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Constant-time-ish comparison to avoid trivial timing leaks.
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

/** For use in Route Handlers / Server Components to gate admin-only work. */
export async function isRequestAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
