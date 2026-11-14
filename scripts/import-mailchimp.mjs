// Adds the subscribers from a Mailchimp audience export as Zingers.
//
//   npm run import:mailchimp -- "path/to/subscribed_email_audience_export_….csv"
//   npm run import:mailchimp -- "…csv" --dry-run     (shows what would be added)
//
// Use the *subscribed* file only. Unsubscribed people opted out and cleaned
// addresses bounced, so neither belongs on the list.
// People already on the list (matched by email) are skipped, so it is safe to
// re-run. Each Zinger keeps their original Mailchimp opt-in date. No sign-up
// notifications are sent.
// Writes to the database in DATABASE_URL, or the local embedded one without it.
import fs from 'node:fs';
import path from 'node:path';
import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '../app/lib/db/index.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Usage: npm run import:mailchimp -- <subscribed export .csv> [--dry-run]');
  process.exit(1);
}
if (/unsubscribed|cleaned/i.test(path.basename(file))) {
  console.error('That looks like the unsubscribed or cleaned export. Only import the subscribed file.');
  process.exit(1);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const records = parseCsv(fs.readFileSync(file, 'utf8'));
const [header, ...rows] = records;
const col = (name) => {
  const i = header.indexOf(name);
  if (i < 0) throw new Error(`Column "${name}" not found. Is this a Mailchimp audience export?`);
  return i;
};
const C = {
  email: col('Email Address'), first: col('First Name'), last: col('Last Name'),
  optin: col('OPTIN_TIME'), source: col('SOURCE'),
};

const people = [];
const skipped = [];
const seen = new Set();
for (const r of rows) {
  if (r.length === 1 && !r[0]) continue; // blank line
  const email = (r[C.email] || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) { skipped.push(`${email || '(no email)'}: not a valid email`); continue; }
  if (seen.has(email)) { skipped.push(`${email}: listed twice in the file`); continue; }
  seen.add(email);
  const { firstName, lastName } = cleanName(r[C.first], r[C.last]);
  people.push({
    email, firstName, lastName,
    // Mailchimp exports times in UTC.
    createdAt: parseTime(r[C.optin]),
    mailchimpSource: (r[C.source] || '').trim(),
  });
}

const db = await getDb();
const { submissions } = schema;
let added = 0;
let already = 0;

for (const p of people) {
  const [existing] = await db.select({ id: submissions.id }).from(submissions)
    .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, p.email))).limit(1);
  if (existing) { already++; continue; }
  if (!dryRun) {
    await db.insert(submissions).values({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      subject: 'Newsletter sign-up',
      message: '',
      source: 'newsletter',
      details: { page: 'Mailchimp (old site)', mailchimpSource: p.mailchimpSource },
      read: true,
      ...(p.createdAt ? { createdAt: p.createdAt } : {}),
    });
  }
  added++;
}

console.log(`${dryRun ? 'Would add' : 'Added'} ${added} Zingers; ${already} were already on the list.`);
if (skipped.length) console.log(`Skipped ${skipped.length}:\n  ${skipped.join('\n  ')}`);
process.exit(0);

// Tidies names typed into the old form: "connie" → "Connie", and a first
// name that repeats the last name ("Beverly Walker" / "Walker") → "Beverly".
function cleanName(first = '', last = '') {
  let f = first.trim().replace(/\s+/g, ' ');
  const l = last.trim().replace(/\s+/g, ' ');
  if (l && f.length > l.length && f.toLowerCase().replace(/\s/g, '').endsWith(l.toLowerCase().replace(/\s/g, ''))) {
    const stripped = f.slice(0, f.length - l.length).trim();
    if (stripped) f = stripped;
  }
  return { firstName: capitalise(f), lastName: capitalise(l) };
}

function capitalise(s) {
  if (!s || s !== s.toLowerCase()) return s; // leave names that already have capitals alone
  return s.replace(/(^|[\s'-])\p{L}/gu, (m) => m.toUpperCase());
}

function parseTime(s) {
  const m = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec((s || '').trim());
  return m ? new Date(`${m[1]}T${m[2]}Z`) : null;
}

// RFC 4180 CSV: quoted fields may hold commas, quotes ("") and line breaks.
function parseCsv(text) {
  const out = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); out.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); out.push(row); }
  return out;
}
