'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia, updateMediaAlt } from '../actions';
import { useUpload } from './useUpload';
import styles from '../admin.module.scss';

const isImage = (item) => (item.contentType || '').startsWith('image/');

function formatSize(bytes) {
  if (!bytes) return '';
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibrary({ items, blobEnabled }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [alt, setAlt] = useState('');
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const { uploadFiles, progress, error } = useUpload();
  const selected = items.find((m) => m.id === selectedId);

  function select(item) {
    setSelectedId(item.id);
    setAlt(item.alt || '');
    setCopied(false);
  }

  async function handleFiles(e) {
    await uploadFiles(e.target.files);
    e.target.value = '';
    router.refresh();
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-center mb-3">
        {blobEnabled ? (
          <label className="btn btn-primary mb-0">
            Upload files…
            <input type="file" multiple hidden accept="image/*,video/mp4,video/webm,application/pdf" onChange={handleFiles} />
          </label>
        ) : (
          <div className="alert alert-warning py-2 small mb-0">
            Uploads are disabled: connect a Vercel Blob store so <code>BLOB_READ_WRITE_TOKEN</code> is set.
          </div>
        )}
        <span className={styles.muted}>{items.length} files</span>
      </div>
      {progress && <div className="alert alert-info py-2 small">Uploading {progress.file} ({progress.index}/{progress.total})… {Math.round(progress.percentage)}%</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="row g-4">
        <div className={selected ? 'col-lg-8' : 'col-12'}>
          <div className={styles.mediaGrid}>
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${styles.mediaTile} ${item.id === selectedId ? styles.mediaTileSelected : ''}`}
                onClick={() => select(item)}
                title={item.filename}
              >
                {isImage(item) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt} loading="lazy" />
                ) : (
                  <div className={styles.fileIcon}>{item.contentType || 'file'}</div>
                )}
                <div className={styles.mediaName}>{item.filename}</div>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="col-lg-4">
            <div className={`card ${styles.stickySide}`}>
              <div className="card-body">
                {isImage(selected) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.url} alt={selected.alt} className="img-fluid rounded mb-3" />
                )}
                <div className="small mb-1 text-break">{selected.filename}</div>
                <div className={`${styles.muted} mb-3`}>
                  {selected.contentType} {formatSize(selected.size)} · {new Date(selected.createdAt).toLocaleDateString('en-US')}
                </div>

                <label className="form-label" htmlFor="media-alt">Default alt text</label>
                <div className="input-group mb-3">
                  <input id="media-alt" className="form-control" value={alt} onChange={(e) => setAlt(e.target.value)} />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    disabled={pending || alt === (selected.alt || '')}
                    onClick={() => startTransition(async () => { await updateMediaAlt(selected.id, alt); router.refresh(); })}
                  >
                    Save
                  </button>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigator.clipboard.writeText(selected.url).then(() => setCopied(true))}
                  >
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">Open ↗</a>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-auto"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm('Delete this file? Pages that use it will show a broken image.')) return;
                      startTransition(async () => { await deleteMedia(selected.id); setSelectedId(null); router.refresh(); });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
