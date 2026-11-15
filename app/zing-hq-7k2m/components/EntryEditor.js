'use client';

import { useEffect, useId, useState, useTransition } from 'react';
import Link from 'next/link';
import { entryPath } from '@/app/lib/content-schema';
import { deleteEntry, generateSeo, saveEntry } from '../actions';
import { FieldList, MediaContext } from './FieldEditor';
import styles from '../admin.module.scss';
import { ADMIN_PATH } from '@/app/lib/admin-path';

const SEO_FIELDS = [
  { name: 'title', label: 'Meta title', type: 'text', help: 'Leave blank to use the default title.' },
  { name: 'description', label: 'Meta description', type: 'textarea' },
  { name: 'og_image', label: 'Social share image', type: 'image' },
  { name: 'noindex', label: 'Hide from search engines', type: 'toggle' },
];

// ISO string → value for <input type="datetime-local"> in the browser's timezone.
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function slugify(str) {
  return str.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function toDraft(entry) {
  return {
    title: entry.title,
    slug: entry.slug,
    status: entry.status,
    sortOrder: entry.sortOrder,
    publishedAt: toLocalInput(entry.publishedAt),
    fields: entry.fields || {},
    seo: entry.seo || {},
  };
}

export default function EntryEditor({ entry: initial, schema, label, collection, media: initialMedia, blobEnabled }) {
  const [entry, setEntry] = useState(initial);
  const [draft, setDraft] = useState(() => toDraft(initial));
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(toDraft(initial)));
  const [media, setMedia] = useState(initialMedia);
  const [message, setMessage] = useState(null);
  const [pending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);
  const [seoMessage, setSeoMessage] = useState(null);
  const ids = { title: useId(), slug: useId(), status: useId(), date: useId(), order: useId() };

  const isPage = entry.type === 'page';
  const dirty = JSON.stringify(draft) !== savedJson;
  const path = entryPath(entry.type, entry.slug);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveEntry(entry.id, {
        ...draft,
        publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : null,
      });
      if (res?.error) {
        setMessage({ type: 'danger', text: res.error });
        return;
      }
      const next = toDraft(res.entry);
      setEntry(res.entry);
      setDraft(next);
      setSavedJson(JSON.stringify(next));
      setMessage({ type: 'success', text: 'Saved. The live site has been refreshed.' });
    });
  }

  // Fills the meta title and description from the page's current content.
  // Nothing is saved until Save is pressed.
  async function generate() {
    if ((draft.seo.title || draft.seo.description)
      && !confirm('Replace the current meta title and description with new suggestions?')) return;
    setSeoMessage(null);
    setGenerating(true);
    try {
      const categoryDef = schema.find((d) => d.name === 'category' && d.options);
      const categoryName = categoryDef?.options.find((o) => o.value && o.value === draft.fields.category)?.label;
      const res = await generateSeo({
        type: entry.type, slug: draft.slug, title: draft.title, fields: draft.fields, categoryName,
      });
      if (res?.error) {
        setSeoMessage({ type: 'danger', text: res.error });
        return;
      }
      set({ seo: { ...draft.seo, title: res.title, description: res.description } });
      setSeoMessage({ type: 'info', text: `Suggested from the page content (title ${res.title.length} characters, description ${res.description.length}). Edit if you like, then save.` });
    } catch {
      setSeoMessage({ type: 'danger', text: 'Couldn\'t generate SEO details. Try again in a minute.' });
    } finally {
      setGenerating(false);
    }
  }

  function remove() {
    if (!confirm(`Delete "${entry.title}"? This cannot be undone.`)) return;
    startTransition(() => deleteEntry(entry.id));
  }

  // Warn before leaving with unsaved changes; Ctrl/Cmd+S saves.
  useEffect(() => {
    const onBeforeUnload = (e) => { if (dirty) e.preventDefault(); };
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (!pending) save(); }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('keydown', onKey);
    };
  });

  return (
    <MediaContext.Provider value={{ media, blobEnabled, addMedia: (items) => setMedia((m) => [...items, ...m]) }}>
      <div className={styles.pageHeader}>
        <div>
          <Link href={`${ADMIN_PATH}/${collection}`} className="small">← {label.plural}</Link>
          <h1 className="mt-1">Edit {label.singular.toLowerCase()}</h1>
        </div>
      </div>

      <div className={styles.editorGrid}>
        <div>
          <div className="mb-4">
            <label className="form-label visually-hidden" htmlFor={ids.title}>Title</label>
            <input
              id={ids.title}
              className={`form-control ${styles.titleInput}`}
              placeholder="Title"
              value={draft.title}
              onChange={(e) => {
                const title = e.target.value;
                // Never-published entries keep the slug in step with the title
                // until the slug is edited by hand.
                const followSlug = !isPage && !entry.publishedAt
                  && (draft.slug === slugify(draft.title) || draft.slug.startsWith('untitled'));
                set(followSlug ? { title, slug: slugify(title) } : { title });
              }}
            />
          </div>

          <FieldList defs={schema} value={draft.fields} onChange={(fields) => set({ fields })} />

          <div className={styles.group}>
            <div className={`${styles.groupTitle} d-flex align-items-center justify-content-between gap-2`}>
              <span>SEO</span>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={generate} disabled={generating}>
                {generating ? 'Writing…' : '✨ Generate SEO details'}
              </button>
            </div>
            {seoMessage && <div className={`alert alert-${seoMessage.type} py-2 small`}>{seoMessage.text}</div>}
            <FieldList defs={SEO_FIELDS} value={draft.seo} onChange={(seo) => set({ seo })} />
          </div>
        </div>

        <div className={styles.stickySide}>
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label" htmlFor={ids.status}>Status</label>
                <select id={ids.status} className="form-select" value={draft.status} onChange={(e) => set({ status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {!isPage && (
                <div className="mb-3">
                  <label className="form-label" htmlFor={ids.slug}>Slug</label>
                  <input id={ids.slug} className="form-control" value={draft.slug} onChange={(e) => set({ slug: e.target.value })} />
                </div>
              )}

              {(entry.type === 'post' || entry.type === 'project') && (
                <div className="mb-3">
                  <label className="form-label" htmlFor={ids.date}>Publish date</label>
                  <input id={ids.date} type="datetime-local" className="form-control" value={draft.publishedAt} onChange={(e) => set({ publishedAt: e.target.value })} />
                </div>
              )}

              {['service', 'project', 'testimonial'].includes(entry.type) && (
                <div className="mb-3">
                  <label className="form-label" htmlFor={ids.order}>Sort order</label>
                  <input id={ids.order} type="number" className="form-control" value={draft.sortOrder} onChange={(e) => set({ sortOrder: e.target.value })} />
                  <div className="form-text">Lower numbers appear first.</div>
                </div>
              )}

              {message && <div className={`alert alert-${message.type} py-2 small`}>{message.text}</div>}

              <button type="button" className="btn btn-primary w-100" disabled={pending || !dirty} onClick={save}>
                {pending ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
              </button>

              <div className="d-flex justify-content-between mt-3 small">
                {path && entry.status === 'published' ? (
                  <a href={path} target="_blank" rel="noopener noreferrer">View on site ↗</a>
                ) : <span className={styles.muted}>Not live</span>}
                {!isPage && (
                  <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={remove} disabled={pending}>Delete</button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.muted}>Last updated {new Date(entry.updatedAt).toLocaleString('en-US')}</div>
        </div>
      </div>
    </MediaContext.Provider>
  );
}
