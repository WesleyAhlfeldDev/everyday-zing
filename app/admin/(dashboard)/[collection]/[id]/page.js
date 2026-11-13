import { notFound } from 'next/navigation';
import { requireAdmin } from '@/app/lib/auth';
import { COLLECTIONS, TYPE_LABELS, schemaFor } from '@/app/lib/content-schema';
import { getEntry, listEntries, listMedia, serializeEntry } from '../../../data';
import EntryEditor from '../../../components/EntryEditor';

export default async function EditEntryPage({ params }) {
  await requireAdmin();
  const { collection, id } = await params;
  const type = COLLECTIONS[collection];
  const entryId = Number.parseInt(id, 10);
  if (!type || !Number.isInteger(entryId)) notFound();

  const [entry, media] = await Promise.all([getEntry(type, entryId), listMedia()]);
  if (!entry) notFound();
  const schema = await resolveOptions(schemaFor(type, entry.slug));

  return (
    <EntryEditor
      entry={serializeEntry(entry)}
      schema={schema}
      label={TYPE_LABELS[type]}
      collection={collection}
      media={media.map((m) => ({ id: m.id, url: m.url, alt: m.alt, filename: m.filename, contentType: m.contentType }))}
      blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
    />
  );
}

// Fills selects marked `optionsFrom: '<type>'` with that type's entries (by slug).
async function resolveOptions(defs) {
  return Promise.all(defs.map(async (def) => {
    if (def.optionsFrom) {
      const rows = await listEntries(def.optionsFrom);
      return { ...def, options: [{ value: '', label: '— None —' }, ...rows.map((r) => ({ value: r.slug, label: r.title }))] };
    }
    if (def.fields) return { ...def, fields: await resolveOptions(def.fields) };
    return def;
  }));
}
