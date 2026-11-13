// Signed session tokens for the admin dashboard. Uses Web Crypto only, so it
// runs in proxy.js as well as in server components and actions.
//
// Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 signature)

export const SESSION_COOKIE = 'as_admin_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set to at least 32 characters.');
  }
  return crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'],
  );
}

export async function createSessionToken(email) {
  const payload = b64url(encoder.encode(JSON.stringify({
    sub: email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

// Returns the session payload, or null if the token is missing, forged or expired.
export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  try {
    const valid = await crypto.subtle.verify(
      'HMAC', await hmacKey(), fromB64url(sig), encoder.encode(payload),
    );
    if (!valid) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    if (data.sub !== process.env.ADMIN_EMAIL) return null;
    return data;
  } catch {
    return null;
  }
}
