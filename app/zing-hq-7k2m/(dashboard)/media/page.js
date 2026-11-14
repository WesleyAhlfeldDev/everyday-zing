import { requireAdmin } from '@/app/lib/auth';
import { listMedia } from '../../data';
import MediaLibrary from '../../components/MediaLibrary';
import styles from '../../admin.module.scss';

export default async function MediaPage() {
  await requireAdmin();
  const media = await listMedia();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Media</h1>
      </div>
      <MediaLibrary
        items={media.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
        blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </>
  );
}
