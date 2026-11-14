'use client';

import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useUpload } from './useUpload';
import styles from '../admin.module.scss';

const isImage = (item) => (item.contentType || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(item.url);

export default function MediaPicker({ show, onHide, onSelect, media, onUploaded, blobEnabled }) {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const { uploadFiles, progress, error } = useUpload();

  const images = media.filter(isImage).filter((m) =>
    !query || `${m.filename} ${m.alt}`.toLowerCase().includes(query.toLowerCase()));

  async function handleFiles(e) {
    const saved = await uploadFiles(e.target.files);
    e.target.value = '';
    if (saved.length) {
      onUploaded?.(saved);
      onSelect({ url: saved[0].url, alt: saved[0].alt || '' });
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" data-bs-theme="dark" scrollable>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Choose image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-2 flex-wrap mb-3">
          <input
            type="search"
            className="form-control"
            style={{ maxWidth: 260 }}
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {blobEnabled && (
            <label className="btn btn-outline-primary mb-0">
              Upload…
              <input type="file" accept="image/*" hidden onChange={handleFiles} />
            </label>
          )}
          <div className="input-group" style={{ maxWidth: 420 }}>
            <input
              type="url"
              className="form-control"
              placeholder="…or paste an image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="button" className="btn btn-outline-secondary" disabled={!url} onClick={() => onSelect({ url, alt: '' })}>
              Use URL
            </button>
          </div>
        </div>
        {progress && <div className="alert alert-info py-2 small">Uploading {progress.file}… {Math.round(progress.percentage)}%</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {images.length ? (
          <div className={styles.mediaGrid}>
            {images.map((item) => (
              <button
                type="button"
                key={item.id}
                className={styles.mediaTile}
                onClick={() => onSelect({ url: item.url, alt: item.alt || '' })}
                title={item.filename}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt} loading="lazy" />
                <div className={styles.mediaName}>{item.filename}</div>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>No images found.</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
