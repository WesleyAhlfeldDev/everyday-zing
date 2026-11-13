import 'server-only';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken,
} from './session';

const scryptAsync = promisify(scrypt);

// ADMIN_PASSWORD_HASH format: "scrypt:<salt base64url>:<hash base64url>".
// Generate one with `npm run admin:hash-password`. No "$" characters, because
// Next.js expands "$VAR" inside .env files.
export async function verifyPassword(password, stored) {
  const [algo, salt, hash] = (stored || '').split(':');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64url'), expected.length);
  return timingSafeEqual(expected, actual);
}

export async function checkCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set.');
  }
  // Always run the hash so response time doesn't reveal whether the email matched.
  const passwordOk = await verifyPassword(password, adminHash);
  return passwordOk && email.trim().toLowerCase() === adminEmail.toLowerCase();
}

export async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(process.env.ADMIN_EMAIL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Call at the top of every admin page, server action and API route.
// proxy.js also guards /admin, but it is only a first line of defence.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
