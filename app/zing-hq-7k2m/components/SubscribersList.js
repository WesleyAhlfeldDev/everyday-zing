'use client';

import { useTransition } from 'react';
import { deleteSubmission } from '../actions';
import styles from '../admin.module.scss';

export default function SubscribersList({ rows }) {
  const [pending, startTransition] = useTransition();

  if (!rows.length) {
    return <div className={`card card-body ${styles.muted}`}>No Zingers yet. Sign-ups from the site land here.</div>;
  }

  return (
    <div className="card">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Signed up from</th>
            <th>Joined</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.firstName} {row.lastName}</td>
              <td><a href={`mailto:${row.email}`}>{row.email}</a></td>
              <td className={styles.muted}>{row.details?.page || '—'}</td>
              <td className={styles.muted}>{new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`Remove ${row.email} from the list?`)) startTransition(() => deleteSubmission(row.id));
                  }}
                >
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
