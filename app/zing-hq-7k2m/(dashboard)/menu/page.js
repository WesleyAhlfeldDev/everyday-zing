import { requireAdmin } from '@/app/lib/auth';
import { getMenuItems } from '../../data';
import MenuEditor from '../../components/MenuEditor';
import styles from '../../admin.module.scss';

export default async function MenuPage() {
  await requireAdmin();
  const items = await getMenuItems();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Main menu</h1>
      </div>
      <MenuEditor initialItems={items} />
    </>
  );
}
