import 'server-only';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, getAdmins, verifySessionToken,
} from './session';
import { ADMIN_PATH } from './admin-path';

const scryptAsync = promisify(scrypt);

// Compared against when the email isn't an admin, so the hash still runs.
const DUMMY_HASH = `scrypt:${'A'.repeat(22)}:${'A'.repeat(86)}`;

// Password hash format: "scrypt:<salt base64url>:<hash base64url>".
// Generate one with `npm run admin:hash-password`. No "$" characters, because
// Next.js expands "$VAR" inside .env files.
export async function verifyPassword(password, stored) {
  const [algo, salt, hash] = (stored || '').split(':');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64url'), expected.length);
  return timingSafeEqual(expected, actual);
}

// Returns the signed-in admin's email, or null.
export async function checkCredentials(email, password) {
  const admins = getAdmins();
  if (admins.size === 0) {
    throw new Error('Set ADMIN_USERS (or ADMIN_EMAIL and ADMIN_PASSWORD_HASH).');
  }
  const normalized = email.trim().toLowerCase();
  // Always run the hash, even for an unknown email, so response time doesn't
  // reveal which emails are admins.
  const passwordOk = await verifyPassword(password, admins.get(normalized) ?? DUMMY_HASH);
  return passwordOk && admins.has(normalized) ? normalized : null;
}

export async function startSession(email) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(email), {
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
// proxy.js also guards the dashboard, but it is only a first line of defence.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect(`${ADMIN_PATH}/login`);
  return session;
}
