import 'server-only';
import { getDb, schema } from './db';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trims every string field to its max length; anything else becomes ''.
export function cleanStrings(body, limits) {
  const out = {};
  for (const [key, max] of Object.entries(limits)) {
    out[key] = (typeof body?.[key] === 'string' ? body[key] : '').trim().slice(0, max);
  }
  return out;
}

// Discord embed field values must be non-empty and at most 1024 chars.
function field(name, value, inline = false) {
  const v = (value ?? '').toString().trim();
  return { name, value: v ? v.slice(0, 1024) : '—', inline };
}

// Stores a lead in `submissions`, then pings Discord. Throws if the insert fails;
// a notification failure is only logged, never thrown.
export async function saveLead(lead, { title = '📬 New lead', extraFields = [] } = {}) {
  const db = await getDb();
  await db.insert(schema.submissions).values(lead);

  if (!DISCORD_WEBHOOK_URL) return;
  const payload = {
    embeds: [{
      title,
      color: 0xec789f, // zing pink
      fields: [
        field('Name', `${lead.firstName} ${lead.lastName}`.trim(), true),
        field('Email', lead.email, true),
        field('Subject', lead.subject),
        ...extraFields.map(([n, v]) => field(n, v)),
        field('Message', lead.message),
      ].filter(Boolean),
    }],
  };
  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error('[Discord notify error]', res.status, await res.text());
  } catch (err) {
    console.error('[Discord notify error]', err);
  }
}
