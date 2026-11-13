import { requireAdmin } from '@/app/lib/auth';
import { listSubmissions } from '../../data';
import SubmissionsList from '../../components/SubmissionsList';
import styles from '../../admin.module.scss';

export default async function SubmissionsPage() {
  await requireAdmin();
  const rows = await listSubmissions();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Inbox</h1>
      </div>
      <SubmissionsList rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </>
  );
}
