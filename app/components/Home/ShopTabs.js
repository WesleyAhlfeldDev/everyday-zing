'use client';

import { useState } from 'react';
import styles from './Home.module.scss';

// Two tabs down the left, the chosen list as banded rows on the right.
// Without script both lists show, one after the other.
export default function ShopTabs({ shops, follows }) {
  const lists = [
    { id: 'shops', label: 'Where I shop', count: shops.length, rows: shops.map((s) => ({ ...s, sub: s.note })) },
    { id: 'follows', label: 'Who I follow', count: follows.length, rows: follows.map((f) => ({ ...f, sub: f.note, aside: f.handle ? `@${f.handle}` : '' })) },
  ].filter((l) => l.count);
  const [active, setActive] = useState(null);
  const current = active ?? lists[0]?.id;

  return (
    <div className={styles.shopBody}>
      <div className={styles.shopTabs} role="tablist" aria-label="Lists">
        {lists.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            id={`tab-${l.id}`}
            aria-selected={current === l.id}
            aria-controls={`panel-${l.id}`}
            className={styles.shopTab}
            onClick={() => setActive(l.id)}
          >
            <span>{l.label}</span>
            <span className={styles.shopTabCount}>{l.count}</span>
          </button>
        ))}
      </div>
      <div>
        {lists.map((l) => (
          // role="tabpanel" sits on a wrapper: on the <ul> it would replace the list role.
          <div
            key={l.id}
            id={`panel-${l.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${l.id}`}
            className={styles.bands}
            data-active={current === l.id}
          >
            <ul>
              {l.rows.map((row) => (
                <li key={row.name}>
                  <a href={row.url} target="_blank" rel="noopener noreferrer sponsored" className={styles.band}>
                    <span className={styles.bandName}>{row.name}</span>
                    <span className={styles.bandSub}>{row.sub}</span>
                    <span className={styles.bandAside}>{row.aside || 'Visit'} <span aria-hidden="true">↗</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
