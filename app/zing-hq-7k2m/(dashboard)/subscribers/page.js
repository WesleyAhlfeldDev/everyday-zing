import { requireAdmin } from '@/app/lib/auth';
import { listSubscribers } from '../../data';
import SubscribersList from '../../components/SubscribersList';
import styles from '../../admin.module.scss';

export default async function SubscribersPage() {
  await requireAdmin();
  const rows = await listSubscribers();

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Zingers</h1>
          <p>{rows.length === 1 ? '1 subscriber' : `${rows.length} subscribers`} from the &ldquo;Become a Zinger&rdquo; sign-up.</p>
        </div>
        {rows.length > 0 && (
          <div className={styles.chips}>
            {/* A file download, not a page: a plain link is right here. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/admin/subscribers" className="btn btn-primary btn-sm">Download CSV</a>
          </div>
        )}
      </div>
      <SubscribersList rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </>
  );
}
