import 'server-only';
import crypto from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { getDb, schema } from './db';

// Keeps the Zingers list and the Mailchimp audience in step.
//   Site → Mailchimp: sign-ups and dashboard removals call subscribe()/unsubscribe().
//   Mailchimp → site: the webhook (app/api/mailchimp/webhook) and syncAll().
//
// MAILCHIMP_API_KEY       an API key from the Mailchimp account (ends in -us21 or similar)
// MAILCHIMP_AUDIENCE_ID   the audience's id (Audience → Settings → Audience name and defaults)
// MAILCHIMP_WEBHOOK_SECRET a long random string; part of the webhook URL so only Mailchimp can call it
//
// A Zinger's Mailchimp state lives in submissions.details.mailchimp:
// { status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'archived', syncedAt }.
// Rows without it (sign-ups made before Mailchimp was connected) count as subscribed.

const { submissions } = schema;

export const STATUS_LABELS = {
  subscribed: 'Subscribed',
  pending: 'Awaiting confirmation',
  unsubscribed: 'Unsubscribed',
  cleaned: 'Email bounced',
  archived: 'Archived in Mailchimp',
};

// SQL for "this Zinger currently gets the newsletter".
export const isSubscribed = sql`coalesce(${submissions.details}->'mailchimp'->>'status', 'subscribed') = 'subscribed'`;

export function mailchimpConfigured() {
  return Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID);
}

const memberHash = (email) => crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');

async function api(method, path, body) {
  const key = process.env.MAILCHIMP_API_KEY;
  const dc = key.split('-').pop();
  const base = process.env.MAILCHIMP_API_BASE || `https://${dc}.api.mailchimp.com/3.0`;
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`zing:${key}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`Mailchimp ${method} ${path.split('?')[0]}: ${res.status} ${data.title || ''} ${data.detail || ''}`.trim());
    err.status = res.status;
    err.title = data.title;
    throw err;
  }
  return data;
}

const listPath = () => `/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`;

// Adds or re-subscribes someone who signed up on the site. Returns their
// Mailchimp status. Someone who unsubscribed before can't be re-added directly
// (Mailchimp protects them), so they get a confirmation email instead.
export async function subscribe({ email, firstName = '', lastName = '' }) {
  const path = `${listPath()}/members/${memberHash(email)}`;
  const body = {
    email_address: email,
    status_if_new: 'subscribed',
    status: 'subscribed',
    merge_fields: { FNAME: firstName, LNAME: lastName },
  };
  try {
    return (await api('PUT', path, body)).status;
  } catch (err) {
    if (err.title !== 'Member In Compliance State') throw err;
    return (await api('PUT', path, { ...body, status: 'pending' })).status;
  }
}

export async function unsubscribe(email) {
  try {
    await api('PATCH', `${listPath()}/members/${memberHash(email)}`, { status: 'unsubscribed' });
  } catch (err) {
    if (err.status !== 404) throw err; // not in Mailchimp: nothing to do
  }
}

// Records a status change from Mailchimp on the matching Zinger. A new
// subscriber (signed up through a Mailchimp form, say) becomes a Zinger.
// Without a status (a profile edit) only the names change; with
// overwriteNames, Mailchimp's names replace the site's.
export async function applyMailchimpChange({ email, status, firstName, lastName, at, overwriteNames = false }) {
  email = email?.trim().toLowerCase();
  if (!email) return 'ignored';
  const db = await getDb();
  const [row] = await db.select().from(submissions)
    .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, email))).limit(1);
  const mailchimp = { status, syncedAt: new Date().toISOString() };

  if (row) {
    const takeFirst = firstName && (overwriteNames || !row.firstName);
    const takeLast = lastName && (overwriteNames || !row.lastName);
    await db.update(submissions).set({
      ...(status ? { details: { ...row.details, mailchimp } } : {}),
      ...(takeFirst ? { firstName } : {}),
      ...(takeLast ? { lastName } : {}),
    }).where(eq(submissions.id, row.id));
    return 'updated';
  }
  if (status !== 'subscribed') return 'ignored'; // never add people who aren't on the list
  await db.insert(submissions).values({
    firstName: firstName || '',
    lastName: lastName || '',
    email,
    subject: 'Newsletter sign-up',
    message: '',
    source: 'newsletter',
    details: { page: 'Mailchimp', mailchimp },
    read: true,
    ...(at ? { createdAt: at } : {}),
  });
  return 'added';
}

// A subscriber changed their address in Mailchimp.
export async function changeEmail(oldEmail, newEmail) {
  oldEmail = oldEmail?.trim().toLowerCase();
  newEmail = newEmail?.trim().toLowerCase();
  if (!oldEmail || !newEmail || oldEmail === newEmail) return 'ignored';
  const db = await getDb();
  const [taken] = await db.select({ id: submissions.id }).from(submissions)
    .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, newEmail))).limit(1);
  if (taken) {
    // Already listed under the new address: drop the old row.
    await db.delete(submissions).where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, oldEmail)));
    return 'merged';
  }
  await db.update(submissions).set({ email: newEmail })
    .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, oldEmail)));
  return 'updated';
}

// Full two-way catch-up: every Mailchimp member's status is copied to the
// matching Zinger (new subscribers are added), and Zingers who signed up on the
// site but never reached Mailchimp are sent there.
export async function syncAll() {
  const members = [];
  const fields = 'members.email_address,members.status,members.merge_fields,members.timestamp_opt,total_items';
  for (let offset = 0; ; offset += 1000) {
    const page = await api('GET', `${listPath()}/members?count=1000&offset=${offset}&fields=${fields}`);
    members.push(...(page.members || []));
    if (members.length >= page.total_items || !page.members?.length) break;
  }

  const result = { added: 0, updated: 0, sent: 0, failed: 0 };
  for (const m of members) {
    const outcome = await applyMailchimpChange({
      email: m.email_address,
      status: m.status,
      firstName: m.merge_fields?.FNAME,
      lastName: m.merge_fields?.LNAME,
      at: m.timestamp_opt ? new Date(m.timestamp_opt) : null,
    });
    if (outcome === 'added') result.added++;
    if (outcome === 'updated') result.updated++;
  }

  const inMailchimp = new Set(members.map((m) => m.email_address.toLowerCase()));
  const db = await getDb();
  const local = await db.select().from(submissions).where(and(eq(submissions.source, 'newsletter'), isSubscribed));
  for (const row of local) {
    if (inMailchimp.has(row.email)) continue;
    try {
      const status = await subscribe(row);
      await db.update(submissions)
        .set({ details: { ...row.details, mailchimp: { status, syncedAt: new Date().toISOString() } } })
        .where(eq(submissions.id, row.id));
      result.sent++;
    } catch (err) {
      // e.g. an address permanently deleted in Mailchimp, which it won't take back
      console.error('[Mailchimp sync]', row.email, err.message);
      result.failed++;
    }
  }
  return result;
}

// Sends one new sign-up to Mailchimp and records the outcome. Never throws:
// the sign-up is already saved, and the next sync retries a failure.
export async function pushSignup(email) {
  if (!mailchimpConfigured()) return;
  try {
    const db = await getDb();
    const [row] = await db.select().from(submissions)
      .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, email))).limit(1);
    if (!row) return;
    const status = await subscribe(row);
    await db.update(submissions)
      .set({ details: { ...row.details, mailchimp: { status, syncedAt: new Date().toISOString() } } })
      .where(eq(submissions.id, row.id));
  } catch (err) {
    console.error('[Mailchimp sign-up error]', err.message);
  }
}
