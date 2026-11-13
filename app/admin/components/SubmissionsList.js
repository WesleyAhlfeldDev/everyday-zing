'use client';

import { Fragment, useState, useTransition } from 'react';
import { deleteSubmission, setSubmissionRead } from '../actions';
import styles from '../admin.module.scss';

export default function SubmissionsList({ rows }) {
  const [openId, setOpenId] = useState(null);
  const [pending, startTransition] = useTransition();

  function open(row) {
    setOpenId(openId === row.id ? null : row.id);
    if (!row.read) startTransition(() => setSubmissionRead(row.id, true));
  }

  if (!rows.length) {
    return <div className={`card card-body ${styles.muted}`}>No submissions yet.</div>;
  }

  return (
    <div className="card">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.id}>
              <tr className={row.read ? '' : styles.unreadRow} style={{ cursor: 'pointer' }} onClick={() => open(row)}>
                <td>
                  {!row.read && <span className="badge text-bg-info me-2">New</span>}
                  {row.firstName} {row.lastName}
                </td>
                <td>{row.subject}</td>
                <td className={styles.muted}>{new Date(row.createdAt).toLocaleString('en-US')}</td>
              </tr>
              {openId === row.id && (
                <tr>
                  <td colSpan={3}>
                    <div className="mb-2">
                      <a href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject}`)}`}>{row.email}</a>
                    </div>
                    <div className={`${styles.messageBody} mb-3`}>{row.message}</div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        disabled={pending}
                        onClick={() => startTransition(() => setSubmissionRead(row.id, !row.read))}
                      >
                        Mark as {row.read ? 'unread' : 'read'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={pending}
                        onClick={() => {
                          if (confirm('Delete this submission?')) startTransition(() => deleteSubmission(row.id));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
