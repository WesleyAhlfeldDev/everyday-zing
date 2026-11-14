'use client';

import { useTransition } from 'react';
import { removeZinger } from '../actions';
import styles from '../admin.module.scss';

const BADGES = {
  subscribed: 'text-bg-success',
  pending: 'text-bg-warning',
  unsubscribed: 'text-bg-secondary',
  cleaned: 'text-bg-danger',
  archived: 'text-bg-secondary',
};

export default function SubscribersList({ rows, connected = false }) {
  const [pending, startTransition] = useTransition();

  if (!rows.length) {
    return <div className={`card card-body ${styles.muted}`}>No Zingers yet. Sign-ups from the site land here.</div>;
  }

  const remove = (row) => {
    const note = connected ? ' They will also be unsubscribed in Mailchimp.' : '';
    if (!confirm(`Remove ${row.email} from the list?${note}`)) return;
    startTransition(async () => {
      const r = await removeZinger(row.id);
      if (!r.ok) alert(r.error);
    });
  };

  return (
    <div className="card table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Signed up from</th>
            <th>Joined</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={row.status === 'subscribed' ? '' : styles.mutedRow}>
              <td>{row.firstName} {row.lastName}</td>
              <td><a href={`mailto:${row.email}`}>{row.email}</a></td>
              <td><span className={`badge ${BADGES[row.status] || 'text-bg-secondary'}`}>{row.statusLabel}</span></td>
              <td className={styles.muted}>{row.details?.page || '—'}</td>
              <td className={styles.muted}>{new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              <td className="text-end">
                <button type="button" className="btn btn-sm btn-outline-danger" disabled={pending} onClick={() => remove(row)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
