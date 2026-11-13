'use client';

import { createContext, useContext, useId, useState } from 'react';
import MediaPicker from './MediaPicker';
import styles from '../admin.module.scss';

// Media library + upload availability, shared by every image field in a form.
export const MediaContext = createContext({ media: [], addMedia: () => {}, blobEnabled: false });

// Renders a list of field definitions (see app/lib/content-schema.js) against
// a value object, calling onChange with a new object on every edit.
export function FieldList({ defs, value, onChange }) {
  const obj = value && typeof value === 'object' ? value : {};
  return defs.map((def) =>
    def.flatten ? (
      <Group key={def.name} def={def} value={obj} onChange={onChange} />
    ) : (
      <Field
        key={def.name}
        def={def}
        value={obj[def.name]}
        onChange={(v) => onChange({ ...obj, [def.name]: v })}
      />
    ));
}

function Field({ def, value, onChange }) {
  switch (def.type) {
    case 'group': return <Group def={def} value={value} onChange={onChange} />;
    case 'repeater': return <Repeater def={def} value={value} onChange={onChange} />;
    case 'image': return <ImageField def={def} value={value} onChange={onChange} />;
    case 'link': return <LinkField def={def} value={value} onChange={onChange} />;
    case 'html': return <HtmlField def={def} value={value} onChange={onChange} />;
    case 'toggle': return <ToggleField def={def} value={value} onChange={onChange} />;
    default: return <InputField def={def} value={value} onChange={onChange} />;
  }
}

function Help({ text }) {
  return text ? <div className="form-text">{text}</div> : null;
}

function InputField({ def, value, onChange }) {
  const id = useId();
  const v = value ?? '';
  let control;

  if (def.type === 'textarea') {
    control = <textarea id={id} className="form-control" rows={3} value={v} onChange={(e) => onChange(e.target.value)} />;
  } else if (def.type === 'select') {
    control = (
      <select id={id} className="form-select" value={v} onChange={(e) => onChange(e.target.value)}>
        {!def.options.some((o) => o.value === v) && <option value={v}>{v || '—'}</option>}
        {def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else {
    control = (
      <input
        id={id}
        type={def.type === 'number' ? 'number' : 'text'}
        className="form-control"
        value={v}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>{def.label}</label>
      {control}
      <Help text={def.help} />
    </div>
  );
}

function ToggleField({ def, value, onChange }) {
  const id = useId();
  return (
    <div className="form-check form-switch mb-3">
      <input id={id} className="form-check-input" type="checkbox" role="switch" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      <label className="form-check-label" htmlFor={id}>{def.label}</label>
      <Help text={def.help} />
    </div>
  );
}

function Group({ def, value, onChange }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupTitle}>{def.label}</div>
      <Help text={def.help} />
      <FieldList defs={def.fields} value={value} onChange={onChange} />
    </div>
  );
}

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function Repeater({ def, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(() => new Set());

  const update = (next) => onChange(next);
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
    setOpen(new Set());
  };
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="form-label mb-0">{def.label} <span className={styles.muted}>({items.length})</span></span>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => { update([...items, {}]); setOpen((p) => new Set(p).add(items.length)); }}
        >
          + Add
        </button>
      </div>
      <Help text={def.help} />
      <div className="mt-2">
        {items.map((item, i) => (
          <div key={i} className={styles.repeaterItem}>
            <div className={styles.repeaterHeader} onClick={() => toggle(i)}>
              <span className={styles.muted}>{open.has(i) ? '▾' : '▸'}</span>
              <span className="flex-grow-1 text-truncate">
                {(def.itemLabel && getPath(item, def.itemLabel)) || `Item ${i + 1}`}
              </span>
              <span className="btn-group btn-group-sm" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="btn btn-outline-secondary" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">↑</button>
                <button type="button" className="btn btn-outline-secondary" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">↓</button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  aria-label="Remove"
                  onClick={() => { update(items.filter((_, j) => j !== i)); setOpen(new Set()); }}
                >
                  ✕
                </button>
              </span>
            </div>
            {open.has(i) && (
              <div className={styles.repeaterBody}>
                <FieldList
                  defs={def.fields}
                  value={item}
                  onChange={(v) => update(items.map((it, j) => (j === i ? v : it)))}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageField({ def, value, onChange }) {
  const { media, addMedia, blobEnabled } = useContext(MediaContext);
  const [picking, setPicking] = useState(false);
  const id = useId();
  const image = value && typeof value === 'object' && value.url ? value : null;

  return (
    <div className="mb-3">
      <label className="form-label">{def.label}</label>
      <div className="d-flex gap-3 align-items-start">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt} className={styles.imagePreview} />
        ) : (
          <div className={`${styles.imagePreview} d-flex align-items-center justify-content-center ${styles.muted}`}>None</div>
        )}
        <div className="flex-grow-1">
          <div className="d-flex gap-2 mb-2">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setPicking(true)}>
              {image ? 'Change' : 'Choose'}
            </button>
            {image && (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onChange(null)}>Remove</button>
            )}
          </div>
          {image && (
            <>
              <label className="form-label visually-hidden" htmlFor={id}>Alt text</label>
              <input
                id={id}
                className="form-control form-control-sm"
                placeholder="Alt text"
                value={image.alt || ''}
                onChange={(e) => onChange({ ...image, alt: e.target.value })}
              />
            </>
          )}
        </div>
      </div>
      <Help text={def.help} />
      <MediaPicker
        show={picking}
        onHide={() => setPicking(false)}
        media={media}
        blobEnabled={blobEnabled}
        onUploaded={addMedia}
        onSelect={(img) => { onChange(img); setPicking(false); }}
      />
    </div>
  );
}

function LinkField({ def, value, onChange }) {
  const id = useId();
  const link = value && typeof value === 'object' ? value : {};
  const set = (patch) => {
    const next = { title: '', url: '', target: '', ...link, ...patch };
    onChange(next.title || next.url ? next : null);
  };

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>{def.label}</label>
      <div className="row g-2 align-items-center">
        <div className="col-sm-4">
          <input id={id} className="form-control" placeholder="Text" value={link.title || ''} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="col-sm-5">
          <input className="form-control" placeholder="URL, e.g. /contact" aria-label={`${def.label} URL`} value={link.url || ''} onChange={(e) => set({ url: e.target.value })} />
        </div>
        <div className="col-sm-3">
          <div className="form-check">
            <input
              id={`${id}-target`}
              type="checkbox"
              className="form-check-input"
              checked={link.target === '_blank'}
              onChange={(e) => set({ target: e.target.checked ? '_blank' : '' })}
            />
            <label className="form-check-label small" htmlFor={`${id}-target`}>New tab</label>
          </div>
        </div>
      </div>
      <Help text={def.help} />
    </div>
  );
}

function HtmlField({ def, value, onChange }) {
  const id = useId();
  const [preview, setPreview] = useState(false);
  const html = value ?? '';

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label className="form-label mb-0" htmlFor={id}>{def.label} <span className={styles.muted}>(HTML)</span></label>
        <div className="btn-group btn-group-sm">
          <button type="button" className={`btn ${preview ? 'btn-outline-secondary' : 'btn-secondary'}`} onClick={() => setPreview(false)}>Edit</button>
          <button type="button" className={`btn ${preview ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setPreview(true)}>Preview</button>
        </div>
      </div>
      {preview ? (
        <div className={styles.htmlPreview} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <textarea
          id={id}
          className={`form-control ${styles.mono}`}
          rows={16}
          spellCheck={false}
          value={html}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <Help text={def.help} />
    </div>
  );
}
