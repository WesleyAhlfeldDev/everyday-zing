'use client';

import { useState, useTransition } from 'react';
import { saveMenu } from '../actions';
import styles from '../admin.module.scss';

export default function MenuEditor({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState(() => JSON.stringify(initialItems));
  const [message, setMessage] = useState(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(items) !== saved;

  const update = (i, patch) => setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (from, to) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
  };

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveMenu(items);
      if (res?.error) return setMessage({ type: 'danger', text: res.error });
      setItems(res.items);
      setSaved(JSON.stringify(res.items));
      setMessage({ type: 'success', text: 'Menu saved.' });
    });
  }

  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <div className="card-body">
        <p className={styles.muted}>
          Links shown in the site header. If the menu is empty, the site falls back to its built-in links.
        </p>
        {items.map((item, i) => (
          <div className="row g-2 align-items-center mb-2" key={i}>
            <div className="col-sm-4">
              <input className="form-control" placeholder="Label" aria-label="Label" value={item.label} onChange={(e) => update(i, { label: e.target.value })} />
            </div>
            <div className="col-sm-5">
              <input className="form-control" placeholder="/path or https://…" aria-label="URL" value={item.url} onChange={(e) => update(i, { url: e.target.value })} />
            </div>
            <div className="col-sm-3">
              <div className="btn-group btn-group-sm">
                <button type="button" className="btn btn-outline-secondary" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">↑</button>
                <button type="button" className="btn btn-outline-secondary" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">↓</button>
                <button type="button" className="btn btn-outline-danger" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={() => setItems([...items, { label: '', url: '' }])}>
          + Add link
        </button>

        <hr />
        {message && <div className={`alert alert-${message.type} py-2 small`}>{message.text}</div>}
        <button type="button" className="btn btn-primary" disabled={pending || !dirty} onClick={save}>
          {pending ? 'Saving…' : dirty ? 'Save menu' : 'Saved'}
        </button>
      </div>
    </div>
  );
}
