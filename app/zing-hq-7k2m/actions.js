'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq, like, ne } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { getDb, schema } from '@/app/lib/db';
import { checkCredentials, endSession, requireAdmin, startSession } from '@/app/lib/auth';
import { TYPE_LABELS } from '@/app/lib/content-schema';
import { mailchimpConfigured, syncAll, unsubscribe } from '@/app/lib/mailchimp';
import { serializeEntry } from './data';
import { ADMIN_PATH } from '@/app/lib/admin-path';

const { entries, media, settings, submissions } = schema;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = ['draft', 'published'];

// The site is small, so every content change refreshes every public page.
function refreshSite() {
  revalidatePath('/', 'layout');
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(_prev, formData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const adminEmail = await checkCredentials(email, password);
  if (!adminEmail) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: 'Incorrect email or password.' };
  }

  await startSession(adminEmail);
  redirect(ADMIN_PATH);
}

export async function logout() {
  await endSession();
  redirect(`${ADMIN_PATH}/login`);
}

// ── Entries ─────────────────────────────────────────────────────────────────

export async function createEntry(type) {
  await requireAdmin();
  if (!TYPE_LABELS[type] || type === 'page') throw new Error('Invalid type');

  const db = await getDb();
  const taken = await db.select({ slug: entries.slug }).from(entries)
    .where(and(eq(entries.type, type), like(entries.slug, 'untitled%')));
  const used = new Set(taken.map((r) => r.slug));
  let slug = 'untitled';
  for (let n = 2; used.has(slug); n++) slug = `untitled-${n}`;

  const [row] = await db.insert(entries).values({
    type, slug, title: `Untitled ${TYPE_LABELS[type].singular.toLowerCase()}`, status: 'draft',
  }).returning({ id: entries.id });

  redirect(`${ADMIN_PATH}/${TYPE_LABELS[type].path}/${row.id}`);
}

export async function saveEntry(id, input) {
  await requireAdmin();
  const db = await getDb();
  const [existing] = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  if (!existing) return { error: 'This entry no longer exists.' };

  const title = String(input.title ?? '').trim();
  const slug = existing.type === 'page' ? existing.slug : String(input.slug ?? '').trim();
  const status = STATUSES.includes(input.status) ? input.status : 'draft';
  const sortOrder = Number.parseInt(input.sortOrder, 10) || 0;
  let publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;

  if (!title) return { error: 'Title is required.' };
  if (!SLUG_RE.test(slug)) {
    return { error: 'Slug may only contain lowercase letters, numbers and single hyphens.' };
  }
  if (publishedAt && Number.isNaN(publishedAt.getTime())) return { error: 'Invalid publish date.' };
  if (status === 'published' && !publishedAt) publishedAt = existing.publishedAt ?? new Date();

  const [clash] = await db.select({ id: entries.id }).from(entries)
    .where(and(eq(entries.type, existing.type), eq(entries.slug, slug), ne(entries.id, id))).limit(1);
  if (clash) return { error: `Another ${existing.type} already uses the slug "${slug}".` };

  const [row] = await db.update(entries).set({
    title,
    slug,
    status,
    sortOrder,
    publishedAt,
    fields: isPlainObject(input.fields) ? input.fields : {},
    seo: isPlainObject(input.seo) ? input.seo : {},
    updatedAt: new Date(),
  }).where(eq(entries.id, id)).returning();

  refreshSite();
  return { ok: true, entry: serializeEntry(row) };
}

export async function deleteEntry(id) {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db.delete(entries)
    .where(and(eq(entries.id, id), ne(entries.type, 'page')))
    .returning({ type: entries.type });
  refreshSite();
  redirect(row ? `${ADMIN_PATH}/${TYPE_LABELS[row.type].path}` : ADMIN_PATH);
}

// ── Menu ────────────────────────────────────────────────────────────────────

export async function saveMenu(items) {
  await requireAdmin();
  if (!Array.isArray(items)) return { error: 'Invalid menu.' };

  const clean = items
    .map((item) => ({ label: String(item.label ?? '').trim(), url: String(item.url ?? '').trim() }))
    .filter((item) => item.label && item.url)
    .map((item, i) => ({ id: i + 1, ...item }));

  const db = await getDb();
  await db.insert(settings).values({ key: 'main_menu', value: clean })
    .onConflictDoUpdate({ target: settings.key, set: { value: clean, updatedAt: new Date() } });

  refreshSite();
  return { ok: true, items: clean };
}

// ── Media ───────────────────────────────────────────────────────────────────

// Called by the browser after a direct-to-Blob upload finishes.
export async function recordMedia({ url, pathname, contentType, size, filename }) {
  await requireAdmin();
  if (!isBlobUrl(url)) return { error: 'Unexpected upload URL.' };

  const db = await getDb();
  const [row] = await db.insert(media).values({
    url,
    pathname: String(pathname),
    filename: String(filename || pathname).slice(0, 255),
    contentType: contentType ? String(contentType) : null,
    size: Number.isFinite(size) ? size : null,
  }).onConflictDoNothing().returning();

  revalidatePath(`${ADMIN_PATH}/media`);
  return { ok: true, item: row };
}

export async function updateMediaAlt(id, alt) {
  await requireAdmin();
  const db = await getDb();
  await db.update(media).set({ alt: String(alt ?? '').slice(0, 500) }).where(eq(media.id, id));
  revalidatePath(`${ADMIN_PATH}/media`);
  return { ok: true };
}

export async function deleteMedia(id) {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db.delete(media).where(eq(media.id, id)).returning();
  if (row && isBlobUrl(row.url)) {
    await del(row.url).catch((err) => console.error('[Blob delete error]', err));
  }
  revalidatePath(`${ADMIN_PATH}/media`);
  return { ok: true };
}

// ── Submissions ─────────────────────────────────────────────────────────────

export async function setSubmissionRead(id, read) {
  await requireAdmin();
  const db = await getDb();
  await db.update(submissions).set({ read: Boolean(read) }).where(eq(submissions.id, id));
  revalidatePath(ADMIN_PATH, 'layout');
  return { ok: true };
}

export async function deleteSubmission(id) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(submissions).where(eq(submissions.id, id));
  revalidatePath(ADMIN_PATH, 'layout');
  return { ok: true };
}

// Takes someone off the newsletter: unsubscribed in Mailchimp first (so a later
// sync doesn't bring them back), then removed from Zingers.
export async function removeZinger(id) {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db.select().from(submissions)
    .where(and(eq(submissions.id, id), eq(submissions.source, 'newsletter'))).limit(1);
  if (!row) return { ok: true };
  if (mailchimpConfigured()) {
    try {
      await unsubscribe(row.email);
    } catch (err) {
      console.error('[Mailchimp unsubscribe error]', err.message);
      return { ok: false, error: 'Mailchimp didn\'t respond, so nothing was removed. Try again in a minute.' };
    }
  }
  await db.delete(submissions).where(eq(submissions.id, id));
  revalidatePath(ADMIN_PATH, 'layout');
  return { ok: true };
}

export async function syncMailchimp() {
  await requireAdmin();
  if (!mailchimpConfigured()) return { ok: false, error: 'Mailchimp isn\'t connected yet.' };
  try {
    const result = await syncAll();
    revalidatePath(ADMIN_PATH, 'layout');
    return { ok: true, ...result };
  } catch (err) {
    console.error('[Mailchimp sync error]', err.message);
    return { ok: false, error: err.status === 401 ? 'Mailchimp turned down the API key.' : 'Mailchimp didn\'t respond. Try again in a minute.' };
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isBlobUrl(url) {
  try {
    return new URL(url).hostname.endsWith('.blob.vercel-storage.com');
  } catch {
    return false;
  }
}
